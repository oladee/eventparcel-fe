import axios from "axios";
const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

const axiosInstance = axios.create({
  // baseURL: "https://api.eventparcel.com/api/v1",
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Retrieve auth token from localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // Check if the response is a 401 and if the request was not a retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint
        // const refreshResponse = await axios.post("https://api.eventparcel.com/api/v1/refresh-token", {}, {
        const refreshResponse = await axios.post(`${baseURL}/refresh-token`, {}, {
          withCredentials: true // Ensure cookies are sent with the request
        });

        // Update the accessToken in localStorage
        localStorage.setItem("authToken", refreshResponse.data.accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);

        // Handle refresh token error (e.g., redirect to login)
        window.location.href = "/adminLogin"; // Update this to your login route
        return Promise.reject(refreshError);
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;

