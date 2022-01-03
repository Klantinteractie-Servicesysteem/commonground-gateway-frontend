import * as React from "react";
import { Link, navigate } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import { GenericInputComponent, Checkbox, SelectInputComponent, Accordion, MultiDimensionalArrayInput, Spinner, Card, Alert } from "@conductionnl/nl-design-system/lib";
import { addElement, deleteElementFunction } from "../utility/elementCreation";
import { isLoggedIn } from "../../services/auth";
import { isJsxAttributes } from "typescript";
import FlashMessage from 'react-flash-message';

export default function HandlerForm({ id, endpoint }) {
  const [context, setContext] = React.useState(null);
  const [handler, setHandler] = React.useState(null);
  const [handlers, setHandlers] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn() && id !== 'new') {
      getHandler();
      getHandlers();
    }
  }, [context]);

  const getHandler = () => {
    fetch(`${context.adminUrl}/handlers/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setHandler(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const getHandlers = () => {
    fetch(`${context.adminUrl}/handlers`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setHandlers(data);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const saveHandler = (event) => {
    event.preventDefault();

    // let attributeEnum = retrieveFormArrayAsOArray(event.target, "enum");
    // let allOf = retrieveFormArrayAsObject(event.target, "allOf");
    // let anyOf = retrieveFormArrayAsObject(event.target, "anyOf");
    // let oneOf = retrieveFormArrayAsObject(event.target, "oneOf");
    // let forbiddenIf = retrieveFormArrayAsObject(event.target, "forbiddenIf");
    // let requiredIf = retrieveFormArrayAsObject(event.target, "requiredIf");
    // let objectConfig = retrieveFormArrayAsObject(event.target, "objectConfig");

    // get the inputs and check if set other set null

    let body = {
      entity: `/admin/endpoints/${endpoint}`,
      name: event.target.name.value,
      description: event.target.description.value
        ? event.target.description.value
        : null,
      type: event.target.type.value,
      format: event.target.format.value ? event.target.format.value : null,
      persistToGateway: event.target.persistToGateway.checked,
      cascade: event.target.cascade.checked,
      searchable: event.target.searchable.checked,
      required: event.target.required.checked,
      mustBeUnique: event.target.mustBeUnique.checked,
      multiple: event.target.multiple.checked,
      nullable: event.target.nullable.checked,
      writeOnly: event.target.writeOnly.checked,
      readOnly: event.target.readOnly.checked,
      deprecated: event.target.deprecated.checked,
      defaultValue: event.target.defaultValue.value
        ? event.target.defaultValue.value
        : null,
      fileType: event.target.fileType.value
        ? event.target.fileType.value
        : null,
      example: event.target.example.value ? event.target.example.value : null,
      maxFileSize: event.target.maxFileSize.value
        ? parseInt(event.target.maxFileSize.value)
        : null,
      inversedBy: event.target.inversedBy.value
        ? event.target.inversedBy.value
        : null,
      multipleOf: event.target.multipleOf.value
        ? parseInt(event.target.multipleOf.value)
        : null,
      maximum: event.target.maximum.value
        ? parseInt(event.target.maximum.value)
        : null,
      minimum: event.target.minimum.value
        ? parseInt(event.target.minimum.value)
        : null,
      exclusiveMaximum: event.target.exclusiveMaximum.checked,
      exclusiveMinimum: event.target.exclusiveMinimum.checked,
      maxLength: event.target.maxLength.value
        ? parseInt(event.target.maxLength.value)
        : null,
      minLength: event.target.minLength.value
        ? parseInt(event.target.minLength.value)
        : null,
      maxItems: event.target.maxItems.value
        ? parseInt(event.target.maxItems.value)
        : null,
      minItems: event.target.minItems.value
        ? parseInt(event.target.minItems.value)
        : null,
      maxDate: event.target.maxDate.value ? event.target.maxDate.value : null,
      minDate: event.target.minDate.value ? event.target.minDate.value : null,
      uniqueItems: event.target.uniqueItems.checked,
      minProperties: event.target.minProperties.value
        ? parseInt(event.target.minProperties.value)
        : null,
      maxProperties: event.target.maxProperties.value
        ? parseInt(event.target.maxProperties.value)
        : null,
    };

    // if (attributeEnum.length != 0) {
    //   body["enum"] = attributeEnum;
    // } else {
    //   body["enum"] = [];
    // }

    // if (Object.keys(allOf).length != 0) {
    //   body["allOf"] = allOf;
    // } else {
    //   body["allOf"] = [];
    // }

    // if (Object.keys(anyOf).length != 0) {
    //   body["anyOf"] = anyOf;
    // } else {
    //   body["anyOf"] = [];
    // }

    // if (Object.keys(oneOf).length != 0) {
    //   body["oneOf"] = oneOf;
    // } else {
    //   body["oneOf"] = [];
    // }

    // if (Object.keys(forbiddenIf).length != 0) {
    //   body["forbiddenIf"] = forbiddenIf;
    // } else {
    //   body["forbiddenIf"] = [];
    // }

    // if (Object.keys(requiredIf).length != 0) {
    //   body["requiredIf"] = requiredIf;
    // } else {
    //   body["requiredIf"] = [];
    // }

    // if (Object.keys(objectConfig).length != 0) {
    //   body["objectConfig"] = objectConfig;
    // } else {
    //   body["objectConfig"] = [];
    // }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);
    if (body['type'] === "") {
      delete body['type'];
    }

    if (!checkValues([body.name, body.type])) {
      return;
    }

    let url = context.adminUrl + "/handlers";
    let method = null;
    console.log(url);
    if (id === "new") {
      method = "POST";
    } else {
      url = `${url}/${id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data.id !== undefined) {
          navigate(`/endpoints/${endpoint}`);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const options = [
    {
      name: "String",
      value: "string",
    },
    {
      name: "Array",
      value: "array",
    },
    {
      name: "Integer",
      value: "integer",
    },
    {
      name: "Integer",
      value: "integer",
    },
    {
      name: "Integer",
      value: "integer",
    },
    {
      name: "Integer",
      value: "integer",
    },
  ];

  return (<>
    {
      alert !== null &&
      <FlashMessage duration={5000}>
        <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
      </FlashMessage>
    }
    <form id="attributeForm" onSubmit={saveHandler}>
      <Card title="Values"
        cardHeader={function () {
          return (<>
            <Link className="utrecht-link" to={`/endpoints/${endpoint}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />Back
              </button>
            </Link>
            <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
              <i className="fas fa-save mr-2" />Save
            </button>
          </>)
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner === true ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="row">
                      {/*<div className="col-6">*/}
                      {/*  {attribute !== null && attribute.name !== null ? (*/}
                      {/*    <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={attribute.name}*/}
                      {/*      nameOverride={"Name"} />*/}
                      {/*  ) : (*/}
                      {/*    <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}*/}
                      {/*      nameOverride={"Name"} />*/}
                      {/*  )}*/}
                      {/*</div>*/}
                      {/*<div className="col-6">*/}
                      {/*  {attribute !== null && attribute.description !== null ? (*/}
                      {/*    <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}*/}
                      {/*      data={attribute.description} nameOverride={"Description"} />*/}
                      {/*  ) : (*/}
                      {/*    <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}*/}
                      {/*      nameOverride={"Description"} />*/}
                      {/*  )}*/}
                      {/*</div>*/}
                    </div>
                    <br />
                  </>
                )}
              </div>
            </div>

          )
        }} />
    </form></>
  );
}
