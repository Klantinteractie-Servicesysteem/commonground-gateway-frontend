import React from "react"
import { Link } from "gatsby"

export default function Table({ title = "table", helpLink = null, refresh = null, addNewLink = null, editLink = null, thead = [{ thead: "1", value: "one" }], items = null, showSpinner = null }) {

  return (
    <>
      <div className="utrecht-card card">

        <div className="utrecht-card-header card-header">
          <div className="utrecht-card-head-row card-head-row row">
            <div className="col-6">
              <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">{title}</h4>
            </div>
            <div className="col-6 text-right">
              {
                helpLink !== null &&
                <a class="utrecht-link">
                  <i className="fas fa-question mr-1"></i>
                  <span className="mr-2">Help</span>
                </a>
              }
              {
                refresh !== null &&
                <a class="utrecht-link" onClick={refresh}>
                  <i className="fas fa-sync-alt mr-1"></i>
                  <span className="mr-2">Refresh</span>
                </a>
              }
              {
                addNewLink !== null &&
                <Link to={addNewLink}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i className="fas fa-plus mr-2"></i>Add</button>
                </Link>
              }
            </div>
          </div>
        </div>
        <div className="utrecht-card-body card-body">
          <div className="row">
            <div className="col-12">
              {
                showSpinner == true ?
                  <div className="text-center pt-5">
                    <div class="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div> :
                  <div className="utrecht-html">
                    <table lang="nl" summary="Overview of sources fetched from the gateway." className="table">
                      {/*<caption></caption>*/}
                      <thead>
                        <tr>
                          {
                            thead.map((row) => (
                              <th scope="col">{row.thead}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      {
                        items !== null && items.length > 0 ?
                          <tbody>
                            {
                              items.map((item) => (
                                <tr>
                                  {
                                    thead.map((row) => (
                                      <td>
                                        {item[row.value]}</td>
                                    ))
                                  }
                                  {
                                    editLink !== null &&
                                    <td className="text-right"><Link to={editLink + "/" + item.id}><button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"></i>Edit</button></Link></td>
                                  }
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
    </>
  )
}
