import * as React from "react"
import { useState } from "react";
import Layout from "../../components/common/layout";
import ActionMenu from "../../components/common/actionMenu";
import {useUrlContext} from "../../context/urlContext";

const IndexPage = () => {
  const context = useUrlContext();
  let id = "new";
  let pageDescription = "Create your new source on this page";

  const [sources, setSources] = useState(null);

  //useEffect(() => {
  //  if (typeof window !== "undefined") {
  //      getSources();
  //  }
  //}, []);

  //const getSources = () => {
  //  fetch(context.adminUrl + "/gateways", {
  //    credentials: 'include',
  //    headers: { 'Content-Type': 'application/json' },
  //  })
  //    .then(response => response.json())
  //    .then((data) => {
  //      if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
  //        setSources(data['hydra:member']);
  //      }
  //    });
  //}

  return (
      <Layout>
      <main>
        <div className="row">
          <div className="col-3">
            <ActionMenu pageDescription={pageDescription} />
           </div>
           <div className="col-9">
            <title>Sources - {id}</title>
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">{id}</h1>

            <input className="utrecht-textbox utrecht-textbox--html-input" name="name" id="nameInput" value={id} />
         </div>
        </div>
        </main>
      </Layout>

  )
}

export default IndexPage
