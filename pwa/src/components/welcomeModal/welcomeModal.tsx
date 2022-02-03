
import * as React from "react";
// import { Modal } from "@conductionnl/nl-design-system/lib";
import {Modal} from "./modal";
import {navigate} from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

const WelcomeModal = () => {
  const API: APIService = React.useContext(APIContext);
  const modalRef = React.useRef(null);
  
  React.useEffect(() => {
    console.log(modalRef.current);
  }, [modalRef.current])

  React.useEffect(() => {
    ClickButtonForModal(0);
  }, [API])

  const ClickButtonForModal = (appCount) => {
    let button = document.getElementById('welcomeModalButton');
    if (button != null && appCount == 0) {
      // button.click();
    }
  }

  const ApplicationsCount = () => {
    API.Application.getAll()
      .then((res) => { return res.data.length })
      .catch((err) => { throw new Error('GET applications error: ' + err) })
  };

  const navToApplications = () => {
    navigate('/applications/new');
  };

  const welcomeModalBody = () => {
    return <>
      <p>Welcome to the gateway user-interface.</p>
      <p>It seems you haven't created a application yet, would you like to
        <a className="utrecht--link" data-bs-dismiss="modal" aria-label="Close" onClick={navToApplications}> create an application </a>
        first or you can close this modal if you want to find things out yourself. </p>
    </>
  };

  return (<>
    <button
      type="button"
      className="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target={`#welcomeModal`}
      style={{ display: 'none' }}
      id="welcomeModalButton"
    >
      More info
    </button>
    <Modal title={'Hello!'} id='welcomeModal' body={welcomeModalBody} ref={modalRef} />
  </>);
};

export default WelcomeModal;








