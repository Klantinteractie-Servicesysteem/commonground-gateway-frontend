import * as React from "react";

interface TabsProps {
  items: Array<Partial<Record<"name"|"active"|"id", any>>>;
}

/**
 * This components renders tabs.
 * @returns TSX of the generated tabs.
 */
export default function Tabs(props: TabsProps) {
    const navItems = props.items.map((item) =>
        <li className="nav-item" role="presentation" key={item.name}>
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
