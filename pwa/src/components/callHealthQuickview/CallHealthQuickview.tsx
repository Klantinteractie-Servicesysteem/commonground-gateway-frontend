import * as React from "react";
import LabelWithBackground from "../LabelWithBackground/LabelWithBackground";
import "./callHealthQuickview.css";

interface CallHealthQuickviewProps {
  healthyCallsAmount: number;
  unhealthyCallsAmount: number;
}

export const CallHealthQuickview: React.FC<CallHealthQuickviewProps> = ({
  healthyCallsAmount,
  unhealthyCallsAmount,
}) => {
  return (
    <div className="callHealthQuickview">
      <div className="callHealthQuickview--healthy">
        Healthy <LabelWithBackground label={healthyCallsAmount.toString()} type="success" />
      </div>

      <div className="callHealthQuickview--unhealthy">
        Unhealthy <LabelWithBackground label={unhealthyCallsAmount.toString()} type="danger" />
      </div>
    </div>
  );
};

export default CallHealthQuickview;
