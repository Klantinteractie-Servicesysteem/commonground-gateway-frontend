import * as React from "react"
import { useEffect, useState } from "react";
import { Link } from "gatsby"
import Layout from "../../components/common/layout";
import ActionMenu from "../../components/common/actionMenu";
import {useUrlContext} from "../../context/urlContext";
import { getUser, isLoggedIn, logout } from "../../services/auth";

const IndexPage = (props) => {
  const context = useUrlContext();
  let id = props.params.id;
  let pageDescription = "Create your new source on this page";

  if (id != "new") {
    pageDescription = "Edit your source on this page.";
  }

  const [source, setSource] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  //useEffect(() => {
  //  if (typeof window !== "undefined") {
  //      getSources();
  //  }
  //}, []);

  //const getSources = () => {
  //  fetch(context.adminUrl + "/gateways", {
  //    credentials: 'include',
  //    headers: { 'Content-Type': 'application/json' },
  //  })
  //    .then(response => response.json())
  //    .then((data) => {
  //      if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
  //        setSources(data['hydra:member']);
  //      }
  //    });
  //}

  const saveSource = () => {
    setShowSpinner(true);
    //fetch(context.adminUrl + "/gateways", {
    //  method: "POST",
    //  credentials: 'include',
    //  headers: { 'Content-Type': 'application/json' },
    //})
    //  .then(response => response.json())
    //  .then((data) => {
    //    setSource(data);
    //    setShowSpinner(false);
    //  });
  }

  return (
      <Layout>
      <main>
        <div className="row">
          <div className="col-3">
            <ActionMenu pageDescription={pageDescription} />
           </div>
           <div className="col-9">
            <title>Sources - {id}</title>
            <div className="row">
              <div className="col-8">
                <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">{id}</h1>
              </div>
              <div className="col-4">
                <button className="utrecht-button float-right" type="button" onClick={saveSource} >Save</button>
              </div>
            </div>
              
            { showSpinner === false ?
              <form id="dataForm" onSubmit={saveSource} >
                <span class="utrecht-form-label">Name</span>
                {
                  source !== null && source.name !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" value={source.name} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" value={id} />
                }
                <span class="utrecht-form-label">Location</span>
                {
                  source !== null && source.location !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location" id="locationInput" value={source.location} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location" id="locationInput" />
                }
                <span class="utrecht-form-label">Auth</span>
                {
                  source !== null && source.auth !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="auth" id="authInput" value={source.auth} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="auth" id="authInput" />
                }
                <span class="utrecht-form-label">Locale</span>
                {
                  source !== null && source.locale !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="locale" id="localeInput" value={source.locale} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="locale" id="localeInput" />
                }
                <span class="utrecht-form-label">Accept</span>
                {
                  source !== null && source.accept !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="accept" id="acceptInput" value={source.accept} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="accept" id="acceptInput" />
                }
                <span class="utrecht-form-label">Jwt</span>
                {
                  source !== null && source.jwt !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput" value={source.jwt} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwt" id="jwtInput" />
                }
                <span class="utrecht-form-label">JwtId</span>
                {
                  source !== null && source.JwtId !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId" id="jwtIdInput" value={source.jwtId} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="jwtId" id="jwtIdInput" />
                }
                <span class="utrecht-form-label">Secret</span>
                {
                  source !== null && source.secret !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="secret" id="secretInput" value={source.secret} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="secret" id="secretInput" />
                }
                <span class="utrecht-form-label">Username</span>
                {
                  source !== null && source.username !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="username" id="usernameInput" value={source.username} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="username" id="usernameInput" />
                }
                <span class="utrecht-form-label">Password</span>
                {
                  source !== null && source.password !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password" id="usernameInput" value={source.password} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" type="password" name="password" id="passwordInput" />
                }
                <span class="utrecht-form-label">Apikey</span>
                {
                  source !== null && source.apikey !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey" id="apikeyInput" value={source.apikey} /> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="apikey" id="apikeyInput" />
                }
                <span class="utrecht-form-label">Documentation</span>
                {
                  source !== null && source.documentation !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="documentation" id="documentationInput" value={source.documentation} /> :
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
