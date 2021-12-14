import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import Table from "../common/table";
import Spinner from "../common/spinner";
import { Link } from "gatsby";
import DeleteModal from "../modals/deleteModal";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";

export default function SourcesTable() {
  const context = useUrlContext();
  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
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

  useEffect(() => {
    getSources();
  }, []);

  return (<>
      <Card title={"Sources"}
            cardHeader={function () {
              return (
                <>
                  <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
                    <i className="fas fa-question mr-1"/>
                    <span className="mr-2">Help</span>
                  </button>
                  <a className="utrecht-link">
                    <i className="fas fa-sync-alt mr-1"/>
                    <span className="mr-2">Refresh</span>
                  </a>
                  <Link to="/sources/new">
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
                      <Table properties={[{ th: "Name", property: "name" }, { th: "Location", property: "location" }]} items={sources} editLink="/sources" />
                    )}
                  </div>
                </div>
              )
            }}
      />
  </>
  );
}
