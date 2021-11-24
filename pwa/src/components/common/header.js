import React from "react"

/**
 * This Header.
 *
 * @param {Variable} title Save the data variable we need.
 * @param {Variable} subText Save the data variable we need.
 */


export default function Header({title, subText}) {
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
        </div>
      </header>
    </>
  );
}
