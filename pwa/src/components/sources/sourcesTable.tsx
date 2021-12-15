import * as React from "react";
import Spinner from "../common/spinner";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";


export default function SourcesTable() {
  const [sources, setSources] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getSources();
    }
  }, [context]);

  // const createEditLink = (link = "/sources/$id[0]/entities/$id[1]", pathsToIds = ["id", "entity.id"], object = {id: "1",entity: {id: "2"}}) => {

  //   pathsToIds.forEach(path => {
  //     let editLinkFields = path.split(".");
  //     let idOrArray;
  //     editLinkFields.forEach((field, index) => {
  //       if (idOrArray) {
  //         idOrArray = idOrArray[field];
  //       } else if (object[field]) {
  //         idOrArray = object[field];
  //       }
  //       link = link.replace(`$id[${index}]`, idOrArray);
  //     });
  //   })

  //   console.log(link);
  //   return link;
  // }

  const getSources = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/gateways`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"] !== null
        ) {
          setSources(data["hydra:member"]);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };

  const cardHead = () => {
    return (
      <>
        <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
          <i className="fas fa-question mr-1" />
          <span className="mr-2">Help</span>
        </button>
        <a className="utrecht-link" onClick={getSources}>
          <i className="fas fa-sync-alt mr-1" />
          <span className="mr-2">Refresh</span>
        </a>
        <Link to="/sources/new">
          <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
            className="fas fa-plus mr-2" />Add
          </button>
        </Link>
      </>
    )
  }

  const cardBody = () => {
    return (<div className="row">
      <div className="col-12">
        {showSpinner === true ? (
          <Spinner />
        ) : (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : (
                <Table columns={[{
                  headerName: "Name",
                  field: "name"
                }, {
                  headerName: "Location",
                  field: "location"
                }, {
                  field: "id",
                  headerName: "Edit ",
                  renderCell: (item) => {
                    return (
                      <Link to={`/sources/${item.id}`}>
                        <button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1" />Edit</button>
                      </Link>
                    );
                  },
                },]} rows={sources ? sources : []} />
              )
              }
            </div>
          </div>
        )}
      </div>
    </div>
    )
  }

  return (<>
    <Card title="Sources" cardBody={cardBody} cardHeader={cardHead} />
  </>
  );
}
