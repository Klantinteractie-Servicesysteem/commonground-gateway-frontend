import * as React from "react";
import "./LabelWithBackground.css";

interface LabelWithBackgroundProps {
  label: string;
  type?: "success" | "danger" | "primary" | "secondary";
  color?: string;
}

const LabelWithBackground: React.FC<LabelWithBackgroundProps> = ({ label, type, color }) => {
  return <span style={{ backgroundColor: `${color}`}} className={`LabelWithBackground LabelWithBackground--${type}`}>{label}</span>;
};

export default LabelWithBackground;
