import * as React from "react";
import "./infoOverlay.css";

export enum VerticallyCentered {
  scrollable = "modal-dialog-centered modal-dialog-scrollable",
}

// default value is 500px
export enum Size {
  small = "modal-sm",
  lage = "modal-lg",
  extraLage = "modal-xl",
}

interface InfoOverlayProps {
  title: string;
  id: any;
  body: () => JSX.Element;
  footer?: () => JSX.Element;
  centered?: VerticallyCentered;
  size?: Size;
}

/**
 * This components renders bootstrap modal.
 *
 * @returns JSX of the generated Modal.
 */
export const InfoOverlay: React.FC<InfoOverlayProps> = ({
  title,
  id,
  body,
  footer,
  size,
}) => {
  return (
    <div
      className="modal fade right"
      tabIndex={-1}
      id={`${id.replaceAll("-", "")}`}
      aria-labelledby={`${id.replaceAll("-", "")}Label`}
      aria-hidden="true"
    >
      <div className={` ${size && size}`}>
        <div className="modal-content custom">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">{body && body()}</div>
          {footer && (
            <div
              className="modal-footer"
              id={`modalFooter${id.replaceAll("-", "")}`}
            >
              {footer()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
