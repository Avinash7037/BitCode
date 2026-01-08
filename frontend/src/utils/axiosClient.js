import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000", // ✅ BACKEND PORT
  withCredentials: true, // ✅ required for cookies/JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
