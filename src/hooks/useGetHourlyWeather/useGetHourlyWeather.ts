import { useState, useEffect } from 'react';
import { getHourly } from '../../api/weather';
import { useLocationStore } from '../../store';
import { HourlyWeather } from '../../types/hourlyWeather.type';

export const useGetHourlyWeather = () => { 
 const {location, fetchCurrentLocation} =  useLocationStore();
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather[]>([])
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
        const res = await getHourly(location);
        setHourlyWeather(res.data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }


  return { hourlyWeather, loading, error }
}