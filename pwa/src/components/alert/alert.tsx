import * as React from "react";
import "./alert.css";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AlertComponent = () => {
  const [alert, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    alert && setTimeout(() => setAlert(null), 5000);
  }, [alert]);

  if (alert) {
    let title: string;
    switch (alert.type) {
      case "danger":
        title = "Oops something went wrong";
        break;
      case "success":
        title = "Success";
        break;
    }

    return (
      <div className={`Alert Alert--${alert.type}`}>
        <div className="Alert-messageContainer">
          <span className="Alert-header">{title}</span>
          <span>{alert.message}</span>
        </div>

        <div className="Alert-closeContainer" onClick={() => setAlert(null)}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    );
  }

  return <></>;
};

export default AlertComponent;
