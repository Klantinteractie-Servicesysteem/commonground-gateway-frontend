
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
    if (window.location.href.split("/").at(-1) !== 'applications' || (window.location.href.split("/").at(-1) !== 'new' && window.location.href.split("/").at(-2) !== 'applications')) {
      renderOptionalWelcomeModal()
    }
  }, [API, buttonRef])

  const renderOptionalWelcomeModal = (): void => {
    API.Application.getAll()
      .then((res) => { buttonRef.current !== null && (res.data.length === 0 && buttonRef.current.click()); })
      .catch((err) => { throw new Error('GET applications error: ' + err) })
  }

  const welcomeModalBody = (): JSX.Element => {
    return (
      <>
        <p>Welcome to the gateway user-interface.</p>
        <p>It seems you haven't created a application yet, would you like to
          <a
            className="utrecht--link"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => { navigate('/applications/new') }}>
            {` create an application `}
          </a>
          first or you can close this modal if you want to find things out yourself. </p>
      </>
    )
  };

  return (<>
    <button
      type="button"
      className="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#welcomeModal"
      style={{ display: 'none' }}
      ref={buttonRef}
    >
      More info
    </button>
    <Modal title={'Hello!'} id='welcomeModal' body={welcomeModalBody} />
  </>);
};

export default WelcomeModal;
