import * as React from "react";
import Footer from "./footer";
import MainMenu from "./menu";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./header";
import { Breadcrumb } from 'gatsby-plugin-breadcrumb';


/**
 * This components renders a layout which is renders the menu, footer and container surrounding main body of pages.
 *
 * @param {object} children Content that is rendered as body.
 * @param {string|null} title Title for the page.
 * @param {string|null} subText Subtext for the site.
 * @returns TSX of the generated Layout.
 */
const Layout = ({ children, title = "", subtext = "", pageContext}) => {
  /*const {
    breadcrumb: { crumbs },
  } = pageContext
  const customCrumbLabel = location.pathname.toLowerCase().replace('-', ' ')
  console.log({pageContext:pageContext.breadcrumb.crumbs})*/
  return (
    <>
      <Helmet>
        <title>Gateway Admin Dashboard</title>
      </Helmet>
      <div className="utrecht-document conduction-theme">
        <div className="utrecht-page">
          <MainMenu />
          <div className="utrecht-page__content">
            <Header title={title} subText={subtext} pageContext={pageContext}/>

            <div className="container py-4">{children}</div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
  export default Layout
