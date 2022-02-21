import * as React from "react";
import "./alert.css";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AlertComponent = () => {
  const [alert, setAlert] = React.useContext(AlertContext)

  React.useEffect(() => {
    alert && setTimeout(() => setAlert(null), 5000);
  }, [alert])

  if (alert) {
    return (
      <div className={`conduction-alert conduction-alert-${alert.type}`}>
        {alert.message}

        <div className="conduction-alert-closeContainer" onClick={() => setAlert(null)}>
          <FontAwesomeIcon className="conduction-alert-close" icon={faTimes} />
        </div>
      </div>
    )
  }

  return <></>
}


export default AlertComponent
