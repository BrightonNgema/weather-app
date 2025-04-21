import { DailyForecast } from "../../types/dailyForecast.type";
import { WeatherType } from "../../types/weather.types";

type CurrentWeatherInfoProps = {
    weather: WeatherType | DailyForecast | null;
    active: boolean;
    onResetWeather: () => void;
}

export const CurrentWeatherInfo: React.FC<CurrentWeatherInfoProps> = ({ weather, active, onResetWeather }) => {
    return (
        <section className='py-4'>
            <div className='lg:flex justify-between'>
                <div className='flex items-center justify-center'>
                    <img src={`/icons/${weather?.weather?.icon}.svg`} className='h-40 w-40 max-md:-mr-8 max-md:-ml-8' />
                    <div className='lg:ml-4'>
                        <h1 className='lg:text-8xl text-6xl font-bold text-slate-900'>{weather?.temp?.toFixed(0)}°</h1>
                        <p className='mt-2 text-gray-500 '>{weather?.weather?.description}</p>
                    </div>
                </div>
                <div className='flex flex-col pt-6 max-md:items-center max-md:-mt-8'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Location</p>
                            <h1 className='text-2xl font-semibold text-slate-900'>{(weather as WeatherType)?.city_name}</h1>
                        </div>
                    </div>
                    {active ? (
                        <button
                            onClick={onResetWeather}
                            className='text-sm text-blue-600 underline mt-8 lg:text-right text-center cursor-pointer'
                        >
                            Back to current weather
                        </button>
                    ) : (
                        <p className='lg:text-right mt-8 text-red-600'>Feels like {(weather as WeatherType)?.app_temp?.toFixed(0)}°</p>
                    )}
                </div>
            </div>
        </section>
    );
};