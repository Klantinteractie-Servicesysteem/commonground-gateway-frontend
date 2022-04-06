import * as React from "react";
import { Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { usePackage } from "../../hooks/package";

interface GeneralDetailsProps {
  packageName: string;
}

export const GeneralDetails: React.FC<GeneralDetailsProps> = ({ packageName }) => {
  const [__, setHeader] = React.useContext(HeaderContext);
  const name = packageName.replace("--", "/");
  const _usePackage = usePackage();
  const getPackage = _usePackage.getOne(name);

  console.log(name);

  /**
   * Effects
   */
  React.useEffect(() => {
    setHeader("Package");

    if (getPackage.isSuccess) {
      setHeader(
        <>
          Package: <i>{name}</i>
        </>
      );
    }
  }, [getPackage.isSuccess]);

  return (
    getPackage.isLoading ? (
      <Spinner />
    ) : (
      getPackage.data.packages[name].map((item, idx) => (
        <div key={idx} className="row">
          <div className="col-8">
            {
              item.name && (
                <Card
                  title={item.name}
                  cardHeader={function() {
                    return (<p/>);
                  }}
                  cardBody={function() {
                    return (
                      <div className="row">
                        <div className="col-12">
                          <div>
                            <div className="row">
                              <div className="col-12">
                                <span>{item.description}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              )
            }
            <div className="row">
              <div className="col-12">
                {
                  item.require && (
                    <Card
                      title={"Require"}
                      cardHeader={function() {
                        return (<p />);
                      }}
                      cardBody={function() {
                        const items = [];
                        for (const [key, value] of Object.entries(item.require)) {
                          items.push({ ...{ key, value } });
                        }
                        return (
                          <table className="mt-3 logTable-table">
                            <tbody>
                            {items.map((item, idx) => {
                              return (
                                <tr key={idx}>
                                  <th>{item.key}</th>
                                  <td>{item.value}</td>
                                </tr>
                              );
                            })}
                            </tbody>
                          </table>
                        );
                      }}
                    />
                  )
                }
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {
                  item.require && (
                    <Card
                      title={"Require-dev"}
                      cardHeader={function() {
                        return (<p />);
                      }}
                      cardBody={function() {
                        const items = [];
                        for (const [key, value] of Object.entries(item.require)) {
                          items.push({ ...{ key, value } });
                        }
                        return (
                          <table className="mt-3 logTable-table">
                            <tbody>
                            {items.map((item, idx) => {
                              return (
                                <tr key={idx}>
                                  <th>{item.key}</th>
                                  <td>{item.value}</td>
                                </tr>
                              );
                            })}
                            </tbody>
                          </table>
                        );
                      }}
                    />
                  )
                }
              </div>
            </div>
          </div>
          <div className="col-4">
            <Card
              title={"Version details"}
              cardHeader={function() {
                return (
                  <div>
                    <a href={item?.dist?.url}>
                      <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                        {item?.dist?.type ?? "Download"}
                      </button>
                    </a>
                    <a href={item?.source?.url}>
                      <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                        Github
                      </button>
                    </a>
                  </div>
                );
              }}
              cardBody={function() {
                return (
                  <div className="row">
                    <div className="col-12">
                      <div className="container">
                        <div className="row">
                          {
                            item.version && (
                              <div className="col-12">
                                <span className="card-text">Version: </span>
                                <span
                                  className="text-truncate">{item.version}</span>
                              </div>
                            )
                          }
                        </div>
                        <div className="row">
                          {
                            item.version && (
                              <div className="col-12">
                                <span className="card-text">Version normalized: </span>
                                <span
                                  className="text-truncate">{item.version_normalized}</span>
                              </div>
                            )
                          }
                        </div>
                        <div className="row">
                          {
                            item.type && (
                              <div className="col-12">
                                <span className="card-text">Type: </span>
                                <span
                                  className="text-truncate">{item.type}</span>
                              </div>
                            )
                          }
                        </div>
                        <div className="row">
                          {
                            item.time && (
                              <div className="col-12">
                                <span className="card-text">Time: </span>
                                <span
                                  className="text-truncate">{item.time}</span>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {
              item.authors?.map((author, idx) => (
                <Card
                  key={idx}
                  title={"Authors"}
                  cardHeader={function() {
                    return (<p />);
                  }}
                  cardBody={function() {
                    return (
                      <div className="row">
                        <div className="col-12">
                          <div>
                            <div className="row">
                              <div className="col-12">
                                <span className="card-text">Name: </span>
                                <span
                                  className="text-truncate">{author.name}</span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <span className="card-text">Email: </span>
                                <span
                                  className="text-truncate">{author.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              ))
            }
          </div>
        </div>
      ))
    )
  );
};
export default GeneralDetails;
