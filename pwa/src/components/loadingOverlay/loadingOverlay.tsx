import * as React from "react";
import "./loadingOverlay.css";
import {Spinner} from "@conductionnl/nl-design-system/lib";

interface loadingOverlayProps {

}

const loadingOverlay: React.FC<loadingOverlayProps> = ({}) => {
  return (
    <div className="loadingOverlay">
        <Spinner />
    </div>
  )
}

export default loadingOverlay
