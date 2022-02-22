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
      <div id={`new${_.upperFirst(props.id)}`}>
        <ul style={{ paddingLeft: 0 }}>
          {props.data !== undefined &&
          props.data !== null &&
          props.data.map((item) => (
            item.value && Object.entries(item.value).map(([key, value], idx) => {
              return (
                  <div className="d-flex">
                    <div className="col-10">
                      <div className="form-group">
                        <span className="utrecht-form-label">{key}</span>
                        <input
                          type="text"
                          id="value"
                          name={`${props.id}[${key}]`}
                          value={value}
                          className="utrecht-textbox utrecht-textbox--html-input mb-2"
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
                        Delete
                      </button>
                    </div>
                  </div>
              );
            })))}
        </ul>
      </div>
      <br />
      <div className="separator-solid" />
      <h5>Create {props.label ?? props.id}</h5>
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
                deleteElement
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
