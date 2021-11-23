import * as React from "react";

export default function Text({ name = 'name', value = null, required = null }) {

  return (<>
    {value !== null ? (<>
      {required !== false ? (
        <input
          className="utrecht-textbox utrecht-textbox--html-input"
          name={name}
          id={name + "Input"}
          defaultValue={value}
          required
        />
      ) : (
        <input
          className="utrecht-textbox utrecht-textbox--html-input"
          name={name}
          id={name + "Input"}
          defaultValue={value}

        />
      )}
    </>) : (<>
      {required !== false ? (
        <input
          className="utrecht-textbox utrecht-textbox--html-input"
          name={name}
          id={name + "Input"}
          required
        />
      ) : (
        <input
          className="utrecht-textbox utrecht-textbox--html-input"
          name={name}
          id={name + "Input"}
        />
      )}
    </>)} </>
  );
}
