import * as React from "react";
import {Link} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  Accordion,
  Card,
  Alert,
  Spinner,
  SelectInputComponent
} from "@conductionnl/nl-design-system/lib";
import FlashMessage from 'react-flash-message';
import ElementCreationNew from "../common/elementCreationNew"
import APIService from "../../apiService/apiService";
import {navigate} from "gatsby-link";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

interface SourceFormProps {
  id: string,
}

export const SourceForm: React.FC<SourceFormProps> = ({id}) => {
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState(null);
  const API: APIService = React.useContext(APIContext)
  const title: string = id ? "Edit Source" : "Create Source";

  React.useEffect(() => {
    id && handleSetSource()
  }, [API, id])

  const handleSetSource = () => {
    setShowSpinner(true)

    API.Source.getOne(id)
      .then((res) => {
        setSource(res.data)
      })
      .catch((err) => {
        throw new Error('GET gateway error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  const saveSource = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let headers = retrieveFormArrayAsOArray(event.target, "headers");
    let oas = retrieveFormArrayAsOArray(event.target, "oas");
    let paths = retrieveFormArrayAsOArray(event.target, "paths");
    let translationConfig = retrieveFormArrayAsOArray(event.target, "translationConfig");

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description
        ? event.target.description.value
        : null,
      type: event.target.type.value,
      auth: event.target.auth.value,
      locale: event.target.locale.value,
      location: event.target.location.value,
      accept: event.target.accept.value,
      jwt: event.target.jwt.value,
      jwtId: event.target.jwtId.value,
      secret: event.target.secret.value,
      username: event.target.username.value,
      password: event.target.password.value,
      apikey: event.target.apikey.value,
      documentation: event.target.documentation.value,
      authorizationHeader: event.target.authorizationHeader.value,
      headers,
      oas,
      paths,
      translationConfig
    };


    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["location"], body["type"], body["auth"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setLoadingOverlay(false);
      return;
    }

    if (!id) { // unset id means we're creating a new entry
      API.Source.create(body)
        .then(() => {
          navigate('/sources');
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('Create source error: ' + err)
        })
        .finally(() => {
          setLoadingOverlay(false);
        })
    }

    if (id) { // set id means we're updating a existing entry
      API.Source.update(body, id)
        .then((res) => {
          setSource(res.data);
        })
        .catch((err) => {
          setAlert({type: 'danger', message: err.message});
          throw new Error('Update source error: ' + err)
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
      <form id="dataForm" onSubmit={saveSource}>
        <Card
          title={title}
          cardHeader={function () {
            return (
              <>
                <Link className="utrecht-link" to={"/sources"}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrecht`ht-button-sm btn-sm btn-success"
                  type="submit"
                >
                  <i className="fas fa-save mr-2"/>Save
                </button>
              </>
            )
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner/>
                  ) : (
                    <>
                      {loadingOverlay && <LoadingOverlay/>}
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.name !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              name={"name"}
                              id={"nameInput"}
                              data={source.name}
                              nameOverride={"Name"}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"name"}
                              id={"nameInput"}
                              nameOverride={"Name"}
                            />
                          )}
                        </div>
                        <div className="col-6">
                          {source !== null && source.location !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              name={"location"}
                              id={"locationInput"}
                              data={source.location}
                              nameOverride={"Location (url)"}
                              infoTooltip={{content: <p>Enter the source location here</p>}}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"location"}
                              id={"locationInput"}
                              nameOverride={"Location (url)"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.type !== null ? (
                              <SelectInputComponent
                                options={[
                                  {name: "json", value: "json"},
                                  {name: "xml", value: "xml"},
                                  {name: "soaps", value: "soaps"},
                                  {name: "ftp", value: "ftp"},
                                  {name: "sftp", value: "sftp"}
                                ]}
                                name={"type"}
                                id={"typeInput"}
                                nameOverride={"Type"}
                                data={source.type}
                                required={true}
                              />
                            ) :
                            (
                              <SelectInputComponent
                                options={[
                                  {name: "json", value: "json"},
                                  {name: "xml", value: "xml"},
                                  {name: "soaps", value: "soaps"},
                                  {name: "ftp", value: "ftp"},
                                  {name: "sftp", value: "sftp"}
                                ]}
                                name={"type"}
                                id={"typeInput"}
                                nameOverride={"Type"}
                                required={true}
                              />
                            )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.accept !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Accept (accept header used for this source)"}
                              name={"accept"}
                              id={"acceptInput"}
                              data={source.accept}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Accept (accept header used for this source)"}
                              name={"accept"}
                              id={"acceptInput"}
                            />
                          )}
                        </div>
                        <div className="col-6">
                          {source !== null && source.locale !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Locale"}
                              name={"locale"}
                              id={"localeInput"}
                              data={source.locale}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Locale"}
                              name={"locale"}
                              id={"localeInput"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          {source !== null && source.auth !== null ? (
                            <SelectInputComponent
                              options={[{name: "apikey", value: "apikey"},
                                {name: "jwt", value: "jwt"},
                                {name: "username-password", value: "username-password"}
                              ]}
                              name={"auth"}
                              id={"authInput"}
                              nameOverride={"Auth"}
                              required={true}
                              data={source.auth}
                            />
                          ) : (
                            <SelectInputComponent
                              options={[
                                {name: "apikey", value: "apikey"},
                                {name: "jwt", value: "jwt"},
                                {name: "username-password", value: "username-password"}
                              ]}
                              name={"auth"}
                              id={"authInput"}
                              nameOverride={"Auth"}
                              required={true}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.jwt !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Jwt"}
                              name={"jwt"}
                              id={"jwtInput"}
                              data={source.jwt}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Jwt"}
                              name={"jwt"}
                              id={"jwtInput"}
                            />
                          )}
                        </div>
                        <div className="col-6">
                          {source !== null && source.jwtId !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"JwtId"}
                              name={"jwtId"}
                              id={"jwtIdInput"}
                              data={source.jwtId}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"JwtId"}
                              name={"jwtId"}
                              id={"jwtIdInput"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.secret !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Secret"}
                              name={"secret"}
                              id={"secretInput"}
                              data={source.secret}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Secret"}
                              name={"secret"}
                              id={"secretInput"}
                            />
                          )}
                        </div>
                        <div className="col-6">
                          {source !== null && source.apikey !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Apikey"}
                              name={"apikey"}
                              id={"apikeyInput"}
                              data={source.apikey}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Apikey"}
                              name={"apikey"}
                              id={"apikeyInput"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.documentation !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Documentation(url)"}
                              name={"documentation"}
                              id={"documentationInput"}
                              data={source.documentation}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Documentation"}
                              name={"documentation"}
                              id={"documentationInput"}
                            />
                          )}
                        </div>
                        <div className="col-6">
                          {source !== null && source.authorizationHeader !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"AuthorizationHeader"}
                              name={"authorizationHeader"}
                              id={"authorizationHeaderInput"}
                              data={source.authorizationHeader}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"AuthorizationHeader"}
                              name={"authorizationHeader"}
                              id={"authorizationHeaderInput"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          {source !== null && source.username !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Username"}
                              name={"username"}
                              id={"usernameInput"}
                              data={source.username}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Username"}
                              name={"username"}
                              id={"usernameInput"}
                            />
                          )}
                        </div>
                        <div className="col-6">
                          {source !== null && source.password !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              nameOverride={"Password"}
                              name={"password"}
                              id={"passwordInput"}
                              data={source.password}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"password"}
                              id={"passwordInput"}
                            />
                          )}
                        </div>
                      </div>
                      <Accordion
                        id="sourceAccordion"
                        items={[{
                          title: "Headers",
                          id: "headersAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id="headers"
                                label="Headers"
                                data={source?.headers}
                              />
                            )
                          }
                        },
                          {
                            title: "OAS",
                            id: "oasAccordion",
                            render: function () {
                              return (
                                <ElementCreationNew
                                  id="oas"
                                  label="OAS"
                                  data={source?.oas}
                                />
                              )
                            }
                          },
                          {
                            title: "Paths",
                            id: "pathsAccordion",
                            render: function () {
                              return (
                                <ElementCreationNew
                                  id="paths"
                                  label="Paths"
                                  data={source?.paths}
                                />
                              )
                            }
                          },
                        ]}
                      />
                    </>
                  )}
                </div>
              </div>
            )
          }}
        />
      </form>
    </>
  );
}

export default SourceForm
