"use client";

import { SlotInfo, SlotPropGetter } from "react-big-calendar";
import useMakeBooking from "@/hooks/useMakeBooking";
import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";
import { BookingDialog } from "./BookingDialog";
import LocalizedCalendar from "./LocalizedCalendar";
import useBookedEvents from "@/hooks/useBookedEvents";
import useIsDateAvailable from "@/hooks/useIsDateAvailable";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function BookingCalendar() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { isDateAvailable } = useIsDateAvailable({ year, month });
  const { bookedEvents, refetch, error } = useBookedEvents();

  const makeBooking = useMakeBooking({
    onSuccess() {
      refetch();
    },
  });

  const { openDialog } = useDialog();

  const handleSelectSlot = ({ start }: SlotInfo) => {
    if (!isDateAvailable(start)) {
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
    return {
      style: {
        backgroundColor: isDateAvailable(date) ? undefined : "#f0f0f0",
      },
    };
  };

  const handleNavigate = (date: Date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  const renderCalendar = () => {
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Failure to retrieve booked events</AlertTitle>
          <AlertDescription>{error.response?.data.error}</AlertDescription>
        </Alert>
      );
    }

    return (
      <LocalizedCalendar
        events={bookedEvents}
        startAccessor="start"
        endAccessor="end"
        view="week"
        views={["week"]}
        selectable
        onSelectSlot={handleSelectSlot}
        slotPropGetter={getSlotProp}
        onNavigate={handleNavigate}
      />
    );
  };

  return <div className="p-6">{renderCalendar()}</div>;
}
