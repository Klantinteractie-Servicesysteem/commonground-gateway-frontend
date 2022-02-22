import * as React from "react";
import {HeaderContext} from "../../context/headerContext";

const Header = () => {
  const [header] = React.useContext(HeaderContext)

  return (
    header ? (
      <>
        <header className="utrecht-page-header">
        <div className="container">
          <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">
            {header.title}
          </h1>
          <h5 className="utrecht-heading-5 utrecht-heading-5--distanced">
            {header.subText}
          </h5>
        </div>
        </header>
      </>
      ) : <></>
  );
}

export default Header
