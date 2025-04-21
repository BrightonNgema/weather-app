type WeatherData = {
  clouds: number;
  precip: number;
  snow: number;
  wind_spd: number;
};

type WeatherCondition = {
  threshold: number;
  code: number;
  desc: string;
  icon: string;
};

const SNOW_CONDITIONS: WeatherCondition[] = [
  { threshold: 5, code: 602, desc: "Heavy Snow", icon: "s03" },
  { threshold: 2, code: 601, desc: "Snow", icon: "s02" },
  { threshold: 0, code: 600, desc: "Light Snow", icon: "s01" },
];

const RAIN_CONDITIONS: WeatherCondition[] = [
  { threshold: 10, code: 502, desc: "Heavy Rain", icon: "r03" },
  { threshold: 5, code: 501, desc: "Moderate Rain", icon: "r02" },
  { threshold: 0, code: 500, desc: "Light Rain", icon: "r01" },
];

const CLOUD_CONDITIONS: WeatherCondition[] = [
  { threshold: 85, code: 804, desc: "Overcast Clouds", icon: "c04" },
  { threshold: 60, code: 803, desc: "Broken Clouds", icon: "c03" },
  { threshold: 30, code: 802, desc: "Scattered Clouds", icon: "c02" },
  { threshold: 10, code: 801, desc: "Few Clouds", icon: "c02" },
];

function getMatchingCondition(value: number, conditions: WeatherCondition[]): WeatherCondition | null {
  return conditions.find(({ threshold }) => value > threshold) || null;
}

export function estimateWeatherCodeFromHistorical(data: WeatherData, isDay = true) {
  const { clouds, precip, snow, wind_spd } = data;

  let code = 800;
  let description = "Clear Sky";
  let icon = isDay ? "c01d" : "c01n";

  if (snow > 0) {
    const match = getMatchingCondition(snow, SNOW_CONDITIONS);
    if (match) {
      ({ code, desc: description, icon } = match);
    }
  } else if (precip > 0) {
    const match = getMatchingCondition(precip, RAIN_CONDITIONS);
    if (match) {
      ({ code, desc: description, icon } = match);
    }
  } else if (clouds > 10) {
    const match = getMatchingCondition(clouds, CLOUD_CONDITIONS);
    if (match) {
      ({ code, desc: description, icon } = match);
    }
  }

  icon += isDay ? "d" : "n";

  if (wind_spd > 6 && !description.toLowerCase().includes("wind")) {
    description += ", Windy";
  }

  return {
    code,
    description,
    icon,
  };
}
