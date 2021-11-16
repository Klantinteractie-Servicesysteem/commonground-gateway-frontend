import * as React from "react";
import { Link } from "gatsby";
import EntityForm from "../entities/entityForm";
import AttributeTable from "../entities/attributeTable";
import LogsTable from "../entities/logsTable";


export default function Tabs({ items = null }) {
    const navItems = items.map((item) =>
        <li className="nav-item" role="presentation">
          <a className={item.active !== undefined && item.active ? 'nav-link active' : 'nav-link'} id={item.id + "-tab"} data-bs-toggle="tab" data-bs-target={"#"+item.id}
            role="tab" aria-controls={item.id} aria-selected="true">{item.name}
          </a>
        </li>
    )

  return (
    <div className="page-navs bg-white">
      <ul className="nav nav-tabs nav-line d-flex w-100" id="myTab" role="tablist">
        {
          navItems
        }
      </ul>
    </div>
  );
}
