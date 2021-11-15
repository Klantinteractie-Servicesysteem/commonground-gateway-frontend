import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/common/layout";
import {useUrlContext} from "../context/urlContext";
import DigiDImg from "../images/digid_button.svg";
import { UtrechtHeading1 } from "@utrecht/web-component-library-react";
import { getUser, isLoggedIn, logout } from "../services/auth";

const IndexPage = () => {
  const context = useUrlContext();

  return (
      <Layout>
        <main>
        <UtrechtHeading1>The Quick Brown Fox Jumps Over The Lazy Dog</UtrechtHeading1>
        <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">The Quick Brown Fox Jumps Over The Lazy Dog</h1>
        <title>Demodam</title>
          <div style={{textAlign: 'left'}}>
            <p>{context.baseUrl}</p>
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Welkom</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              Dit is de skeleton NL Design applicatie.
            </h4>
            <p className="utrecht-p">
            Het doel van deze skeleton applicatie is om meerdere design tokens te testen over een set NL Design componenten. Ook zou je deze applicatie als template kunnen gebruiken om zelf een app te bouwen in NL Design. De link naar onze github repo: https://github.com/ConductionNL/nl-design-skeleton-gatsby
            </p>
            <div className="row">
              <div className="col-2">test</div>
              <div className="col-8">test2</div>
              <div className="col-6">test3</div>
            </div>
           
          </div>
        </main>
      </Layout>

  )
}

export default IndexPage
