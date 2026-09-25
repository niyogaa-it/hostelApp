import React from "react";

export const SERVICE_STATUS = [
  { id: 1, name: "Open", bg: "#fff2d6", color: "#ffab00" },
  { id: 2, name: "In Progress", bg: "#d7f5fc", color: "#039be5" },
  { id: 3, name: "Completed", bg: "#e8fadf", color: "#71dd37" },
  { id: 4, name: "Rescheduled", bg: "#f1e4fb", color: "#883495" },
  { id: 5, name: "Closed", bg: "#eceff1", color: "#607d8b" },
];

export const statusBadge = (status_name) => {
  const match = SERVICE_STATUS.find((s) => s.name === status_name) || {};
  return (
    <span
      style={{
        padding: "0.5rem",
        borderRadius: "5px",
        backgroundColor: match.bg || "#eceff1",
        color: match.color || "#607d8b",
        fontWeight: "bold",
        border: "none",
      }}
    >
      {(status_name || "-").toUpperCase()}
    </span>
  );
};
