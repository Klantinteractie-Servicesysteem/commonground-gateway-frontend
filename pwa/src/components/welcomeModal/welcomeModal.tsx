import * as React from "react";
import { navigate } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Modal } from "@conductionnl/nl-design-system";

const WelcomeModal: React.FC = () => {
  const API: APIService = React.useContext(APIContext);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    // Check route
    !window.location.pathname.includes("applications") && renderOptionalWelcomeModal();
  }, [API, buttonRef]);

  const renderOptionalWelcomeModal = (): void => {
    API.Application.getAll()
      .then((res) => {
        if (buttonRef.current && res.data.length === 0) {
          buttonRef.current.click();
        }
      })
      .catch((err) => {
        throw new Error("GET applications error: " + err);
      });
  };

  const welcomeModalBody = (): JSX.Element => {
    return (
      <>
        <p>Welcome to the gateway user-interface.</p>
        <p>It seems you haven't created a application yet. <br />
          <a
            className="utrecht--link"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              navigate("/applications/new");
            }}>
            {` Click here to create an application `}
          </a>
          to get started. </p>
      </>
    );
  };

  return (<>
    <button
      type="button"
      className="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#welcomeModal"
      style={{ display: "none" }}
      ref={buttonRef}
    >
      More info
    </button>
    <Modal title={"Hello!"} id="welcomeModal" body={welcomeModalBody} />
  </>);
};

export default WelcomeModal;
