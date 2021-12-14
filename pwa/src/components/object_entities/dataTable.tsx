import * as React from "react";
import Spinner from "../common/spinner";
import Table from "../common/table";
import {isLoggedIn} from "../../services/auth";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";
import {Link} from "gatsby";

export default function DataTable({ id }) {
  const [data, setData] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
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
    }
  }, [context]);

  return (
    <Card title={"Object entities"}
          cardHeader={function () {
            return (
              <>
                <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                {/*<a className="utrecht-link" onClick={getData}>*/}
                <a className="utrecht-link">
                  <i className="fas fa-sync-alt mr-1"/>
                  <span className="mr-2">Refresh</span>
                </a>
                <Link to="/object_entities/new">
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
                    className="fas fa-plus mr-2"/>Add
                  </button>
                </Link>
              </>
            )
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner />
                  ) : (
                    <Table properties={[{ th: "Name", property: "name" }, { th: "Owner", property: "owner" }]} items={data} editLink="/object_entities" />
                  )}
                </div>
              </div>
            )
          }}
    />
  );
}
