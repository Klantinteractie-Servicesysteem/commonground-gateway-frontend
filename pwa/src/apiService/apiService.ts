import axios from 'axios';

const windowGlobal = typeof window !== 'undefined' && window

export const axiosClient = axios.create({
  baseURL: process.env.GATSBY_ADMIN_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: "Bearer " + windowGlobal.sessionStorage.getItem("jwt"),
  }
});
