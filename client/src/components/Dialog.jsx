import React from "react";

const Dialog = ({
  isOpen,
  title,
  message,
  confirmText = "Ok",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  onCancel,
  className = "",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 ${className}`}>
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>}
          {message && <p className="text-slate-300 leading-relaxed">{message}</p>}
          {children}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
          {showCancel && (
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
