import * as React from "react";
import { Link } from "gatsby";
import EntityForm from "../entities/entityForm";
import AttributeTable from "../entities/attributeTable";
import LogsTable from "../entities/logsTable";


export default function Tabs({ items = null }) {
    const navItems = items.map((item) =>
        <li className="nav-item" role="presentation">
          <button className={item.active !== undefined && item.active ? 'nav-link active' : 'nav-link'} id={item.id + "-tab"} data-bs-toggle="tab" data-bs-target={"#"+item.id}
            type="button" role="tab" aria-controls={item.id} aria-selected="true">{item.name}
          </button>
        </li>
    )

  return (
    <ul className="nav nav-tabs" id="myTab" role="tablist">
      {
        navItems
      }
    </ul>

  );
}
