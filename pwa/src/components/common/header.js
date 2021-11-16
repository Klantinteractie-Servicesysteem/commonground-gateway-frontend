import React from "react"

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
