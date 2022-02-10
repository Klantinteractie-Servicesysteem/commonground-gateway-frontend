import * as React from "react";
import {
  GenericInputComponent,
  SelectInputComponent,
  Spinner,
  Card,
  Alert,
} from "@conductionnl/nl-design-system/lib";
import {Link} from "gatsby";
import {navigate} from "gatsby-link";
import {
  checkValues,
  removeEmptyObjectValues,
} from "../utility/inputHandler";
import FlashMessage from 'react-flash-message';
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from '../loadingOverlay/loadingOverlay'


interface EndpointFormProps {
  id: string,
}

export const EndpointForm: React.FC<EndpointFormProps> = ({id}) => {
  const [endpoint, setEndpoint] = React.useState<any>(null);
  const [applications, setApplications] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const title: string = (id === "new") ? "Create Endpoint" : "Edit Endpoint"
  const API: APIService = React.useContext(APIContext)

  React.useEffect(() => {
    handleSetApplications()
    id && handleSetEndpoint()
  }, [API, id])

  const handleSetEndpoint = () => {
    setShowSpinner(true)

    API.Endpoint.getOne(id)
      .then((res) => {
        setEndpoint(res.data)
      })
      .catch((err) => {
        throw new Error('GET Endpoints error: ' + err)
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
        throw new Error('GET application error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  const saveEndpoint = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description.value
        ? event.target.description.value : null,
      type: event.target.type.value,
      path: event.target.path.value,
      application: event.target.application.value
        ? event.target.application.value : null,
    };

    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["type"], body["path"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    if (!id) { // unset id means we're creating a new entry
      API.Endpoint.create(body)
        .then((res) => {
          navigate(`/endpoints/${res.data.id}`)
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('Create application error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false);
        })
    }

    if (id) { // set id means we're updating a existing entry
      API.Endpoint.update(body, id)
        .then((res) => {
          setEndpoint(res.data)
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('Update application error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false);
        })
    }
  };

  return (
    <>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="dataForm" onSubmit={saveEndpoint}>
        <Card
          title={title}
          cardHeader={function () {
            return (
              <div>
                <button
                  className="utrecht-link button-no-style"
                  data-toggle="modal"
                  data-target="helpModal"
                >
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                <Link className="utrecht-link" to={"/endpoints"}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                  type="submit"
                  disabled={!applications}
                >
                  <i className="fas fa-save mr-2"/>Save
                </button>
              </div>
            )
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner/>
                  ) : (
                    <div>
                    {loadingOverlay && <LoadingOverlay />}
                      <div className="row">
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"name"}
                            id={"nameInput"}
                            data={endpoint && endpoint.name && endpoint.name}
                            nameOverride={"Name"}
                          />
                        </div>
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"description"}
                            id={"descriptionInput"}
                            data={endpoint && endpoint.description && endpoint.description}
                            nameOverride={"Description"}
                          />
                        </div>
                      </div>
                      <br/>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group">
                            <SelectInputComponent
                              options={[
                                {name: "gateway-endpoint", value: "gateway-endpoint"},
                                {name: 'entity-route', value: 'entity-route'},
                                {name: 'entity-endpoint', value: 'entity-endpoint'},
                                {name: 'documentation-endpoint', value: 'documentation-endpoint'}
                              ]}
                              name={"type"}
                              id={"typeInput"}
                              nameOverride={"Type"}
                              data={endpoint && endpoint.type ? endpoint.type : "gateway-endpoint"}
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <GenericInputComponent
                              nameOverride={"Path"}
                              name={"path"}
                              data={endpoint && endpoint.path && endpoint.path}
                              type={"text"}
                              id={"pathInput"}
                              required={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            {
                              applications !== null && applications.length > 0 ? (
                                <>
                                  {endpoint !== null &&
                                  endpoint.application !== undefined &&
                                  endpoint.application !== null ? (
                                    <SelectInputComponent
                                      options={applications}
                                      data={endpoint.application.name}
                                      name={"application"}
                                      id={"applicationInput"}
                                      nameOverride={"Applications"}
                                      value={"/admin/applications/"}
                                    />
                                  ) : (
                                    <SelectInputComponent
                                      options={applications}
                                      name={"application"}
                                      id={"applicationInput"}
                                      nameOverride={"Applications"}
                                      value={"/admin/applications/"}
                                    />
                                  )}
                                </>
                              ) : (
                                <SelectInputComponent
                                  data="Please wait, gettings applications from the Gateway..."
                                  options={[{
                                    name: "Please wait, gettings applications from the Gateway...",
                                    value: "Please wait, gettings applications from the Gateway..."
                                  }]}
                                name={"application"}
                                  id={"applicationInput"}
                                  nameOverride={"Applications"}
                                  disabled
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      </form>
    </>
  );
}
export default EndpointForm
