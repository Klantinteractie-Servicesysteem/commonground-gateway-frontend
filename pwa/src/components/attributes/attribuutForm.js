import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {useEffect, useState} from "react";

export default function AttributeForm({id}) {
  const context = useUrlContext();
  const [attribute, setAttribute] = React.useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

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

    // get the inputs and check if set other set null
    let body = {
      name: event.target.name.value,
      description: event.target.description.value ? event.target.description.value : null,
      type: event.target.type.value,
      persistToGateway: event.target.persistToGateway.value ? event.target.persistToGateway.value : null,
      // cascade: event.target.cascade.value ? event.target.cascade.value : null,
      searchable: event.target.searchable.value ? event.target.searchable.value : null,
      required: event.target.required.value ? event.target.required.value : null,
      mustBeUnique: event.target.mustBeUnique.value ? event.target.mustBeUnique.value : null,
      default: event.target.default.value ? event.target.default.value : null,
      multipleOf: event.target.multipleOf.value ? parseInt(event.target.multipleOf.value) : null,
      maximum: event.target.maximum.value ? parseInt(event.target.maximum.value) : null,
      minimum: event.target.minimum.value ? parseInt(event.target.minimum.value) : null,
      exclusiveMaximum: event.target.exclusiveMaximum.value ? event.target.exclusiveMaximum.value : null,
      exclusiveMinimum: event.target.exclusiveMinimum.value ? event.target.exclusiveMinimum.value : null,
      maxLength: event.target.maxLength.value ? parseInt(event.target.maxLength.value) : null,
      minLength: event.target.minLength.value ? parseInt(event.target.minLength.value) : null,
      maxItems: event.target.maxItems.value ? parseInt(event.target.maxItems.value) : null,
      minItems: event.target.minItems.value ? parseInt(event.target.minItems.value) : null,
      maxDate: event.target.maxDate.value ? event.target.maxDate.value : null,
      minDate: event.target.minDate.value ? event.target.minDate.value : null,
      uniqueItems: event.target.uniqueItems.value ? event.target.uniqueItems.value : null,
      minProperties: event.target.minProperties.value ? parseInt(event.target.minProperties.value) : null,
      // enum: event.target.enum.value ? event.target.enum.value : null,
      allOf: event.target.allOf.value ? event.target.allOf.value : null,
      oneOf: event.target.oneOf.value ? event.target.oneOf.value : null,
      anyOf: event.target.anyOf.value ? event.target.anyOf.value : null,
      not: event.target.not.value ? event.target.not.value : null,
      // items: event.target.items.value,
      additionalProperties: event.target.additionalProperties.value ? event.target.additionalProperties.value : null,
      // requiredIf: event.target.requiredIf.value ? event.target.requiredIf.value : null,
    }

    // gets the inputs when there are set
    body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v != null));

    if (!checkInputs([body.name, body.type])) {
      return;
    }

    setShowSpinner(true);

    let url = context.apiUrl + '/attribute';
    let method = null;
    if (id === 'new') {
      method = 'POST';
    } else {
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
                        <option selected value={attribute.type} id="typeInput">{attribute.type}</option> :
                        <option selected value="" id="typeInput"> </option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "string" ?
                        <option selected value="string" id="typeInput">String</option> :
                        <option value="string" id="typeInput">String</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "array" ?
                        <option selected value="array" id="typeInput">Array</option> :
                        <option value="array" id="typeInput">Array</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "integer" ?
                        <option selected value="integer" id="typeInput">Integer</option> :
                        <option value="integer" id="typeInput">Integer</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "boolean" ?
                        <option selected value="boolean" id="typeInput">Boolean</option> :
                        <option value="boolean" id="typeInput">Boolean</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "object" ?
                        <option selected value="object" id="typeInput">Object</option> :
                        <option value="object" id="typeInput">Object</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "date" ?
                        <option selected value="date" id="typeInput">Date</option> :
                        <option value="date" id="typeInput">Date</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "datetime" ?
                        <option selected value="datetime" id="typeInput">Datetime</option> :
                        <option value="datetime" id="typeInput">Datetime</option>
                    }
                    {
                      attribute !== null && attribute.type !== null && attribute.type === "number" ?
                        <option selected value="number" id="typeInput">Number</option> :
                        <option value="number" id="typeInput">Number</option>
                    }
                  </select>
                </div>
                <div className="col-6">
                  <label htmlFor="formatInput">Format</label>
                  <select name="format" id="formatInput" className="utrecht-select utrecht-select--html-select">
                    {
                      attribute !== null && attribute.format !== null ?
                        <option selected value={attribute.format} id="formatInput">{attribute.format}</option> :
                        <option selected value="" id="formatInput"> </option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format === "email" ?
                        <option selected value="email" id="formatInput">Email</option> :
                        <option value="email" id="formatInput">Email</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format === "telephone" ?
                        <option selected value="telephone" id="formatInput">Telephone</option> :
                        <option value="telephone" id="formatInput">Telephone</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format === "countryCode" ?
                        <option selected value="countryCode" id="formatInput">Country code</option> :
                        <option value="countryCode" id="formatInput">Country code</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format === "bsn" ?
                        <option selected value="bsn" id="formatInput">Bsn</option> :
                        <option value="bsn" id="formatInput">Bsn</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format === "url" ?
                        <option selected value="url" id="formatInput">Url</option> :
                        <option value="url" id="formatInput">Url</option>
                    }
                     {
                      attribute !== null && attribute.format !== null && attribute.format === "uuid" ?
                        <option selected value="uuid" id="formatInput">Uuid</option> :
                        <option value="uuid" id="formatInput">Uuid</option>
                    }
                    {
                      attribute !== null && attribute.format !== null && attribute.format === "json" ?
                        <option selected value="json" id="formatInput">Json</option> :
                        <option value="json" id="formatInput">Json</option>
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
                        <input type="radio" id="persistToGatewayInput" name="persistToGateway" checked/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="persistToGatewayInput" name="persistToGateway"/>
                      </div>
                      :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="persistToGatewayInput" name="persistToGateway"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="persistToGatewayInput" name="persistToGateway"/>
                      </div>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="cascadeInput">Cascade</label>
                  {
                    attribute !== null && attribute.cascade !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="cascadeInput" name="cascade" checked/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="cascadeInput" name="cascade"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="cascadeInput" name="cascade"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="cascadeInput" name="cascade"/>
                      </div>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="searchableInput">Searchable</label>
                  {
                    attribute !== null && attribute.searchable !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="searchableInput" name="searchable" checked/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="searchableInput" name="searchable"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="searchableInput" name="searchable"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="searchableInput" name="searchable"/>
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
                  <label htmlFor="requiredInput">Required</label>
                  {
                    attribute !== null && attribute.required !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="requiredInput" name="required" checked value="true"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="requiredInput" name="required" value="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="requiredInput" name="required" value="true"/>
                        <label htmlFor="radio">False</label>
                        <input type="radio" id="requiredInput" name="required" value="false"/>
                      </div>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="mustBeUniqueInput">MustBeUnique</label>
                  {
                    attribute !== null && attribute.mustBeUnique !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="radio">True</label>
                        <input type="radio" id="mustBeUniqueInput" name="mustBeUnique" checked value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="mustBeUniqueInput" name="mustBeUnique" value="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="mustBeUniqueInput" name="mustBeUnique" value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="mustBeUniqueInput" name="mustBeUnique" value="false"/>
                      </div>}
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="defaultInput">Default</label>
                  {
                    attribute !== null && attribute.default !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="default" id="defaultInput"
                             defaultValue={attribute.default}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="default" id="defaultInput"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="multipleOfInput">MultipleOf</label>
                  {
                    attribute !== null && attribute.multipleOf !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="multipleOf"
                             id="multipleOfInput"
                             defaultValue={attribute.multipleOf} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="multipleOf"
                             id="multipleOfInput" type="number"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="maximumInput">Maximum</label>
                  {
                    attribute !== null && attribute.maximum !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maximum" id="maximumInput"
                             defaultValue={attribute.maximum} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maximum" id="maximumInput" type="number"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="minimumInput">Minimum</label>
                  {
                    attribute !== null && attribute.minimum !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minimum" id="minimumInput"
                             defaultValue={attribute.minimum} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minimum" id="minimumInput" type="number"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="exclusiveMaximumInput">ExclusiveMaximum</label>
                  {
                    attribute !== null && attribute.exclusiveMaximum !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="exclusiveMaximumInput" name="exclusiveMaximum" checked value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="exclusiveMaximumInput" name="exclusiveMaximum" value="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="exclusiveMaximumInput" name="exclusiveMaximum" value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="exclusiveMaximumInput" name="exclusiveMaximum" value="false"/>
                      </div>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="exclusiveMinimumInput">ExclusiveMinimum</label>
                  {
                    attribute !== null && attribute.exclusiveMinimum !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="exclusiveMinimumInput" name="exclusiveMinimum" checked value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="exclusiveMinimumInput" name="exclusiveMinimum" value="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="exclusiveMinimumInput" name="exclusiveMinimum" value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="exclusiveMinimumInput" name="exclusiveMinimum" value="false"/>
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
                             defaultValue={attribute.maxLength} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxLength"
                             id="maxLengthInput" type="number"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="minLengthInput">MinLength</label>
                  {
                    attribute !== null && attribute.minLength !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minLength"
                             id="minLengthInput"
                             defaultValue={attribute.minLength} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minLength"
                             id="minLengthInput" type="number"/>
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
                             defaultValue={attribute.maxItems} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="maxItems"
                             id="maxItemsInput" type="number"/>
                  }
                </div>
                <div className="col-6">
                  <label htmlFor="minItemsInput">MinItems</label>
                  {
                    attribute !== null && attribute.minItems !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minItems" id="minItemsInput"
                             defaultValue={attribute.minItems} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minItems"
                             id="minItemsInput" type="number"/>
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
                  <label htmlFor="uniqueItemsInput">UniqueItems</label>
                  {
                    attribute !== null && attribute.uniqueItems !== null ?
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="uniqueItemsInput" name="uniqueItems" checked value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="uniqueItemsInput" name="uniqueItems" value="false"/>
                      </div> :
                      <div className="utrecht-html">
                        <label htmlFor="true">True</label>
                        <input type="radio" id="uniqueItemsInput" name="uniqueItems" value="true"/>
                        <label htmlFor="false">False</label>
                        <input type="radio" id="uniqueItemsInput" name="uniqueItems" value="false"/>
                      </div>}
                </div>
                <div className="col-6">
                  <label htmlFor="minPropertiesInput">MinProperties</label>
                  {
                    attribute !== null && attribute.minProperties !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minProperties"
                             id="minPropertiesInput"
                             defaultValue={attribute.minProperties} type="number"/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="minProperties"
                             id="minPropertiesInput" type="number"/>
                  }
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="notInputInput">Not</label>
                  {
                    attribute !== null && attribute.not !== null ?
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="not" id="notInputInput"
                             defaultValue={attribute.not}/> :
                      <input className="utrecht-textbox utrecht-textbox--html-input" name="not" id="notInputInput"/>
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
                {/*<div className="col-6">*/}
                {/*  <label htmlFor="itemsInput">Items</label>*/}
                {/*  {*/}
                {/*    attribute !== null && attribute.items !== null ?*/}
                {/*      <input className="utrecht-textbox utrecht-textbox--html-input" name="items" id="itemsInput"*/}
                {/*             defaultValue={attribute.items}/> :*/}
                {/*      <input className="utrecht-textbox utrecht-textbox--html-input" name="items" id="itemsInput"/>*/}
                {/*  }*/}
                {/*</div>*/}
              </div>
              <br/>
              {/*<div className="row">*/}
                {/*<div className="col-6">*/}
                {/*  <label htmlFor="requiredIfInput">RequiredIf</label>*/}
                {/*  {*/}
                {/*    attribute !== null && attribute.requiredIf !== null ?*/}
                {/*      <input className="utrecht-textbox utrecht-textbox--html-input" name="requiredIf"*/}
                {/*             id="requiredIfInput"*/}
                {/*             defaultValue={attribute.requiredIf}/> :*/}
                {/*      <input className="utrecht-textbox utrecht-textbox--html-input" name="requiredIf"*/}
                {/*             id="requiredIfInput"/>*/}
                {/*  }*/}
                {/*</div>*/}
                {/*<div className="col-6">*/}
                {/*  <label htmlFor="enumInput">Enum</label>*/}
                {/*  {*/}
                {/*    attribute !== null && attribute.enum !== null ?*/}
                {/*      <input className="utrecht-textbox utrecht-textbox--html-input" name="enum" id="enumInput"*/}
                {/*             defaultValue={attribute.enum}/> :*/}
                {/*      <input className="utrecht-textbox utrecht-textbox--html-input" name="enum" id="enumInput"/>*/}
                {/*  }*/}
                {/*</div>*/}
              {/*</div>*/}
            </div>
          </div>
        </form> :
        <p className="utrecht-paragraph">Saving..</p>
      }
    </div>
  );
}
