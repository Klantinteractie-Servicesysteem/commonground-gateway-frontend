import * as React from "react";

export default function Number({ name = 'name', value = null, required = null }) {

  return (<>
    {value !== null ? (<>
      {required !== false ? (
        <input
          className="utrecht-textbox utrecht-textbox--html-input"
          name={name}
          id={name+"Input"}
          defaultValue={value}
          type="number"
          required
        />
      ) : (
        <input
            className="utrecht-textbox utrecht-textbox--html-input"
            name={name}
            id={name + "Input"}
            defaultValue={value}
            type="number"
        />
      )}
    </>) : (<>
      {required !== false ? (
        <input
            className="utrecht-textbox utrecht-textbox--html-input"
            name={name}
            id={name + "Input"}
            required
            type="number"
        />
      ) : (
        <input
              className="utrecht-textbox utrecht-textbox--html-input"
              name={name}
              id={name + "Input"}
              type="number"
        />
      )}
    </>)} </>
  );
}
