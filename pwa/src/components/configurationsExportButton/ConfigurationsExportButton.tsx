import * as React from "react";
import { download } from "../utility/DocumentDownload";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Modal } from "@conductionnl/nl-design-system";

export default function ConfigurationsExportButton() {
  const [context, setContext] = React.useState(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    }
  }, [context]);

  const handleExport = () => {
    setLoading(true);
    fetch(`${context.adminUrl}/export/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => {
        response.text().then(function (text) {
          download("export.yaml", text, "text/yaml");
        });
      })
      .catch((err) => {
        throw new Error("GET export: " + err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  React.useEffect(() => {
    handleSetDocumentation();
  });

  const handleSetDocumentation = (): void => {
    API.Documentation.get("configurations")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });
  };
  return (
    <div>
      <button className="utrecht-button text-center" type="button" onClick={handleExport} disabled={loading}>
        {loading ? "Preparing your download..." : "Export Configuration"}
      </button>
      <button className="utrecht-link button-no-style" data-bs-toggle="modal" data-bs-target="#configurationsHelpModal">
        <i className="fas fa-question mr-1" />
        <span className="mr-2">Help</span>
      </button>
      <Modal
        title="Configuration Documentation"
        id="configurationsHelpModal"
        body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
      />
    </div>
  );
}
