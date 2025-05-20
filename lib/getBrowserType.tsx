  const GetBrowserType = () => {
    const ua = navigator.userAgent;
    if (/chrome/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    if (/edge/i.test(ua)) return "Edge";
    return "Other";
  };
  
  export default GetBrowserType;