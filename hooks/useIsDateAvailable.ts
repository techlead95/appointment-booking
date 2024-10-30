import { useMemo } from "react";
import useAvailabileSlots from "./useAvailableSlots";
import { format } from "date-fns";

interface Props {
  year: number;
  month: number;
}

export default function useIsDateAvailable({ year, month }: Props) {
  const { data: { slots } = {}, ...rest } = useAvailabileSlots({
    year,
    month,
  });

  const availabilitySet = useMemo(() => {
    const result = new Set();

    (slots ?? []).forEach((slot) => {
      Object.entries(slot.slots).forEach(([timePeriod, { is_available }]) => {
        const startTime = timePeriod.split("-")[0];
        if (is_available) {
          result.add(`${slot.date} ${startTime}`);
        }
      });
    });

    return result;
  }, [slots]);

  const isDateAvailable = (date: Date) => {
    return availabilitySet.has(format(date, "yyyy-MM-dd HH:mm"));
  };

  return { isDateAvailable, ...rest };
}
