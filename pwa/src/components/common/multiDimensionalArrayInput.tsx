import * as React from "react";
import * as _ from "lodash";
import { deleteElementFunction, addElement } from "./elementCreation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

interface MultiDimensionalArrayInputProps {
  data: Record<any, any>;
  id?: string;
  label?: string;
}

/**
 * This components handles multidimensional array input forms.
 * @returns JSX of the generated form.
 */
const MultiDimensionalArrayInput: React.FC<MultiDimensionalArrayInputProps> = ({ data, id, label }) => {
  const deleteElement = deleteElementFunction;

  return (
    <>
      <div id={`new${_.upperFirst(id)}`}>
        <ul style={{ paddingLeft: 0 }}>
          {data !== undefined &&
            data !== null &&
            data.map(
              (item) =>
                item.value &&
                Object.entries(item.value).map(([key, value], idx) => {
                  return (
                    <div key={idx} className="d-flex">
                      <div className="col-10">
                        <div className="form-group">
                          <span className="utrecht-form-label">{key}</span>
                          <input
                            type="text"
                            id="value"
                            name={`${id}[${key}]`}
                            value={value.toString()}
                            className="utrecht-textbox utrecht-textbox--html-input mb-2"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-2 m-auto">
                        <button
                          value={key}
                          onClick={deleteElement}
                          type="button"
                          className="utrecht-button utrecht-button-sm btn-sm btn-danger"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                }),
            )}
        </ul>
      </div>
      <br />
      <div className="separator-solid" />
      <span className="font-weight-bold">Create {label ?? id}</span>
      <div className="d-flex">
        <div>
          <div className="form-group">
            <span className="utrecht-form-label">Key</span>
            <input type="text" id={`new${_.upperFirst(id)}Key`} className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <span className="utrecht-form-label">Value</span>
            <input type="text" id={`new${_.upperFirst(id)}Value`} className="form-control" />
          </div>
        </div>
        <div className="col-2 my-auto">
          <button
            type={"button"}
            className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
            onClick={() => {
              addElement(
                `new${_.upperFirst(id)}`,
                `new${_.upperFirst(id)}Key`,
                `new${_.upperFirst(id)}Value`,
                `${id}`,
                deleteElement,
              );
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>
      </div>
    </>
  );
};

export default MultiDimensionalArrayInput;
