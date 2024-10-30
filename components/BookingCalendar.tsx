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

  const { data: { bookings } = {}, refetch } = useBookings();

  const makeBooking = useMakeBooking({
    onSuccess() {
      refetch();
    },
  });

  const { openDialog } = useDialog();

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
      children: (
        <BookingDialog
          onSubmit={async (values) => {
            try {
              await makeBooking.mutateAsync({
                ...values,
                date: start,
              });
            } catch {}

            closeDialog();
          }}
        />
      ),
    });
  };

  return (
    <div className="p-6">
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
    </div>
  );
}
