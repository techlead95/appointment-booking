"use client";

import { MEETING_SLUG } from "@/constants";
import apiClient from "@/lib/apiClient";
import { getTimeZone } from "@/utils";
import { useQuery } from "@tanstack/react-query";

interface Params {
  year: number;
  month: number;
}

export default function useAvailabileSlots({ year, month }: Params) {
  const timeZone = getTimeZone();

  return useQuery({
    queryKey: ["slots", timeZone, year, month],
    queryFn: () =>
      apiClient.get(`/slots/${MEETING_SLUG}`, {
        params: { year, month, time_zone: timeZone },
      }),
  });
}
