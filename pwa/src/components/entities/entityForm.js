import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import { useEffect, useState } from "react";
import { Link } from "gatsby"

export default function EntityForm({id}) {
  const context = useUrlContext();
  const [entity, setEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getEntity = () => {
    fetch(context.apiUrl + "/entities/" + id, {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then((data) => {
        setEntity(data);
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

  const saveEntity = (event) => {

    event.preventDefault();

    let body = {
      name: event.target.name.value,
      endpoint: event.target.endpoint.value,
      description: event.target.description.value ? event.target.description.value : null,
    }

    body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v != null));

    if (!checkInputs([body.name, body.endpoint])) {
      return;
    }

    setShowSpinner(true);

    let url = context.apiUrl + '/entities';
    let method = null;
    if (id === 'new') {
      method = 'POST';
    } else {
      url = url + '/' + id;
      method = 'PUT';
    }

    console.log(body);
    console.log(method);
    console.log(id);
    return;

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved entity:', data);
        setEntity(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (id !== "new") {
      getEntity();
    }
  }, []);

  return (
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
            <a className="utrecht-link" onClick={saveEntity}>
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
                        <span className="utrecht-form-label">Endpoint</span>
                        {
                          entity !== null && entity.endpoint !== null ?
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="endpoint" id="endpointInput" defaultValue={entity.endpoint} required /> :
                              <input className="utrecht-textbox utrecht-textbox--html-input" name="endpoint" id="endpointInput" required />
                        }
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
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
                </>
            }
          </div>
        </div>
        </div>
      </form>


    </div>
  );
}
