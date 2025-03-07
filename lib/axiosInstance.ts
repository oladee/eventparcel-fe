import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-eventparcel.onrender.com/api/v1",
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
        const refreshResponse = await axios.post("https://api-eventparcel.onrender.com/api/v1/refresh-token", {}, {
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
        window.location.href = "/"; // Update this to your login route
        return Promise.reject(refreshError);
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;















// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://api-eventparcel.onrender.com/api/v1",
//   headers: { "Content-Type": "application/json" }
// });

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//   function (config) {
//     // Do something before the request is sent
//     // For example, add an authentication token to the headers
//     const token = localStorage.getItem("authToken"); 
//     // Retrieve auth token from localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     // Handle the error
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// axiosInstance.interceptors.response.use(
//   function (response) {
//     // Return the response if successful
//     return response;
//   },
//   function (error) {
//     // Check if the response is a 401
//     if (error.response && error.response.status === 401) {

//       // Redirect the user to the login page
//       window.location.href = "/"; // Update this to your login route
//     }
//     // Reject other errors
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
