export const convertTo12Hour = (time24: string): string => {
    // Split the time string into hours and minutes
    const [hourStr, minute] = time24.split(":");
    let hours = parseInt(hourStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // Convert hours for 12-hour format
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    
    // Pad hours with leading zero if necessary
    const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
    
    return `${paddedHours}:${minute} ${ampm}`;
  };
  
  // Optional: Add this if you need to convert from 12-hour format to 24-hour format
  export const convertTo24Hour = (time12: string): string => {
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
  
    if (modifier === "PM" && hours !== "12") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
  
    return `${hours.padStart(2, '0')}:${minutes}`;
  };