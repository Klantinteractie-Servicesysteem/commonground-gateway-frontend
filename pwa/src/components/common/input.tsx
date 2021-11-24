import * as React from "react";
import Text from "./inputs/text";
import Number from "./inputs/number";

export default function Input({ label = "Label", type = 'text', name = 'name', value = null, required = false, maxLength = null }) {

  const renderType = (type) => {
    console.log(type);
    switch (type) {
      case 'text':
        return <Text name={name} value={value} required={required} />;
      case 'number':
        return <Number name={name} value={value} required={required} />;
      default:
        return <></>;
    }
  }

  return (
    <div className="form-group">
      <span className="utrecht-form-label mb-2">{label}{required === true && <> * </>}</span>
      {renderType(type)}
    </div>
  );
}
