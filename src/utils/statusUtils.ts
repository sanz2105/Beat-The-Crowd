export const getCrowdStatus = (capacity: number): "low" | "moderate" | "high" => {
  if (capacity < 40) return "low";
  if (capacity < 75) return "moderate";
  return "high";
};

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
};
