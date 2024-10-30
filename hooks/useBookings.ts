"use client";

import apiClient from "@/lib/apiClient";
import ApiError from "@/types/ApiError";
import Booking from "@/types/Booking";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useBookings() {
  return useQuery<{ bookings: Booking[] }, AxiosError<ApiError>>({
    queryKey: ["bookings"],
    queryFn: () => apiClient.get("/bookings").then((res) => res.data),
  });
}
