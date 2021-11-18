import * as React from "react";
import * as _ from "lodash";
import { deleteElementFunction, addElement } from "./elementCreation";

/**
 * This components handles multidimensional array input forms.
 *
 * @param {object|null} data either object used for the map or null.
 * @param {string} name Name of the key that holds the array data.
 * @returns Jsx of the generated form.
 */
export const multiDimensionalArrayInput = (name, data = null) => {
  const deleteElement = deleteElementFunction;

  return (
    <>
      <span className="utrecht-form-label">{_.upperFirst(name)}</span>
      <div id={`new${_.upperFirst(name)}`}>
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
                      name={`${name}[${key}]`}
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
      <h5>Add {name}</h5>
      <div className="d-flex">
        <div>
          <div className="form-group">
            <span className="utrecht-form-label">Key</span>
            <input
              type="text"
              id={`new${_.upperFirst(name)}Key`}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <span className="utrecht-form-label">Value</span>
            <input
              type="text"
              id={`new${_.upperFirst(name)}Value`}
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
                `new${_.upperFirst(name)}`,
                `new${_.upperFirst(name)}Key`,
                `new${_.upperFirst(name)}Value`,
                name,
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
