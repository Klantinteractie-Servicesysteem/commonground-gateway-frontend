import * as React from "react";
import "./tooltip.css";
import ReactTooltip from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface TooltipProps {
  content: JSX.Element | string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const uuid = uuidv4();

  return (
    <div className="Tooltip">
      <FontAwesomeIcon icon={faInfoCircle} data-tip data-for={uuid} className="Tooltip-button" />

      <ReactTooltip id={uuid} className="Tooltip-tooltip" delayHide={250} effect="solid">
        {content}
      </ReactTooltip>
    </div>
  );
};
