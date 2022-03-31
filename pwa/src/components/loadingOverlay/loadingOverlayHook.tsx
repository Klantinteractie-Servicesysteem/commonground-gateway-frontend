import * as React from "react";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import LoadingOverlay from "./loadingOverlay";

const LoadingOverlayHook = () => {
  const [loadingOverlay] = React.useContext(LoadingOverlayContext);

  return loadingOverlay.isLoading ? <LoadingOverlay /> : <></>;
};

export default LoadingOverlayHook;
