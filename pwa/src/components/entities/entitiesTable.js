import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import { Link } from "gatsby"

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const context = useUrlContext();

  const [showSpinner, setShowSpinner] = useState(false);


  const getEntities = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + '/entities', {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setEntities(data['hydra:member']);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  useEffect(() => {
      getEntities();
  }, []);
  return (
    <div className="utrecht-card card">

      <div className="utrecht-card-header card-header">
        <div className="utrecht-card-head-row card-head-row row">
          <div className="col-6">
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Entities</h4>
          </div>
          <div className="col-6 text-right">
            <button class="utrecht-link button-no-style" data-toggle="modal" data-target={"#helpModal"}>
              <i className="fas fa-question mr-1"></i>
              <span className="mr-2">Help</span>
            </button>
            <a class="utrecht-link" onClick={getEntities}>
              <i className="fas fa-sync-alt mr-1"></i>
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/entities/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i className="fas fa-plus mr-2"></i>Add</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {
              showSpinner == true ?
                <div className="text-center px-5">
                  <div class="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div> :
                <div className="utrecht-html">
                  <table lang="nl" summary="Overview of entities fetched from the gateway." className="table">
                    {/*<caption></caption>*/}
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Endpoint</th>
                        <th scope="col">Route</th>
                        <th scope="col">Source</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    {
                      entities !== null && entities.length > 0 ?
                      <tbody>
                        {
                          entities.map((row) => (
                            <tr>
                              <td>{row.name}</td>
                              <td>{row.endpoint}</td>
                              <td>{row.route}</td>
                                  <td>{row.gateway !== null && row.gateway.name}</td>
                              <td className="text-right"><Link to={"/entities/" + row.id}><button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"></i>Edit</button></Link></td>
                            </tr>
                          ))
                        }
                        </tbody> :
                        <tbody>
                              <tr>
                                <td>No results found</td>
                                <td></td>
                                <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                    }
                  </table>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
