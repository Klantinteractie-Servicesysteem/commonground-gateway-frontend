import * as React from "react";
import CardHeader from "./cardHeader";

export default function Card({ children, title = 'Title', modal = null, refresh = null, add = null, back = null, save = null, onlySaveIf = undefined}) {

  return (
    <div className="utrecht-card card">
      <CardHeader title={title} modal={modal} refresh={refresh} add={add} back={back} save={save} onlySaveIf={onlySaveIf} />
      <div className="utrecht-card-body card-body">
        {children}
      </div>
    </div>
  );
}
