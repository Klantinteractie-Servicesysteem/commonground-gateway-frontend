import * as React from "react";
import { getUser, isLoggedIn } from "../services/auth";
import Dashboard from "../templates/dashboard/Dashboard";
import { HeaderContext } from "../context/headerContext";

const IndexPage = () => {
  const [_, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    isLoggedIn() && setHeader({subText: `Welcome ${getUser().username}, to the gateway admin dashboard`, title: 'Dashboard'})
    !isLoggedIn() && setHeader({subText: `Welcome to the gateway admin dashboard`, title: 'Dashboard'})
  }, [isLoggedIn()])

  return (
    isLoggedIn() && (
      <Dashboard />
    )
  );
};

export default IndexPage;
