import { createContext, useState, useCallback } from "react";
import ToastMessage from "../Toast/Toast";
import { Toast } from "../Enum/toast"; // Importing the Toast enum

export const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toast, setToastState] = useState(null);

  // Using the Toast enum to enforce valid types
  const setToast = useCallback((message, type) => {
    if (!Object.values(Toast).includes(type)) {
      console.warn("Invalid toast type:", type);
      return;
    }
    setToastState({ message, type });
  }, []);

  const clearHandler = useCallback(() => {
    setToastState(null);
  }, []);

  return (
    <ToastContext.Provider value={{ setToast }}>
      {" "}
      {/* Fix: Expose setToast, not setToastState */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          closeHandler={clearHandler}
        />
      )}
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
