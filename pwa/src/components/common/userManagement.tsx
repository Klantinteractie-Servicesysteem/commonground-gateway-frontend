import * as React from "react";
import {useUrlContext} from "../../context/urlContext";
import { useUserContext } from "../../context/userContext";
import { navigate } from "gatsby"


export default function UserManagement() {
  const [info, setInfo] = React.useState(null);

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      let context = useUrlContext();

      fetch(context.meUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then((data) => {
          setInfo(data)
        });
    }
    let userContext = useUserContext();
    const params = new URLSearchParams(window.location.search);

    if (info !== null && info !== undefined && params.has('state')) {
      let data = {
        bsn: info.email,
        name: info.name,
        firstName: info.first_name,
        lastName: info.last_name,
      }

      userContext.setUser(null);

      sessionStorage.setItem('user', JSON.stringify(data));
      navigate("/data");
      return null;

    }
  }

  return (
    <div>
      {handleLogin()}
    </div>
  );
}
