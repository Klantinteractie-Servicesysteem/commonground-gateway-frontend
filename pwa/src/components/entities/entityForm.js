import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { Link, navigate } from "gatsby";
import { MultiDimensionalArrayInput } from "../utility/multiDimensionalArrayInput";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";

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

  const saveEntity = (event) => {
    event.preventDefault();

    // retrieve arrays
    let transformations = retrieveFormArrayAsObject(
      event.target,
      "transformations"
    );
    let translationConfig = retrieveFormArrayAsObject(
      event.target,
      "translationConfig"
    );
    let collectionConfig = retrieveFormArrayAsObject(
      event.target,
      "collectionConfig"
    );

    let usedProperties = retrieveFormArrayAsOArray(
      event.target,
      "usedProperties"
    );

    let body = {
      name: event.target.name.value,
      description: event.target.description.value,
      route: event.target.route.value,
      endpoint: event.target.entityEndpoint.value,
      gateway: event.target.gateway.value,
      extend: event.target.extend.checked,
    };

    // check arrays
    if (Object.keys(transformations).length != 0) {
      body["transformations"] = transformations;
    } else {
      body["transformations"] = [];
    }

    if (Object.keys(translationConfig).length != 0) {
      body["translationConfig"] = translationConfig;
    } else {
      body["translationConfig"] = [];
    }

    if (Object.keys(collectionConfig).length != 0) {
      body["collectionConfig"] = collectionConfig;
    } else {
      body["collectionConfig"] = [];
    }

    if (usedProperties.length != 0) {
      body["usedProperties"] = usedProperties;
    } else {
      body["usedProperties"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name])) {
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
                            name="entityEndpoint"
                            id="endpointInput"
                            defaultValue={entity.endpoint}
                          />
                        ) : (
                          <input
                            className="utrecht-textbox utrecht-textbox--html-input"
                            name="entityEndpoint"
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
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="extendInput"
                                name="extend"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="extendInput"
                            name="extend"
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
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#transformationsCollapse"
                          aria-expanded="false"
                          aria-controls="transformationsCollapse"
                        >
                          Transformations
                        </button>
                      </h2>
                      <div
                        id="transformationsCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="transformationsAccordion"
                        data-bs-parent="#entityAccordion"
                      >
                        <div class="accordion-body">
                          {entity !== null ? (
                            <MultiDimensionalArrayInput
                              target={"transformations"}
                              data={entity.transformations}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"transformations"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2
                        class="accordion-header"
                        id="translationConfigAccordion"
                      >
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#translationConfigCollapse"
                          aria-expanded="false"
                          aria-controls="translationConfigCollapse"
                        >
                          Translation Config
                        </button>
                      </h2>
                      <div
                        id="translationConfigCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="translationConfigAccordion"
                        data-bs-parent="#entityAccordion"
                      >
                        <div class="accordion-body">
                          {entity !== null ? (
                            <MultiDimensionalArrayInput
                              target={"translationConfig"}
                              data={entity.translationConfig}
                              name={"Translation Config"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"translationConfig"}
                              name={"Translation Config"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2
                        class="accordion-header"
                        id="collectionConfigAccordion"
                      >
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collectionConfigCollapse"
                          aria-expanded="false"
                          aria-controls="collectionConfigCollapse"
                        >
                          Collection Config
                        </button>
                      </h2>
                      <div
                        id="collectionConfigCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="collectionConfigAccordion"
                        data-bs-parent="#entityAccordion"
                      >
                        <div class="accordion-body">
                          {entity !== null ? (
                            <MultiDimensionalArrayInput
                              target={"collectionConfig"}
                              data={entity.collectionConfig}
                              name={"Collection Config"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"collectionConfig"}
                              name={"Collection Config"}
                            />
                          )}
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
