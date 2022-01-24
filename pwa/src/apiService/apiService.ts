import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.GATSBY_ADMIN_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: "Bearer " + sessionStorage?.getItem("jwt"),
  }
});
