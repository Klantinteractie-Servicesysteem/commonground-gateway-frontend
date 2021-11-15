import * as React from "react"
import { useEffect, useState } from "react";
import { Link } from "gatsby"
import Layout from "../../components/common/layout";
import ActionMenu from "../../components/common/actionMenu";
import {useUrlContext} from "../../context/urlContext";
import { getUser, isLoggedIn, logout } from "../../services/auth";

const IndexPage = () => {
  const context = useUrlContext();

  const pageDescription = "On this page u can view and create your gateways sources.";

  const [sources, setSources] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        getSources();
    }
  }, []);

  const getSources = () => {
    fetch(context.adminUrl + "/gateways", {
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
        console.log(error)
      });
  }

  return (
      <Layout>
      <main>
        <div className="row">
          <div className="col-3">
            <ActionMenu pageDescription={pageDescription} />
           </div>
           <div className="col-9">
            <title>Gateway - Sources</title>
          <h1 class="utrecht-heading-1 utrecht-heading-1--distanced">Sources</h1>

          <Link to="/sources/new">
             <button class="utrecht-button" type="button">Create source</button>
          </Link>

            <div class="utrecht-html">
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
