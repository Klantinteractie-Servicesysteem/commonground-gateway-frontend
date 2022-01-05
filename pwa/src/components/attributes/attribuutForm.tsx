import * as React from "react";
import { Link, navigate } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import { MultiDimensionalArrayInput } from "../common/multiDimensionalArrayInput";
import { ArrayInputComponent } from "../common/arrayInput";
import {
  GenericInputComponent,
  Checkbox,
  SelectInputComponent,
  Accordion,
  Spinner,
  Card,
  Alert,
} from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import FlashMessage from 'react-flash-message';

export default function AttributeForm({ id, entity }) {
  const [context, setContext] = React.useState(null);
  const [attribute, setAttribute] = React.useState(null);
  const [attributes, setAttributes] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== 'new') {
        getAttribute();
      }
      getAttributes();
    }
  }, [context]);

  const getAttribute = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/attributes/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setAttribute(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const getAttributes = () => {
    fetch(`${context.adminUrl}/attributes`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setAttributes(data['hydra:member']);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const saveAttribute = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let attributeEnum = retrieveFormArrayAsOArray(event.target, "enum");
    let allOf = retrieveFormArrayAsObject(event.target, "allOf");
    let anyOf = retrieveFormArrayAsObject(event.target, "anyOf");
    let oneOf = retrieveFormArrayAsObject(event.target, "oneOf");
    let forbiddenIf = retrieveFormArrayAsObject(event.target, "forbiddenIf");
    let requiredIf = retrieveFormArrayAsObject(event.target, "requiredIf");
    let objectConfig = retrieveFormArrayAsObject(event.target, "objectConfig");

    // get the inputs and check if set other set null

    let body = {
      entity: `/admin/entities/${entity}`,
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

    if (attributeEnum.length !== 0) {
      body["enum"] = attributeEnum;
    } else {
      body["enum"] = [];
    }

    if (Object.keys(allOf).length !== 0) {
      body["allOf"] = allOf;
    } else {
      body["allOf"] = [];
    }

    if (Object.keys(anyOf).length !== 0) {
      body["anyOf"] = anyOf;
    } else {
      body["anyOf"] = [];
    }

    if (Object.keys(oneOf).length !== 0) {
      body["oneOf"] = oneOf;
    } else {
      body["oneOf"] = [];
    }

    if (Object.keys(forbiddenIf).length !== 0) {
      body["forbiddenIf"] = forbiddenIf;
    } else {
      body["forbiddenIf"] = [];
    }

    if (Object.keys(requiredIf).length !== 0) {
      body["requiredIf"] = requiredIf;
    } else {
      body["requiredIf"] = [];
    }

    if (Object.keys(objectConfig).length !== 0) {
      body["objectConfig"] = objectConfig;
    } else {
      body["objectConfig"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);
    if (body['type'] === "") {
      delete body['type'];
    }

    if (!checkValues([body.name, body.type])) {
      return;
    }

    let url = context.adminUrl + "/attributes";
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
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setAttribute(data);
        // if (data.id !== undefined) {
        //   navigate(`/entities/${entity}`);
        // }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (<>
    {
      alert !== null &&
      <FlashMessage duration={5000}>
        <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
      </FlashMessage>
    }
    <form id="attributeForm" onSubmit={saveAttribute}>
      <Card title="Values"
        cardHeader={function () {
          return (<>
            <Link className="utrecht-link" to={`/entities/${entity}`}>
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
                      <div className="col-6">
                        {attribute !== null && attribute.name !== null ? (
                          <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={attribute.name}
                            nameOverride={"Name"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                            nameOverride={"Name"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.description !== null ? (
                          <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                            data={attribute.description} nameOverride={"Description"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                            nameOverride={"Description"} />
                        )}
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-6">
                        {attribute !== null && attribute.type !== null ? (
                          <SelectInputComponent
                            options={[{ name: "String", value: 'string' }, {
                              name: "Array",
                              value: "array"
                            }, { name: "Integer", value: "integer" }, { name: "Boolean", value: "boolean" },
                            { name: "Object", value: "object" }, { name: "Date", value: "date" }, {
                              name: "Datetime",
                              value: "datetime"
                            }, { name: "Number", value: "number" }, { name: "Float", value: "float" }, {
                              name: "File",
                              value: "file"
                            }]}
                            name={"type"} id={"typeInput"} nameOverride={"Type"} data={attribute.type} required={true} />
                        ) :
                          (
                            <SelectInputComponent
                              options={[{ name: "String", value: 'string' }, {
                                name: "Array",
                                value: "array"
                              }, { name: "Integer", value: "integer" }, { name: "Boolean", value: "boolean" },
                              { name: "Object", value: "object" }, { name: "Date", value: "date" }, {
                                name: "Datetime",
                                value: "datetime"
                              }, { name: "Number", value: "number" }, { name: "Float", value: "float" }, {
                                name: "File",
                                value: "file"
                              }]}
                              name={"type"} id={"typeInput"} nameOverride={"Type"} required={true} />
                          )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.format !== null ? (
                            <SelectInputComponent
                              options={[{ name: "Email", value: 'email' }, {
                                name: "Phone",
                                value: 'phone'
                              }, { name: "Country code", value: 'country code' }, { name: "BSN", value: 'bsn' },
                                { name: "Url", value: 'url' }, { name: "UUID", value: 'uuid' }, {
                                  name: "Json",
                                  value: 'json'
                                }]}
                              name={"format"} id={"formatInput"} nameOverride={"Format"} data={attribute.format} />
                          ) :
                          (
                            <SelectInputComponent
                              options={[{ name: "Email", value: 'email' }, {
                                name: "Phone",
                                value: 'phone'
                              }, { name: "Country code", value: 'country code' }, { name: "BSN", value: 'bsn' },
                                { name: "Url", value: 'url' }, { name: "UUID", value: 'uuid' }, {
                                  name: "Json",
                                  value: 'json'
                                }]}
                              name={"format"} id={"formatInput"} nameOverride={"Format"} />
                          )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        {
                          attributes !== null && attributes.length > 0 ? (
                            <>
                              {attribute !== null &&
                                attribute.inversedBy !== undefined &&
                                attribute.inversedBy !== null ? (
                                <SelectInputComponent
                                  options={attributes}
                                  data={attribute.inversedBy}
                                  name={"inversedBy"} id={"inversedByInput"} nameOverride={"inversedBy"}
                                  value={"/admin/attributes/"} />
                              ) : (
                                <SelectInputComponent
                                  options={attributes}
                                  name={"inversedBy"} id={"inversedByInput"} nameOverride={"inversedBy"}
                                  value={"/admin/attributes/"} />
                              )}
                            </>
                          ) : (
                            <SelectInputComponent
                              options={[{ name: "Please create a attribute to use inversedBy"}]}
                              name={"inversedBy"} id={"inversedByInput"} nameOverride={"inversedBy"} />
                          )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.defaultValue !== null ? (
                          <GenericInputComponent type={"text"} name={"defaultValue"} id={"defaultValueInput"}
                            data={attribute.defaultValue} nameOverride={"Default Value"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"defaultValue"} id={"defaultValueInput"}
                            nameOverride={"Default Value"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.multipleOf !== null ? (
                          <GenericInputComponent type={"number"} name={"multipleOf"} id={"multipleOfInput"}
                            data={attribute.multipleOf} nameOverride={"Multiple Of"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"multipleOf"} id={"multipleOfInput"}
                            nameOverride={"Multiple Of"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.minimum !== null ? (
                          <GenericInputComponent type={"number"} name={"minimum"} id={"minimumInput"}
                            data={attribute.minimum} nameOverride={"Minimum"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"minimum"} id={"minimumInput"}
                            nameOverride={"Minimum"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.maximum !== null ? (
                          <GenericInputComponent type={"number"} name={"maximum"} id={"maximumInput"}
                            data={attribute.maximum} nameOverride={"Maximum"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"maximum"} id={"maximumInput"}
                            nameOverride={"Maximum"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.exclusiveMinimum ? (
                                <Checkbox type={"checkbox"} id={"exclusiveMinimumInout"}
                                  nameLabel={"Exclusive minimum"} nameAttribute={"exclusiveMinimum"}
                                  data={attribute.exclusiveMinimum} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"exclusiveMinimumInout"}
                                  nameLabel={"Exclusive minimum"} nameAttribute={"exclusiveMinimum"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"exclusiveMinimumInout"}
                              nameLabel={"Exclusive minimum"} nameAttribute={"exclusiveMinimum"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.exclusiveMaximum ? (
                                <Checkbox type={"checkbox"} id={"exclusiveMaximumInput"}
                                  nameLabel={"Exclusive Maximum"} nameAttribute={"exclusiveMaximum"}
                                  data={attribute.exclusiveMaximum} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"exclusiveMaximumInput"}
                                  nameLabel={"Exclusive Maximum"} nameAttribute={"exclusiveMaximum"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"exclusiveMaximumInput"}
                              nameLabel={"Exclusive Maximum"} nameAttribute={"exclusiveMaximum"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.minLength !== null ? (
                          <GenericInputComponent type={"number"} name={"minLength"} id={"minLengthInput"}
                            data={attribute.minLength} nameOverride={"MinLength"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"minLength"} id={"minLengthInput"}
                            nameOverride={"MinLength"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.maxLength !== null ? (
                          <GenericInputComponent type={"number"} name={"maxLength"} id={"maxLengthInput"}
                            data={attribute.maxLength} nameOverride={"MaxLength"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"maxLength"} id={"maxLengthInput"}
                            nameOverride={"MaxLength"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.minItems !== null ? (
                          <GenericInputComponent type={"number"} name={"minItems"} id={"minItemsInput"}
                            data={attribute.minItems} nameOverride={"MinItems"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"minItems"} id={"minItemsInput"}
                            nameOverride={"MinItems"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.maxItems !== null ? (
                          <GenericInputComponent type={"number"} name={"maxItems"} id={"maxItemsInput"}
                            data={attribute.maxItems} nameOverride={"MaxItems"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"maxItems"} id={"maxItemsInput"}
                            nameOverride={"MaxItems"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.minDate !== null ? (
                          <GenericInputComponent type={"text"} name={"minDate"} id={"minDateInput"}
                            data={attribute.minDate} nameOverride={"MinDate"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"minDate"} id={"minDateInput"}
                            nameOverride={"MinDate"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.maxDate !== null ? (
                          <GenericInputComponent type={"text"} name={"maxDate"} id={"maxDateInput"}
                            data={attribute.maxDate} nameOverride={"MaxDate"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"maxDate"} id={"maxDateInput"}
                            nameOverride={"MaxDate"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.minProperties !== null ? (
                          <GenericInputComponent type={"number"} name={"minProperties"} id={"minPropertiesInput"}
                            data={attribute.minProperties} nameOverride={"Min Properties"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"minProperties"} id={"minPropertiesInput"}
                            nameOverride={"Min Properties"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.maxProperties !== null ? (
                          <GenericInputComponent type={"number"} name={"maxProperties"} id={"maxPropertiesInput"}
                            data={attribute.maxProperties} nameOverride={"Max Properties"} />
                        ) : (
                          <GenericInputComponent type={"number"} name={"maxProperties"} id={"maxPropertiesInput"}
                            nameOverride={"Max Properties"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.example !== null ? (
                          <GenericInputComponent type={"text"} name={"example"} id={"exampleInput"}
                            data={attribute.example} nameOverride={"Example"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"example"} id={"exampleInput"}
                            nameOverride={"Example"} />
                        )}
                      </div>
                      <div className="col-6">
                        {attribute !== null && attribute.fileType !== null ? (
                          <GenericInputComponent type={"text"} name={"fileType"} id={"fileTypeInput"}
                            data={attribute.fileType} nameOverride={"File Type"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"fileType"} id={"fileTypeInput"}
                            nameOverride={"File Type"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        {attribute !== null && attribute.maxFileSize !== null ? (
                          <GenericInputComponent type={"text"} name={"maxFileSize"} id={"maxFileSizeInput"}
                            data={attribute.maxFileSize} nameOverride={"Max File Size"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"maxFileSize"} id={"maxFileSizeInput"}
                            nameOverride={"Max File Size"} />
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.inversedBy ? (
                                <Checkbox type={"checkbox"} id={"inversedByInput"}
                                  nameLabel={"Inversed By"} nameAttribute={"inversedBy"}
                                  data={attribute.inversedBy} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"persistToGatewayInput"}
                                  nameLabel={"Persist To Gateway"} nameAttribute={"InversedBy"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"inversedByInput"}
                              nameLabel={"Inversed By"} nameAttribute={"inversedBy"}/>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.persistToGateway ? (
                                <Checkbox type={"checkbox"} id={"persistToGatewayInput"}
                                  nameLabel={"Persist To Gateway"} nameAttribute={"persistToGateway"}
                                  data={attribute.persistToGateway} defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"persistToGatewayInput"}
                                  nameLabel={"Persist To Gateway"} nameAttribute={"persistToGateway"}
                                  defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"persistToGatewayInput"}
                              nameLabel={"Persist To Gateway"} nameAttribute={"persistToGateway"}
                              defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.cascade ? (
                                <Checkbox type={"checkbox"} id={"cascadeInput"} nameLabel={"Cascade"}
                                  nameAttribute={"cascade"} data={attribute.cascade}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"cascadeInput"} nameLabel={"Cascade"}
                                  nameAttribute={"cascade"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"cascadeInput"} nameLabel={"Cascade"}
                              nameAttribute={"cascade"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.required ? (
                                <Checkbox type={"checkbox"} id={"requiredInput"} nameLabel={"Required"}
                                  nameAttribute={"required"} data={attribute.required}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"requiredInput"} nameLabel={"Required"}
                                  nameAttribute={"required"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"requiredInput"} nameLabel={"Required"}
                              nameAttribute={"required"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.searchable ? (
                                <Checkbox type={"checkbox"} id={"searchableInput"} nameLabel={"Searchable"}
                                  nameAttribute={"searchable"} data={attribute.searchable}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"searchableInput"} nameLabel={"Searchable"}
                                  nameAttribute={"searchable"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"searchableInput"} nameLabel={"Searchable"}
                              nameAttribute={"searchable"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.mustBeUnique ? (
                                <Checkbox type={"checkbox"} id={"mustBeUniqueInput"} nameLabel={"Must Be Unique"}
                                  nameAttribute={"mustBeUnique"} data={attribute.mustBeUnique}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"mustBeUniqueInput"} nameLabel={"Must Be Unique"}
                                  nameAttribute={"mustBeUnique"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"mustBeUniqueInput"} nameLabel={"Must Be Unique"}
                              nameAttribute={"mustBeUnique"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.uniqueItems ? (
                                <Checkbox type={"checkbox"} id={"uniqueItemsInput"} nameLabel={"Unique Items"}
                                  nameAttribute={"uniqueItems"} data={attribute.uniqueItems}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"uniqueItemsInput"} nameLabel={"Unique Items"}
                                  nameAttribute={"uniqueItems"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"uniqueItemsInput"} nameLabel={"Unique Items"}
                              nameAttribute={"uniqueItems"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.multiple ? (
                                <Checkbox type={"checkbox"} id={"multipleInput"} nameLabel={"Multiple"}
                                  nameAttribute={"multiple"} data={attribute.multiple}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"multipleInput"} nameLabel={"Multiple"}
                                  nameAttribute={"multiple"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"multipleInput"} nameLabel={"Multiple"}
                              nameAttribute={"multiple"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.nullable ? (
                                <Checkbox type={"checkbox"} id={"nullableInput"} nameLabel={"Nullable"}
                                  nameAttribute={"nullable"} data={attribute.nullable}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"nullableInput"} nameLabel={"Nullable"}
                                  nameAttribute={"nullable"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"nullableInput"} nameLabel={"Nullable"}
                              nameAttribute={"nullable"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.readOnly ? (
                                <Checkbox type={"checkbox"} id={"readOnlyInput"} nameLabel={"Read Only"}
                                  nameAttribute={"readOnly"} data={attribute.readOnly}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"readOnlyInput"} nameLabel={"Read Only"}
                                  nameAttribute={"readOnly"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"readOnlyInput"} nameLabel={"Read Only"}
                              nameAttribute={"readOnly"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.writeOnly ? (
                                <Checkbox type={"checkbox"} id={"writeOnlyInput"} nameLabel={"Write Only"}
                                  nameAttribute={"writeOnly"} data={attribute.writeOnly}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"writeOnlyInput"} nameLabel={"Write Only"}
                                  nameAttribute={"writeOnly"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"writeOnlyInput"} nameLabel={"Write Only"}
                              nameAttribute={"writeOnly"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          {attribute !== null ? (
                            <>
                              {attribute.deprecated ? (
                                <Checkbox type={"checkbox"} id={"deprecatedInput"} nameLabel={"Deprecated"}
                                  nameAttribute={"deprecated"} data={attribute.deprecated}
                                  defaultValue={"true"} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"deprecatedInput"} nameLabel={"Deprecated"}
                                  nameAttribute={"deprecated"} defaultValue={"true"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"deprecatedInput"} nameLabel={"Deprecated"}
                              nameAttribute={"deprecated"} defaultValue={"true"} />
                          )}
                        </div>
                      </div>
                    </div>
                    {/*<Accordion id="validationsAccordion" title="Validations">*/}
                    {/*  {attribute !== null ? (*/}
                    {/*    <MultiDimensionalArrayInput*/}
                    {/*      target={"validations"}*/}
                    {/*      data={attribute.validations}*/}
                    {/*    />*/}
                    {/*  ) : (*/}
                    {/*    <MultiDimensionalArrayInput target={"Validations"} />*/}
                    {/*  )}*/}
                    {/*</Accordion>*/}

                    <Accordion id="attributeAccordion"
                      items={[{
                        title: "Object Config",
                        id: "objectConfigAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.objectConfig !== null ? (
                              <MultiDimensionalArrayInput
                                id={"objectConfig"}
                                label={"Object Config"}
                                data={[{ key: 'objectConfig', value: attribute.objectConfig }]}
                              />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"objectConfig"}
                                label={"Object Config"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "Enum",
                        id: "enumAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.enum !== null ? (
                                <ArrayInputComponent
                                  id={"enum"}
                                  label={"Enum"}
                                  data={attribute.enum}
                                />
                            ) : (
                              <ArrayInputComponent
                                id={"enum"}
                                label={"Enum"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "Required If",
                        id: "requiredIfAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.requiredIf !== null ? (
                              <MultiDimensionalArrayInput
                                id={"requiredIf"}
                                label={"Required If"}
                                data={[{ key: 'requiredIf', value: attribute.requiredIf }]}
                              />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"requiredIf"}
                                label={"Required If"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "Forbidden If",
                        id: "forbiddenIfAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.forbiddenIf !== null ? (
                              <MultiDimensionalArrayInput
                                id={"forbiddenIf"}
                                label={"Forbidden If"}
                                data={[{ key: 'forbiddenIf', value: attribute.forbiddenIf }]}
                              />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"forbiddenIf"}
                                label={"Forbidden If"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "All Of",
                        id: "allOfAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.allOf !== null ? (
                              <MultiDimensionalArrayInput
                                label={"All Of"}
                                id={"allOf"}
                                data={[{ key: 'allOf', value: attribute.allOf }]}
                              />
                            ) : (
                              <MultiDimensionalArrayInput
                                label={"All Of"}
                                id={"allOf"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "Any Of",
                        id: "anyOfAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.anyOf !== null ? (
                              <MultiDimensionalArrayInput
                                label={"Any Of"}
                                id={"anyOf"}
                                data={[{ key: 'anyOf', value: attribute.anyOf }]}
                              />
                            ) : (
                              <MultiDimensionalArrayInput
                                label={"Any Of"}
                                id={"anyOf"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "One Of",
                        id: "oneOfAccordion",
                        render: function () {
                          return (<>
                            {attribute !== null && attribute.oneOf !== null ? (
                              <MultiDimensionalArrayInput
                                label={"One Of"}
                                id={"oneOf"}
                                data={[{ key: 'oneOf', value: attribute.oneOf }]}
                              />
                            ) : (
                              <MultiDimensionalArrayInput
                                label={"One Of"}
                                id={"oneOf"}
                                data={null}
                              />
                            )}
                          </>)
                        }
                      }
                      ]} />
                  </>
                )}
              </div>
            </div>

          )
        }} />
    </form></>
  );
}
