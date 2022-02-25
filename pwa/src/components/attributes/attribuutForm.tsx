import * as React from "react";
import { Link } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import MultiDimensionalArrayInput from "../common/multiDimensionalArrayInput";
import {
  GenericInputComponent,
  Checkbox,
  SelectInputComponent,
  TextareaGroup,
  Accordion,
  Spinner,
  Card,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { MIMETypes } from "../../data/mimeTypes";
import MultiSelect from "../common/multiSelect";

interface AttributeFormProps {
  attributeId: string;
  entityId: string;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({ attributeId, entityId }) => {
  const [attribute, setAttribute] = React.useState<any>(null);
  const [attributes, setAttributes] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = attributeId ? "Edit Attribute" : "Create Attribute";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({
      title: "Attribute",
      subText: "Manage your attribute here",
    });
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    if (attributeId) {
      handleSetAttributes();
      handleSetAttribute();
    }
  }, [API]);

  const handleSetAttribute = () => {
    setShowSpinner(true);

    API.Attribute.getOne(attributeId)
      .then((res) => {
        setAttribute(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET attribute error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };
  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };
  const handleSetAttributes = () => {
    setShowSpinner(true);

    API.Attribute.getAllFromEntity(entityId)
      .then((res) => {
        setAttributes(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET attributes error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const saveAttribute = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let attributeEnum = retrieveFormArrayAsOArray(event.target, "enum");
    let fileTypes = retrieveFormArrayAsOArray(event.target, "fileTypes");
    let allOf = retrieveFormArrayAsOArray(event.target, "allOf");
    let anyOf = retrieveFormArrayAsOArray(event.target, "anyOf");
    let oneOf = retrieveFormArrayAsOArray(event.target, "oneOf");
    let forbiddenIf = retrieveFormArrayAsOArray(event.target, "forbiddenIf");
    let requiredIf = retrieveFormArrayAsObject(event.target, "requiredIf");
    let objectConfig = retrieveFormArrayAsObject(event.target, "objectConfig");

    let body: {} = {
      entity: `/admin/entities/${entityId}`,
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      type: event.target.type.value,
      format: event.target.format.value ?? null,
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
      defaultValue: event.target.defaultValue.value ?? null,
      example: event.target.example.value ?? null,
      maxFileSize: event.target.maxFileSize.value ? parseInt(event.target.maxFileSize.value) : null,
      multipleOf: event.target.multipleOf.value ? parseInt(event.target.multipleOf.value) : null,
      maximum: event.target.maximum.value ? parseInt(event.target.maximum.value) : null,
      minimum: event.target.minimum.value ? parseInt(event.target.minimum.value) : null,
      exclusiveMaximum: event.target.exclusiveMaximum.checked,
      exclusiveMinimum: event.target.exclusiveMinimum.checked,
      maxLength: event.target.maxLength.value ? parseInt(event.target.maxLength.value) : null,
      minLength: event.target.minLength.value ? parseInt(event.target.minLength.value) : null,
      maxItems: event.target.maxItems.value ? parseInt(event.target.maxItems.value) : null,
      minItems: event.target.minItems.value ? parseInt(event.target.minItems.value) : null,
      maxDate: event.target.maxDate.value ?? null,
      minDate: event.target.minDate.value ?? null,
      uniqueItems: event.target.uniqueItems.checked,
      minProperties: event.target.minProperties.value ? parseInt(event.target.minProperties.value) : null,
      maxProperties: event.target.maxProperties.value ?? null,
      fileTypes,
      attributeEnum,
      allOf,
      oneOf,
      anyOf,
      forbiddenIf,
      requiredIf,
      objectConfig,
    };

    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["type"]])) {
      setAlert({ type: "danger", message: "Required fields are empty" });
      setLoadingOverlay(false);
      return;
    }

    if (!attributeId) {
      // unset id means we're creating a new entry
      API.Attribute.create(body)
        .then(() => {
          setAlert({ message: "Saved attribute", type: "success" });
          navigate(`/entities/${entityId}`);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Create application error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }

    if (attributeId) {
      // set id means we're updating a existing entry
      API.Attribute.update(body, attributeId)
        .then((res) => {
          setAlert({ message: "Updated attribute", type: "success" });
          setAttribute(res.data);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Update application error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }
  };

  return (
    <form id="attributeForm" onSubmit={saveAttribute}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#attributeHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <Modal
                  title="Attribute Documentation"
                  id="attributeHelpModal"
                  body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
                />
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Link className="utrecht-link" to={`/entities/${entityId}`} state={{activeTab: "attributes"}}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
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
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={attribute && attribute.name && attribute.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "String", value: "string" },
                            { name: "Array", value: "array" },
                            { name: "Integer", value: "integer" },
                            { name: "Boolean", value: "boolean" },
                            { name: "Object", value: "object" },
                            { name: "Date", value: "date" },
                            { name: "Datetime", value: "datetime" },
                            { name: "Number", value: "number" },
                            { name: "Float", value: "float" },
                            { name: "File", value: "file" },
                          ]}
                          name={"type"}
                          id={"typeInput"}
                          nameOverride={"Type"}
                          data={attribute && attribute.type && attribute.type}
                          required
                        />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-6">
                        {attributes !== null && attributes.length > 0 ? (
                          <>
                            {attribute !== null &&
                            attribute.inversedBy !== undefined &&
                            attribute.inversedBy !== null ? (
                              <SelectInputComponent
                                options={attributes}
                                data={attribute.inversedBy.name}
                                name={"inversedBy"}
                                id={"inversedByInput"}
                                nameOverride={"inversedBy"}
                                value={"/admin/attributes/"}
                              />
                            ) : (
                              <SelectInputComponent
                                options={attributes}
                                name={"inversedBy"}
                                id={"inversedByInput"}
                                nameOverride={"inversedBy"}
                                value={"/admin/attributes/"}
                              />
                            )}
                          </>
                        ) : (
                          <SelectInputComponent
                            options={[{ name: "Please create a attribute to use inversedBy", value: null }]}
                            name={"inversedBy"}
                            id={"inversedByInput"}
                            nameOverride={"inversedBy"}
                          />
                        )}
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "Email", value: "email" },
                            { name: "Phone", value: "phone" },
                            { name: "Country code", value: "country code" },
                            { name: "BSN", value: "bsn" },
                            { name: "Url", value: "url" },
                            { name: "UUID", value: "uuid" },
                            { name: "Json", value: "json" },
                          ]}
                          name={"format"}
                          id={"formatInput"}
                          nameOverride={"Format"}
                          data={attribute && attribute.format && attribute.format}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"defaultValue"}
                          id={"defaultValueInput"}
                          data={attribute && attribute.defaultValue && attribute.defaultValue}
                          nameOverride={"Default Value"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"multipleOf"}
                          id={"multipleOfInput"}
                          data={attribute && attribute.multipleOf && attribute.multipleOf}
                          nameOverride={"Multiple Of"}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"minimum"}
                          id={"minimumInput"}
                          data={attribute && attribute.minimum && attribute.minimum}
                          nameOverride={"Minimum"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"maximum"}
                          id={"maximumInput"}
                          data={attribute && attribute.maximum && attribute.maximum}
                          nameOverride={"Maximum"}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"exclusiveMinimumInput"}
                            nameLabel={"Exclusive minimum"}
                            nameAttribute={"exclusiveMinimum"}
                            data={attribute && attribute.exclusiveMinimum && attribute.exclusiveMinimum}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"exclusiveMaximumInput"}
                            nameLabel={"Exclusive Maximum"}
                            nameAttribute={"exclusiveMaximum"}
                            data={attribute && attribute.exclusiveMaximum && attribute.exclusiveMaximum}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"minLength"}
                          id={"minLengthInput"}
                          data={attribute && attribute.minLength && attribute.minLength}
                          nameOverride={"MinLength"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"maxLength"}
                          id={"maxLengthInput"}
                          data={attribute && attribute.maxLength && attribute.maxLength}
                          nameOverride={"MaxLength"}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"minItems"}
                          id={"minItemsInput"}
                          data={attribute && attribute.minItems && attribute.minItems}
                          nameOverride={"MinItems"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"maxItems"}
                          id={"maxItemsInput"}
                          data={attribute && attribute.maxItems && attribute.maxItems}
                          nameOverride={"MaxItems"}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"minDate"}
                          id={"minDateInput"}
                          data={attribute && attribute.minDate && attribute.minDate}
                          nameOverride={"MinDate"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"maxDate"}
                          id={"maxDateInput"}
                          data={attribute && attribute.maxDate && attribute.maxDate}
                          nameOverride={"MaxDate"}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"minProperties"}
                          id={"minPropertiesInput"}
                          data={attribute && attribute.minProperties && attribute.minProperties}
                          nameOverride={"Min Properties"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"maxProperties"}
                          id={"maxPropertiesInput"}
                          data={attribute && attribute.maxProperties && attribute.maxProperties}
                          nameOverride={"Max Properties"}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"example"}
                          id={"exampleInput"}
                          data={attribute && attribute.example && attribute.example}
                          nameOverride={"Example"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"maxFileSize"}
                          id={"maxFileSizeInput"}
                          data={attribute && attribute.maxFileSize && attribute.maxFileSize}
                          nameOverride={"Max File Size"}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
                          defaultValue={attribute?.description}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"persistToGatewayInput"}
                            nameLabel={"Persist To Gateway"}
                            nameAttribute={"persistToGateway"}
                            data={attribute && attribute.persistToGateway && attribute.persistToGateway}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"cascadeInput"}
                            nameLabel={"Cascade"}
                            nameAttribute={"cascade"}
                            data={attribute && attribute.cascade && attribute.cascade}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"requiredInput"}
                            nameLabel={"Required"}
                            nameAttribute={"required"}
                            data={attribute && attribute.required && attribute.required}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"searchableInput"}
                            nameLabel={"Searchable"}
                            nameAttribute={"searchable"}
                            data={attribute && attribute.searchable && attribute.searchable}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"mustBeUniqueInput"}
                            nameLabel={"Must Be Unique"}
                            nameAttribute={"mustBeUnique"}
                            data={attribute && attribute.mustBeUnique && attribute.mustBeUnique}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"uniqueItemsInput"}
                            nameLabel={"Unique Items"}
                            nameAttribute={"uniqueItems"}
                            data={attribute && attribute.uniqueItems && attribute.uniqueItems}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"multipleInput"}
                            nameLabel={"Multiple"}
                            nameAttribute={"multiple"}
                            data={attribute && attribute.multiple && attribute.multiple}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"nullableInput"}
                            nameLabel={"Nullable"}
                            nameAttribute={"nullable"}
                            data={attribute && attribute.nullable && attribute.nullable}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"readOnlyInput"}
                            nameLabel={"Read Only"}
                            nameAttribute={"readOnly"}
                            data={attribute && attribute.readOnly && attribute.readOnly}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"writeOnlyInput"}
                            nameLabel={"Write Only"}
                            nameAttribute={"writeOnly"}
                            data={attribute && attribute.writeOnly && attribute.writeOnly}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"deprecatedInput"}
                            nameLabel={"Deprecated"}
                            nameAttribute={"deprecated"}
                            data={attribute && attribute.deprecated && attribute.deprecated}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                    </div>
                    <Accordion
                      id="attributeAccordion"
                      items={[
                        {
                          title: "Object Config",
                          id: "objectConfigAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"objectConfig"}
                                label={"Object Config"}
                                data={
                                  attribute && attribute.objectConfig
                                    ? [
                                        {
                                          key: "objectConfig",
                                          value: attribute.objectConfig,
                                        },
                                      ]
                                    : null
                                }
                              />
                            );
                          },
                        },
                        {
                          title: "File Types",
                          id: "fileTypesAccordion",
                          render: function () {
                            return (
                              <MultiSelect
                                id="fileTypes"
                                label="File Types"
                                data={attribute?.fileTypes}
                                options={MIMETypes}
                              />
                            );
                          },
                        },
                        {
                          title: "Enum",
                          id: "enumAccordion",
                          render: function () {
                            return <ElementCreationNew id={"enum"} label={"Enum"} data={attribute?.enum} />;
                          },
                        },
                        {
                          title: "Required If",
                          id: "requiredIfAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"requiredIf"}
                                label={"Required If"}
                                data={
                                  attribute && attribute.requiredIf
                                    ? [
                                        {
                                          key: "requiredIf",
                                          value: attribute.requiredIf,
                                        },
                                      ]
                                    : null
                                }
                              />
                            );
                          },
                        },
                        {
                          title: "Forbidden If",
                          id: "forbiddenIfAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id={"forbiddenIf"}
                                label={"Forbidden If"}
                                data={attribute?.forbiddenIf}
                              />
                            );
                          },
                        },
                        {
                          title: "All Of",
                          id: "allOfAccordion",
                          render: function () {
                            return <ElementCreationNew label={"All Of"} id={"allOf"} data={attribute?.allOf} />;
                          },
                        },
                        {
                          title: "Any Of",
                          id: "anyOfAccordion",
                          render: function () {
                            return <ElementCreationNew label={"Any Of"} id={"anyOf"} data={attribute?.anyOf} />;
                          },
                        },
                        {
                          title: "One Of",
                          id: "oneOfAccordion",
                          render: function () {
                            return <ElementCreationNew label={"One Of"} id={"oneOf"} data={attribute?.oneOf} />;
                          },
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
};

export default AttributeForm;
