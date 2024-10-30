"use client";

import { MEETING_SLUG } from "@/constants";
import apiClient from "@/lib/apiClient";
import ApiError from "@/types/ApiError";
import Slot from "@/types/Slot";
import { getTimeZone } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Params {
  year: number;
  month: number;
}

export default function useAvailabileSlots({ year, month }: Params) {
  const timeZone = getTimeZone();

  return useQuery<{ slots: Slot[] }, AxiosError<ApiError>>({
    queryKey: ["slots", timeZone, year, month],
    queryFn: () =>
      apiClient
        .get(`/slots/${MEETING_SLUG}`, {
          params: { year, month, time_zone: timeZone },
        })
        .then((r) => r.data),
  });
}
