import * as React from "react"
import { useEffect, useState } from "react";
import Layout from "../../components/common/layout";
import { Link } from "gatsby"
import { useUrlContext } from "../../context/urlContext";

const IndexPage = (props) => {
  const context = useUrlContext();
  let id = props.params.id;

  const [application, setApplication] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [title, setTitle] = useState("Application");

  const getApplication = () => {
    fetch(context.apiUrl + "/gateways/" + id, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        setApplication(data);
      });
  }

  const saveApplication = () => {
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
      documentation: documentationInput.value
    }

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved application:', data);
        setApplication(data);
        setShowSpinner(false);
        setTitle(application.name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (id != "new") {
      getApplication();
    }
  }, []);

  return (
    <Layout title={title} subtext={"Edit your source here"}>
      <main>


        <div className="row">
          <div className="col-12">


            <div className="utrecht-card card">

              <div className="utrecht-card-header card-header">
                <div className="utrecht-card-head-row card-head-row row">
                  <div className="col-6">
                    <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Values</h4>
                  </div>
                  <div className="col-6 text-right">
                    <Link className="utrecht-link" to="/application">
                      <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2"><i className="fas fa-long-arrow-alt-left mr-2"></i>Back</button>
                    </Link>
                    <a className="utrecht-link" onClick={saveApplication}>
                      <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i className="fas fa-save mr-2"></i>Save</button>
                    </a>
                  </div>
                </div>
              </div>
              <div className="utrecht-card-body card-body">
                <div className="row">
                  <div className="col-12">
                    {
                      showSpinner == true ?
                        <div className="text-center py-5">
                          <div class="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div> :
                        <form id="dataForm" onSubmit={saveApplication} >
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label mb-2">Name *</span>
                                {
                                  application !== null && application.name !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" defaultValue={application.name} required/> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" required/>
                                }
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label">Location (url) *</span>
                                {
                                  application !== null && application.location !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location" id="locationInput" defaultValue={application.location} required/> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location" id="locationInput" required/>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label">Accept (accept header used for this source)</span>
                                {
                                  application !== null && application.accept !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="accept" id="acceptInput" defaultValue={application.accept} /> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="accept" id="acceptInput" />
                                }
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label">Locale</span>
                                {
                                  application !== null && application.locale !== null ?
                                    <input maxLength="10" className="utrecht-textbox utrecht-textbox--html-input" name="locale" id="localeInput" defaultValue={application.locale} /> :
                                    <input maxLength="10" className="utrecht-textbox utrecht-textbox--html-input" name="locale" id="localeInput" />
                                }
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <span className="utrecht-form-label">Auth *</span>
                            <select name="auth" id="authInput" class="utrecht-select utrecht-select--html-select" required>
                              <option value=""></option>
                              {
                                application !== null && application.auth !== null && application.auth == "apikey" ?
                                  <option selected value="apikey">API key</option> :
                                  <option value="apikey">API key</option>
                              }
                              {
                                application !== null && application.auth !== null && application.auth == "jwt" ?
                                  <option selected value="jwt">JWT</option> :
                                  <option value="jwt">JWT</option>
                              }
                              {
                                application !== null && application.auth !== null && application.auth == "username-password" ?
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
                                  application !== null && application.jwt !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput" defaultValue={application.jwt} /> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput" />
                                }
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="form-group">
                                <span className="utrecht-form-label">Jwt ID (used for auth if auth is jwt)</span>
                                {
                                  application !== null && application.JwtId !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId" id="jwtIdInput" defaultValue={application.jwtId} /> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId" id="jwtIdInput" />
                                }
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="form-group">
                                <span className="utrecht-form-label">Secret (used for auth if auth is jwt)</span>
                                {
                                  application !== null && application.secret !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="secret" id="secretInput" defaultValue={application.secret} /> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="secret" id="secretInput" />
                                }
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label">Username (used for auth if auth is username-password)</span>
                                {
                                  application !== null && application.username !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="username" id="usernameInput" defaultValue={application.username} /> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="username" id="usernameInput" />
                                }
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label">Password (used for auth if auth is username-password)</span>
                                {
                                  application !== null && application.password !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password" id="passwordInput" defaultValue={application.password} /> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password" id="passwordInput" />
                                }
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <span className="utrecht-form-label">Apikey (used for auth if auth is api key)</span>
                            {
                              application !== null && application.apikey !== null ?
                                <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey" id="apikeyInput" defaultValue={application.apikey} /> :
                                <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey" id="apikeyInput" />
                            }
                          </div>
                          <div className="form-group">
                            <span className="utrecht-form-label">Documentation (url)</span>
                            {
                              application !== null && application.documentation !== null ?
                                <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation" id="documentationInput" defaultValue={application.documentation} /> :
                                <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation" id="documentationInput" />
                            }
                          </div>
                        </form>
                    }
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </main>
    </Layout>

  )
}

export default IndexPage
