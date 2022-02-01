import * as React from "react";
import Spinner from "../common/spinner";
import {GenericInputComponent, Accordion, SelectInputComponent, Alert, Card} from "@conductionnl/nl-design-system/lib";
import {Link} from "gatsby";
import {checkValues, removeEmptyObjectValues, retrieveFormArrayAsOArray} from "../utility/inputHandler";
import {navigate} from "gatsby-link";
import ElementCreationNew from "../common/elementCreationNew"
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import FlashMessage from 'react-flash-message';

interface ObjectEntityFormProps {
  entityObjectId: string,
  entityId: string,
}

export const ObjectEntityForm: React.FC<ObjectEntityFormProps> = ({ entityObjectId, entityId }) => {
  const [entityObject, setEntityObject] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const [applications, setApplications] = React.useState<any>(null);
  const API: APIService = React.useContext(APIContext);
  const title: string = entityObjectId ? "Edit Entity objects" : "Create  objects";


  React.useEffect(() => {
    entityObjectId && handleSetEntity_object()
    handleSetApplications()
  }, [API, entityObjectId])

  const handleSetEntity_object = () => {
    setShowSpinner(true)

    API.Entity_objects.getOne(entityObjectId)
      .then((res) => {
        setEntityObject(res.data)
      })
      .catch((err) => {
        throw new Error('GET entity object error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  const handleSetApplications = () => {
    setShowSpinner(true)

    API.Application.getAll()
      .then((res) => {
        setApplications(res.data)
      })
      .catch((err) => {
        throw new Error('GET applications error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  const saveObjectEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let errors = retrieveFormArrayAsOArray(event.target, "errors");
    let promises = retrieveFormArrayAsOArray(event.target, "promises");
    let externalResult = retrieveFormArrayAsOArray(event.target, "externalResult");

    let body: {} = {
      uri: event.target.uri.value,
      externalId: event.target.externalId ? event.target.externalId.value : null,
      application: event.target.application.value
        ? event.target.application.value
        : null,
      organization: event.target.organization.value
        ? event.target.organization.value
        : null,
      owner: event.target.owner.value ? event.target.owner.value : null,
      entity: `/admin/entities/${entityId}`,
      errors,
      promises,
      externalResult,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["uri"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

      if (!entityObjectId) { // unset id means we're creating a new entry
        API.Entity_objects.create(body)
          .then((res) => {
            navigate(`/entities/${entityId}`)
          })
          .catch((err) => {
            setAlert({type: 'danger', message: err.message});
            throw new Error('CREATE Entity object error: ' + err)
          })
      }

      if (entityObjectId) { // set id means we're updating a existing entry
        API.Entity_objects.update(body, entityObjectId)
          .then((res) => {
            setEntityObject(res.data)
          })
          .catch((err) => {
            setAlert({type: 'danger', message: err.message});
            throw new Error('UPDATE Entity object error: ' + err)
          })
      }
  }

    return (
      <div>
        {
          alert !== null &&
          <FlashMessage duration={5000}>
            <Alert alertClass={alert.type} body={function () {
              return (<>{alert.message}</>)
            }}/>
          </FlashMessage>
        }
        <form id="dataForm" onSubmit={saveObjectEntity}>
          <Card
            title={title}
            cardHeader={function () {
              return (
                <>
                  <Link className="utrecht-link" to={`/entities/${entityId}`}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                      <i className="fas fa-long-arrow-alt-left mr-2"/>
                      Back
                    </button>
                  </Link>
                  <button
                    className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                    type="submit"
                  >
                    <i className="fas fa-save mr-2"/>
                    Save
                  </button>
                </>
              );
            }}
            cardBody={function () {
              return (
                <div className="row">
                  <div className="col-12">
                    {showSpinner === true ? (
                      <Spinner/>
                    ) : (
                      <>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              <GenericInputComponent
                                type="url"
                                name={"uri"}
                                id={"uriInput"}
                                data={entityObject && entityObject.uri && entityObject.uri}
                                nameOverride={"Uri"}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group">
                              <GenericInputComponent
                                type={"text"}
                                name={"externalId"}
                                id={"externalIdInput"}
                                data={entityObject && entityObject.externalId && entityObject.externalId}
                                nameOverride={"External Id"}
                              />
                            </div>
                          </div>
                        </div>
                        <br/>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              {
                                applications !== null && applications.length > 0 ? (
                                  <>
                                    {entityObject !== null &&
                                    entityObject.application !== undefined &&
                                    entityObject.application !== null ? (
                                        <SelectInputComponent
                                          options={applications}
                                          data={entityObject.application.name}
                                          name={"application"} id={"applicationInput"} nameOverride={"Application"}
                                          value={"/admin/applications/"}/>
                                      )
                                      : (
                                        <SelectInputComponent
                                          options={applications}
                                          name={"application"} id={"applicationInput"} nameOverride={"Application"}
                                          value={"/admin/applications/"}/>
                                      )}
                                  </>
                                ) : (
                                  <SelectInputComponent
                                    options={[{name: "Please create a Application.", value: null}]}
                                    name={"application"} id={"applicationInput"} nameOverride={"Application"}
                                  />
                                )}
                            </div>
                          </div>
                          <div className="col-6">
                            <GenericInputComponent
                              type={"text"}
                              name={"organization"}
                              id={"organizationInput"}
                              data={entityObject && entityObject.organization && entityObject.organization}
                              nameOverride={"Organization"}
                            />
                          </div>
                        </div>
                        <br/>
                        <div className="row">
                          <div className="col-6">
                            <GenericInputComponent
                              type={"text"}
                              name={"owner"}
                              id={"ownerInput"}
                              data={entityObject && entityObject.owner && entityObject.owner}
                              nameOverride={"Owner"}
                            />
                          </div>
                        </div>

                        <Accordion
                          id="objectEntityAccordion"
                          items={[
                            {
                              title: "Errors",
                              id: "errorsAccordion",
                              render: function () {
                                return (
                                  <>
                                    <ElementCreationNew
                                      id="errors"
                                      label="Errors"
                                      data={entityObject?.errors}
                                    />
                                  </>
                                );
                              }
                            },
                            {
                              title: "Promises",
                              id: "promisesAccordion",
                              render: function () {
                                return (
                                  <>
                                    <ElementCreationNew
                                      id="promises"
                                      label="Promises"
                                      data={entityObject?.promises}
                                    />
                                  </>
                                );
                              }
                            },
                            {
                              title: "External Result",
                              id: "externalResultAccordion",
                              render: function () {
                                return (
                                  <>
                                    <ElementCreationNew
                                      id="externalResult"
                                      label="External Result"
                                      data={entityObject?.externalResult}
                                    />
                                  </>
                                );
                              },
                            }
                          ]}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </form>
      </div>
    )
  }
export default ObjectEntityForm
