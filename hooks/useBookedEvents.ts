import { useMemo } from "react";
import useBookings from "./useBookings";

export default function useBookedEvents() {
  const { data: { bookings } = {}, ...rest } = useBookings();

  const bookedEvents = useMemo(
    () =>
      (bookings ?? []).map((booking) => ({
        id: booking.id,
        title: booking.name,
        start: new Date(booking.starts_at),
        end: new Date(booking.ends_at),
        allDay: false,
        resource: {
          hostName: booking.host_name,
          hostEmail: booking.host_email,
          roomUrl: booking.room_url,
        },
      })),
    [bookings]
  );

  return { bookedEvents, ...rest };
}
