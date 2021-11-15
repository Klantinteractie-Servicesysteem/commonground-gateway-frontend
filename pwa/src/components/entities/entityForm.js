import * as React from "react";

export default function EntityForm() {

  return (
    <div className="utrecht-html">
      <label htmlFor="name">Name</label>
      <input type="text" id="name"/><br/>
      <label htmlFor="endpoint">Endpoint</label>
      <input type="text" id="endpoint"/><br/>
      <label htmlFor="description">Description</label>
      <input type="text" id="description"/>
    </div>
  );
}
