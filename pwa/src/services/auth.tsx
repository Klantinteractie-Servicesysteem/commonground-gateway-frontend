export const isBrowser = () => typeof window !== "undefined";

export const getUser = () =>
  isBrowser() && window.sessionStorage.getItem("user")
    ? JSON.parse(window.sessionStorage.getItem("user") as string)
    : {};

export const setUser = (user: {}) => window.sessionStorage.setItem("user", JSON.stringify(user));

export const handleLogin = (data: any) => {
  return setUser(data);
};

export const isLoggedIn = () => {
  const user = getUser();
  return !!user.username;
};

export const logout = () => {
  setUser({});
};
