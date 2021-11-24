import * as React from "react";


/**
 * This components renders an bootstrap accordion.
 *
 * @param {object} children Code that will be placed as child in this component.
 * @param {string} id HTML id for this accordion.
 * @param {string} title Title for this accordion.
 * @returns TSX of the generated accordion.
 */
export default function Accordion({ children, id = 'id', title = "Title"}) {

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
          className="accordion-collapse collapse"
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
