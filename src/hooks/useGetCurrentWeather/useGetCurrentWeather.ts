import { useState, useEffect } from 'react';
import { WeatherType } from '../../types/weather.types';
import { getCurrent } from '../../api/weather';
import { useLocationStore } from '../../store';

type CurrentWeatherResponse = {
  count: number;
  data: WeatherType[];
}

export const useGetCurrentWeather = () => { 
  const {location, fetchCurrentLocation} =  useLocationStore();
  const [weather, setWeather] = useState<WeatherType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(location?.latitude && location.longitude){
      fetchWeather()
    }else{
      fetchCurrentLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const fetchWeather = async () => {
      try {
        setLoading(true)
        if(!location) return;
        const res:CurrentWeatherResponse = await getCurrent(location);
        if (!res.data) throw new Error(`Failed to fetch weather`)
        setWeather(res.data[0])
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

  return { weather, loading, error }
}