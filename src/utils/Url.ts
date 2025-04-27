import axios from "axios";

export const HOST_URL = "http://localhost:5000/";

const api = axios.create({
  baseURL: HOST_URL,
});


export default api;