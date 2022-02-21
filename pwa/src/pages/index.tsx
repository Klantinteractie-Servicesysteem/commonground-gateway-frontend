import * as React from "react";
import Layout from "../components/common/layout";
import { getUser, isLoggedIn } from "../services/auth";
import Dashboard from "../templates/dashboard/Dashboard";

const IndexPage = () => {

  return (
    <Layout
      title={"Dashboard"}
      subtext={
        isLoggedIn()
          ? `Welcome ${getUser().username}, to the gateway admin dashboard`
          : `Welcome to the gateway admin dashboard`
      }>

      {isLoggedIn() && (
        <Dashboard />
      )}
    </Layout >
  );
};

export default IndexPage;
