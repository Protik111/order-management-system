import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
}

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/auth/profile");
      setUser(response.data?.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch user profile:", error);
      setError(error.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { user, loading, error, refetch: fetchUserProfile };
};
