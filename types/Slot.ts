export default interface Slot {
  date: string;
  day: number;
  slots: Record<string, SlotItem>;
}

export interface SlotItem {
  start_time: string;
  is_available: boolean;
  end_time: string;
  count: number;
}
