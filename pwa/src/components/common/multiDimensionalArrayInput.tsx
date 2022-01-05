import * as React from "react";
import * as _ from "lodash";
import { deleteElementFunction, addElement } from "./elementCreation";

interface MultiDimensionalArrayInputProps {
  data: Record<any, any>;
  id?: string;
  label?: string;
  deleteFunction?: any;
  addFunction?: any;
}

/**
 * This components handles multidimensional array input forms.
 * @returns JSX of the generated form.
 */
export function MultiDimensionalArrayInput(props: MultiDimensionalArrayInputProps) {
  const deleteElement = deleteElementFunction;

  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(props.label ?? props.id)}</span>
      <div id={`new${_.upperFirst(props.id)}`}>
        {props.data !== undefined &&
        props.data !== null &&
        Object.entries(props.data).map(([key, value]) => {
              return (
                <>
                  <div key={value} className={`row ${key}`}>
                    <div className="col-5">
                      <div className="form-group">
                        <label htmlFor={value} className="utrecht-form-label">
                          {key}
                        </label>
                        <input
                          type="text"
                          id="value"
                          name={`${props.id}[${key}]`}
                          defaultValue={value}
                          className="utrecht-textbox utrecht-textbox--html-input mb-2"
                        />
                      </div>
                    </div>
                    <div className="col-2 d-flex mt-auto mb-4">
                      <button
                        value={key}
                        onClick={deleteElement}
                        type="button"
                        className="utrecht-button utrecht-button-sm btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
      </div>
      <br />
      <div className="separator-solid" />
      <h5>Add {props.label ?? props.id}</h5>
      <div className="d-flex">
        <div>
          <div className="form-group">
            <span className="utrecht-form-label">Key</span>
            <input type="text" id={`new${_.upperFirst(props.id)}Key`} className="form-control" />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <span className="utrecht-form-label">Value</span>
            <input type="text" id={`new${_.upperFirst(props.id)}Value`} className="form-control" />
          </div>
        </div>
        <div className="col-2 my-auto">
          <button
            type={"button"}
            className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
            onClick={() => {
              addElement(
                `new${_.upperFirst(props.id)}`,
                `new${_.upperFirst(props.id)}Key`,
                `new${_.upperFirst(props.id)}Value`,
                `${props.id}`,
                deleteElement,
              );
            }}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
