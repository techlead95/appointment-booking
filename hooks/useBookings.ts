"use client";

import apiClient from "@/lib/apiClient";
import Booking from "@/types/Booking";
import { useQuery } from "@tanstack/react-query";

export default function useBookings() {
  return useQuery<{ bookings: Booking[] }>({
    queryKey: ["bookings"],
    queryFn: () => apiClient.get("/bookings").then((res) => res.data),
  });
}
