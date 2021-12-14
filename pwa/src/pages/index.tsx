import * as React from "react";
import Layout from "../components/common/layout";
import {Tabs}from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ResponseTable from "../components/logs/responseTable";
import RequestTable from "../components/logs/requestTable";

const IndexPage = () => {

  return (
    <Layout
      title={"Dashboard"}
      subtext={"Welcome to the gateway admin dashboard"}
    >
      <Tabs items={[{
        name: 'Response logs',
        id: 'response',
        active: true
      },{
        name: 'Request logs',
        id: 'request'
      }
      ]}/>

      <div className="tab-content">
        <div
          className="tab-pane active"
          id="response"
          role="tabpanel"
          aria-labelledby="main-tab"
        >
          <br />
         <ResponseTable />
        </div>
        <div
          className="tab-pane"
          id="request"
          role="tabpanel"
          aria-labelledby="attributes-tab"
        >
          <br />
          <RequestTable />
        </div>
      </div>
      {/*<a href={`${context.apiUrl}/export/all`} target="_blank">*/}
      {/*  <button className="utrecht-button" type="button">*/}
      {/*    Export Configuration*/}
      {/*  </button>*/}
      {/*</a>*/}
    </Layout>
  );
};

export default IndexPage;
