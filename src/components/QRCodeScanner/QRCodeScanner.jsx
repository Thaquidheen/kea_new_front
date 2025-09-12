import React, { useState, useEffect, useRef } from "react";
import { useNotification } from "../../contexts/NotificationContext";

function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const { success, error: showError, info } = useNotification();

  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setScanning(false);
    setCameraReady(false);
  };

  const initializeCamera = async () => {
    try {
      setError(null);
      setPermissionStatus("requesting");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported by this browser");
      }

      // Request camera permission and start
      await startCamera();
      
    } catch (err) {
      console.error("Camera initialization error:", err);
      handleCameraError(err);
    }
  };

  const handleCameraError = (err) => {
    console.error("Camera error:", err);
    
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      setPermissionStatus("denied");
      setError("Camera permission denied. Please allow camera access and refresh the page.");
      showError("Camera permission denied. Please allow camera access and refresh the page.");
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      setPermissionStatus("no_camera");
      setError("No camera found on this device.");
      showError("No camera found on this device.");
    } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
      setPermissionStatus("camera_busy");
      setError("Camera is already in use by another application.");
      showError("Camera is already in use by another application.");
    } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
      setPermissionStatus("constraint_error");
      setError("Camera doesn't support the required settings. Trying with basic settings...");
      info("Camera doesn't support the required settings. Trying with basic settings...");
      // Try with more basic constraints
      setTimeout(() => startCameraWithBasicConstraints(), 1000);
    } else {
      setPermissionStatus("error");
      setError(`Camera error: ${err.message}`);
      showError(`Camera error: ${err.message}`);
    }
  };

  const startCamera = async () => {
    try {
      // Progressive fallback for camera constraints
      const constraints = [
        // Try rear camera first (best for QR scanning)
        {
          video: {
            facingMode: { exact: "environment" },
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Fallback to any rear camera
        {
          video: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Fallback to front camera
        {
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Basic constraints
        {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        },
        // Minimal constraints
        {
          video: true
        }
      ];

      let stream = null;
      let constraintIndex = 0;

      while (!stream && constraintIndex < constraints.length) {
        try {
          console.log(`Trying camera constraint ${constraintIndex + 1}`);
          stream = await navigator.mediaDevices.getUserMedia(constraints[constraintIndex]);
          break;
        } catch (err) {
          console.log(`Constraint ${constraintIndex + 1} failed:`, err.message);
          constraintIndex++;
          if (constraintIndex >= constraints.length) {
            throw err;
          }
        }
      }

      if (!stream) {
        throw new Error("Could not access camera with any constraints");
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Set up video event handlers
        const video = videoRef.current;
        
        video.onloadedmetadata = () => {
          console.log("Video metadata loaded");
        };

        video.oncanplay = () => {
          console.log("Video can play");
          setCameraReady(true);
          setPermissionStatus("granted");
          setScanning(true);
          success("Camera ready! Position QR code within the frame.");
          startScanning();
        };

        video.onerror = (e) => {
          console.error("Video error:", e);
          setError("Video playback error");
        };

        // Start playing
        try {
          await video.play();
          console.log("Video started playing");
        } catch (playError) {
          console.error("Video play error:", playError);
          // Try to play again after a short delay
          setTimeout(async () => {
            try {
              await video.play();
            } catch (retryError) {
              console.error("Retry play error:", retryError);
              setError("Could not start video playback");
            }
          }, 500);
        }
      }

    } catch (err) {
      console.error("Start camera error:", err);
      throw err;
    }
  };

  const startCameraWithBasicConstraints = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
        setPermissionStatus("granted");
        setScanning(true);
        startScanning();
        setError(null);
      }
    } catch (err) {
      handleCameraError(err);
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      if (scanning && cameraReady) {
        scanForQRCode();
      }
    }, 300); // Scan every 300ms
  };

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Here you would integrate with a QR code library like jsQR
        // For now, we'll use the click simulation
        // In production, replace with: const code = jsQR(imageData.data, imageData.width, imageData.height);
        
      } catch (err) {
        console.error("Error processing video frame:", err);
      }
    }
  };

  // Demo function - replace with actual QR detection
  const handleVideoClick = () => {
    if (!scanning) return;
    
    // Simulate QR code detection
    const mockQRData = "UserID=12345678-1234-1234-1234-123456789abc";
    handleScan({ text: mockQRData });
  };

  const handleScan = (data) => {
    if (data && data.text) {
      console.log("QR Code detected:", data.text);
      info("QR Code detected, processing...");
      
      // Extract user ID from QR code
      const matches = data.text.match(/UserID=([a-f0-9\-]+)/i);
      if (matches && matches[1]) {
        setScanning(false);
        cleanup();
        verifyUserRegistration(matches[1]);
      } else {
        setError("Invalid QR Code format. Expected format: UserID=...");
        showError("Invalid QR Code format. Expected format: UserID=...");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const verifyUserRegistration = async (user_id) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showError("Authentication required. Please login first.");
        setScanResult({
          status: "error",
          message: "Authentication required. Please login first."
        });
        return;
      }

      info("Verifying user registration...");

      const response = await fetch("http://127.0.0.1:8000/program/verify-user-event-registration/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          showError("Session expired. Please login again.");
          setScanResult({
            status: "error",
            message: "Session expired. Please login again."
          });
          return;
        }
        
        if (response.status === 404) {
          showError("User not found or not registered for any events.");
          setScanResult({
            status: "not_registered",
            message: "User not found or not registered for any events."
          });
          return;
        }

        if (response.status === 403) {
          showError("Access denied. You don't have permission to verify registrations.");
          setScanResult({
            status: "error",
            message: "Access denied. You don't have permission to verify registrations."
          });
          return;
        }

        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setScanResult(result);
      
      if (result.status === "registered") {
        success(`Registration verified for ${result.user.username}`);
      } else {
        info("User registration status checked");
      }
      
    } catch (err) {
      console.error("Registration verification error:", err);
      setError("Failed to verify registration: " + err.message);
      showError("Failed to verify registration: " + err.message);
      
      setTimeout(() => {
        setError(null);
        resetToScanning();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetToScanning = async () => {
    setScanResult(null);
    setError(null);
    info("Resetting scanner...");
    await initializeCamera();
  };

  const resetScan = async () => {
    setScanResult(null);
    setError(null);
    info("Ready to scan next QR code");
    await initializeCamera();
  };

  const requestCameraPermission = async () => {
    setError(null);
    info("Requesting camera permission...");
    await initializeCamera();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-green-600 to-green-500">
            <h1 className="text-2xl font-bold text-center text-white">
              📱 QR Code Scanner
            </h1>
            <p className="text-center text-green-100 mt-2">
              Event Check-in System
            </p>
          </div>

          <div className="p-6">
            
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
                ⚠️ {error}
              </div>
            )}

            {/* Permission States */}
            {permissionStatus === "pending" || permissionStatus === "requesting" ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-300">Initializing camera...</p>
              </div>
            ) : permissionStatus === "denied" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-2">Camera Access Required</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Please allow camera access to scan QR codes for event check-in.
                </p>
                <button 
                  onClick={requestCameraPermission}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Enable Camera
                </button>
              </div>
            ) : permissionStatus === "no_camera" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">No Camera Found</h3>
                <p className="text-gray-300 text-sm">
                  No camera was detected on this device.
                </p>
              </div>
            ) : permissionStatus === "granted" && !scanResult ? (
              <div>
                {/* Camera View */}
                <div className="relative mb-4">
                  <div className="relative bg-black rounded-lg overflow-hidden border-4 border-green-500" style={{ aspectRatio: '4/3' }}>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover cursor-pointer"
                      autoPlay
                      playsInline
                      muted
                      onClick={handleVideoClick}
                      style={{ backgroundColor: 'black' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative w-48 h-48">
                        {/* Corner indicators */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-300"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-300"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-300"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-300"></div>
                        
                        {/* Scanning line animation */}
                        {scanning && (
                          <div className="absolute inset-0 overflow-hidden rounded">
                            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent animate-pulse" 
                                 style={{ 
                                   animation: 'scan 2s linear infinite',
                                   top: '50%',
                                   transform: 'translateY(-50%)'
                                 }}>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Camera status indicator */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-white text-sm font-medium">
                        {cameraReady ? 'Camera Ready' : 'Starting...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-300 text-sm">
                    {scanning ? (
                      <>
                        📱 <strong>Position QR code within the frame</strong>
                        <br />
                        <span className="text-gray-400">Tap the video for demo mode</span>
                      </>
                    ) : (
                      "Starting camera..."
                    )}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-300">Verifying registration...</p>
              </div>
            )}

            {/* Scan Results */}
            {scanResult && (
              <div className="space-y-4">
                {scanResult.status === "registered" ? (
                  <div className="bg-gray-700 rounded-lg p-6">
                    {/* Success Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{scanResult.user.username}</h3>
                        <p className="text-green-400 font-medium">✅ Registration Verified</p>
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-400">📅 Registered Events:</h4>
                      {scanResult.events.map((evt, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                          <div className="font-semibold text-white mb-1">{evt.event_name}</div>
                          <div className="text-gray-300 text-sm mb-2">{evt.event_sub_name}</div>
                          <div className="text-gray-400 text-sm mb-2">📍 {evt.location}</div>
                          <div className="text-gray-400 text-sm mb-3">🕐 {formatDate(evt.event_time)}</div>
                          <span className="inline-block bg-green-700 text-green-100 px-3 py-1 rounded-full text-xs font-medium">
                            💰 Fee Paid: ₹{evt.fee_paid}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={resetScan}
                      className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      🔄 Scan Next QR Code
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-500 mb-2">Not Registered</h3>
                    <p className="text-gray-300 mb-4">
                      {scanResult.message || "This user is not registered for any events"}
                    </p>
                    <button 
                      onClick={resetScan}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                    >
                      🔄 Scan Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-50%) translateX(-100%); }
          100% { transform: translateY(-50%) translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default QRCodeScanner;