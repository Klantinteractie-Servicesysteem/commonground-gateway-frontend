import * as React from "react";
import {AlertContext} from "../../context/alertContext";
import FlashMessage from 'react-flash-message';
import {
  Alert,
} from "@conductionnl/nl-design-system/lib";

const AlertComponent = () => {
  const [alert, setAlert] = React.useContext(AlertContext)

  React.useEffect(() => {
    console.log(alert)
  }, [alert])
  if (!alert) return <></>

  return (
    <FlashMessage duration={5000}>
      <Alert alertClass={alert.type} body={function () {
        return (<>{alert.message}</>)
      }} />
    </FlashMessage>
  )
}


export default AlertComponent
