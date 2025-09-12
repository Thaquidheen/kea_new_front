import React, { useState, useEffect, useRef } from 'react';
import { 
  scanQRForEventCheckIn, 
  confirmEventCheckIn, 
  getEventAttendance, 
  getEventsList 
} from '../../api/EventCheckInApi';

const QRCheckInAdmin = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [manualUserId, setManualUserId] = useState('');
  const [scanMethod, setScanMethod] = useState('manual'); // 'manual' or 'camera'
  const [message, setMessage] = useState({ type: '', text: '' });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await getEventsList();
      setEvents(response);
    } catch (error) {
      console.error('Error loading events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleManualScan = async () => {
    if (!selectedEvent || !manualUserId.trim()) {
      showMessage('error', 'Please select an event and enter a User ID');
      return;
    }

    setLoading(true);
    try {
      const response = await scanQRForEventCheckIn(manualUserId.trim(), selectedEvent);
      setScanResult(response);
      
      if (response.status === 'ready_for_checkin') {
        showMessage('success', 'User verified and ready for check-in!');
      } else {
        showMessage('warning', response.message || 'User verification completed');
      }
    } catch (error) {
      console.error('Error scanning QR:', error);
      showMessage('error', 'Failed to verify user');
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!scanResult?.registration_id) {
      showMessage('error', 'No registration ID found');
      return;
    }

    setLoading(true);
    try {
      const response = await confirmEventCheckIn(scanResult.registration_id);
      showMessage('success', response.message || 'Check-in confirmed successfully!');
      setScanResult(null);
      setManualUserId('');
      
      // Refresh attendance if it's currently shown
      if (showAttendance && selectedEvent) {
        await loadAttendance();
      }
    } catch (error) {
      console.error('Error confirming check-in:', error);
      showMessage('error', 'Failed to confirm check-in');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    if (!selectedEvent) {
      showMessage('error', 'Please select an event first');
      return;
    }

    setLoading(true);
    try {
      const response = await getEventAttendance(selectedEvent);
      setAttendanceData(response);
      setShowAttendance(true);
    } catch (error) {
      console.error('Error loading attendance:', error);
      showMessage('error', 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setManualUserId('');
    setMessage({ type: '', text: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready_for_checkin':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'already_checked_in':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'not_registered':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'membership_inactive':
      case 'membership_expired':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">QR Check-in Admin Panel</h1>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' ? 'bg-green-100 border-green-300 text-green-800' :
          message.type === 'error' ? 'bg-red-100 border-red-300 text-red-800' :
          message.type === 'warning' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
          'bg-blue-100 border-blue-300 text-blue-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Event Selection */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Select Event</h2>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose an event...</option>
          {events.map((event) => (
            <option key={event.event_id} value={event.event_id}>
              {event.event_name} - {event.event_sub_name} ({new Date(event.event_time).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* Scanning Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User Verification</h2>
        
        {/* Manual User ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter User ID (from QR scan)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={manualUserId}
              onChange={(e) => setManualUserId(e.target.value)}
              placeholder="Enter User ID..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualScan}
              disabled={loading || !selectedEvent || !manualUserId.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify User'}
            </button>
          </div>
        </div>

        <button
          onClick={resetScan}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Clear Results
        </button>
      </div>

      {/* Scan Results */}
      {scanResult && (
        <div className={`mb-8 p-6 rounded-lg border-2 ${getStatusColor(scanResult.status)}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Verification Result</h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-50">
              {scanResult.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <p className="text-lg mb-4">{scanResult.message}</p>

          {scanResult.user_info && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">User Information:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {scanResult.user_info.username}</div>
                <div><strong>Email:</strong> {scanResult.user_info.email}</div>
                <div><strong>Phone:</strong> {scanResult.user_info.phone_number}</div>
                <div><strong>Company:</strong> {scanResult.user_info.company_name || 'N/A'}</div>
                <div><strong>Designation:</strong> {scanResult.user_info.designation || 'N/A'}</div>
                <div><strong>User Type:</strong> {scanResult.user_info.user_type}</div>
                {scanResult.user_info.fee_paid && (
                  <div><strong>Fee Paid:</strong> ₹{scanResult.user_info.fee_paid}</div>
                )}
              </div>
            </div>
          )}

          {scanResult.event_info && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Event Information:</h4>
              <div className="text-sm">
                <div><strong>Event:</strong> {scanResult.event_info.event_name} - {scanResult.event_info.event_sub_name}</div>
                <div><strong>Location:</strong> {scanResult.event_info.location}</div>
                <div><strong>Time:</strong> {new Date(scanResult.event_info.event_time).toLocaleString()}</div>
              </div>
            </div>
          )}

          {scanResult.status === 'ready_for_checkin' && (
            <button
              onClick={handleConfirmCheckIn}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Checking In...' : 'Confirm Check-In'}
            </button>
          )}

          {scanResult.checked_in_at && (
            <div className="mt-2 text-sm">
              <strong>Already checked in at:</strong> {new Date(scanResult.checked_in_at).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Attendance Management */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Event Attendance</h2>
        <div className="flex gap-3 mb-4">
          <button
            onClick={loadAttendance}
            disabled={loading || !selectedEvent}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'View Attendance'}
          </button>
          {showAttendance && (
            <button
              onClick={() => setShowAttendance(false)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Hide Attendance
            </button>
          )}
        </div>

        {showAttendance && attendanceData && (
          <div>
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-800">{attendanceData.statistics.total_registered}</div>
                <div className="text-sm text-blue-600">Total Registered</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-800">{attendanceData.statistics.total_checked_in}</div>
                <div className="text-sm text-green-600">Checked In</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-800">{attendanceData.statistics.pending_checkin}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-800">{attendanceData.statistics.attendance_rate}</div>
                <div className="text-sm text-purple-600">Attendance Rate</div>
              </div>
            </div>

            {/* Attendees List */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b">
                <h3 className="font-semibold">Registered Attendees</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fee Paid</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceData.attendees.map((attendee) => (
                      <tr key={attendee.user_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{attendee.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{attendee.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{attendee.company_name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">₹{attendee.fee_paid}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            attendee.checked_in 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {attendee.checked_in ? 'Checked In' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {attendee.checked_in_at 
                            ? new Date(attendee.checked_in_at).toLocaleString()
                            : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCheckInAdmin;