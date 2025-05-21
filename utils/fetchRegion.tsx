const fetchRegion = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
  
      return {
        region: data.region,   
        country: data.country_name, 
        city: data.city,            
      };
    } catch (error) {
      console.error("Failed to fetch location:", error);
      return null;
    }
  };

  export default fetchRegion;