import * as React from "react";
import * as _ from "lodash";
import { deleteElementFunction, addElement } from "./elementCreation";

/**
 * This components handles multidimensional array input forms.
 *
 * @param {string} target Target that holds the array data.
 * @param {object|null} data either object used for the map or null.
 * @param {string|null} name Name used for the labels.
 * @returns Jsx of the generated form.
 */
export const ArrayInputComponent = ({ target, data = null, name = null }) => {
  const deleteElement = deleteElementFunction;
  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name ?? target)}</span>
      <div id={`new${_.upperFirst(target)}`}>
        {data !== undefined &&
          data !== null &&
          Object.entries(data).map(([key, value]) => {
            return (
              <div className={`row ${value}`}>
                <div className="col-5">
                  <div className="form-group">
                    <input
                      type="text"
                      id="value"
                      name={`${target}[${value}]`}
                      defaultValue={value}
                      className="utrecht-textbox utrecht-textbox--html-input mb-2"
                    />
                  </div>
                </div>
                <div className="col-2 d-flex mt-auto mb-4">
                  <button
                    value={value}
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
                `new${_.upperFirst(target)}Value`,
                `new${_.upperFirst(target)}Value`,
                target,
                deleteElement,
                false
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
