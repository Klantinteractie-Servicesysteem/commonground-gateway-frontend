import * as React from "react";

export enum VerticallyCentered {
  centered = "modal-dialog-centered",
  scrollable = "modal-dialog-centered modal-dialog-scrollable",
}

// default value is 500px
export enum Size {
  small = "modal-sm",
  lage = "modal-lg",
  extraLage = "modal-xl",
}

interface ModalProps {
  title: string;
  id: any;
  body: () => JSX.Element;
  footer?: () => JSX.Element;
  centered?: VerticallyCentered;
  size?: Size;
  ref?: any;
}

/**
 * This components renders bootstrap modal.
 *
 * @returns JSX of the generated Modal.
 */
export const Modal: React.FC<ModalProps> = ({ title, id, body, footer, centered, size, ref }) => {
  return ( 
    <div
      className="modal fade"
      tabIndex={-1}
      id={`${id.replaceAll("-", "")}`}
      aria-labelledby={`${id.replaceAll("-", "")}Label`}
      aria-hidden="false"
      ref={ref}
    >
      <div className={`modal-dialog ${centered} ${size && size}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">{body && body()}</div>
          {footer && (
            <div className="modal-footer" id={`modalFooter${id.replaceAll("-", "")}`}>
              {footer()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
