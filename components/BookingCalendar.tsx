"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import useAvailabileSlots from "@/hooks/useAvailableSlots";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  SlotPropGetter,
} from "react-big-calendar";
import useMakeBooking from "@/hooks/useMakeBooking";
import useBookings from "@/hooks/useBookings";
import { useMemo, useState } from "react";
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
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data: { slots } = {} } = useAvailabileSlots({
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

  const handleSelectSlot = ({ start }: SlotInfo) => {
    if (!availabilitySet.has(format(start, "yyyy-MM-dd HH:mm"))) {
      return;
    }

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

  const getSlotProp: SlotPropGetter = (date) => {
    const key = format(date, "yyyy-MM-dd HH:mm");

    if (availabilitySet.has(key)) {
      return {};
    }

    return {
      style: {
        backgroundColor: "#f0f0f0",
      },
    };
  };

  const handleNavigate = (date: Date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
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
        slotPropGetter={getSlotProp}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
