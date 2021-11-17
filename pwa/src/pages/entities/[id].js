import * as React from "react"
import Layout from "../../components/common/layout";
import AttributeTable from "../../components/attributes/attributeTable";
import LogsTable from "../../components/entities/logsTable";
import DataTable from "../../components/object_entities/dataTable";
import EntityForm from "../../components/entities/entityForm";
import Tabs from "../../components/common/tabs";
import { Link } from "gatsby";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";


const IndexPage = (props) => {
  const context = useUrlContext();
  const [entity, setEntity] = React.useState(null);
  const [title, setTitle] = useState("Entity");
  const [showSpinner, setShowSpinner] = useState(false);
  const [id, setId] = useState("new");


  const getEntity = () => {
    fetch(context.apiUrl + "/entities/" + id, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        setTitle(data.name);
        setId(data.id);
        setEntity(data);
      });
  }

  useEffect(() => {
    if (id != "new") {
      getEntity();
    }
  }, []);


  const checkInputs = (inputs) => {
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].length === 0) {
        valid = false;
      }
    }

    return valid;
  }

  const removeEmptyValues = (obj) => {
    for (var propName in obj) {
      if ((obj[propName] === undefined || obj[propName] === '') && obj[propName] !== false) {
        delete obj[propName];
      }
    }
    return obj
  }

  const saveEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);


    let body = {
      name: event.target.name.value,
      description: event.target.description.value ? event.target.description.value : null,
      route: event.target.route.value,
      endpoint: event.target.endpoint.value,
      gateway: event.target.gateway.value,
    }

    //if (event.target.extend.checked === true) {
    //  body.extend = true;
    //} else {
    //  body.extend = false;
    //}

    // This removes empty values from the body
    body = removeEmptyValues(body);

    if (!checkInputs([body.name])) {
      return;
    }

    let url = context.apiUrl + '/entities';
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved entity:', data);
        setEntity(data);
        setTitle(data.name);
        setId(data.id);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const [sources, setSources] = useState(null);
  const getSources = () => {
    fetch(context.apiUrl + "/gateways", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
          setSources(data['hydra:member']);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getSources();
    if (id !== "new") {
      getEntity();
    }
  }, []);

  return (
    <Layout title={title} subtext={"Add or modify your entity"}>
      <main>
        <div className="row">
          <div className="col-12">

            <div className="page-top-item">
              {
                entity !== null ?
                  <Tabs items={[{ name: 'Main', id: 'main', active: true }, { name: 'Attributes', id: 'attributes' }, { name: 'Data', id: 'data' }, { name: 'Logs', id: 'logs' }]} /> :
                  <Tabs items={[{ name: 'Main', id: 'main', active: true }]} />
              }
            </div>

            <div className="tab-content">
              <div className="tab-pane active" id="main" role="tabpanel" aria-labelledby="main-tab"><br />
                <div className="utrecht-card card">
                  <form id="dataForm" onSubmit={saveEntity} >

                    <div className="utrecht-card-header card-header">
                      <div className="utrecht-card-head-row card-head-row row">
                        <div className="col-6">
                          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Values</h4>
                        </div>
                        <div className="col-6 text-right">
                          <Link className="utrecht-link" to="/entities">
                            <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2"><i className="fas fa-long-arrow-alt-left mr-2"></i>Back</button>
                          </Link>
                          <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit"><i className="fas fa-save mr-2"></i>Save</button>
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
                              <>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="form-group">
                                      <span className="utrecht-form-label mb-2">Name *</span>
                                      {
                                        entity !== null && entity.name !== null ?
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" defaultValue={entity.name} required /> :
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" required />
                                      }
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="form-group">
                                      <span className="utrecht-form-label">Description</span>
                                      {
                                        entity !== null && entity.description !== null ?
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="description" id="descriptionInput" defaultValue={entity.description} /> :
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="description" id="descriptionInput" />
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="form-group">
                                      <span className="utrecht-form-label">Endpoint</span>
                                      {
                                        entity !== null && entity.endpoint !== null ?
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="endpoint" id="endpointInput" defaultValue={entity.endpoint} /> :
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="endpoint" id="endpointInput" />
                                      }
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="form-group">
                                      <span className="utrecht-form-label">Route</span>
                                      {
                                        entity !== null && entity.route !== null ?
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="route" id="routeInput" defaultValue={entity.route} /> :
                                          <input className="utrecht-textbox utrecht-textbox--html-input" name="route" id="routeInput" />
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-12">
                                    <div className="form-group">
                                      <span className="utrecht-form-label">Gateway</span>
                                      <select name="gateway" id="gatewayInput" class="utrecht-select utrecht-select--html-select">
                                        <option value=""></option>
                                        {
                                          sources !== null && sources.length > 0 ?
                                            sources.map((row) => (<>
                                              {
                                                entity !== null && entity.gateway !== undefined && entity.gateway !== null && entity.gateway.id == row.id ?
                                                  <option value={"/admin/gateways/" + row.id} selected>{row.name}</option> :
                                                  <option value={"/admin/gateways/" + row.id}>{row.name}</option>
                                              }</>
                                            )) :
                                            <option value="">No results found</option>
                                        }
                                      </select>
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
              </div>
              {
                entity !== null && <>
                  <div className="tab-pane" id="attributes" role="tabpanel" aria-labelledby="attributes-tab"><br />
                    <div className="row">
                      <Link to="/attributes/new">
                        <button className="utrecht-button float-right" type="button">Create attribute</button>
                      </Link>
                    </div>
                    <AttributeTable />
                  </div>
                  <div className="tab-pane" id="data" role="tabpanel" aria-labelledby="data-tab"><br />
                    <DataTable />
                  </div>
                  <div className="tab-pane" id="logs" role="tabpanel" aria-labelledby="data-tab"><br />
                    <LogsTable />
                  </div>
                </>
              }
            </div>
                </div>

        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
