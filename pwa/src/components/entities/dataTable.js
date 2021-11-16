import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import { Link } from "gatsby"

export default function DataTable() {
  const [data, setData] = React.useState(null);
  const context = useUrlContext();

  const [showSpinner, setShowSpinner] = useState(false);

  const getData = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + '/object_entities', {
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
        setData(data['hydra:member']);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
      getData();
  }, []);

  return (
    <div className="utrecht-card card">

      <div className="utrecht-card-header card-header">
        <div className="utrecht-card-head-row card-head-row row">
          <div className="col-6">
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Data </h4>
          </div>
          <div className="col-6 text-right">
            <button class="utrecht-link button-no-style" data-toggle="modal" data-target={"#helpModal"}>
              <i className="fas fa-question mr-1"></i>
              <span className="mr-2">Help</span>
            </button>
            <a class="utrecht-link" onClick={getData}>
              <i className="fas fa-sync-alt mr-1"></i>
              <span className="mr-2">Refresh</span>
            </a>
            {/*<Link to="/object_entities/new">*/}
            {/*  <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i className="fas fa-plus mr-2"></i>Add</button>*/}
            {/*</Link>*/}
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
                  <table lang="nl" summary="Overview of object entities fetched from the gateway." className="table">
                    {/*<caption></caption>*/}
                    <thead>
                      <tr>
                        <th scope="col">URI</th>
                        <th scope="col">Owner</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    {
                      data !== null && data.length > 0 ?
                      <tbody>
                        {
                          data.map((row) => (
                            <tr>
                              <td>{row.uri}</td>
                              <td>{row.owner}</td>
                              <td className="text-right"><Link to={"/object_entities/" + row.id}><button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"></i>Edit</button></Link></td>
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
