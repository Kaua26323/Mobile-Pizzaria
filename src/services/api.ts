import axios from "axios";

const api = axios.create({
  baseURL: `http://26.214.167.40:3333`
});

export { api };