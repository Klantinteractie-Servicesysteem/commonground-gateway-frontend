import * as React from "react"
import { useEffect, useState } from "react";
import Layout from "../../components/common/layout";
import ActionMenu from "../../components/common/actionMenu";
import {useUrlContext} from "../../context/urlContext";

const IndexPage = (props) => {
  const context = useUrlContext();
  let id = props.params.id;
  let pageDescription = "Create your new source on this page";

  if (id != "new") {
    pageDescription = "Edit your source on this page.";
  }

  const [source, setSource] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSource = () => {
    fetch(context.apiUrl + "/gateways/" + id, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        setSource(data);
      });
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
        console.log('Saved source:', data);
        setSource(data);
        setShowSpinner(false);
      })
      .catch ((error) => {
         console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (id != "new") {
      getSource();
    }
  }, []);

  return (
      <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            {
              source !== null && source.name !== null ?
                <title>Sources - {source.name}</title> :
                <title>Sources - {id}</title>
            }
            <div className="row">
              <div className="col-8">
                {
                  source !== null && source.name !== null ?
                    <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">{source.name}</h1> :
                    <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">{id}</h1>
                }
              </div>
              <div className="col-4">
                <button className="utrecht-button float-right" type="button" onClick={saveSource}>Save</button>
              </div>
            </div>
              
            { showSpinner === false ?
              <form id="dataForm" onSubmit={saveSource} >
                <span class="utrecht-form-label">Name</span>
                {
                  source !== null && source.name !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" defaultValue={source.name} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" />
                }
                <span class="utrecht-form-label">Location (url)</span>
                {
                  source !== null && source.location !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location" id="locationInput" defaultValue={source.location} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location" id="locationInput" />
                }
                <span class="utrecht-form-label">Auth</span>
                <select name="auth" id="authInput" class="utrecht-select utrecht-select--html-select">
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
                <span class="utrecht-form-label">Locale</span>
                {
                  source !== null && source.locale !== null ?
                    <input maxLength="10" className="utrecht-textbox utrecht-textbox--html-input" name="locale" id="localeInput" defaultValue={source.locale} /> :
                    <input maxLength="10" className="utrecht-textbox utrecht-textbox--html-input" name="locale" id="localeInput" />
                }
                <span class="utrecht-form-label">Accept (accept header used for this source)</span>
                {
                  source !== null && source.accept !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="accept" id="acceptInput" defaultValue={source.accept} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="accept" id="acceptInput" />
                }
                <span class="utrecht-form-label">Jwt (used for auth if auth is jwt)</span>
                {
                  source !== null && source.jwt !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput" defaultValue={source.jwt} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput" />
                }
                <span class="utrecht-form-label">Jwt ID (used for auth if auth is jwt)</span>
                {
                  source !== null && source.JwtId !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId" id="jwtIdInput" defaultValue={source.jwtId} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId" id="jwtIdInput" />
                }
                <span class="utrecht-form-label">Secret (used for auth if auth is jwt)</span>
                {
                  source !== null && source.secret !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="secret" id="secretInput" defaultValue={source.secret} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="secret" id="secretInput" />
                }
                <span class="utrecht-form-label">Username (used for auth if auth is username-password)</span>
                {
                  source !== null && source.username !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="username" id="usernameInput" defaultValue={source.username} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="username" id="usernameInput" />
                }
                <span class="utrecht-form-label">Password (used for auth if auth is username-password)</span>
                {
                  source !== null && source.password !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password" id="passwordInput" defaultValue={source.password} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password" id="passwordInput" />
                }
                <span class="utrecht-form-label">Apikey (used for auth if auth is api key)</span>
                {
                  source !== null && source.apikey !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey" id="apikeyInput" defaultValue={source.apikey} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey" id="apikeyInput" />
                }
                <span class="utrecht-form-label">Documentation (url)</span>
                {
                  source !== null && source.documentation !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation" id="documentationInput" defaultValue={source.documentation} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation" id="documentationInput" />
                }
              </form> :
              <p class="utrecht-paragraph">Saving..</p>
            }
         </div>
        </div>
        </main>
      </Layout>

  )
}

export default IndexPage
