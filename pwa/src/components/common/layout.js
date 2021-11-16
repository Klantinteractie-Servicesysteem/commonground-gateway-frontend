import React from "react"
import Footer from "./footer";
import MainMenu from "./menu";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./header";

export default function Layout({ children, title="", subtext="" }) {
    return (
        <>
          <Helmet>
            <title>Gateway Admin Dashboard</title>
            <link rel="stylesheet" href="https://unpkg.com/@conductionnl/conduction-design-tokens@1.0.0-alpha.10/dist/index.css"/>
          </Helmet>
          <div className="utrecht-document conduction-theme">
            <div className="utrecht-page">
              <MainMenu />
              <div className="utrecht-page__content">
                <Header title={title} subText={subtext} />
                <div className="container py-4">
                  {children}
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </>
    )
}
