import * as React from "react";
import {download} from "../utility/DocumentDownload";

export default function ConfigurationsExportButton() {
  const [context, setContext] = React.useState(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL
      });
    }
  }, [context]);

  const handleExport = () => {
    setLoading(true)
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
      .catch((error) => {
        throw new Error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <div>
      <button
        className="utrecht-button"
        type="button"
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? "Perparing your download..." : "Export Configuration"}
      </button>
    </div>
  );
}
