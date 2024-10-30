"use client";

import { MEETING_SLUG } from "@/constants";
import apiClient from "@/lib/apiClient";
import { getTimeZone } from "@/utils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { format } from "date-fns";
import { useToast } from "./use-toast";
import ApiError from "@/types/ApiError";
import Booking from "@/types/Booking";

interface MakeBookingVariables {
  name: string;
  email: string;
  date: Date;
}

export default function useMakeBooking(
  options?: UseMutationOptions<
    AxiosResponse<Booking>,
    AxiosError<ApiError>,
    MakeBookingVariables
  >
) {
  const toast = useToast();

  return useMutation<
    AxiosResponse<Booking>,
    AxiosError<ApiError>,
    MakeBookingVariables
  >({
    ...options,
    mutationFn: ({ name, email, date }) => {
      const data = {
        meeting_slug: MEETING_SLUG,
        name,
        email,
        slot_date: format(date, "yyyy-MM-dd"),
        slot_start_time: format(date, "p"),
        time_zone: getTimeZone(),
      };

      return apiClient.post("/bookings", data);
    },
    onError(error) {
      toast.toast({
        title: "Booking failed",
        description: error.response?.data.error,
        variant: "destructive",
      });
    },
  });
}
