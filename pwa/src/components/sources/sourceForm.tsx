import * as React from "react";
import { Link } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  Accordion,
  Card,
  Spinner,
  SelectInputComponent,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import { navigate } from "gatsby-link";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import MultiDimensionalArrayInput from "../common/multiDimensionalArrayInput";

interface SourceFormProps {
  sourceId: string;
}

export const SourceForm: React.FC<SourceFormProps> = ({ sourceId }) => {
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = sourceId ? "Edit Source" : "Create Source";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader(
      <>
        Source <i>{source && source.name}</i>
      </>
    );
  }, [setHeader, source]);

  React.useEffect(() => {
    handleSetDocumentation();
    sourceId && handleSetSource();
  }, [sourceId, API]);

  const handleSetSource = () => {
    setShowSpinner(true);

    API.Source.getOne(sourceId)
      .then((res) => {
        setSource(res.data);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET gateway error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };
  const handleSetDocumentation = (): void => {
    API.Documentation.get("sources")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const saveSource = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let headers = retrieveFormArrayAsObject(event.target, "headers");
    let oas = retrieveFormArrayAsOArray(event.target, "oas");
    let paths = retrieveFormArrayAsOArray(event.target, "paths");

    let body: any = {
      name: event.target.name.value,
      description: event.target.description ? event.target.description.value : null,
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
    };

    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.location, body.type, body.auth])) {
      setAlert({ title: "Oops something went wrong", type: "danger", message: "Required fields are empty" });
      setLoadingOverlay(false);
      return;
    }

    if (!sourceId) {
      // unset id means we're creating a new entry
      API.Source.create(body)
        .then(() => {
          setAlert({ type: "success", message: "Saved source" });
          navigate("/sources");
        })
        .catch((err) => {
          setAlert({ title: "Oops something went wrong", type: "danger", message: err.message });
          throw new Error("Create source error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }

    if (sourceId) {
      // set id means we're updating a existing entry
      API.Source.update(body, sourceId)
        .then((res) => {
          setAlert({ type: "success", message: "Updated source" });
          setSource(res.data);
        })
        .catch((err) => {
          setAlert({ title: "Oops something went wrong", type: "danger", message: err.message });
          throw new Error("Update source error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }
  };

  return (
    <form id="dataForm" onSubmit={saveSource}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#sourceHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Source Documentation"
                id="sourceHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={"/sources"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht`ht-button-sm btn-sm btn-success" type="submit">
                <i className="fas fa-save mr-2" />
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
                  <Spinner />
                ) : (
                  <>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={source?.name}
                          nameOverride={"Name"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"location"}
                          id={"locationInput"}
                          data={source?.location}
                          nameOverride={"Location (url)"}
                          required
                          infoTooltip={{
                            content: <p>Enter the source location here</p>
                          }}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "json", value: "json" },
                            { name: "xml", value: "xml" },
                            { name: "soap", value: "soap" },
                            { name: "ftp", value: "ftp" },
                            { name: "sftp", value: "sftp" }
                          ]}
                          name={"type"}
                          id={"typeInput"}
                          nameOverride={"Type"}
                          data={source?.type}
                          required={true}
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "apikey", value: "apikey" },
                            { name: "jwt", value: "jwt" },
                            { name: "username-password", value: "username-password" }
                          ]}
                          name={"auth"}
                          id={"authInput"}
                          nameOverride={"Auth"}
                          required={true}
                          data={source?.auth}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Accept (accept header used for this source)"}
                          name={"accept"}
                          id={"acceptInput"}
                          data={source?.accept}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Locale"}
                          name={"locale"}
                          id={"localeInput"}
                          data={source?.locale}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Jwt"}
                          name={"jwt"}
                          id={"jwtInput"}
                          data={source?.jwt}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"JwtId"}
                          name={"jwtId"}
                          id={"jwtIdInput"}
                          data={source?.jwtId}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Secret"}
                          name={"secret"}
                          id={"secretInput"}
                          data={source?.secret}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Apikey"}
                          name={"apikey"}
                          id={"apikeyInput"}
                          data={source?.apikey}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Documentation(url)"}
                          name={"documentation"}
                          id={"documentationInput"}
                          data={source?.documentation}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"AuthorizationHeader"}
                          name={"authorizationHeader"}
                          id={"authorizationHeaderInput"}
                          data={source?.authorizationHeader}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Username"}
                          name={"username"}
                          id={"usernameInput"}
                          data={source?.username}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          nameOverride={"Password"}
                          name={"password"}
                          id={"passwordInput"}
                          data={source?.password}
                        />
                      </div>
                    </div>
                    <br/>
                    <Accordion
                      id="sourceAccordion"
                      items={[
                        {
                          title: "Headers",
                          id: "headersAccordion",
                          render: function() {
                            return (
                              <MultiDimensionalArrayInput
                                id="headers"
                                label="Headers"
                                data={
                                  source && source.headers
                                    ? [
                                      {
                                        key: "headers",
                                        value: source.headers
                                      }
                                    ]
                                    : null
                                }
                              />
                            );
                          }
                        },
                        {
                          title: "OAS",
                          id: "oasAccordion",
                          render: function() {
                            return <ElementCreationNew id="oas" label="OAS" data={source?.oas} />;
                          }
                        },
                        {
                          title: "Paths",
                          id: "pathsAccordion",
                          render: function() {
                            return <ElementCreationNew id="paths" label="Paths" data={source?.paths} />;
                          }
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
  );
};

export default SourceForm;
