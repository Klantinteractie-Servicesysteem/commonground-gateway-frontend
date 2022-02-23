import * as React from "react";
import "./LabelWithBackground.css";

interface LabelWithBackgroundProps {
  label: string;
  type: "success" | "danger" | "primary" | "secondary";
}

const LabelWithBackground: React.FC<LabelWithBackgroundProps> = ({ label, type }) => {
  return <span className={`LabelWithBackground LabelWithBackground--${type}`}>{label}</span>;
};

export default LabelWithBackground;
