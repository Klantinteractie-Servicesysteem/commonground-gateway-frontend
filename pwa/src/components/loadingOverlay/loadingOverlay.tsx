import * as React from "react";
import "./loadingOverlay.css";
import { Spinner } from "@conductionnl/nl-design-system/lib";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";

const LoadingOverlay = () => {
  const [loadingOverlay] = React.useContext(LoadingOverlayContext);

  return loadingOverlay.isLoading ? (
    <div className="loadingOverlay">
      <Spinner />
    </div>
  ) : (
    <></>
  );
};

export default LoadingOverlay;
