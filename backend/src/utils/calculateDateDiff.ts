export const calculateDateDifference = (startDate: Date, endDate: Date, unit: 'day' | 'hour' | 'second'): number => {
  // Calculate the difference in milliseconds
  const differenceMs = endDate.getTime() - startDate.getTime();

  // Define constants for conversion
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisecondsPerHour = 1000 * 60 * 60;
  const millisecondsPerSecond = 1000;

  // Calculate difference based on the specified unit
  switch (unit) {
    case 'day':
      return Math.floor(differenceMs / millisecondsPerDay);
    case 'hour':
      return Math.floor(differenceMs / millisecondsPerHour);
    case 'second':
      return Math.floor(differenceMs / millisecondsPerSecond);
    default:
      throw new Error(`Unsupported unit: ${unit}. Supported units are 'day', 'hour', or 'second'.`);
  }
};
