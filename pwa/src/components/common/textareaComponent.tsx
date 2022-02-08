import * as _ from "lodash";
import * as React from "react";
// import { InfoTooltip } from "../../InfoTooltip/InfoTooltip";

// interface IInfoTooltip {
//   content: JSX.Element;
//   placement?: "top" | "right" | "bottom" | "left";
// }

interface TextareaComponentProps {
  id: string;
  data?: string | number;
  type: "text";
  name: string;
  nameOverride?: string;
  required?: boolean;
  disabled?: boolean;
  // infoTooltip?: IInfoTooltip;
}

/**
 * This component generates a input element with the specified type.
 *
 * @returns Jsx of the generated form.
 */
export const TextareaComponent: React.FC<TextareaComponentProps> = (
  {
    id,
    data,
    type,
    name,
    nameOverride,
    required,
    // infoTooltip,
  }) => {


  return (
    <div className="textarea-group">
      <label htmlFor={id} className="utrecht-form-label">
        {_.upperFirst(nameOverride ?? name)}
        {required && " *"}
        {/*{infoTooltip && <InfoTooltip content={infoTooltip.content} placement={infoTooltip.placement} />}*/}
      </label>
      <textarea
        className="utrecht-textarea"
        name={name}
        id={id}
        defaultValue={data === null ? undefined : data}
        required={required}
      />
    </div>
  );
};

TextareaComponent.defaultProps = {
  data: undefined,
  disabled: false,
  required: false,
};
