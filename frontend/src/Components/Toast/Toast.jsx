import { useEffect } from "react";
import { Toast } from "../Enum/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = ({ message, type, closeHandler }) => {
  // Fix: Correct prop name
  useEffect(() => {
    const autoCloseDuration = 1500; // 1 seconds (adjust as needed)

    switch (type) {
      case Toast.SUCCESS: // Fix: Correct Toast enum usage
        toast.success(message, { onClose: closeHandler, autoClose: autoCloseDuration });
        break;
      case Toast.ERROR:
        toast.error(message, { onClose: closeHandler, autoClose: autoCloseDuration });
        break;
      case Toast.INFO:
        toast.info(message, { onClose: closeHandler, autoClose: autoCloseDuration });
        break;
      case Toast.WARNING:
        toast.warn(message, { onClose: closeHandler, autoClose: autoCloseDuration });
        break;
      default:
        toast(message, { onClose: closeHandler, autoClose: autoCloseDuration });
    }
  }, [type, message, closeHandler]);

  return <ToastContainer />;
};

export default ToastMessage;
