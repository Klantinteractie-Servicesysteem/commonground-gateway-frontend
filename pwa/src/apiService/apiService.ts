import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost/admin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: "Bearer " + sessionStorage.getItem("jwt"),
  }
});

