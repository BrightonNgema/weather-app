import { useState } from 'react';
import { useGetHourlyWeather , useGetWeeklyWeather, useGetCurrentWeather} from './hooks';
import { estimateRainChance } from './utils/estimateRainChance';
import { estimateWeatherCodeFromHistorical } from './utils/estimateWeather';
import { WeatherDayCard,  CurrentWeatherInfo, Loader, WeatherInfoCard, WeatherHourlyCard } from './components';
import { WeatherType } from './types/weather.types';
import { DailyForecast } from './types/dailyForecast.type';
import './App.css'
import moment from 'moment';

function App() {
  const { weather , loading} =  useGetCurrentWeather();
  console.log("weather", weather)
  const { hourlyWeather, loading:hourlyLoading } =  useGetHourlyWeather();

  const {forecast, history, loading:weeklyLoading } = useGetWeeklyWeather();
  const [selectedWeather, setSelectedWeather] = useState<WeatherType | DailyForecast | null>(null);
  
  const displayWeather = (selectedWeather ?? weather) as WeatherType;
  const windDirection = displayWeather?.wind_dir ? `rotate-[${displayWeather.wind_dir+100}deg]` : '';
  const chanceOfRain = estimateRainChance(displayWeather?.precip, (displayWeather as WeatherType)?.clouds);
  const isLoading = loading || hourlyLoading || weeklyLoading;

  if(isLoading) return <Loader />;
  return (
    <div className='main'>
     <CurrentWeatherInfo 
        weather={displayWeather} 
        active={!!selectedWeather} 
        onResetWeather={() => setSelectedWeather(null)}     
      />
     <section className='mb-8'>
       <div className='columns-4 max-md:columns-2'>
          <WeatherInfoCard title="Chance of rain" value={`${chanceOfRain}%`} icon={"rain"}/>
          <WeatherInfoCard title="UV index" value={displayWeather?.uv} icon={"uv"}/>
          <WeatherInfoCard title="Wind" value={`${displayWeather?.wind_spd}km/h`} icon={"wind"} imageClassName={windDirection}/>
          <WeatherInfoCard title="Pressure" value={`${displayWeather?.pres} hPa`} icon={"pressure"}/>
          <WeatherInfoCard title="Sunrise" value={displayWeather.sunrise ?? "--"}  icon={"sunrise"}/>
          <WeatherInfoCard title="Humidity" value={`${displayWeather?.rh}%`} icon={"humidity"}/>
          <WeatherInfoCard title="Sunset" value={displayWeather.sunset ?? "--"} icon={"sunset"}/>
          <WeatherInfoCard title="Gusts" value={`${displayWeather?.gust ?? "-- "}km/h`} icon={"gusts"}/>
       </div>
     </section>
     <section className='mb-8'>
       <div className='mb-4 text-xl font-semibold'>Hourly</div>
       <div className='grid lg:grid-cols-8 gap-3 grid-cols-4'>
         {hourlyWeather.map((item,index) => (
          <WeatherHourlyCard item={item} key={index} />
        ))}
       </div>
     </section>
     <section>
        <div className='mb-4 text-xl font-semibold'>This week</div>
       <div className='grid lg:grid-cols-3 gap-3 grid-cols-1'>
          {forecast?.data?.map((item, index) => (
            <WeatherDayCard
              key={index}
              date={item.valid_date}
              minTemp={item.min_temp}
              maxTemp={item.max_temp}
              icon={item.weather.icon}
              onClick={( ) => setSelectedWeather({...item, city_name:forecast.city_name})}
              active={selectedWeather?.datetime === item.datetime}
            />
          ))}
        </div>
     </section>
     <section>
        <div className='mb-4 text-xl font-semibold'>Last 3 days</div>
        <div className='grid lg:grid-cols-3 gap-3 grid-cols-1'>
          {history.map((item, index) => (
            <WeatherDayCard
              key={index}
              date={item.datetime}
              minTemp={item.min_temp}
              maxTemp={item.max_temp}
              icon={estimateWeatherCodeFromHistorical(item).icon}
            />
          ))}
        </div>
     </section>
    </div>
  )
}

export default App
