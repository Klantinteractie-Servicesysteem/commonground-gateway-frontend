import * as React from "react";
import { navigate } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Modal } from "@conductionnl/nl-design-system";
import "./welcomeModal.css";

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
        <p>
          It seems you haven't created a application yet, in order to consume your API's you will need to create
          applications.
        </p>
        <p>
          If this is your first time in Conductor we suggest that you follow the
          <a
            className="utrecht--link"
            href="https://docs.conductor-gateway.app/en/latest/getting_started/"
            target="_blank"
          >
            {` short tutorial`}
          </a>
          .
        </p>

        <a
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => {
            navigate("/applications");
          }}
        >
          <button className="btn btn-success btn-block">Create an application</button>
        </a>
      </>
    );
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary welcomeModal-display--none"
        data-bs-toggle="modal"
        data-bs-target="#welcomeModal"
        ref={buttonRef}
      >
        More info
      </button>
      <Modal title="Welcome to Conductor!" id="welcomeModal" body={welcomeModalBody} />
    </>
  );
};

export default WelcomeModal;
