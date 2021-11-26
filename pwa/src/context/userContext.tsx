import { createContext, useContext, useState } from "react";
import * as React from "react";

const UserContext = createContext(undefined);

export function UserContextWrapper({ children }) {
  let storedUser = null;

  if (typeof window !== "undefined") {
    storedUser = sessionStorage.getItem("user");
  }

  if (storedUser !== null) {
    storedUser = JSON.parse(storedUser);
  }

  const [user, setUser] = useState(storedUser);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
