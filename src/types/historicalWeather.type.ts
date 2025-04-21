export type HistoricalWeather = {
  clouds: number;
  datetime: string;
  dewpt: number;
  dhi: number;
  dni: number;
  ghi: number;
  max_dhi: number;
  max_dni: number;
  max_ghi: number;
  max_temp: number;
  max_temp_ts: number;
  max_uv: number;
  max_wind_dir: number;
  max_wind_spd: number;
  max_wind_spd_ts: number;
  min_temp: number;
  min_temp_ts: number;
  precip: number;
  precip_gpm: number;
  pres: number;
  revision_status: string;
  rh: number;
  slp: number;
  snow: number;
  snow_depth: number | null;
  solar_rad: number;
  t_dhi: number;
  t_dni: number;
  t_ghi: number;
  t_solar_rad: number;
  temp: number;
  ts: number;
  wind_dir: number;
  wind_gust_spd: number;
  wind_spd: number;
}

export type HistoricalWeatherResponse = {
  city_id: string;
  city_name: string;
  country_code: string;
  data: HistoricalWeather[];
  lat: number;
  lon: number;
  sources: string[];
  state_code: string;
  station_id: string;
  timezone: string;
}
