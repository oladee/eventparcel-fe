export const storePaymentForm = (data: any, hasNGN: boolean, hasUSD: boolean) => {
    localStorage.setItem("paymentFormData", JSON.stringify(data));
    localStorage.setItem("paymentHasNGN", JSON.stringify(hasNGN));
    localStorage.setItem("paymentHasUSD", JSON.stringify(hasUSD));
  };
  
  export const getStoredPaymentForm = () => {
    const data = localStorage.getItem("paymentFormData");
    const hasNGN = localStorage.getItem("paymentHasNGN");
    const hasUSD = localStorage.getItem("paymentHasUSD");
  
    return {
      formData: data ? JSON.parse(data) : null,
      hasNGN: hasNGN === "true",
      hasUSD: hasUSD === "true",
    };
  };
  
  export const clearStoredPaymentForm = () => {
    localStorage.removeItem("paymentFormData");
    localStorage.removeItem("paymentHasNGN");
    localStorage.removeItem("paymentHasUSD");
  };
  