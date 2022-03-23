import * as React from "react";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { useQuery } from "react-query";
import { ShopCard } from "../../components/shop/shopCard";

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
      {getRepositoriesQuery.isSuccess && getRepositoriesQuery.data.map((repository) => (
        <div className="row" key={`row-${repository.repository.id}`}>
          <div className="col-12">
            <ShopCard repository={repository.repository} />
          </div>
        </div>
      ))}
    </main>
  );
};

export default IndexPage;
