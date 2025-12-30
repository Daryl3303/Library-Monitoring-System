import { useState, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, Scan, User } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

type StatusType = '' | 'success' | 'error';

interface UserData {
  name: string;
  department: string;
  year: string;
}

export default function ScannerLogger() {
  const [scanData, setScanData] = useState<string>('');
  const [status, setStatus] = useState<{ type: StatusType; message: string }>({
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const logToFirestore = async (uid: string) => {
    if (!uid.trim() || loading) return;

    setLoading(true);
    setUserInfo(null);

    try {
      // First, fetch user data from "users" collection using uid
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('User not found in database');
      }

      const userData = userDocSnap.data() as UserData;
      setUserInfo(userData);

      // Then, add log entry with user information
      await addDoc(collection(db, 'logs'), {
        uid,
        Name: userData.name,
        Department: userData.department,
        Year: userData.year,
        timestamp: serverTimestamp(),
      });

      setStatus({
        type: 'success',
        message: `Successfully logged ${userData.name}!`,
      });

      setScanData('');

      setTimeout(() => {
        setStatus({ type: '', message: '' });
        setUserInfo(null);
        inputRef.current?.focus();
      }, 3000);
    } catch (error) {
      const err = error as Error;

      setStatus({
        type: 'error',
        message: err.message || 'Failed to log data',
      });

      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      logToFirestore(scanData);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Scan className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Scan to Log
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Ready to Scan
            </label>

            <input
              ref={inputRef}
              type="text"
              value={scanData}
              onChange={(e) => setScanData(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scan QR code here..."
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:bg-blue-50 disabled:cursor-not-allowed"
              autoFocus
            />

            <p className="text-xs text-blue-500 mt-2">
              {loading
                ? 'Looking up user...'
                : 'Press Enter after scanning to log'}
            </p>
          </div>

          {userInfo && (
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">User Information</span>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Department:</strong> {userInfo.department}</p>
                <p><strong>Year:</strong> {userInfo.year}</p>
              </div>
            </div>
          )}

          {status.message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                status.type === 'success'
                  ? 'bg-blue-50 text-blue-800 border-2 border-blue-200'
                  : 'bg-red-50 text-red-800 border-2 border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{status.message}</span>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Scan QR code containing user UID to automatically fetch and log user information.
          </p>
        </div>
      </div>
    </div>
  );
}