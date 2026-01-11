import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/* 🔥 Silence /user/check 401 errors */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.url === "/user/check" && error.response?.status === 401) {
      // This is normal — user not logged in
      return Promise.resolve({ data: { user: null } });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
