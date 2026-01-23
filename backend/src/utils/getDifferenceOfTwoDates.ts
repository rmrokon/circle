// Example function to calculate the difference between two dates
export const calculateDateDifferenceInDays = (startDate: Date, endDate: Date): number => {
  // Calculate the difference in milliseconds
  const differenceMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days (1 day = 1000 * 60 * 60 * 24 milliseconds)
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  return differenceDays;
};
