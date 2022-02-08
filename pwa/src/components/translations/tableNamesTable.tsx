import * as React from "react";
import {Table, Card, Spinner} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import {Link} from "gatsby";
import {AlertContext} from "../../context/alertContext";
import {HeaderContext} from "../../context/headerContext";

export default function TableNamesTable() {
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [_, setAlert] = React.useContext(AlertContext)
  const [header, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({title: 'Table names', subText: 'An overview of your table names'})
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getTranslations(context);
    }
  }, [context]);

  const getTranslations = (context) => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/table_names`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // convert array to array objects
        const convertedArray = data['results'].map((value) => ({name: value}));
        setShowSpinner(false);
        setTableNames(convertedArray)
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert({type: 'danger', message: error.message});
      });
  };

  return (
    <Card
      title={"Translations"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-toggle="modal"
              data-target="helpModal"
            >
              <i className="fas fa-question mr-1"/>
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getTranslations}>
              <i className="fas fa-sync-alt mr-1"/>
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/translations/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2"/>
                Create
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner/>
              ) : tableNames ? (
                <Table
                  columns={[
                    {
                      headerName: "Tables",
                      field: "name",
                    },
                    {
                      field: "name",
                      headerName: " ",
                      renderCell: (tables: { name: string }) => {
                        return (
                          <Link className="utrecht-link d-flex justify-content-end" to={`/translations/${tables.name}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1"/>
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    }
                  ]}
                  rows={tableNames}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Tables",
                      field: "name",
                    }
                  ]}
                  rows={[{name: 'No results found'}]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  )
}
