import * as React from "react";
import {
  GenericInputComponent,
  Checkbox,
  SelectInputComponent,
  Card,
  Alert
}
  from "@conductionnl/nl-design-system/lib";
import {navigate} from "gatsby-link";
import {Link} from "gatsby";
import Spinner from "../common/spinner";
import FlashMessage from 'react-flash-message';
import {checkValues, removeEmptyObjectValues,} from "../utility/inputHandler";
import APIService from "../../apiService/apiService";

interface EntityFormProps {
  id: string,
}
export const EntityForm:React.FC<EntityFormProps> = ({ id }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const [entity, setEntity] = React.useState<any>(null);
  const [sources, setSources] = React.useState<any>(null);
  const [API, setAPI] = React.useState<APIService>(null)
  const title: string = id ? "Edit Object" : "Create Object";

  React.useEffect(() => {
    if (!API) {
      setAPI(new APIService(sessionStorage.getItem('jwt')))
    } else {
      handleSetSources()
      id && handleSetEntity()
    }
  }, [id, API])

  const handleSetSources = () => {
    setShowSpinner(true)

    API.Source.getAll()
      .then((res) => { setSources(res.data) })
      .catch((err) => { throw new Error ('GET sources error: ' + err) })
      .finally(() => { setShowSpinner(false) })
  }

  const handleSetEntity = () => {
    setShowSpinner(true)

    API.Entity.getOne(id)
      .then((res) => { setEntity(res.data) })
      .catch((err) => { throw new Error ('GET source error: ' + err) })
      .finally(() => { setShowSpinner(false) })
  }

  const saveEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description.value ? event.target.description.value : null,
      route: event.target.route.value ? event.target.route.value : null,
      endpoint: event.target.endpoint.value ? event.target.endpoint.value : null,
      gateway: event.target.gateway.value
        ? event.target.gateway.value
        : null,
      extend: event.target.extend.checked,
      function: event.target.function.value ? event.target.function.value : null,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"]])) {
      return;
    }

    if (!id) { // unset id means we're creating a new entry
      API.Entity.create(body)
        .then((res) => {
          setEntity(res.data)
          navigate('/entities')
        })
        .catch((err) => {
          setAlert({ type: 'danger', message: err.message });
          throw new Error ('Create entity error: ' + err)
        })
    }

    if (id) { // set id means we're updating a existing entry
      API.Entity.update(body, id)
        .then((res) => {
          setEntity(res.data)
          navigate('/entities')
        })
        .catch((err) => {
          setAlert({ type: 'danger', message: err.message });
          throw new Error ('Update entity error: ' + err)
        })
    }
  }


  return (<>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="dataForm" onSubmit={saveEntity}>
        <Card title={title}
          cardHeader={function () {
            return (
              <div>
                <Link className="utrecht-link" to={"/entities"}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                  type="submit"
                >
                  <i className="fas fa-save mr-2"/>Save
                </button>
              </div>
            )}}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner/>
                  ) : (
                    <div>
                      <div className="row">
                        <div className="col-6">
                            <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={entity && entity.name && entity.name}
                                                   nameOverride={"Name"} required/>
                        </div>
                        <div className="col-6">
                            <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                   data={entity && entity.description && entity.description} nameOverride={"Description"}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <SelectInputComponent
                              options={[{name: 'Organization', value: 'organization'}, {
                                name: 'User',
                                value: 'user'
                              }, {name: 'User group', value: 'userGroup'}]}
                              data={entity && entity.function ? entity.function : null}
                              name={"function"}
                              id={"functionInput"}
                              nameOverride={"Function"}
                              required/>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                            <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                                   data={entity && entity.endpoint && entity.endpoint}
                                                   nameOverride={"Endpoint"}/>
                        </div>
                        <div className="col-6">
                            <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                                                   data={entity && entity.route && entity.route} nameOverride={"Route"}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            {
                              sources !== null && sources.length > 0 ? (
                                <>
                                  {entity !== null &&
                                  entity.gateway !== undefined &&
                                  entity.gateway !== null ? (
                                      <SelectInputComponent
                                        options={sources}
                                        data={entity.gateway.name}
                                        name={"gateway"} id={"gatewayInput"} nameOverride={"Source"}
                                        value={"/admin/gateways/"}/>
                                    )
                                    : (
                                      <SelectInputComponent
                                        options={sources}
                                        name={"gateway"} id={"gatewayInput"} nameOverride={"Source"}
                                        value={"/admin/gateways/"}/>
                                    )}
                                </>
                              ) : (
                                <SelectInputComponent
                                  options={[{
                                    name: "Please create a Source before creating an Entity",
                                    value: null
                                  }]}
                                  name={"gateway"} id={"gatewayInput"} nameOverride={"Source"}/>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-check">
                            <Checkbox type={"checkbox"} id={"extendInput"}
                                      nameLabel={"Extend"} nameAttribute={"extend"}
                                      data={entity && entity.extend && entity.extend}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }}/>
      </form>
    </>
  );
}
  export default EntityForm

