import * as React from "react"
import { useEffect, useState } from "react";
import { Link } from "gatsby"
import Layout from "../../components/common/layout";
import ActionMenu from "../../components/common/actionMenu";
import {useUrlContext} from "../../context/urlContext";

const IndexPage = () => {
  const context = useUrlContext();

  const pageDescription = "On this page u can view and create your gateways sources.";

  const [sources, setSources] = useState(null);

  const getSources = () => {
    fetch(context.apiUrl + "/gateways", {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
          setSources(data['hydra:member']);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
      getSources();
  }, []);


  return (
      <Layout>
      <main>
        <div className="row">
          <div className="col-3">
            <ActionMenu pageDescription={pageDescription} />
           </div>
           <div className="col-9">
            <title>Gateway - Sources</title>
          <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Sources</h1>

          <Link to="/sources/new">
             <button className="utrecht-button float-right" type="button">Create source</button>
          </Link>

            <div className="utrecht-html">
              <table lang="nl" summary="Overview of sources fetched from the gateway." class="">
                {/*<caption></caption>*/}
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                  {
                  sources !== null &&
                  <tbody>
                    {
                      sources.map((row) => (
                        <tr>
                          <td>{row.name}</td>
                          <td>{row.location}</td>
                          <td><Link to={"/sources/" + row.id}>View</Link></td>
                        </tr>
                      ))
                    }
                  </tbody>
                  }
              </table>
          </div>
         </div>
        </div>
        </main>
      </Layout>

  )
}

export default IndexPage
