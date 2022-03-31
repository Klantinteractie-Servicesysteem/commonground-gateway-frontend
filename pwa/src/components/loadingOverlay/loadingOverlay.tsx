import * as React from "react";
import "./loadingOverlay.css";
import { Spinner } from "@conductionnl/nl-design-system/lib";

const loadingOverlay: React.FC = () => {
  return (
    <div className="loadingOverlay">
      <Spinner />
    </div>
  );
};

export default loadingOverlay;
