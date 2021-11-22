import * as React from "react";
import {Link} from "gatsby";

export default function CardHeader({items}) {

  const cardTitle = items.map((item) =>
    <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">{item.title}</h4>
  )

  return (
    <div className="utrecht-card-header card-header">
      <div className="utrecht-card-head-row card-head-row row">
        <div className="col-6">
          {
            cardTitle
          }
        </div>
          {
            items.map((item) => (
            <div className="col-6 text-right">
            <button className="utrecht-link button-no-style" data-toggle="modal" data-target={item.modal}>
                <i className="fas fa-question mr-1"></i>
                <span className="mr-2">Help</span>
              </button>
            <a className="utrecht-link" onClick={item.refresh}>
            <i className="fas fa-sync-alt mr-1"></i>
            <span className="mr-2">Refresh</span>
            </a>
              {
                item.link !== null &&
                <Link to={item.add}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i className="fas fa-plus mr-2"></i>Add</button>
                </Link>
              }
            </div>
            ))
          }
      </div>
    </div>
  );
}
