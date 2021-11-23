import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import Card from "../common/card";
import Spinner from "../common/spinner";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";

export default function DataTable({ id }) {
  const [data, setData] = React.useState(null);
  const context = useUrlContext();

  const [showSpinner, setShowSpinner] = useState(false);

  const getData = () => {
    setShowSpinner(true);
    fetch(`${context.apiUrl}/object_entities/?entity.id=${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        console.log(data)
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
    <Card title="Object entities" modal="#helpModal" refresh={getData} add="/object_entities/new">
      <div className="row">
        <div className="col-12">
          {
            showSpinner === true ?
              <Spinner />
              :
              <div className="utrecht-html">
                <table lang="nl" summary="Overview of object entities fetched from the gateway." className="table">
                  <TableHeaders headerItems={[{
                    name: 'Uri'
                  }, { name: 'Owner' }, { name: '' }]} />
                  <tbody>
                    {
                      data !== null && data.length > 0 ?
                        data.map((row) => (
                          <TableCells
                            cellItems={[{ name: row.uri }, { name: row.owner }, { name: 'button', link: `/object_entities/${row.id}` }]} />
                        ))
                        :
                        <TableCells cellItems={[{ name: 'No results found' }, { name: '' }, { name: '' }]} />
                    }
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>

    </Card>
  );
}
