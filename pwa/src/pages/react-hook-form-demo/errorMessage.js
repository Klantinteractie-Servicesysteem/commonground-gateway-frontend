import * as React from "react"

const ErrorMessage = ({ error }) => {
  let message

  switch(error.type) {
    case "required":
      message = "Dit veld is verplicht"
      break
    case "minLength":
      message = "Dit veld bevat niet voldoende karakters"
      break
    default:
      message = "Er is iets fout gegaan"
      break
  }

  return <span>{message}</span>
}

export default ErrorMessage
