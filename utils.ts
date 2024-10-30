export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
