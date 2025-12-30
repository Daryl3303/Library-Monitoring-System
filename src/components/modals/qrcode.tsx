// QrCodeModal.tsx
import { X, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrCodeModalProps {
  isOpen: boolean;
  userName: string;
  userUid: string;
  onClose: () => void;
}

export default function QrCodeModal({
  isOpen,
  userName,
  userUid,
  onClose,
}: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && userUid) {
      // Generate QR code when modal opens
      QRCode.toCanvas(
        canvasRef.current,
        userUid,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    }
  }, [isOpen, userUid]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${userName.replace(/\s+/g, "_")}_QRCode.png`;
      link.href = url;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-gray-700 font-medium mb-1">{userName}</p>
            <p className="text-sm text-gray-500">UID: {userUid}</p>
          </div>

          {/* QR Code Canvas */}
          <div className="flex justify-center mb-6 bg-gray-50 p-6 rounded-lg">
            <canvas ref={canvasRef} className="border-4 border-white shadow-md" />
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download QR Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}