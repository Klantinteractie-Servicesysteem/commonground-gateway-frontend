import * as React from "react";
import { Card, InfoTooltip, Spinner } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { useQueryClient } from "react-query";
import { useRepository } from "../../hooks/repository";
import LabelWithBackground from "../LabelWithBackground/LabelWithBackground";

interface GeneralDetailsProps {
  repositoryId: string;
}

export const GeneralDetails: React.FC<GeneralDetailsProps> = ({ repositoryId }) => {
  const [__, setHeader] = React.useContext(HeaderContext);
  const queryClient = useQueryClient();

  const _useRepository = useRepository(queryClient);
  const getRepository = _useRepository.getOne(repositoryId);
  const installRepository = _useRepository.install(repositoryId);

  /**
   * Effects
   */
  React.useEffect(() => {
    setHeader("Repository");

    if (getRepository.isSuccess) {
      setHeader(
        <>
          Repository: <i>{getRepository.data.name}</i>
        </>
      );
    }
  }, [getRepository.isSuccess]);

  return (
    getRepository.isLoading ? (
      <Spinner />
    ) : (
      <div className="row">
        <div className="col-8">
          <Card
            title={getRepository.data.name}
            cardHeader={function() {
              return (
                <div>
                  <button
                    onClick={() => installRepository.mutateAsync({ id: getRepository.data.id })}
                    className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
                    type="submit"
                  >
                    Install
                  </button>
                  <a href={getRepository.data?.html_url}>
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
                    <div>
                      <div className="row">
                        <div className="col-12">
                          <span>{getRepository.data.description}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <div className="row">
            <div className="col-6">
            {
              getRepository.data?.tags && (
                <Card
                  title={"Tags"}
                  cardHeader={function() {
                    return (<p />);
                  }}
                  cardBody={function() {
                    return (
                      <table className="mt-3 logTable-table">
                        <tbody>
                        {getRepository.data?.tags?.map((item, idx) => {
                          return (
                            <tr key={idx}>
                              <th><a href={item?.zipball_url}>{item.name}</a></th>
                              <td></td>
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
            <div className="col-6">
              {
                getRepository.data?.languages && (
                  <Card
                    title={"Languages"}
                    cardHeader={function() {
                      return (<p />);
                    }}
                    cardBody={function() {
                      const languages = [];
                      for (const [key, value] of Object.entries(getRepository.data?.languages)) {
                        languages.push({ ...{ key, value } });
                      }
                      return (
                        <table className="mt-3 logTable-table">
                          <tbody>
                          {languages.map((language, idx) => {
                            return (
                              <tr key={idx}>
                                <th>{language.key}</th>
                                <td>{language.value}</td>
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
            title={"Publiccode details"}
            cardHeader={function() {
              return (
                <a href={getRepository.data?.owner?.publiccode?.url}>
                  <button className="utrecht-button utrecht-button btn btn btn-light mr-2">
                    {getRepository.data?.owner?.login ?? "GitHub repo"}
                  </button>
                </a>
              );
            }}
            cardBody={function() {
              return (
                <div className="row">
                  <div className="col-12">
                    <div>
                      <div className="container">
                        {
                          getRepository.data?.owner?.publiccode?.logo && (
                            <div className="row">
                              <div className="col-12">
                                <img src={getRepository.data?.owner?.publiccode?.logo} alt="url" />
                              </div>
                            </div>
                          )
                        }
                        <div className="row">
                          {
                            getRepository.data?.owner?.publiccode?.softwareVersion && (
                              <div className="col-12">
                                <span className="card-text">Software Version: </span>
                                <span
                                  className="text-truncate">{getRepository.data?.owner?.publiccode?.softwareVersion}</span>
                              </div>
                            )
                          }
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <span className="card-text">Release Date: </span>
                            <span className="text-truncate">{getRepository.data?.owner?.publiccode?.releaseDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          {
            getRepository.data?.owner?.publiccode?.maintenance && (
              <Card
                title={"Maintainers"}
                cardHeader={function() {
                  return (
                    <a href={getRepository.data?.owner?.publiccode?.maintenance?.contractors[0]?.website}>
                      <button className="utrecht-button utrecht-button btn btn btn-light mr-2 small">
                        {getRepository.data?.owner?.publiccode?.maintenance?.contractors[0]?.name}
                      </button>
                    </a>
                  );
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
                                className="text-truncate">{getRepository.data?.owner?.publiccode?.maintenance?.contractors[0]?.name}</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <span className="card-text">Email: </span>
                              <span
                                className="text-truncate">{getRepository.data?.owner?.publiccode?.maintenance?.contractors[0]?.email}</span>
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
          {
            getRepository.data?.owner?.publiccode?.dependsOn && (
              <Card
                title={"Dependencies"}
                cardHeader={function() {
                  return (<span />);
                }}
                cardBody={function() {
                  return (
                    <div className="row">
                      <div className="col-12">
                        <div>
                          {getRepository.data.owner?.publiccode?.dependsOn?.open?.map((item, idx) => (
                            <span>
                              <div className="container">
                                 <div className="row">
                                   <div className="col-12">
                                     <span className="card-text">Name: </span>
                                     <span className="text-truncate">{item.name}</span>
                                   </div>
                                 </div>
                                <div className="row">
                                  <div className="col-12">
                                    <span className="card-text">Optional: </span>
                              <span
                                className="text-truncate">{item.optional}</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <span className="card-text">Minimal Version: </span>
                              <span
                                className="text-truncate">{item.versionMin}</span>
                            </div>
                          </div>
                              </div>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )
          }
          {
            getRepository.data?.labels && (
              <Card
                title={"Labels"}
                cardHeader={function() {
                  return (<p />);
                }}
                cardBody={function() {
                  return (
                    <table className="mt-3 logTable-table">
                      <tbody>
                      {getRepository.data?.labels?.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <th><LabelWithBackground color={`#${item.color}`} label={item.name} /></th>
                            <td>{
                              item?.description && (
                                <InfoTooltip content={item.description} placement={"bottom"}
                                             layoutClassName="genericInput-tooltip" />
                              )
                            }</td>
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
    )
  );
};
export default GeneralDetails;
