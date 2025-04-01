import React from "react";

const DownloadButton = ({
  children,
  onClick,
  type = "button",
  variant = "custom",
}) => {
  const baseStyles = {
    padding: "10px 10px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    transition: "background-color 0.3s ease-in-out",
    border: "none",
    cursor: "pointer",
    display: "block", // Makes sure it takes full width when needed
    marginLeft: "auto", // Pushes button to the right
  };

  const variants = {
    primary: { backgroundColor: "#1D4ED8", hover: "#1E40AF" }, // Blue
    secondary: { backgroundColor: "#4B5563", hover: "#374151" }, // Gray
    danger: { backgroundColor: "#DC2626", hover: "#B91C1C" }, // Red
    success: { backgroundColor: "#16A34A", hover: "#15803D" }, // Green
    warning: { backgroundColor: "#EAB308", hover: "#CA8A04", color: "black" }, // Yellow
    custom: {
      backgroundColor: "#333333ae",
      hover: "#374151",
      color: "white",
    },
  };

  const style = {
    ...baseStyles,
    ...(variants[variant] || variants.custom),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
      onMouseEnter={(e) =>
        (e.target.style.backgroundColor =
          variants[variant]?.hover || variants.secondary.hover)
      }
      onMouseLeave={(e) =>
        (e.target.style.backgroundColor =
          variants[variant]?.backgroundColor ||
          variants.secondary.backgroundColor)
      }
    >
      {children}
    </button>
  );
};

export default DownloadButton;
