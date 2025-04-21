import moment from "moment"
import { HourlyWeather } from "../../types/hourlyWeather.type"

export const WeatherHourlyCard = ({item}:{item:HourlyWeather}) => {
    return (
        <div className=" bg-[#e8e9eb] flex flex-col items-center justify-between p-3 rounded-xl">
            <p className="text-sm font-medium text-neutral-600">{moment(item?.timestamp_local).format('h A')}</p>
            <img src={`/icons/${item?.weather.icon}.svg`} className='h-16 w-16 my-2'/>
            <p className="text-sm font-medium text-neutral-600">{item.temp.toFixed(0)}°</p>
        </div>
    )
}