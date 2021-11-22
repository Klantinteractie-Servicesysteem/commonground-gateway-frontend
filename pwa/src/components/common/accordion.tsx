import * as React from "react";

export default function Spinner({ children, id = 'id', title = "Title"}) {

  return (
    <div className="accordion mt-4" id={id + "Accordion"}>
      <div className="accordion-item">
        <h2 className="accordion-header" id={id}>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={'#' + id + 'Collapse'}
            aria-expanded="true"
            aria-controls={ id + 'Collapse'}
        >
            {title}
        </button>
      </h2>
      <div
          id={id + 'Collapse'}
          className="accordion-collapse collapse show"
          aria-labelledby={id}
          data-bs-parent={'#' + id + "Accordion"}
      >
          <div className="accordion-body">
            {children}
        </div>
      </div>
    </div>
  </div>
  );
}
