import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import {useEffect, useState} from "react";
import {Link} from "gatsby";
import CardHeader from "../cardHeader";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";


export default function AttributeTable({ id }) {
  const [attributes, setAttributes] = React.useState(null);
  const context = useUrlContext();
  const [showSpinner, setShowSpinner] = useState(false);

  const getAttributes = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + '/attributes', {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setShowSpinner(false);
          setAttributes(null);
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setAttributes(data['hydra:member']);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setShowSpinner(false);
        setAttributes(null);
      });
  }
  useEffect(() => {
      getAttributes();
  }, []);

  return (
    <div className="utrecht-card card">
      <CardHeader items={[{title: 'Attributes', modal: '#helpModal', refresh: {getAttributes}, add: '/attributes/new', entityId: id}]}/>
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
                  <table lang="nl" summary="Overview of object entities fetched from the gateway." className="table">
                    <TableHeaders headerItems={[{
                      name: 'Name'
                    }, {name: 'Type'}, {name: ''}]}/>
                    <tbody>
                    {
                      attributes !== null && attributes.length > 0 ?
                        attributes.map((row) => (
                          <TableCells
                            cellItems={[{name: row.name}, {name: row.type}, {name: 'button', link: `/attributes/${row.id}`}]}/>                        ))
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
  );
}
