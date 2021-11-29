import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {Link, navigate} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import {ArrayInputComponent} from "../utility/arrayInput";
import {MultiDimensionalArrayInput} from "../utility/multiDimensionalArrayInput";
import {CheckboxComponent} from "../utility/checkbox";
import {GenericInputComponent} from "../utility/genericInput";
import {SelectInputComponent} from "../utility/selectInput";
import Accordion from "../common/accordion";

export default function AttributeForm({id, entity}) {
  const context = useUrlContext();
  const [attribute, setAttribute] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [attributes, setAttributes] = React.useState(null);

  const getAttributes = () => {
    fetch(context.apiUrl + "/attributes", {
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    })
      .then((response) => response.json())
      .then((data) => {
        setAttributes(data["hydra:member"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getAttribute = () => {
    fetch(`${context.apiUrl}/attributes/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    })
      .then((response) => response.json())
      .then((data) => {
        setAttribute(data);
      });
  };

  const saveAttribute = (event) => {
    event.preventDefault();

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

    if (attributeEnum.length != 0) {
      body["enum"] = attributeEnum;
    } else {
      body["enum"] = [];
    }

    if (Object.keys(allOf).length != 0) {
      body["allOf"] = allOf;
    } else {
      body["allOf"] = [];
    }

    if (Object.keys(anyOf).length != 0) {
      body["anyOf"] = anyOf;
    } else {
      body["anyOf"] = [];
    }

    if (Object.keys(oneOf).length != 0) {
      body["oneOf"] = oneOf;
    } else {
      body["oneOf"] = [];
    }

    if (Object.keys(forbiddenIf).length != 0) {
      body["forbiddenIf"] = forbiddenIf;
    } else {
      body["forbiddenIf"] = [];
    }

    if (Object.keys(requiredIf).length != 0) {
      body["requiredIf"] = requiredIf;
    } else {
      body["requiredIf"] = [];
    }

    if (Object.keys(objectConfig).length != 0) {
      body["objectConfig"] = objectConfig;
    } else {
      body["objectConfig"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.type])) {
      return;
    }

    // setShowSpinner(true);

    let url = context.apiUrl + "/attributes";
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
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("yes!");
        setShowSpinner(false);
        navigate(`/entities/${entity}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  React.useEffect(() => {
    getAttributes();
    if (id !== "new") {
      getAttribute();
    }
  }, []);

  return (
    <div className="utrecht-card card">
      <form id="dataForm" onSubmit={saveAttribute}>
        <div className="utrecht-card-header card-header">
          <div className="utrecht-card-head-row card-head-row row">
            <div className="col-6">
              <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">
                Values
              </h4>
            </div>
            <div className="col-6 text-right">
              <Link className="utrecht-link" to={`/entities/${entity}`}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2"></i>Back
                </button>
              </Link>
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
                type="submit"
              >
                <i className="fas fa-save mr-2"></i>Save
              </button>
            </div>
          </div>
        </div>
        {showSpinner === true ? (
          <div className="text-center py-5">
            <div
              class="spinner-border text-primary"
              style={{width: "3rem", height: "3rem"}}
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="utrecht-card-body card-body">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-6">
                      {attribute !== null && attribute.name !== null ? (
                        <GenericInputComponent type={"text"} target={"name"} id={"nameInput"} data={attribute.name}
                                               name={"Name"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"name"} id={"nameInput"} name={"Name"}/>
                      )}
                    </div>
                    <div className="col-6">
                      {attribute !== null && attribute.description !== null ? (
                        <GenericInputComponent type={"text"} target={"description"} id={"descriptionInput"}
                                               data={attribute.description} name={"Description"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"description"} id={"descriptionInput"}
                                               name={"Description"}/>
                      )}
                    </div>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col-6">
                      {attribute !== null && attribute.type !== null ? (
                          <SelectInputComponent
                            options={[{name: "string"}, {name: "array"}, {name: "integer"}, {name: "boolean"},
                              {name: "object"}, {name: "date"}, {name: "datetime"}, {name: "number"}, {name: "float"}, {name: "file"}]}
                            name={"type"} id={"typeInput"} nameOverride={"Type"} data={attribute.type}/>
                        ) :
                        (
                          <SelectInputComponent
                            options={[{name: "string"}, {name: "array"}, {name: "integer"}, {name: "boolean"},
                              {name: "object"}, {name: "date"}, {name: "datetime"}, {name: "number"}, {name: "float"}, {name: "file"}]}
                            name={"type"} id={"typeInput"} nameOverride={"Type"}/>
                        )}
                    </div>
                    <div className="col-6">
                      {attribute !== null && attribute.format !== null ? (
                          <SelectInputComponent
                            options={[{name: "email"}, {name: "phone"}, {name: "country code"}, {name: "bsn"},
                              {name: "url"}, {name: "uuid"}, {name: "json"}]}
                            name={"format"} id={"formatInput"} nameOverride={"Format"} data={attribute.format}/>
                        ) :
                        (
                          <SelectInputComponent
                            options={[{name: "email"}, {name: "phone"}, {name: "country code"}, {name: "bsn"},
                              {name: "url"}, {name: "uuid"}, {name: "json"}]} name={"format"} id={"formatInput"}
                            nameOverride={"Format"}/>
                        )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      {attribute !== null && attribute.defaultValue !== null ? (
                        <GenericInputComponent type={"text"} target={"defaultValue"} id={"defaultValueInput"}
                                               data={attribute.defaultValue} name={"Default Value"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"defaultValue"} id={"defaultValueInput"}
                                               name={"Default Value"}/>
                      )}
                    </div>
                    <div className="col-6">
                      {attribute !== null && attribute.multipleOf !== null ? (
                        <GenericInputComponent type={"number"} target={"multipleOf"} id={"multipleOfInput"}
                                               data={attribute.multipleOf} name={"Multiple Of"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"multipleOf"} id={"multipleOfInput"}
                                               name={"Multiple Of"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      {attribute !== null && attribute.maximum !== null ? (
                        <GenericInputComponent type={"number"} target={"maximum"} id={"maximumInput"}
                                               data={attribute.maximum} name={"Maximum"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"maximum"} id={"maximumInput"} name={"Maximum"}/>
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="minimumInput">Minimum</label>
                      {attribute !== null && attribute.minimum !== null ? (
                        <GenericInputComponent type={"number"} target={"minimum"} id={"minimumInput"}
                                               data={attribute.minimum} name={"Minimum"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"minimum"} id={"minimumInput"} name={"Minimum"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.exclusiveMaximum ? (
                              <CheckboxComponent type={"checkbox"} id={"exclusiveMaximumInput"}
                                                 nameLabel={"Exclusive Maximum"} nameAttribute={"exclusiveMaximum"}
                                                 data={attribute.exclusiveMaximum}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"exclusiveMaximumInput"}
                                                 nameLabel={"Exclusive Maximum"} nameAttribute={"exclusiveMaximum"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"exclusiveMaximumInput"}
                                             nameLabel={"Exclusive Maximum"} nameAttribute={"exclusiveMaximum"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.exclusiveMinimum ? (
                              <CheckboxComponent type={"checkbox"} id={"exclusiveMinimumInout"}
                                                 nameLabel={"Exclusive minimum"} nameAttribute={"exclusiveMinimum"}
                                                 data={attribute.exclusiveMinimum}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"exclusiveMinimumInout"}
                                                 nameLabel={"Exclusive minimum"} nameAttribute={"exclusiveMinimum"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"exclusiveMinimumInout"}
                                             nameLabel={"Exclusive minimum"} nameAttribute={"exclusiveMinimum"}/>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      {attribute !== null && attribute.minLength !== null ? (
                        <GenericInputComponent type={"number"} target={"minLength"} id={"minLengthInput"}
                                               data={attribute.minLength} name={"MinLength"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"minLength"} id={"minLengthInput"}
                                               name={"MinLength"}/>
                      )}
                    </div>
                    <div className="col-6">
                      {attribute !== null && attribute.maxLength !== null ? (
                        <GenericInputComponent type={"number"} target={"maxLength"} id={"maxLengthInput"}
                                               data={attribute.maxLength} name={"MaxLength"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"maxLength"} id={"maxLengthInput"}
                                               name={"MaxLength"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      {attribute !== null && attribute.maxItems !== null ? (
                        <GenericInputComponent type={"number"} target={"maxItems"} id={"maxItemsInput"}
                                               data={attribute.maxItems} name={"MaxItems"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"maxItems"} id={"maxItemsInput"}
                                               name={"MaxItems"}/>
                      )}
                    </div>
                    <div className="col-6">
                      {attribute !== null && attribute.minItems !== null ? (
                        <GenericInputComponent type={"number"} target={"minItems"} id={"minItemsInput"}
                                               data={attribute.minItems} name={"MinItems"}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"minItems"} id={"minItemsInput"}
                                               name={"MinItems"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      {attribute !== null && attribute.maxDate !== null ? (
                        <GenericInputComponent type={"string"} target={"maxDate"} id={"maxDateInput"}
                                               data={attribute.maxDate} name={"MaxDate"}
                                               defaultValue={attribute.maxDate}/>
                      ) : (
                        <GenericInputComponent type={"string"} target={"maxDate"} id={"maxDateInput"} name={"MaxDate"}/>
                      )}
                    </div>
                    <div className="col-6">
                      {attribute !== null && attribute.minDate !== null ? (
                        <GenericInputComponent type={"string"} target={"minDate"} id={"minDateInput"}
                                               data={attribute.minDate} name={"MinDate"}
                                               defaultValue={attribute.minDate}/>
                      ) : (
                        <GenericInputComponent type={"string"} target={"minDate"} id={"minDateInput"} name={"MinDate"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      {attribute !== null &&
                      attribute.minProperties !== null ? (
                        <GenericInputComponent type={"number"} target={"minProperties"} id={"minPropertiesInput"}
                                               data={attribute.minProperties} name={"Min Properties"}
                                               defaultValue={attribute.minProperties}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"minProperties"} id={"minPropertiesInput"}
                                               name={"Min Properties"}/>
                      )}
                    </div>
                    <div className="col-6">
                      {attribute !== null &&
                      attribute.maxProperties !== null ? (
                        <GenericInputComponent type={"number"} target={"maxProperties"} id={"maxPropertiesInput"}
                                               data={attribute.maxProperties} name={"Max Properties"}
                                               defaultValue={attribute.maxProperties}/>
                      ) : (
                        <GenericInputComponent type={"number"} target={"maxProperties"} id={"maxPropertiesInput"}
                                               name={"Max Properties"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">Example</label>
                      {attribute !== null && attribute.example !== null ? (
                        <GenericInputComponent type={"text"} target={"example"} id={"exampleInput"}
                                               data={attribute.example} name={"Example"}
                                               defaultValue={attribute.example}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"example"} id={"exampleInput"} name={"Example"}/>
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">File Type</label>
                      {attribute !== null && attribute.fileType !== null ? (
                        <GenericInputComponent type={"text"} target={"fileType"} id={"fileTypeInput"}
                                               data={attribute.fileType} name={"File Type"}
                                               defaultValue={attribute.fileType}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"fileType"} id={"fileTypeInput"}
                                               name={"File Type"}/>
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">Max File Size</label>
                      {attribute !== null && attribute.maxFileSize !== null ? (
                        <GenericInputComponent type={"text"} target={"maxFileSize"} id={"maxFileSizeInput"}
                                               data={attribute.maxFileSize} name={"Max File Size"}
                                               defaultValue={attribute.maxFileSize}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"maxFileSize"} id={"maxFileSizeInput"}
                                               name={"Max File Size"}/>
                      )}
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="inversedByInput">Inversed By</label>
                        <select
                          name="inversedBy"
                          id="inversedByInput"
                          class="utrecht-select utrecht-select--html-select"
                        >
                          <option value=""></option>
                          {attributes !== null &&
                          attributes.length > 0 &&
                          attributes.map((row) => (
                            <>
                              {attribute !== null &&
                              attribute.inversedBy !== undefined &&
                              attribute.inversedBy !== null &&
                              attribute.inversedBy.id == row.id ? (
                                <option
                                  value={"/admin/attributes/" + row.id}
                                  selected
                                >
                                  {row.name}
                                </option>
                              ) : (
                                <option value={"/admin/attributes/" + row.id}>
                                  {row.name}
                                </option>
                              )}
                            </>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.persistToGateway ? (
                              <CheckboxComponent type={"checkbox"} id={"persistToGatewayInput"}
                                                 nameLabel={"Persist To Gateway"} nameAttribute={"persistToGateway"}
                                                 data={attribute.persistToGateway} defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"persistToGatewayInput"}
                                                 nameLabel={"Persist To Gateway"} nameAttribute={"persistToGateway"}
                                                 defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"persistToGatewayInput"}
                                             nameLabel={"Persist To Gateway"} nameAttribute={"persistToGateway"}
                                             defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.cascade ? (
                              <CheckboxComponent type={"checkbox"} id={"cascadeInput"} nameLabel={"Cascade"}
                                                 nameAttribute={"cascade"} data={attribute.cascade}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"cascadeInput"} nameLabel={"Cascade"}
                                                 nameAttribute={"cascade"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"cascadeInput"} nameLabel={"Cascade"}
                                             nameAttribute={"cascade"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.required ? (
                              <CheckboxComponent type={"checkbox"} id={"requiredInput"} nameLabel={"Required"}
                                                 nameAttribute={"required"} data={attribute.required}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"requiredInput"} nameLabel={"Required"}
                                                 nameAttribute={"required"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"requiredInput"} nameLabel={"Required"}
                                             nameAttribute={"required"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.searchable ? (
                              <CheckboxComponent type={"checkbox"} id={"searchableInput"} nameLabel={"Searchable"}
                                                 nameAttribute={"searchable"} data={attribute.searchable}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"searchableInput"} nameLabel={"Searchable"}
                                                 nameAttribute={"searchable"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"searchableInput"} nameLabel={"Searchable"}
                                             nameAttribute={"searchable"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.mustBeUnique ? (
                              <CheckboxComponent type={"checkbox"} id={"mustBeUniqueInput"} nameLabel={"Must Be Unique"}
                                                 nameAttribute={"mustBeUnique"} data={attribute.mustBeUnique}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"mustBeUniqueInput"} nameLabel={"Must Be Unique"}
                                                 nameAttribute={"mustBeUnique"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"mustBeUniqueInput"} nameLabel={"Must Be Unique"}
                                             nameAttribute={"mustBeUnique"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.uniqueItems ? (
                              <CheckboxComponent type={"checkbox"} id={"uniqueItemsInput"} nameLabel={"Unique Items"}
                                                 nameAttribute={"uniqueItems"} data={attribute.uniqueItems}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"uniqueItemsInput"} nameLabel={"Unique Items"}
                                                 nameAttribute={"uniqueItems"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"uniqueItemsInput"} nameLabel={"Unique Items"}
                                             nameAttribute={"uniqueItems"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.multiple ? (
                              <CheckboxComponent type={"checkbox"} id={"multipleInput"} nameLabel={"Multiple"}
                                                 nameAttribute={"multiple"} data={attribute.multiple}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"multipleInput"} nameLabel={"Multiple"}
                                                 nameAttribute={"multiple"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"multipleInput"} nameLabel={"Multiple"}
                                             nameAttribute={"multiple"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.nullable ? (
                              <CheckboxComponent type={"checkbox"} id={"nullableInput"} nameLabel={"Nullable"}
                                                 nameAttribute={"nullable"} data={attribute.nullable}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"nullableInput"} nameLabel={"Nullable"}
                                                 nameAttribute={"nullable"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"nullableInput"} nameLabel={"Nullable"}
                                             nameAttribute={"nullable"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.readOnly ? (
                              <CheckboxComponent type={"checkbox"} id={"readOnlyInput"} nameLabel={"Read Only"}
                                                 nameAttribute={"readOnly"} data={attribute.readOnly}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"readOnlyInput"} nameLabel={"Read Only"}
                                                 nameAttribute={"readOnly"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"readOnlyInput"} nameLabel={"Read Only"}
                                             nameAttribute={"readOnly"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.writeOnly ? (
                              <CheckboxComponent type={"checkbox"} id={"writeOnlyInput"} nameLabel={"Write Only"}
                                                 nameAttribute={"writeOnly"} data={attribute.writeOnly}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"writeOnlyInput"} nameLabel={"Write Only"}
                                                 nameAttribute={"writeOnly"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"writeOnlyInput"} nameLabel={"Write Only"}
                                             nameAttribute={"writeOnly"} defaultValue={"true"}/>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.deprecated ? (
                              <CheckboxComponent type={"checkbox"} id={"deprecatedInput"} nameLabel={"Deprecated"}
                                                 nameAttribute={"deprecated"} data={attribute.deprecated}
                                                 defaultValue={"true"}/>
                            ) : (
                              <CheckboxComponent type={"checkbox"} id={"deprecatedInput"} nameLabel={"Deprecated"}
                                                 nameAttribute={"deprecated"} defaultValue={"true"}/>
                            )}
                          </>
                        ) : (
                          <CheckboxComponent type={"checkbox"} id={"deprecatedInput"} nameLabel={"Deprecated"}
                                             nameAttribute={"deprecated"} defaultValue={"true"}/>
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
                  <Accordion id="objectConfigAccordion" title="Object Config">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"objectConfig"}
                        data={attribute.objectConfig}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"objectConfig"}/>
                    )}
                  </Accordion>
                  <Accordion id="enumAccordion" title="Enum">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"enum"}
                        data={attribute.enum}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"enum"}/>
                    )}
                  </Accordion>
                  <Accordion id="requiredIfAccordion" title="Required If">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"requiredIf"}
                        data={attribute.requiredIf}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"requiredIf"}/>
                    )}
                  </Accordion>
                  <Accordion id="forbiddenIfAccordion" title="Forbidden If">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"forbiddenIf"}
                        data={attribute.forbiddenIf}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"forbiddenIf"}/>
                    )}
                  </Accordion>
                  <Accordion id="allOfAccordion" title="All Of">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"allOf"}
                        data={attribute.allOf}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"allOf"}/>
                    )}
                  </Accordion>
                  <Accordion id="anyOfAccordion" title="Any Of">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"anyOf"}
                        data={attribute.anyOf}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"anyOf"}/>
                    )}
                  </Accordion>
                  <Accordion id="oneOfAccordion" title="One Of">
                    {attribute !== null ? (
                      <MultiDimensionalArrayInput
                        target={"oneOf"}
                        data={attribute.oneOf}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"oneOf"}/>
                    )}
                  </Accordion>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
