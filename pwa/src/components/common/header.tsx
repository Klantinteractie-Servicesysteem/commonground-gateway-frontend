import * as React from "react";
import { Breadcrumb } from 'gatsby-plugin-breadcrumb';




/**
 * This components renders a header.
 *
 * @returns TSX of the generated Header.
 */
export default function Header({title, subText, pageContext,}) {
  console.log({pageContext:pageContext.breadcrumb.crumbs})
  const {
    breadcrumb: { crumbs },
  } = pageContext

    pageContext.breadcrumb.crumbs.forEach(function(item, index){
      if(index == 0 ) {
      }
      else{
        const CrumbLabel = item.pathname.toLowerCase().replace('/', ' ').charAt(1).toUpperCase() + item.pathname.slice(2);

        //console.log({pathname:location.pathname})
        //console.log({crumbs:pageContext.breadcrumb.crumbs})
        //console.log({CrumbLabel1:CrumbLabel})
        //console.log({Index:index})
        crumbs[index].crumbLabel = CrumbLabel;
        //console.log({Name:item.pathname})
      }
    });
  return (
    <>
      <header className="utrecht-page-header">
        <div className="container">
          <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">
            {title}
          </h1>
          <h5 className="utrecht-heading-5 utrecht-heading-5--distanced">
            {subText}
          </h5>
          <Breadcrumb className="utrecht-heading-5 utrecht-heading-5--distanced"
            crumbs={crumbs}
            crumbSeparator=" - "
          />
        </div>
      </header>
    </>
  );
}
