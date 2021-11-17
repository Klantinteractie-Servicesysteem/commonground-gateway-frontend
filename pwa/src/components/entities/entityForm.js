import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {useEffect, useState} from "react";

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
    <div className="card">
      <div className="card-body">
        <div className="row">

          {showSpinner === false ?
            <form id="dataForm" onSubmit={saveEntity}>
              <div className="col-12">
                <button className="utrecht-button float-right" type="submit">Save</button>
              </div>
              <div className="col-6">
                <label htmlFor="nameInput">Name</label>
                {
                  entity !== null && entity.name !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput"
                           defaultValue={entity.name}/> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput"/>
                }
              </div>
              <br/>
              <div className="col-6">
                <label htmlFor="endpointInput">Endpoint</label>
                {
                  entity !== null && entity.endpoint !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="endpoint" id="endpointInput"
                           defaultValue={entity.endpoint}/> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="endpoint" id="endpointInput"/>
                }
              </div>
              <br/>
              <div className="col-6">
                <label htmlFor="descriptionInput">Description</label>
                {
                  entity !== null && entity.description !== null ?
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="description"
                           id="descriptionInput"
                           defaultValue={entity.description}/> :
                    <input className="utrecht-textbox utrecht-textbox--html-input" name="description"
                           id="descriptionInput"/>
                }
              </div>
            </form> :
            <p className="utrecht-paragraph">Saving..</p>
          }
        </div>
      </div>
    </div>
  );
}
