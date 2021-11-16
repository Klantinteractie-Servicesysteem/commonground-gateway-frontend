import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/common/layout";
import {useUrlContext} from "../../context/urlContext";


const Configuration = () => {
  const context = useUrlContext();

  return (
    <Layout>
      <main>
        <div className="utrecht-html">
          <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren." className="">
            <caption>Uitslag internetpeiling 8 juni tot en met 28 juni</caption>
            <thead>
            <tr>
              <th scope="col">Configuration</th>
              <th scope="col" className="numeric">E-mail</th>
              <th scope="col" className="numeric"></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Locatie A</td>
              <td className="numeric">53</td>
              <td className="numeric">113</td>
            </tr>
            <tr>
              <td>Locatie B</td>
              <td className="numeric">58</td>
              <td className="numeric">42</td>
            </tr>
            <tr>
              <td>Locatie C</td>
              <td className="numeric">87</td>
              <td className="numeric">16</td>
            </tr>
            </tbody>
          </table>
        </div>
      </main>
    </Layout>

  )
}

export default Configuration
