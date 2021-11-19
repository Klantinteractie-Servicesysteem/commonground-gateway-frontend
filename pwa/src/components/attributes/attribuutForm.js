import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { Link, navigate } from "gatsby";
import { MultiDimensionalArrayInput } from "../utility/multiDimensionalArrayInput";
import { ArrayInput } from "../utility/ArrayInput";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";

export default function AttributeForm({ id, entity }) {
  const context = useUrlContext();
  const [attribute, setAttribute] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [attributes, setAttributes] = React.useState(null);

  const getAttributes = () => {
    fetch(context.apiUrl + "/attributes", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
              style={{ width: "3rem", height: "3rem" }}
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
                      <label htmlFor="nameInput">Name</label>
                      {attribute !== null && attribute.name !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="name"
                          id="nameInput"
                          defaultValue={attribute.name}
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="name"
                          id="nameInput"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="descriptionInput">Description</label>
                      {attribute !== null && attribute.description !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="description"
                          id="descriptionInput"
                          defaultValue={attribute.description}
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
                  <br />
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="endpointInput">Type</label>
                      <select
                        name="type"
                        id="typeInput"
                        className="utrecht-select utrecht-select--html-select"
                      >
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "string" ? (
                          <option selected value="string" id="typeInput">
                            String
                          </option>
                        ) : (
                          <option value="string" id="typeInput">
                            String
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "array" ? (
                          <option selected value="array" id="typeInput">
                            Array
                          </option>
                        ) : (
                          <option value="array" id="typeInput">
                            Array
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "integer" ? (
                          <option selected value="integer" id="typeInput">
                            Integer
                          </option>
                        ) : (
                          <option value="integer" id="typeInput">
                            Integer
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "boolean" ? (
                          <option selected value="bool" id="typeInput">
                            Boolean
                          </option>
                        ) : (
                          <option value="bool" id="typeInput">
                            Boolean
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "object" ? (
                          <option selected value="object" id="typeInput">
                            Object
                          </option>
                        ) : (
                          <option value="object" id="typeInput">
                            Object
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "date" ? (
                          <option selected value="date" id="typeInput">
                            Date
                          </option>
                        ) : (
                          <option value="date" id="typeInput">
                            Date
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "datetime" ? (
                          <option selected value="datetime" id="typeInput">
                            Datetime
                          </option>
                        ) : (
                          <option value="datetime" id="typeInput">
                            Datetime
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "number" ? (
                          <option selected value="number" id="typeInput">
                            Number
                          </option>
                        ) : (
                          <option value="number" id="typeInput">
                            Number
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "float" ? (
                          <option selected value="float" id="typeInput">
                            Float
                          </option>
                        ) : (
                          <option value="float" id="typeInput">
                            Float
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.type !== null &&
                        attribute.type === "file" ? (
                          <option selected value="file" id="typeInput">
                            File
                          </option>
                        ) : (
                          <option value="file" id="typeInput">
                            File
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="col-6">
                      <label htmlFor="formatInput">Format</label>
                      <select
                        name="format"
                        id="formatInput"
                        className="utrecht-select utrecht-select--html-select"
                      >
                        {attribute !== null && attribute.format !== null ? (
                          <option
                            selected
                            value={attribute.format}
                            id="formatInput"
                          >
                            {attribute.format}
                          </option>
                        ) : (
                          <option selected value="" id="formatInput"></option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "email" ? (
                          <option selected value="email" id="formatInput">
                            Email
                          </option>
                        ) : (
                          <option value="email" id="formatInput">
                            Email
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "phone" ? (
                          <option selected value="phone" id="formatInput">
                            Phone
                          </option>
                        ) : (
                          <option value="phone" id="formatInput">
                            Phone
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "countryCode" ? (
                          <option selected value="countryCode" id="formatInput">
                            Country code
                          </option>
                        ) : (
                          <option value="countryCode" id="formatInput">
                            Country code
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "bsn" ? (
                          <option selected value="bsn" id="formatInput">
                            Bsn
                          </option>
                        ) : (
                          <option value="bsn" id="formatInput">
                            Bsn
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "url" ? (
                          <option selected value="url" id="formatInput">
                            Url
                          </option>
                        ) : (
                          <option value="url" id="formatInput">
                            Url
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "uuid" ? (
                          <option selected value="uuid" id="formatInput">
                            Uuid
                          </option>
                        ) : (
                          <option value="uuid" id="formatInput">
                            Uuid
                          </option>
                        )}
                        {attribute !== null &&
                        attribute.format !== null &&
                        attribute.format === "json" ? (
                          <option selected value="json" id="formatInput">
                            Json
                          </option>
                        ) : (
                          <option value="json" id="formatInput">
                            Json
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="defaultInput">Default Value</label>
                      {attribute !== null && attribute.defaultValue !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="defaultValue"
                          id="defaultInput"
                          defaultValue={attribute.defaultValue}
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="defaultValue"
                          id="defaultInput"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="multipleOfInput">MultipleOf</label>
                      {attribute !== null && attribute.multipleOf !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="multipleOf"
                          id="multipleOfInput"
                          defaultValue={attribute.multipleOf}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="multipleOf"
                          id="multipleOfInput"
                          type="number"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maximumInput">Maximum</label>
                      {attribute !== null && attribute.maximum !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maximum"
                          id="maximumInput"
                          defaultValue={attribute.maximum}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maximum"
                          id="maximumInput"
                          type="number"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="minimumInput">Minimum</label>
                      {attribute !== null && attribute.minimum !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minimum"
                          id="minimumInput"
                          defaultValue={attribute.minimum}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minimum"
                          id="minimumInput"
                          type="number"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.exclusiveMaximum ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="exclusiveMaximumInput"
                                name="exclusiveMaximum"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="exclusiveMaximumInput"
                                name="exclusiveMaximum"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="exclusiveMaximumInput"
                            name="exclusiveMaximum"
                            defaultValue="true"
                          />
                        )}

                        <label
                          class="form-check-label"
                          for="exclusiveMaximumInput"
                        >
                          Exclusive Maximum
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.exclusiveMinimum ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="exclusiveMinimumInput"
                                name="exclusiveMinimum"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="exclusiveMinimumInput"
                                name="exclusiveMinimum"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="exclusiveMinimumInput"
                            name="exclusiveMinimum"
                            defaultValue="true"
                          />
                        )}

                        <label
                          class="form-check-label"
                          for="exclusiveMinimumInput"
                        >
                          Exclusive Minimum
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="minLengthInput">MinLength</label>
                      {attribute !== null && attribute.minLength !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minLength"
                          id="minLengthInput"
                          defaultValue={attribute.minLength}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minLength"
                          id="minLengthInput"
                          type="number"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="maxLengthInput">MaxLength</label>
                      {attribute !== null && attribute.maxLength !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxLength"
                          id="maxLengthInput"
                          defaultValue={attribute.maxLength}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxLength"
                          id="maxLengthInput"
                          type="number"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maxItemsInput">MaxItems</label>
                      {attribute !== null && attribute.maxItems !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxItems"
                          id="maxItemsInput"
                          defaultValue={attribute.maxItems}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxItems"
                          id="maxItemsInput"
                          type="number"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="minItemsInput">MinItems</label>
                      {attribute !== null && attribute.minItems !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minItems"
                          id="minItemsInput"
                          defaultValue={attribute.minItems}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minItems"
                          id="minItemsInput"
                          type="number"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maxDateInput">MaxDate</label>
                      {attribute !== null && attribute.maxDate !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxDate"
                          id="maxDateInput"
                          defaultValue={attribute.maxDate}
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxDate"
                          id="maxDateInput"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="minDateInput">MinDate</label>
                      {attribute !== null && attribute.minDate !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minDate"
                          id="minDateInput"
                          defaultValue={attribute.minDate}
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minDate"
                          id="minDateInput"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="minPropertiesInput">Min Properties</label>
                      {attribute !== null &&
                      attribute.minProperties !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minProperties"
                          id="minPropertiesInput"
                          defaultValue={attribute.minProperties}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="minProperties"
                          id="minPropertiesInput"
                          type="number"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">Max Properties</label>
                      {attribute !== null &&
                      attribute.maxProperties !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxProperties"
                          id="maxPropertiesInput"
                          defaultValue={attribute.maxProperties}
                          type="number"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxProperties"
                          id="maxPropertiesInput"
                          type="number"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">Example</label>
                      {attribute !== null && attribute.example !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="example"
                          id="exampleInput"
                          defaultValue={attribute.example}
                          type="text"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="example"
                          id="exampleInput"
                          type="text"
                        />
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">File Type</label>
                      {attribute !== null && attribute.fileType !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="fileType"
                          id="fileTypeInput"
                          defaultValue={attribute.fileType}
                          type="text"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="fileType"
                          id="fileTypeInput"
                          type="text"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-6">
                      <label htmlFor="maxPropertiesInput">Max File Size</label>
                      {attribute !== null && attribute.maxFileSize !== null ? (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxFileSize"
                          id="maxFileSizeInput"
                          defaultValue={attribute.maxFileSize}
                          type="text"
                        />
                      ) : (
                        <input
                          className="utrecht-textbox utrecht-textbox--html-input"
                          name="maxFileSize"
                          id="maxFileSizeInput"
                          type="text"
                        />
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
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="persistToGatewayInput"
                                name="persistToGateway"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="persistToGatewayInput"
                                name="persistToGateway"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="persistToGatewayInput"
                            name="persistToGateway"
                            defaultValue="true"
                          />
                        )}

                        <label
                          class="form-check-label"
                          for="persistToGatewayInput"
                        >
                          Persist To Gateway
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.cascade ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="cascadeInput"
                                name="cascade"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="cascadeInput"
                                name="cascade"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="cascadeInput"
                            name="cascade"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="cascadeInput">
                          Cascade
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.required ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="requiredInput"
                                name="required"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="requiredInput"
                                name="required"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="requiredInput"
                            name="required"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="requiredInput">
                          Required
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 ">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.searchable ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="searchableInput"
                                name="searchable"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="searchableInput"
                                name="searchable"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="searchableInput"
                            name="searchable"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="searchableInput">
                          Searchable
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.mustBeUnique ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="mustBeUniqueInput"
                                name="mustBeUnique"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="mustBeUniqueInput"
                                name="mustBeUnique"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="mustBeUniqueInput"
                            name="mustBeUnique"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="mustBeUniqueInput">
                          Must Be Unique
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.uniqueItems ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="uniqueItemsInput"
                                name="uniqueItems"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="uniqueItemsInput"
                                name="uniqueItems"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="uniqueItemsInput"
                            name="uniqueItems"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="uniqueItemsInput">
                          Unique Items
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.multiple ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="multipleInput"
                                name="multiple"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="multipleInput"
                                name="multiple"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="multipleInput"
                            name="multiple"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="multipleInput">
                          Multiple
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.nullable ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="nullableInput"
                                name="nullable"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="nullableInput"
                                name="nullable"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="nullableInput"
                            name="nullable"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="nullableInput">
                          Nullable
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.readOnly ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="readOnlyInput"
                                name="readOnly"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="readOnlyInput"
                                name="readOnly"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="readOnlyInput"
                            name="readOnly"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="readOnlyInput">
                          Read Only
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.writeOnly ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="writeOnlyInput"
                                name="writeOnly"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="writeOnlyInput"
                                name="writeOnly"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="writeOnlyInput"
                            name="writeOnly"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="writeOnlyInput">
                          Write Only
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div class="form-check">
                        {attribute !== null ? (
                          <>
                            {attribute.writeOnly ? (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="deprecatedInput"
                                name="deprecated"
                                defaultChecked={true}
                                defaultValue="true"
                              />
                            ) : (
                              <input
                                class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                                type="checkbox"
                                id="deprecatedInput"
                                name="deprecated"
                                defaultValue="true"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            class="form-check-input utrecht-checkbox utrecht-checkbox--html-input"
                            type="checkbox"
                            id="deprecatedInput"
                            name="deprecated"
                            defaultValue="true"
                          />
                        )}

                        <label class="form-check-label" for="deprecatedInput">
                          Deprecated
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="accordion mt-4" id="attributeAccordion">
                    {/* <div class="accordion-item">
                      <h2 class="accordion-header" id="validationsAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#validationsCollapse"
                          aria-expanded="false"
                          aria-controls="validationsCollapse"
                        >
                          Validations
                        </button>
                      </h2>
                      <div
                        id="validationsCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="validationsAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"validations"}
                              data={attribute.validations}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"validations"}
                            />
                          )}
                        </div>
                      </div>
                    </div> */}
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="objectConfigAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#objectConfigCollapse"
                          aria-expanded="false"
                          aria-controls="objectConfigCollapse"
                        >
                          Object Config
                        </button>
                      </h2>
                      <div
                        id="objectConfigCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="objectConfigAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"objectConfig"}
                              data={attribute.objectConfig}
                              name={"Object Config"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"objectConfig"}
                              name={"Object Config"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="enumAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#enumCollapse"
                          aria-expanded="false"
                          aria-controls="enumCollapse"
                        >
                          Enum
                        </button>
                      </h2>
                      <div
                        id="enumCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="enumAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <ArrayInput target={"enum"} data={attribute.enum} />
                          ) : (
                            <ArrayInput target={"enum"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="requiredIfAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#requiredIfCollapse"
                          aria-expanded="false"
                          aria-controls="requiredIfCollapse"
                        >
                          Required If
                        </button>
                      </h2>
                      <div
                        id="requiredIfCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="requiredIfAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"requiredIf"}
                              data={attribute.requiredIf}
                              name={"Required If"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"requiredIf"}
                              name={"Required If"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="forbidenIfAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#forbidenIfCollapse"
                          aria-expanded="false"
                          aria-controls="forbidenIfCollapse"
                        >
                          Forbidden if
                        </button>
                      </h2>
                      <div
                        id="forbidenIfCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="forbidenIfAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"forbidenIf"}
                              data={attribute.forbidenIf}
                              name={"Forbidden If"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"forbidenIf"}
                              name={"Forbidden If"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="allOfAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#allOfCollapse"
                          aria-expanded="false"
                          aria-controls="allOfCollapse"
                        >
                          All Of
                        </button>
                      </h2>
                      <div
                        id="allOfCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="allOfAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"allOf"}
                              data={attribute.allOf}
                              name={"All Of"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"allOf"}
                              name={"All Of"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="anyOfAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#anyOfCollapse"
                          aria-expanded="false"
                          aria-controls="anyOfCollapse"
                        >
                          Any Of
                        </button>
                      </h2>
                      <div
                        id="anyOfCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="anyOfAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"anyOf"}
                              data={attribute.anyOf}
                              name={"Any Of"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"anyOf"}
                              name={"Any Of"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="anyOfAccordion">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#oneOfCollapse"
                          aria-expanded="false"
                          aria-controls="oneOfCollapse"
                        >
                          One Of
                        </button>
                      </h2>
                      <div
                        id="oneOfCollapse"
                        class="accordion-collapse collapse"
                        aria-labelledby="oneOfAccordion"
                        data-bs-parent="#attributeAccordion"
                      >
                        <div class="accordion-body">
                          {attribute !== null ? (
                            <MultiDimensionalArrayInput
                              target={"oneOf"}
                              data={attribute.oneOf}
                              name={"One Of"}
                            />
                          ) : (
                            <MultiDimensionalArrayInput
                              target={"oneOf"}
                              name={"One Of"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
