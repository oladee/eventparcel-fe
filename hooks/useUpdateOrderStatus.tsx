import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateOrderStatus = async (orderId: string, paymentStatus: string, orderStatus: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await axiosInstance.put(`/update-order/${orderId}`, {
        paymentStatus,
        orderStatus,
      });
      
      if (response.status === 200) {
        toast.success("Order status updated successfully!");
    }
    } catch (err) {
        toast.error("Failed to update order status. Please try again.");
      setError(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderStatus, loading, error, success };
};

export default useUpdateOrderStatus;
