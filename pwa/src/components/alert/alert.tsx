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
    return (
      <div className={`Alert Alert--${alert.type}`}>
        <div className="Alert-messageContainer">
          {alert.type === "danger" && <span className="Alert-header">Oops something went wrong</span>}
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
