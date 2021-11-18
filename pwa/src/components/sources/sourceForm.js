import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {Link} from "gatsby"
import {createElement} from "../utility/elementCreation";

export default function SourceForm({id}) {
  const context = useUrlContext();
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const getSource = () => {
    fetch(context.apiUrl + "/gateways/" + id, {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then((data) => {
        setSource(data);
      });
  }

  const addProperty = () => {
    let key = document.getElementById('newKey');
    let value = document.getElementById('newValue');
    let form = document.getElementById('newInputs');
    //create row
    let formGroupRow = createElement('div', null, null, ['row'], null)

    //set classNames for elements
    let classNameInput = ['utrecht-textbox', 'utrecht-textbox--html-input'];
    let classNameButton = ['utrecht-button', 'utrecht-button-sm', 'btn-sm', 'btn-danger'];

    //create input key
    let formGroupColKey = createElement('div', null, null, ['col-5'], null);
    let formGroupKey = createElement('div', null, null, ['form-group'], null);
    let inputKey = createElement('input', key.value, key.type, classNameInput, null);

    // create input value
    let formGroupColValue = createElement('div', null, null, ['col-5'], null);
    let formGroupValue = createElement('div', null, null, ['from-group'], null);
    let inputValue = createElement('input', value.value, value.type, classNameInput, null);

    //create delete button
    let formGroupButton = createElement('div', null, null, ['col-2'], null);
    let deleteButton = createElement('button', key.value, 'button', classNameButton, {deleteProperty});

    if (key.value.length > 0 && value.value.length > 0) {
      // adds the inputs in the div form-group
      formGroupKey.appendChild(inputKey);
      formGroupValue.appendChild(inputValue);
      // adds the elements in in the col
      formGroupColKey.appendChild(formGroupKey);
      formGroupColValue.appendChild(formGroupValue);
      formGroupButton.appendChild(deleteButton);
      // adds the elements in the row
      formGroupRow.appendChild(formGroupColKey);
      formGroupRow.appendChild(formGroupColValue);
      formGroupRow.appendChild(formGroupButton);
      // adds the row to the newInputs div
      form.appendChild(formGroupRow)
    }

    key.value = '';
    value.value = '';
  }

  const deleteProperty = (id) => {
    let formRow = document.getElementById('newInputs');
    formRow.remove();
  }

  const saveSource = () => {
    setShowSpinner(true);

    let url = context.apiUrl + '/gateways';
    let method = 'POST';
    if (id != 'new') {
      url = url + '/' + id;
      method = 'PUT';
    }

    let nameInput = document.getElementById('nameInput');
    let locationInput = document.getElementById('locationInput');
    let authInput = document.getElementById('authInput');
    let localeInput = document.getElementById('localeInput');
    let acceptInput = document.getElementById('acceptInput');
    let jwtInput = document.getElementById('jwtInput');
    let jwtIdInput = document.getElementById('jwtIdInput');
    let secretInput = document.getElementById('secretInput');
    let usernameInput = document.getElementById('usernameInput');
    let passwordInput = document.getElementById('passwordInput');
    let apikeyInput = document.getElementById('apikeyInput');
    let documentationInput = document.getElementById('documentationInput');
    let authorizationHeaderInput = document.getElementById('authorizationHeaderInput');
    let authorizationPassthroughMethodInput = document.getElementById('authorizationPassthroughMethodInput');
    // let authorizationHeaderInput = document.getElementById('authorizationHeaderInput');

    let body = {
      name: nameInput.value,
      location: locationInput.value,
      auth: authInput.value,
      locale: localeInput.value,
      accept: acceptInput.value,
      jwt: jwtInput.value,
      jwtId: jwtIdInput.value,
      secret: secretInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      apikey: apikeyInput.value,
      documentation: documentationInput.value,
      authorizationHeader: authorizationHeaderInput.value,
      authorizationPassthroughMethod: authorizationPassthroughMethodInput.value
    }

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        setSource(data);
        setShowSpinner(false);
        this.props.history.push('/sources')
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  React.useEffect(() => {
    if (id !== "new") {
      getSource();
    }
  }, []);

  return (
    <div className="utrecht-card card">
      <form id="dataForm" onSubmit={saveSource}>
        <div className="utrecht-card-header card-header">
          <div className="utrecht-card-head-row card-head-row row">
            <div className="col-6">
              <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Values</h4>
            </div>
            <div className="col-6 text-right">
              <Link className="utrecht-link" to="/sources">
                <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2"><i
                  className="fas fa-long-arrow-alt-left mr-2"></i>Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit"><i
                className="fas fa-save mr-2"></i>Save
              </button>
            </div>
          </div>
        </div>
        <div className="utrecht-card-body card-body">
          <div className="row">
            <div className="col-12">
              {
                showSpinner === true ?
                  <div className="text-center py-5">
                    <div class="spinner-border text-primary" style={{width: "3rem", height: "3rem"}} role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div> :
                  <>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label mb-2">Name *</span>
                          {
                            source !== null && source.name !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput"
                                     defaultValue={source.name} required/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput"
                                     required/>
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Location (url) *</span>
                          {
                            source !== null && source.location !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="location"
                                     id="locationInput" defaultValue={source.location} required/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="location"
                                     id="locationInput" required/>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Accept (accept header used for this source)</span>
                          {
                            source !== null && source.accept !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="accept"
                                     id="acceptInput" defaultValue={source.accept}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="accept"
                                     id="acceptInput"/>
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Locale</span>
                          {
                            source !== null && source.locale !== null ?
                              <input maxLength="10" className="utrecht-textbox utrecht-textbox--html-input"
                                     name="locale"
                                     id="localeInput" defaultValue={source.locale}/> :
                              <input maxLength="10" className="utrecht-textbox utrecht-textbox--html-input"
                                     name="locale"
                                     id="localeInput"/>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <span className="utrecht-form-label">Auth *</span>
                      <select name="auth" id="authInput" class="utrecht-select utrecht-select--html-select" required>
                        <option value=""></option>
                        {
                          source !== null && source.auth !== null && source.auth == "apikey" ?
                            <option selected value="apikey">API key</option> :
                            <option value="apikey">API key</option>
                        }
                        {
                          source !== null && source.auth !== null && source.auth == "jwt" ?
                            <option selected value="jwt">JWT</option> :
                            <option value="jwt">JWT</option>
                        }
                        {
                          source !== null && source.auth !== null && source.auth == "username-password" ?
                            <option selected value="username-password">Username password</option> :
                            <option value="username-password">Username password</option>
                        }
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <div className="form-group">
                          <span className="utrecht-form-label">Jwt (used for auth if auth is jwt)</span>
                          {
                            source !== null && source.jwt !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput"
                                     defaultValue={source.jwt}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput"/>
                          }
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <span className="utrecht-form-label">Jwt ID (used for auth if auth is jwt)</span>
                          {
                            source !== null && source.JwtId !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId"
                                     id="jwtIdInput"
                                     defaultValue={source.jwtId}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId"
                                     id="jwtIdInput"/>
                          }
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <span className="utrecht-form-label">Secret (used for auth if auth is jwt)</span>
                          {
                            source !== null && source.secret !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="secret"
                                     id="secretInput" defaultValue={source.secret}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="secret"
                                     id="secretInput"/>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                        <span
                          className="utrecht-form-label">Username (used for auth if auth is username-password)</span>
                          {
                            source !== null && source.username !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="username"
                                     id="usernameInput" defaultValue={source.username}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="username"
                                     id="usernameInput"/>
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                        <span
                          className="utrecht-form-label">Password (used for auth if auth is username-password)</span>
                          {
                            source !== null && source.password !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" type="password"
                                     name="password" id="passwordInput" defaultValue={source.password}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" type="password"
                                     name="password" id="passwordInput"/>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Apikey (used for auth if auth is api key)</span>
                          {
                            source !== null && source.apikey !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey"
                                     id="apikeyInput" defaultValue={source.apikey}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey"
                                     id="apikeyInput"/>
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Documentation (url)</span>
                          {
                            source !== null && source.documentation !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation"
                                     id="documentationInput" defaultValue={source.documentation}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation"
                                     id="documentationInput"/>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Authorization header</span>
                          {
                            source !== null && source.authorizationHeader !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="authorizationHeader"
                                     id="authorizationHeaderInput" defaultValue={source.authorizationHeader}/> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="authorizationHeader"
                                     id="authorizationHeaderInput"/>
                          }
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">Authorization pass through method </span>
                          <select name="authorizationPassthroughMethod" id="authorizationPassthroughMethodInput"
                                  className="utrecht-select utrecht-select--html-select">
                            {
                              source !== null && source.authorizationPassthroughMethod !== null ?
                                <option selected value={source.authorizationPassthroughMethod}
                                        id="authorizationPassthroughMethodInput"
                                        name="authorizationPassthroughMethod">{source.authorizationPassthroughMethod}</option> :
                                <option selected value="" id="authorizationPassthroughMethodInput"
                                        name="authorizationPassthroughMethod"></option>
                            }
                            {
                              source !== null && source.authorizationPassthroughMethod !== null && source.authorizationPassthroughMethod === "header" ?
                                <option selected value="header"
                                        id="authorizationPassthroughMethodInput">Header</option> :
                                <option value="header" id="authorizationPassthroughMethodInput">Header</option>
                            }
                            {
                              source !== null && source.authorizationPassthroughMethod !== null && source.authorizationPassthroughMethod === "header" ?
                                <option selected value="query" id="authorizationPassthroughMethodInput">Query</option> :
                                <option value="query" id="authorizationPassthroughMethodInput">Query</option>
                            }
                          </select>
                        </div>
                      </div>
                      <span className="utrecht-form-label">Headers</span>
                      <div id={'newInputs'}/>
                      <br/>
                      <div className="separator-solid"/>
                      <h5>
                        Add Headers
                      </h5>
                      <div className="row">
                        <div className="col-4">
                          <div className="form-group">
                            <span className="utrecht-form-label">Key</span>
                            <input type="text" id="newKey" className="form-control"/>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <span className="utrecht-form-label">Value</span>
                            <input type="text" id="newValue" className="form-control"/>
                          </div>
                        </div>
                        <div className="col-2">
                          <button type={"button"} className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
                                  onClick={addProperty}>Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
