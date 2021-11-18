import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { Link, navigate } from "gatsby";
import { multiDimensionalArrayInput } from "../utility/multiDimensionalArrayInput";

export default function EntityForm({ id }) {
  const context = useUrlContext();
  const [entity, setEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const getEntity = () => {
    fetch(`${context.apiUrl}/entities/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setEntity(data);
      });
  };

  const checkInputs = (inputs) => {
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].length === 0) {
        valid = false;
      }
    }
    return valid;
  };

  const removeEmptyValues = (obj) => {
    for (var propName in obj) {
      if (
        obj[propName] === undefined ||
        (obj[propName] === null && obj[propName] !== false)
      ) {
        delete obj[propName];
      }
    }
    return obj;
  };

  const retrieveArray = (array, type) => {
    let result = {};

    for (let i = 0; i < array.length; i++) {
      let target = array[i];

      if (target.name.includes(type)) {
        result[
          target.name.substring(
            target.name.indexOf("[") + 1,
            target.name.lastIndexOf("]")
          )
        ] = target.value;
      }
    }

    return result;
  };

  const saveEntity = (event) => {
    event.preventDefault();
    // setShowSpinner(true);

    // retrieve arrays
    let transformations = retrieveArray(event.target, "transformations");

    console.log(transformations);

    let body = {
      name: event.target.name.value,
      description: event.target.description.value,
      route: event.target.route.value,
      endpoint: event.target.endpoint.value,
      gateway: event.target.gateway.value,
      extend: event.target.extend.checked,
    };

    // check arrays
    if (Object.keys(transformations).length != 0) {
      body["transformations"] = transformations;
    } else {
      body["transformations"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyValues(body);

    if (!checkInputs([body.name])) {
      return;
    }

    setShowSpinner(true);

    let url = context.apiUrl + "/entities";
    let method = null;
    if (id === "new") {
      method = "POST";
    } else {
      url = `${url}/${id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setEntity(data);
        setShowSpinner(false);
        navigate(`/entities`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [sources, setSources] = React.useState(null);
  const getSources = () => {
    fetch(context.apiUrl + "/gateways", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"] !== null
        ) {
          setSources(data["hydra:member"]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  React.useEffect(() => {
    getSources();
    if (id !== "new") {
      getEntity();
    }
  }, []);

  return (
    <div className="utrecht-card card">
      <form id="dataForm" onSubmit={saveEntity}>
        <div className="utrecht-card-header card-header">
          <div className="utrecht-card-head-row card-head-row row">
            <div className="col-6">
              <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">
                Values
              </h4>
            </div>
            <div className="col-6 text-right">
              <Link className="utrecht-link" to="/entities">
                <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2"></i>Back
                </button>
              </Link>
              {sources !== null && sources.length > 0 ? (
                <button
                  className="utrecht-button utrecht-button-sm btn btn-sm btn-success"
                  type="submit"
                >
                  <i className="fas fa-save mr-2"></i>Save
                </button>
              ) : (
                <button
                  disabled
                  className="utrecht-button utrecht-button-sm btn btn-sm btn-success"
                  type="submit"
                >
                  <i className="fas fa-save mr-2"></i>Save
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="utrecht-card-body card-body">
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <div className="text-center py-5">
                  <div
                    class="spinner-border text-primary"
                    style={{ width: "3rem", height: "3rem" }}
                    role="status"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <span className="utrecht-form-label mb-2">Name *</span>
                        {entity !== null && entity.name !== null ? (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="name"
                            id="nameInput"
                            defaultValue={entity.name}
                            required
                          />
                        ) : (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="name"
                            id="nameInput"
                            required
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <span className="utrecht-form-label">Description</span>
                        {entity !== null && entity.description !== null ? (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="description"
                            id="descriptionInput"
                            defaultValue={entity.description}
                          />
                        ) : (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="description"
                            id="descriptionInput"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <span className="utrecht-form-label">Endpoint</span>
                        {entity !== null && entity.endpoint !== null ? (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="endpoint"
                            id="endpointInput"
                            defaultValue={entity.endpoint}
                          />
                        ) : (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="endpoint"
                            id="endpointInput"
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <span className="utrecht-form-label">Route</span>
                        {entity !== null && entity.route !== null ? (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="route"
                            id="routeInput"
                            defaultValue={entity.route}
                          />
                        ) : (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="route"
                            id="routeInput"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <span className="utrecht-form-label">Source</span>
                        <select
                          name="gateway"
                          id="gatewayInput"
                          class="utrecht-select utrecht-select--html-select"
                        >
                          {sources !== null && sources.length > 0 ? (
                            sources.map((row) => (
                              <>
                                {entity !== null &&
                                entity.gateway !== undefined &&
                                entity.gateway !== null &&
                                entity.gateway.id == row.id ? (
                                  <option
                                    value={"/admin/gateways/" + row.id}
                                    selected
                                  >
                                    {row.name}
                                  </option>
                                ) : (
                                  <option value={"/admin/gateways/" + row.id}>
                                    {row.name}
                                  </option>
                                )}
                              </>
                            ))
                          ) : (
                            <option value="">
                              Please create a Source before creating an Entity
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div class="form-check">
                        {entity !== null ? (
                          <>
                            {entity.extend ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="extendInput"
                                name="extend"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="extendInput"
                                name="extend"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="extendInput"
                            name="extend"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="extendInput">
                          Extend
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="accordion mt-4" id="entityAccordion">
                    <div class="accordion-item">
                      <h2
                        class="accordion-header"
                        id="transformationsAccordion"
                      >
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#transformationsCollapse"
                          aria-expanded="true"
                          aria-controls="transformationsCollapse"
                        >
                          Transformations
                        </button>
                      </h2>
                      <div
                        id="transformationsCollapse"
                        class="accordion-collapse collapse show"
                        aria-labelledby="transformationsAccordion"
                        data-bs-parent="#entityAccordion"
                      >
                        <div class="accordion-body">
                          {entity !== null
                            ? multiDimensionalArrayInput(
                                "transformations",
                                entity.transformations
                              )
                            : multiDimensionalArrayInput("transformations")}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
