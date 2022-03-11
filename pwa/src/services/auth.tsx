import { navigate } from "gatsby-link";
import jwtDecode, { JwtPayload } from "jwt-decode";

export const isBrowser = () => typeof window !== "undefined";

export const getUser = () =>
  isBrowser() && window.sessionStorage.getItem("user") ? JSON.parse(window.sessionStorage.getItem("user")) : {};

export const setUser = (user) => window.sessionStorage.setItem("user", JSON.stringify(user));

export const handleLogin = (data) => {
  return setUser(data);
};

export const isLoggedIn = () => {
  const user = getUser();
  return !!user.username;
};

export const logout = () => {
  setUser({});
  window.sessionStorage.removeItem("jwt");
  window.sessionStorage.removeItem("user");
  navigate("/login");
};

export const validateSession = () => {
  const token = sessionStorage.getItem("jwt");

  if (!token) return false;

  const decoded = jwtDecode<JwtPayload>(token);
  const expired = Date.now() >= decoded.exp * 1000;

  return !expired;
};
