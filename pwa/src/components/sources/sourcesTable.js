import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";
import CardHeader from "../cardHeader";

export default function SourcesTable() {
  const context = useUrlContext();
  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
          setSources(data['hydra:member']);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getSources();
  }, []);

  return (
    <div className="utrecht-card card">
      <CardHeader items={[{title: 'Sources', modal: '#helpModal', refresh: {getSources}, add: '/sources/new'}]}/>
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {
              showSpinner === true ?
                <div className="text-center px-5">
                  <div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}} role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div> :
                <div className="utrecht-html">
                  <table lang="nl" summary="Overview of sources fetched from the gateway." className="table">
                    <TableHeaders headerItems={[{
                      name: 'Name'
                    }, {name: 'Location'}, {name: ''}]}/>
                    <tbody>
                    {
                      sources !== null && sources.length > 0 ?
                        sources.map((row) => (
                          <TableCells
                            cellItems={[{name: row.name}, {name: row.location}, {
                              name: 'button',
                              link: `/sources/${row.id}`
                            }]}/>
                        ))
                        :
                        <TableCells cellItems={[{name: 'No results found'}, {name: ''}, {name: ''}]}/>
                    }
                    </tbody>
                  </table>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
