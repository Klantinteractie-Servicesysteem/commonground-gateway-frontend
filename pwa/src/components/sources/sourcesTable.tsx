import * as React from "react";
import Table from "../common/table";
import Spinner from "../common/spinner";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";;
import { isLoggedIn } from "../../services/auth";
import { getSupportedCodeFixes } from "typescript";

export default function SourcesTable() {
  const [context, setContext] = React.useState(null);
  const [sources, setSources] = React.useState(null);
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

  return (<>
    <Card title="Sources" cardBody={cardBody} />
  </>
  );
}
