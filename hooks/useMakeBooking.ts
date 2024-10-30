"use client";

import { MEETING_SLUG } from "@/constants";
import apiClient from "@/lib/apiClient";
import { getTimeZone } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { format } from "date-fns";
import { useToast } from "./use-toast";
import ApiError from "@/types/ApiError";

interface MakeBookingVariables {
  name: string;
  email: string;
  date: Date;
}

export default function useMakeBooking() {
  const toast = useToast();

  return useMutation<AxiosResponse, AxiosError<ApiError>, MakeBookingVariables>(
    {
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
          description: error.response?.data.error || "An error occurred",
          variant: "destructive",
        });
      },
    }
  );
}