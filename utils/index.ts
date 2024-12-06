export const formatMilliseconds = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000); // Convert to total seconds
  const hours = Math.floor(totalSeconds / 3600); // Get hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Get remaining minutes
  const seconds = totalSeconds % 60; // Get remaining seconds

  // Pad with leading zeros if necessary
  const formattedTime = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");

  return formattedTime;
};
