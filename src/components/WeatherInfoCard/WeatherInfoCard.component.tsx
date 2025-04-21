type WeatherInfoProps = {
  title: string;
  value: string | number | undefined;
  icon: string;
  imageClassName?: string;
}

export const WeatherInfoCard: React.FC<WeatherInfoProps> = ({ title, value, icon, imageClassName }) => {
  
  return (
    <div className="flex items-center p-2 rounded-xl mb-4">
      <img src={`/info-icons/${icon}.svg`} className={`h-8 w-8 mr-4 ${imageClassName}`} alt="icon" />
      <div>
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="text-md font-bold">{value}</p>
      </div>
    </div>
  );
};