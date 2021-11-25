import * as React from "react";
import * as _ from "lodash";
import { deleteElementFunction, addElement } from "./elementCreation";

/**
 * This components handles multidimensional array input forms.
 *
 * @param {object|null} data Either object used for the map or null.
 * @param {string} target Target that holds the array data.
 * @param {string|null} name Name used for the labels.
 * @returns Jsx of the generated form.
 */
export const MultiDimensionalArrayInput = ({
  target,
  data = null,
  name = null
}) => {
  const deleteElement = deleteElementFunction;

  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <div id={`new${_.upperFirst(target)}`}>
        {data !== undefined &&
          data !== null &&
          Object.entries(data).map(([key, value]) => {
            return (
              <div className={`row ${key}`}>
                <div className="col-5">
                  <div className="form-group">
                    <label htmlFor={value} className="utrecht-form-label">
                      {key}
                    </label>
                    <input
                      type="text"
                      id="value"
                      name={`${target}[${key}]`}
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
            );
          })}
      </div>
      <br />
      <div className="separator-solid" />
      <h5>Add {name ?? target}</h5>
      <div className="d-flex">
        <div>
          <div className="form-group">
            <span className="utrecht-form-label">Key</span>
            <input
              type="text"
              id={`new${_.upperFirst(target)}Key`}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <span className="utrecht-form-label">Value</span>
            <input
              type="text"
              id={`new${_.upperFirst(target)}Value`}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-2 my-auto">
          <button
            type={"button"}
            className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
            onClick={() => {
              addElement(
                `new${_.upperFirst(target)}`,
                `new${_.upperFirst(target)}Key`,
                `new${_.upperFirst(target)}Value`,
                target,
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
};
