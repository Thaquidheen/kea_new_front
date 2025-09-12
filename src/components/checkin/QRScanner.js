import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { scanQRForEventCheckIn } from '../../api/EventCheckInApi';

// Helpers to normalize QR text
const cleanText = (t = '') =>
  t.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(); // remove zero-width/BOM and trim

const getUrlParam = (url, keys = ['data', 'd', 'q', 'token', 'payload']) => {
  try {
    const u = new URL(url);
    for (const k of keys) {
      const v = u.searchParams.get(k);
      if (v) return decodeURIComponent(v);
    }
  } catch (_) {}
  return null;
};

const extractSecurePayload = (raw) => {
  const text = cleanText(raw);

  // If QR is a URL carrying the payload (?data=... etc.)
  const urlPayload = getUrlParam(text);
  if (urlPayload) {
    return { type: 'secure', payload: cleanText(urlPayload), source: 'url-param' };
  }

  // Case-insensitive KEA_SECURE: prefix
  const m = text.match(/^kea[_-]?secure\s*:\s*(.+)$/i);
  if (m && m[1]) {
    return { type: 'secure', payload: cleanText(m[1]), source: 'kea-prefix' };
  }

  // If it looks like a Base64/URL-safe Base64 blob, treat as secure payload
  if (/^[A-Za-z0-9_\-+/=]+$/.test(text) && text.length >= 16) {
    return { type: 'secure', payload: text, source: 'base64-guess' };
  }

  return { type: 'unknown', payload: text };
};

const QRScanner = ({ selectedEventId, onScanResult }) => {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [qrDebugInfo, setQrDebugInfo] = useState('');
  const scannerRef = useRef(null);
  const scannerContainerId = "qr-reader";

  // Initialize QR scanner when showScanner changes
  useEffect(() => {
    if (showScanner) {
      initializeScanner();
    } else {
      stopScanner();
    }

    // Cleanup on unmount
    return () => {
      stopScanner();
    };
  }, [showScanner]);

  const initializeScanner = () => {
    try {
      // Stop existing scanner if any
      stopScanner();

      // Create new scanner instance
      scannerRef.current = new Html5QrcodeScanner(
        scannerContainerId,
        { 
          fps: 10, 
          qrbox: 250,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true
        },
        false
      );

      // Start scanner with success and error callbacks
      scannerRef.current.render(handleQrCodeSuccess, handleQrCodeError);
      setScannerError('');
    } catch (error) {
      console.error("Scanner initialization error:", error);
      setScannerError(`Failed to start scanner: ${error.message}`);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      scannerRef.current = null;
    }
  };

  const handleQrCodeSuccess = async (decodedText) => {
    const raw = typeof decodedText === 'string' ? decodedText : String(decodedText ?? '');
    const norm = extractSecurePayload(raw);
    console.log('QR raw:', raw, 'normalized:', norm);

    // Require event selection
    if (!selectedEventId) {
      setScannerError('Please select an event before scanning.');
      return;
    }

    // Encrypted/secure payloads -> send whole payload to backend
    if (norm.type === 'secure') {
      const secureEnvelope = `KEA_SECURE:${norm.payload}`;
      setQrDebugInfo(`Secure QR detected (${norm.source}). Sending encrypted payload to server.`);
      setManualInput(secureEnvelope);
      await handleScan(secureEnvelope);
      setShowScanner(false);
      return;
    }

    // Fallbacks: try to extract userId from various plain formats
    let userId = '';
    const text = cleanText(raw);

    if (text.includes('USER_ID:')) {
      const parts = text.split('USER_ID:');
      if (parts.length > 1) userId = cleanText(parts[1]).split(/[\s|]/)[0];
    } else if (text.includes('USER_ID=')) {
      const match = text.match(/USER_ID=([^|\s]+)/);
      if (match?.[1]) userId = cleanText(match[1]);
    } else if (text.startsWith('KEA_QR|')) {
      const parts = text.split('|');
      for (const part of parts) {
        if (part.startsWith('USER_ID=')) { userId = cleanText(part.substring(8)); break; }
      }
      if (!userId) {
        setManualInput(text);
        await handleScan(text);
        setShowScanner(false);
        return;
      }
    } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(text)) {
      userId = text; // UUID
    } else if (/^[a-zA-Z0-9_-]+$/.test(text)) {
      userId = text; // simple token/id
    } else {
      userId = text; // last resort
    }

    if (userId) {
      setQrDebugInfo('Plain QR detected. Verifying user ID...');
      setManualInput(userId);
      await handleScan(userId);
      setShowScanner(false);
    } else {
      setScannerError("QR detected but no valid data found. Try again or enter manually.");
      setQrDebugInfo('Failed to extract data from QR.');
    }
  };

  const handleQrCodeError = (error) => {
    if (typeof error === 'string' && (error.includes("Camera access denied") || error.includes("No cameras"))) {
      setScannerError(error);
    }
  };

  const handleManualScan = async () => {
    if (!manualInput.trim() || !selectedEventId) {
      alert('Please enter a User ID and select an event');
      return;
    }
    await handleScan(manualInput.trim());
  };

  const handleScan = async (userData) => {
    if (!selectedEventId) {
      alert('Please select an event first');
      return;
    }
    setIsScanning(true);
    try {
      const payload = cleanText(userData);
      const result = await scanQRForEventCheckIn(payload, selectedEventId);
      onScanResult(result);
    } catch (error) {
      console.error('Scan error:', error);
      onScanResult({ status: 'error', message: 'Failed to scan QR code. Please try again.' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualScan();
    }
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">QR Code Scanner</h3>
      
      <div className="space-y-4">
        {/* Camera Button */}
        <div>
          <button
            onClick={toggleScanner}
            className={`px-4 py-2 ${showScanner ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md w-full md:w-auto`}
            disabled={!selectedEventId}
          >
            {showScanner ? '📷 Stop Camera' : '📷 Start Camera Scanner'}
          </button>
          
          {!selectedEventId && (
            <p className="text-xs text-red-500 mt-1">
              Please select an event before scanning
            </p>
          )}
        </div>
        
        {/* QR Scanner */}
        {showScanner && (
          <div className="qr-scanner-container">
            <div id={scannerContainerId}></div>
            
            {scannerError && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                <p className="font-medium">Scanner Error:</p>
                <p>{scannerError}</p>
                <p className="mt-1 text-xs">
                  Try refreshing the page or check your camera permissions.
                </p>
              </div>
            )}
            
            {/* QR Debug Info */}
            {qrDebugInfo && (
              <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
                <p className="font-medium">Status:</p>
                <p>{qrDebugInfo}</p>
              </div>
            )}
            
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Position the QR code within the scanner frame. The scanner will automatically detect the code.
              </p>
            </div>
          </div>
        )}

        {/* Manual Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manual User ID Entry
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter User ID from QR code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isScanning}
            />
            <button
              onClick={handleManualScan}
              disabled={isScanning || !manualInput.trim() || !selectedEventId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isScanning ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Scan the QR code or enter the User ID manually
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How to use:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Select an event from the dropdown above</li>
            <li>2. Click "Start Camera Scanner" to scan QR code directly <strong>OR</strong></li>
            <li>3. Enter the User ID manually</li>
            <li>4. Click "Verify" to check registration status</li>
          </ol>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setManualInput('');
              setQrDebugInfo('');
              setScannerError('');
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Input
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;