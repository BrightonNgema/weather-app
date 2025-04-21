import { useState, useEffect } from 'react';
import { getHistorical, getForecast } from '../../api/weather';
import moment from 'moment';
import { DailyForecastResponse } from '../../types/dailyForecast.type';
import { useLocationStore } from '../../store';
import { HistoricalWeather } from '../../types/historicalWeather.type';

export const useGetWeeklyWeather = () => { 
   const {location, fetchCurrentLocation} =  useLocationStore();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoricalWeather[]>([]);
  const [forecast, setForecast] = useState<DailyForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(location?.latitude && location.longitude){
      void fetchWeeklyWeather() 
    }else{
      fetchCurrentLocation()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

    const fetchWeeklyWeather = async () => {
      try {
        if(!location) return;
        setLoading(true);
        const start = moment().subtract(3, 'days').format('YYYY-MM-DD');
        const end = moment().format('YYYY-MM-DD');
        const [historicalData, forecastData] = await Promise.all([
          getHistorical(location, start, end),
          getForecast(location),
        ]);
        setHistory(historicalData.data);
        const formatedForecast = forecastData.data.slice(0, 4).filter((x) => x?.valid_date !== moment().format('YYYY-MM-DD'));
        setForecast({
          ...forecastData,
          data: formatedForecast
        });
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }


  return { loading, history, forecast, error, fetchWeeklyWeather };
}