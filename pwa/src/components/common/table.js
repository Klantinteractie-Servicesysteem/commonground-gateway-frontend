import * as React from "react";
import CardHeader from "./cardHeader";
import TableHeaders from "./tableHeaders";
import TableCells from "./tableCells";
import DeleteModal from "../modals/deleteModal";

export default function Table({cardItems, spinner, headerItems, data = null, cellItems, getFunction}) {

  const cardHeaders = cardItems.map((item) =>
    <CardHeader
      items={[
        {
          title: item.title,
          modal: item.modal,
          refresh: item.refresh,
          add: item.add,
        },
      ]}
    />
  )

  return (
    <div className="utrecht-card card">
      {
        cardHeaders
      }
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {spinner === true ? (
              <div className="text-center px-5">
                <div
                  className="spinner-border text-primary"
                  style={{width: "3rem", height: "3rem"}}
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="utrecht-html">
                <table
                  lang="nl"
                  summary="Overview."
                  className="table"
                >
                  <TableHeaders
                    headerItems={headerItems}
                  />
                  <tbody>
                  <TableCells cellItems={cellItems} />
                  </tbody>
                </table>
                {data !== null &&
                data.map((item) => (
                  <>
                    <DeleteModal data={item} useFunction={getFunction} />
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
