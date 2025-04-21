import moment from 'moment';

export const WeatherDayCard = ({ icon, date, minTemp, maxTemp, active, onClick }:{
    icon?:string,
    date:string,
    minTemp:number,
    maxTemp:number,
    active?:boolean
    onClick?:() => void;
}) => {

  const textColor = active ? 'text-white' : 'text-neutral-600'
  return (
    <div
      className={`w-full flex items-center p-3 rounded-xl mb-4 cursor-pointer hover:bg-black transition-all delay-[0.3s] ${active ? 'bg-black !text-white' : 'bg-neutral-200'}`}
      onClick={onClick}
    >
      {icon && <img src={`/icons/${icon}.svg`} className="h-24 w-24 mr-4" />}
      <div>
        <div className="mb-2">
          <div className={`uppercase ${textColor} transition-all delay-75 font-medium text-sm`}>
            {moment(date).format('ddd')}
          </div>
          <div className="uppercase text-neutral-500 text-xs">
            {moment(date).format('D MMM')}
          </div>
        </div>
        <div className="flex">
          <div className="mr-8">
            <div className={`text-2xl font-semibold ${textColor} transition-all delay-75`}>
              {minTemp.toFixed(0)}°
            </div>
            <div className="text-xs text-neutral-500">min</div>
          </div>
          <div>
             <div className={`text-2xl font-semibold ${textColor} transition-all delay-75`}>
              {maxTemp.toFixed(0)}°
            </div>
            <div className="text-xs text-neutral-500">max</div>
          </div>
        </div>
      </div>
    </div>
  );
};