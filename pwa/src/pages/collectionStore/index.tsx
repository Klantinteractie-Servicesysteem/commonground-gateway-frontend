import * as React from "react";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { useQuery } from "react-query";
import { CollectionStoreCard } from "../../components/collectionStore/collectionStoreCard";
import Spinner from "../../components/common/spinner";

const IndexPage = () => {
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  const getRepositoriesQuery = useQuery<any[], Error>("repositories", API.Repository.getAll, {
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    }
  });

  return (
    <main>
      <div className="row">
        <div className="col-6">
          <div className="page-top-item">
            <div className="input-group-append">
              <input
                type="text"
                id="searchInput"
                name="search"
                placeholder="search bar"
                className="utrecht-textbox utrecht-textbox--html-input mb-2"
              />
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {getRepositoriesQuery.isLoading ? (
        <div className="container">
          <Spinner />
        </div>
      ) : (getRepositoriesQuery.data['items'].map((repository) => (
        <div className="row" key={`row-${repository.id}`}>
          <div className="col-12">
            <CollectionStoreCard repository={repository.repository} />
          </div>
        </div>
      )))}
    </main>
  );
};

export default IndexPage;
