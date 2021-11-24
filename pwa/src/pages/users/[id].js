import * as React from "react"
import {useEffect, useState} from "react";
import Layout from "../../components/common/layout";
import {Link} from "gatsby"
import {useUrlContext} from "../../context/urlContext";

const IndexPage = (props) => {
  const context = useUrlContext();
  let id = props.params.id;

  const [user, setUser] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [title, setTitle] = useState("User");

  const getUsers = () => {
    fetch(context.apiUrl + "//" + id, {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then((data) => {
        setUser(data);
      });
  }

  const saveUser = () => {
    setShowSpinner(true);

    let url = context.apiUrl + '/';
    let method = 'POST';
    if (id != 'new') {
      url = url + '/' + id;
      method = 'PUT';
    }

    let nameInput = document.getElementById('nameInput');
    let locationInput = document.getElementById('locationInput');


    let body = {
      name: nameInput.value,
      location: locationInput.value,

    }

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved source:', data);
        setUser(data);
        setShowSpinner(false);
        setTitle(user.name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (id != "new") {
      getUsers();
    }
  }, []);

  return (
    <Layout title={title} subtext={"Edit your user here"}>
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
                    <Link className="utrecht-link" to="/users">
                      <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2"><i
                        className="fas fa-long-arrow-alt-left mr-2"></i>Back
                      </button>
                    </Link>
                    <a className="utrecht-link" onClick={saveUser}>
                      <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
                        className="fas fa-save mr-2"></i>Save
                      </button>
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
                          <div class="spinner-border text-primary" style={{width: "3rem", height: "3rem"}}
                               role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div> :
                        <form id="dataForm" onSubmit={saveUser}>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label mb-2">Name *</span>
                                {
                                  user !== null && user.name !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name"
                                           id="nameInput" defaultValue={user.name} required/> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name"
                                           id="nameInput" required/>
                                }
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                <span className="utrecht-form-label">Location (url) *</span>
                                {
                                  user !== null && user.location !== null ?
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location"
                                           id="locationInput" defaultValue={user.location} required/> :
                                    <input className="utrecht-textbox utrecht-textbox--html-input" name="location"
                                           id="locationInput" required/>
                                }

                              </div>
                            </div>
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
