export const  estimateRainChance = (precip: number | undefined , clouds: number) => {
  if (precip === 0 || !precip) return 0;
  const baseChance = Math.min(precip * 10, 80);
  const cloudFactor = Math.min(clouds, 100) * 0.2;

  const chance = baseChance + cloudFactor;
  return Math.min(Math.round(chance), 100);
}