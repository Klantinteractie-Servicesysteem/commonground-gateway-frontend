import * as React from "react";
import "./callHealthQuickview.css";

interface CallHealthQuickviewProps {
  healthyCallsAmount: number,
  unhealthyCallsAmount: number,
}

export const CallHealthQuickview: React.FC<CallHealthQuickviewProps> = ({
                                                                          healthyCallsAmount,
                                                                          unhealthyCallsAmount
                                                                        }) => {
  return (
    <div className="callHealthQuickview">
      <div className="callHealthQuickview--healthy">
        Healthy <span>{healthyCallsAmount}</span>
      </div>

      <div className="callHealthQuickview--unhealthy">
        Unhealthy <span>{unhealthyCallsAmount}</span>
      </div>
    </div>
  );
};

export default CallHealthQuickview;
