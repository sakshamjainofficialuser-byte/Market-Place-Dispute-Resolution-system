import React, { useEffect } from "react";
import "./Toast.css";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container toast--${type}`}>
      <div className="toast-icon">
        {type === "success" && <MdCheckCircle />}
        {type === "error" && <MdError />}
        {type === "info" && <MdInfo />}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <MdClose />
      </button>
    </div>
  );
};

export default Toast;
