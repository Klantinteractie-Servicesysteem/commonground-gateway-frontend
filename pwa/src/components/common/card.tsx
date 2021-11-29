import * as React from "react";

interface CardProps {
  title: string;
  cardHeader?: Array<Record<"render", any>>;
  cardBody: Array<Record<"render", any>>;
}

/**
 * This components renders a bootstrap card.
 * @returns JSX of the generated Card.
 */
export default function Card(props: CardProps) {

  return (
    <div className="utrecht-card card">
      <div className="utrecht-card-header card-header">
        <div className="utrecht-card-head-row card-head-row row">
          <div className="col-6">
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">{props.title}</h4>
          </div>
          {
            props.cardHeader !== null &&
            props.cardHeader.map((item) => (<>
              {item.render()}
            </>))
          }
        </div>
      </div>
      <div className="utrecht-card-body card-body">
        {props.cardBody.map((item) => (<>
          {item.render()}
        </>))}
      </div>
    </div>
  );
}
