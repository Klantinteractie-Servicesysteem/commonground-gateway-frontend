import * as React from "react";
import APIService from "./apiService";

const APIContext = React.createContext<APIService>(null);

export const APIProvider = APIContext.Provider;

export default APIContext;
