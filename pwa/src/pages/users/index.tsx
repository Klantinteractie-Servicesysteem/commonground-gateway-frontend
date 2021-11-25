import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "gatsby";
import Layout from "../../components/common/layout";
import { useUrlContext } from "../../context/urlContext";

const IndexPage = () => {
  const context = useUrlContext();

  const [users, setUsers] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getUsers = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(data => {
        if (data["hydra:member"] !== undefined && data["hydra:member"] !== null) {
          setUsers(data["hydra:member"]);
          setShowSpinner(false);
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout title={"Users"} subtext={"An overview of your Users objects"}>
      <main>
        <div className="row">
          <div className="col-12">
            <title> - Users</title>

            <div className="utrecht-card card">
              <div className="utrecht-card-header card-header">
                <div className="utrecht-card-head-row card-head-row row">
                  <div className="col-6">
                    <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">Users</h4>
                  </div>
                  <div className="col-6 text-right">
                    <a className="utrecht-link">
                      <i className="fas fa-question mr-1"></i>
                      <span className="mr-2">Help</span>
                    </a>
                    <a className="utrecht-link" onClick={getUsers}>
                      <i className="fas fa-sync-alt mr-1"></i>
                      <span className="mr-2">Refresh</span>
                    </a>
                    <Link to="/users/new">
                      <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                        <i className="fas fa-plus mr-2"></i>Add
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="utrecht-card-body card-body">
                <div className="row">
                  <div className="col-12">
                    {showSpinner === true ? (
                      <div className="text-center pt-5">
                        <div
                          className="spinner-border text-primary"
                          style={{ width: "3rem", height: "3rem" }}
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="utrecht-html">
                        <table lang="nl" summary="Overview of sources fetched from the gateway." className="table">
                          {/*<caption></caption>*/}
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Location</th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          {users !== null && (
                            <tbody>
                              {users.map(row => (
                                <tr>
                                  <td>{row.name}</td>
                                  <td>{row.location}</td>
                                  <td className="text-right">
                                    <Link to={"/users/" + row.id}>
                                      <button className="utrecht-button btn-sm btn-success">
                                        <i className="fas fa-edit pr-1"></i>Edit
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
