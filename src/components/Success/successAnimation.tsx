import React, { useEffect } from "react";
import { Check } from "lucide-react";

interface SuccessAnimationProps {
  isVisible: boolean;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{
        zIndex: 10001,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-md w-full text-center border-2 border-green-200"
        style={{
          maxHeight: "100vh",
          position: "relative",
          zIndex: 10002,
          transform: "none",
          margin: "0 auto",
          bottom: "10%",
        }}
      >
        <div className="relative mx-auto mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto relative animate-pop">
            <Check className="w-10 h-10 text-white animate-check" />
          </div>

          <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-full mx-auto animate-ping opacity-60"></div>
        </div>

  
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-green-700">Form Submitted!</h3>
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">
              Your reservation has been successfully submitted.
            </p>
            <div>
              <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                📧 Wait for the update in your email
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-200 rounded-full h-1 overflow-hidden">
          <div className="bg-green-500 h-full rounded-full animate-progress"></div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          This window will close automatically
        </p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
