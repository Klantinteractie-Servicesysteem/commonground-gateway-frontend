import * as React from "react";
import Spinner from "../common/spinner";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";
import {isLoggedIn} from "../../services/auth";
import {Link} from "gatsby";
import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";


export default function SourcesTable() {
  const [sources, setSources] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(`${context.adminUrl}/gateways`, {
          credentials: "include",
          headers: {"Content-Type": "application/json"},
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
      }
    }
  }, [context]);

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

  const cardBody = () => {
    return (
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table properties={[{ th: "Name", property: "name" }, { th: "Location", property: "location" }]} items={sources} editLink="/sources" />
          )}
        </div>
      </div>
    )
  }

  const cardHead = () => {
    return (
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table properties={[{ th: "Name", property: "name" }, { th: "Location", property: "location" }]} items={sources} editLink="/sources" />
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
