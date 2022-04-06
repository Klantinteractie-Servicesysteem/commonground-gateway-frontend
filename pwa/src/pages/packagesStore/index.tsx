import * as React from "react";
import { PackageStoreCard } from "../../components/packagesStore/packageStoreCard";
import Spinner from "../../components/common/spinner";
import { usePackage } from "../../hooks/package";

const IndexPage = () => {
  const _usePackage = usePackage();
  const getPackages = _usePackage.getAll();

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
      {getPackages.isLoading ? (
        <div className="container">
          <Spinner />
        </div>
      ) : (getPackages.data['results'].map((packagist, idx) => (
        <div className="row" key={`row-${idx}`}>
          <div className="col-12">
            <PackageStoreCard packagist={packagist} id={idx}/>
          </div>
        </div>
      )))}
    </main>
  );
};

export default IndexPage;
