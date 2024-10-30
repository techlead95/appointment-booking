"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import useAvailabileSlots from "@/hooks/useAvailableSlots";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import useMakeBooking from "@/hooks/useMakeBooking";
import useBookings from "@/hooks/useBookings";
import { useMemo } from "react";
import { useDialog } from "@/contexts/DialogContext";
import { BookingDialog } from "./BookingDialog";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BookingCalendar() {
  const {} = useAvailabileSlots({
    year: 2024,
    month: 11,
  });

  const { openDialog } = useDialog();

  const makeBooking = useMakeBooking();

  const { data: { bookings } = {} } = useBookings();

  const events = useMemo(
    () =>
      (bookings ?? []).map((booking) => ({
        id: booking.id,
        title: booking.meeting.name,
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

  const handleSelectSlot = ({ start }: SlotInfo) => {
    const closeDialog = openDialog({
      children: <BookingDialog onConfirm={() => {}} />,
    });
    // makeBooking.mutate({
    //   name: "Test",
    //   email: "test@email.com",
    //   date: start,
    // });
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      view="week"
      views={["week"]}
      selectable
      onSelectSlot={handleSelectSlot}
    />
  );
}
