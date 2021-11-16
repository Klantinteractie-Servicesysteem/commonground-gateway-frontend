import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {useEffect, useState} from "react";

export default function AttributeForm({id}) {
  const context = useUrlContext();
  const [attribute, setAttribute] = React.useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  if (id !== "new") {
    let pageDescription = "Edit your attribute on this page.";
  } else {
    let pageDescription = "Create your new attribute on this page";
  }

  const getAttribute = () => {
    fetch(context.apiUrl + "/attribute/" + id, {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then((data) => {
        setAttribute(data);
      });
  }

  const checkInputs = (inputs) => {
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].length === 0) {
        valid = false;
      }
    }

    return valid;
  }

  const saveAttribute = (event) => {

    event.preventDefault();

    let body = {
      name: event.target.name.value,
      description: event.target.description.value,
      type: event.target.type.value,
      persistToGateway: event.target.persistToGateway.value,
      cascade: event.target.cascade.value,
      searchable: event.target.searchable.value,
      required: event.target.required.value,
      mustBeUnique: event.target.mustBeUnique.value,
      default: event.target.default.value,
      multipleOf: event.target.multipleOf.value,
      maximum: event.target.maximum.value,
      minimum: event.target.minimum.value,
      exclusiveMaximum: event.target.exclusiveMaximum.value,
      exclusiveMinimum: event.target.exclusiveMinimum.value,
      maxLength: event.target.maxLength.value,
      minLength: event.target.minLength.value,
      maxItems: event.target.maxItems.value,
      minItems: event.target.minItems.value,
      maxDate: event.target.maxDate.value,
      minDate: event.target.minDate.value,
      uniqueItems: event.target.uniqueItems.value,
      minProperties: event.target.minProperties.value,
      enum: event.target.enum.value,
      allOf: event.target.allOf.value,
      oneOf: event.target.oneOf.value,
      anyOf: event.target.anyOf.value,
      not: event.target.not.value,
      items: event.target.items.value,
      additionalProperties: event.target.additionalProperties.value,
      requiredIf: event.target.requiredIf.value,
    }

    if (!checkInputs([body.name, body.type])) {
      return;
    }

    setShowSpinner(true);

    let url = context.apiUrl + '/attribute';
    let method = 'POST';
    if (id !== 'new') {
      url = url + '/' + id;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved attribute:', data);
        setAttribute(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (id !== "new") {
      getAttribute();
    }
  }, []);

  return (
    <div className="row">
      {showSpinner === false ?
        <form id="dataForm" onSubmit={saveAttribute}>
          <div className="col-12">
            <button className="utrecht-button float-right" type="submit">Save</button>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="nameInput">Name</label>
                  {
                    attribute !== null && attribute.name !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput"
                             defaultValue={attribute.name}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="descriptionInput">Description</label>
                  {
                    attribute !== null && attribute.description !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="description"
                             id="descriptionInput"
                             defaultValue={attribute.description}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="description"
                             id="descriptionInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="endpointInput">Type</label>
                  <select name="type" id="typeInput" className="utrecht-select utrecht-select--html-select">
                    {
                      attribute !== null && attribute.type !== null ?
                        <option selected value={attribute.type}>{attribute.type}</option> :
                        <option selected value=""></option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "string" ?
                        <option selected value="string">String</option> :
                        <option value="string">String</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "array" ?
                        <option selected value="array">Array</option> :
                        <option value="array">Array</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "integer" ?
                        <option selected value="integer">Integer</option> :
                        <option value="integer">Integer</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "boolean" ?
                        <option selected value="boolean">Boolean</option> :
                        <option value="boolean">Boolean</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "object" ?
                        <option selected value="object">Object</option> :
                        <option value="object">Object</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "date" ?
                        <option selected value="date">Date</option> :
                        <option value="date">Date</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "datetime" ?
                        <option selected value="datetime">Datetime</option> :
                        <option value="datetime">Datetime</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type == "number" ?
                        <option selected value="number">Number</option> :
                        <option value="number">Number</option>
                    }
                  </select>
                </div>
                <div className="col-6">
                  <label htmlFor="formatInput">Format</label>
                  <select name="format" id="formatInput" className="utrecht-select utrecht-select--html-select">
                    {
                      attribute !== null && attribute.format !== null ?
                        <option selected value={attribute.format}>{attribute.format}</option> :
                        <option selected value=""></option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "email" ?
                        <option selected value="email">Email</option> :
                        <option value="email">Email</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "telephone" ?
                        <option selected value="telephone">Telephone</option> :
                        <option value="telephone">Telephone</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "countryCode" ?
                        <option selected value="countryCode">Country code</option> :
                        <option value="countryCode">Country code</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "bsn" ?
                        <option selected value="bsn">Bsn</option> :
                        <option value="bsn">Bsn</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "url" ?
                        <option selected value="url">Url</option> :
                        <option value="url">Url</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "uuid" ?
                        <option selected value="uuid">Uuid</option> :
                        <option value="uuid">Uuid</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format == "json" ?
                        <option selected value="json">Json</option> :
                        <option value="json">Json</option>
                    }
                  </select>
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="persistToGatewayInput">PersistToGateway</label>
                  {
                    attribute !== null && attribute.persistToGateway !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="persistToGateway" name="true" checked/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="persistToGateway" name="false"/>
                      </div>
                      :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="persistToGateway" name="true"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="persistToGateway" name="false"/>
                      </div>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="cascadeInput">Cascade</label>
                  {
                    attribute !== null && attribute.cascade !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="cascade" name="true" checked/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="cascade" name="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="cascade" name="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="cascade" name="false"/>
                      </div>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="nameInput">Searchable</label>
                  {
                    attribute !== null && attribute.searchable !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="searchable" name="true" checked/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="searchable" name="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="searchable" name="true"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="searchable" name="false"/>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <br/>
          <br/>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="nameInput">Required</label>
                  {
                    attribute !== null && attribute.required !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="required" name="true" checked/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="required" name="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="required" name="true"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="required" name="false"/>
                      </div>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="nameInput">MustBeUnique</label>
                  {
                    attribute !== null && attribute.mustBeUnique !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="false" name="mustBeUnique" checked/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="true" name="mustBeUnique"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="false" name="mustBeUnique"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="true" name="mustBeUnique"/>
                      </div>}
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="nameInput">Default</label>
                  {
                    attribute !== null && attribute.default !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="default" id="defaultInput"
                             defaultValue={attribute.default}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="default" id="defaultInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="nameInput">MultipleOf</label>
                  {
                    attribute !== null && attribute.multipleOf !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="multipleOf"
                             id="multipleOfInput"
                             defaultValue={attribute.multipleOf}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="multipleOf"
                             id="multipleOfInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="nameInput">Maximum</label>
                  {
                    attribute !== null && attribute.maximum !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maximum" id="maximumInput"
                             defaultValue={attribute.maximum}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maximum" id="maximumInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="nameInput">Minimum</label>
                  {
                    attribute !== null && attribute.minimum !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minimum" id="minimumInput"
                             defaultValue={attribute.minimum}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minimum" id="minimumInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="exclusiveMaximum">ExclusiveMaximum</label>
                  {
                    attribute !== null && attribute.exclusiveMaximum !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="exclusiveMaximum" name="true" checked/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="exclusiveMaximum" name="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="exclusiveMaximum" name="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="exclusiveMaximum" name="false"/>
                      </div>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="exclusiveMinimum">ExclusiveMinimum</label>
                  {
                    attribute !== null && attribute.exclusiveMinimum !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="false" name="exclusiveMinimum" checked/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="true" name="exclusiveMinimum"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="false" name="exclusiveMinimum"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="true" name="exclusiveMinimum"/>
                      </div>}
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="maxLengthInput">MaxLength</label>
                  {
                    attribute !== null && attribute.maxLength !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxLength"
                             id="maxLengthInput"
                             defaultValue={attribute.maxLength}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxLength"
                             id="maxLengthInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="minLengthInput">MinLength</label>
                  {
                    attribute !== null && attribute.minLength !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minLength"
                             id="minLengthInput"
                             defaultValue={attribute.minLength}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minLength"
                             id="minLengthInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="maxItemsInput">MaxItems</label>
                  {
                    attribute !== null && attribute.maxItems !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxItems" id="maxItemsInput"
                             defaultValue={attribute.maxItems}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxItems"
                             id="maxItemsInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="minItemsInput">MinItems</label>
                  {
                    attribute !== null && attribute.minItems !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minItems" id="minItemsInput"
                             defaultValue={attribute.minItems}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minItems"
                             id="minItemsInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="maxDateInput">MaxDate</label>
                  {
                    attribute !== null && attribute.maxDate !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxDate" id="maxDateInput"
                             defaultValue={attribute.maxDate}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxDate" id="maxDateInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="minDateInput">MinDate</label>
                  {
                    attribute !== null && attribute.minDate !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minDate" id="minDateInput"
                             defaultValue={attribute.minDate}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minDate" id="minDateInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="uniqueItems">UniqueItems</label>
                  {
                    attribute !== null && attribute.uniqueItems !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="false" name="uniqueItems" checked/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="true" name="uniqueItems"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="false" name="uniqueItems"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="true" name="uniqueItems"/>
                      </div>}
                </div>
                <div className="col-6">
                  <label htmlFor="minPropertiesInput">MinProperties</label>
                  {
                    attribute !== null && attribute.minProperties !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minProperties"
                             id="minPropertiesInput"
                             defaultValue={attribute.minProperties}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minProperties"
                             id="minPropertiesInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="enumInput">Enum</label>
                  {
                    attribute !== null && attribute.enum !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="enum" id="enumInput"
                             defaultValue={attribute.enum}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="enum" id="enumInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="allOfInput">AllOf</label>
                  {
                    attribute !== null && attribute.allOf !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="allOf" id="allOfInput"
                             defaultValue={attribute.allOf}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="allOf" id="allOfInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="oneOfInput">OneOf</label>
                  {
                    attribute !== null && attribute.oneOf !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="oneOf" id="oneOfInput"
                             defaultValue={attribute.oneOf}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="oneOf" id="oneOfInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="anyOfInput">AnyOf</label>
                  {
                    attribute !== null && attribute.anyOf !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="anyOf" id="anyOfInput"
                             defaultValue={attribute.anyOf}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="anyOf" id="anyOfInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="notInput">Not</label>
                  {
                    attribute !== null && attribute.not !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="not" id="notInput"
                             defaultValue={attribute.not}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="not" id="notInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="itemsInput">Items</label>
                  {
                    attribute !== null && attribute.items !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="items" id="itemsInput"
                             defaultValue={attribute.items}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="items" id="itemsInput"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="additionalPropertiesInput">AdditionalProperties</label>
                  {
                    attribute !== null && attribute.additionalProperties !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="additionalProperties"
                             id="additionalPropertiesInput"
                             defaultValue={attribute.additionalProperties}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="additionalProperties"
                             id="additionalPropertiesInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="requiredIfInput">RequiredIf</label>
                  {
                    attribute !== null && attribute.requiredIf !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="requiredIf"
                             id="requiredIfInput"
                             defaultValue={attribute.requiredIf}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="requiredIf"
                             id="requiredIfInput"/>
                  }
                </div>
              </div>
            </div>
          </div>
        </form> :
        <p className="utrecht-paragraph">Saving..</p>
      }
    </div>
  );
}
