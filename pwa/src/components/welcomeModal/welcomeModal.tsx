import * as React from "react";
import { navigate } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Modal } from "@conductionnl/nl-design-system";
import "./welcomeModal.css";
import { useQueryClient } from "react-query";
import { useApplication } from "../../hooks/application";

const WelcomeModal: React.FC = () => {
  const API: APIService = React.useContext(APIContext);
  const buttonRef = React.useRef(null);

  const queryClient = useQueryClient();

  const _useApplication = useApplication(queryClient);
  const getApplications = _useApplication.getAll();

  React.useEffect(() => {
    if (window.location.pathname.includes("applications")) return;

    if (getApplications.isSuccess && getApplications.data.length === 0 && buttonRef.current) {
      renderOptionalWelcomeModal();
    }
  }, [API, buttonRef, getApplications.isSuccess]);

  const renderOptionalWelcomeModal = (): void => {
    buttonRef.current.click();
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
            navigate("/applications/new");
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
