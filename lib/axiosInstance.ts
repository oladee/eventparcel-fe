import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-eventparcel.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    // For example, add an authentication token to the headers
    const token = localStorage.getItem("authToken"); // Retrieve auth token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Return the response if successful
    return response;
  },
  function (error) {
    // Check if the response is a 401
    if (error.response && error.response.status === 401) {
      // Clear the token from localStorage (optional)
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("Profile");
      localStorage.removeItem("transactionSummary");

      // Redirect the user to the login page
      window.location.href = "/"; // Update this to your login route
    }
    // Reject other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
