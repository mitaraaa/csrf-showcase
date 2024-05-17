import axios from "axios";

const client = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export default client;
