import * as React from "react";

interface AccordionProps {
  items: Array<Record<"id"|"title"|"render", any>>;
  id: string;
}

/**
 * This components renders an bootstrap accordion.
 * @returns TSX of the generated accordion.
 */
export default function Accordion(props: AccordionProps) {
  return (
    <div className="accordion mt-4" id={props.id + "Accordion"}>
      {props.items.map((item) => (<>
        <div className="accordion-item">
          <h2 className="accordion-header" id={item.id}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={'#' + item.id + 'Collapse'}
              aria-expanded="false"
              aria-controls={ item.id + 'Collapse'}
            >
              {item.title}
            </button>
          </h2>
          <div
            id={item.id + 'Collapse'}
            className="accordion-collapse collapse"
            aria-labelledby={item.id}
            data-bs-parent={'#' + item.id + "Accordion"}
          >
            <div className="accordion-body">
              {item.render()}
            </div>
          </div>
        </div>
      </>))
      }
  </div>
  );
}
