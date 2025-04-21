import { DailyForecastResponse } from "../types/dailyForecast.type";
import { HistoricalWeatherResponse } from "../types/historicalWeather.type";
import { HourlyWeatherResponse } from "../types/hourlyWeather.type";
import { CurrentWeatherResponse } from "../types/weather.types";

const API_KEY = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;


type location = {latitude?: number | null, longitude?:  number | null}

export const getForecast = async ({latitude, longitude}:location): Promise<DailyForecastResponse>  => {
  const res = await fetch(
    `${baseUrl}forecast/daily?lat=${latitude}&lon=${longitude}&days=7&key=${API_KEY}`
  );
  return res.json();
};

export const getHistorical = async (location:location , start: string, end: string):Promise<HistoricalWeatherResponse> => {
  const res = await fetch(
    `${baseUrl}history/daily?lat=${location.latitude}&lon=${location.longitude}&start_date=${start}&end_date=${end}&key=${API_KEY}`
  );
  return res.json();
};

export const getCurrent = async ({latitude, longitude}:location): Promise<CurrentWeatherResponse> => {
  const res = await fetch(
    `${baseUrl}current?lat=${latitude}&lon=${longitude}&key=${API_KEY}`
  );
  return res.json();
};

export const getHourly = async ({latitude, longitude}:location):Promise<HourlyWeatherResponse> => {
  const res = await fetch(
    `${baseUrl}forecast/hourly?lat=${latitude}&lon=${longitude}&hours=8&key=${API_KEY}`
  );
  return res.json();
};
