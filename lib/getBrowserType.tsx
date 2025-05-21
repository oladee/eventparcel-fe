const GetBrowserType = () => {
  const ua = navigator.userAgent;

  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Brave")) return "Brave";
  if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR"))
    return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";

  return "Other";
};
;
  
  export default GetBrowserType;