import * as React from "react";
import {GenericInputComponent} from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import {Checkbox} from "@conductionnl/nl-design-system/lib/Checkbox/src/checkbox";
import {SelectInputComponent} from "@conductionnl/nl-design-system/lib/SelectInput/src/selectInput";
import {Accordion} from "@conductionnl/nl-design-system/lib/Accordion/src/accordion";
import MultiDimensionalArrayInput from "@conductionnl/nl-design-system/lib/MultiDimenionalArrayInput/src/multiDimensionalArrayInput";
import {isLoggedIn} from "../../services/auth";
import {navigate} from "gatsby-link";

export default function EntityForm({id}) {
  const [context, setContext] = React.useState(null);
  const [entity, setEntity] = React.useState(null);
  const [sources, setSources] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (id !== "new") {
          fetch(`${context.apiUrl}/entities/${id}`, {
            credentials: "include",
            headers: {"Content-Type": "application/json"},
          })
            .then((response) => response.json())
            .then((data) => {
              setEntity(data);
            });
        }

        fetch(context.apiUrl + "/gateways", {
          credentials: "include",
          headers: {"Content-Type": "application/json"},
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
      }
    }
  }, [context]);

  const saveEntity = (event) => {
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
      headers: {"Content-Type": "application/json"},
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

  return (
    <>
      <form id="dataForm" onSubmit={saveEntity}>
        {/*<Card title="Values" back="/entities" save={true} onlySaveIf={sources}>*/}
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  style={{width: "3rem", height: "3rem"}}
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.name !== null ? (
                        <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={entity.name}
                                               nameOverride={"Name *"} required={"true"}/>
                      ) : (
                        <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                               nameOverride={"Name *"} required={"true"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.description !== null ? (
                        <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                               data={entity.description} nameOverride={"Description"}/>
                      ) : (
                        <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                               nameOverride={"Description"}/>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.endpoint !== null ? (
                        <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                               data={entity.endpoint} nameOverride={"Endpoint"}/>
                      ) : (
                        <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                               nameOverride={"Endpoint"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.route !== null ? (
                        <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                                               data={entity.route} nameOverride={"Route"}/>
                      ) : (
                        <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                                               nameOverride={"Route"}/>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      {
                        sources !== null && sources.length > 0 ? (
                          <>
                            {entity !== null &&
                            entity.gateway !== undefined &&
                            entity.gateway !== null ? (
                                <SelectInputComponent
                                  options={sources}
                                  data={entity.gateway}
                                  name={"source"} id={"sourceInput"} nameOverride={"Source"}
                                  value={"/admin/gateways/"}/>
                              )
                              : (
                                <SelectInputComponent
                                  options={sources}
                                  name={"source"} id={"sourceInput"} nameOverride={"Source"}
                                  value={"/admin/gateways/"}/>
                              )}
                          </>
                        ) : (
                          <SelectInputComponent
                            options={[{name: "Please create a Source before creating an Entity"}]}
                            name={"source"} id={"sourceInput"} nameOverride={"Source"}/>
                        )}
                      <span className="utrecht-form-label">Source</span>
                      <select
                        name="gateway"
                        id="gatewayInput"
                        className="utrecht-select utrecht-select--html-select"
                      >
                        {sources !== null && sources.length > 0 ? (
                          sources.map((row) => (
                            <>
                              {entity !== null &&
                              entity.gateway !== undefined &&
                              entity.gateway !== null &&
                              entity.gateway.id === row.id ? (
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
                    <div className="form-check">
                      {entity !== null ? (
                        <>
                          {entity.extend ? (
                            <Checkbox type={"checkbox"} id={"extendInput"}
                                      nameLabel={"Extend"} nameAttribute={"extend"}
                                      data={entity.extend}/>
                          ) : (
                            <Checkbox type={"checkbox"} id={"extendInput"}
                                      nameLabel={"Extend"} nameAttribute={"extend"}/>
                          )}
                        </>
                      ) : (
                        <Checkbox type={"checkbox"} id={"extendInput"}
                                  nameLabel={"Extend"} nameAttribute={"extend"}/>
                      )}
                    </div>
                  </div>
                </div>
                <Accordion id="entityAccordion"
                           items={[{
                             title: "Transformations",
                             id: "transformationsAccordion",
                             render: function () {
                               return (<>
                                 {entity !== null ? (
                                   <MultiDimensionalArrayInput
                                     target={"transformations"}
                                     data={entity.transformations}
                                   />
                                 ) : (
                                   <MultiDimensionalArrayInput
                                     target={"transformations"}
                                     data={null}
                                   />
                                 )}
                               </>)
                             }
                           },
                             {
                               title: "Translation Config",
                               id: "translationConfigAccordion",
                               render: function () {
                                 return (<>
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
                                       data={null}
                                     />
                                   )}
                                 </>)
                               }
                             },
                             {
                               title: "Collection Config",
                               id: "collectionConfigAccordion",
                               render: function () {
                                 return (<>
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
                                      data={null}/>
                                   )}
                                 </>)
                               }
                             }
                           ]}/>
              </>
            )}
          </div>
        </div>
      </form>
      {/*</Card>*/}
    </>
  );
}
