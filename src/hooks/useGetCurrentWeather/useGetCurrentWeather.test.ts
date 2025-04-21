import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetCurrentWeather } from './useGetCurrentWeather';
import { getCurrent } from '../../api/weather';
import { useLocationStore } from '../../store';

vi.mock('../../api/weather');
vi.mock('../../store');

const mockData = {
      count: 1,
      data: [
        {
            city_name: 'Johannesburg',
            temp: 22.5,
            weather: {
                description: 'Clear sky',
                icon: '',
                code: 0
            },
            app_temp: 0,
            aqi: 0,
            clouds: 0,
            country_code: '',
            datetime: '',
            dewpt: 0,
            dhi: 0,
            dni: 0,
            elev_angle: 0,
            ghi: 0,
            gust: null,
            h_angle: 0,
            lat: 0,
            lon: 0,
            ob_time: '',
            pod: '',
            precip: 0,
            pres: 0,
            rh: 0,
            slp: 0,
            snow: 0,
            solar_rad: 0,
            sources: [],
            state_code: '',
            station: '',
            sunrise: '',
            sunset: '',
            timezone: '',
            ts: 0,
            uv: 0,
            vis: 0,
            wind_cdir: '',
            wind_cdir_full: '',
            wind_dir: 0,
            wind_spd: 0
        }
      ]
}
describe('useGetCurrentWeather', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    vi.mocked(useLocationStore).mockReturnValue({
      location: { latitude: -26.2041, longitude: 28.0473 },
      fetchCurrentLocation: vi.fn()
    });
    
    vi.mocked(getCurrent).mockResolvedValue(mockData);
  });

  test('should fetch weather data when location is available', async () => {

    const { result } = renderHook(() => useGetCurrentWeather());
    

    expect(result.current.loading).toBe(true);
    expect(result.current.weather).toBe(null);
    expect(result.current.error).toBe(null);
    

    await waitFor(() => expect(result.current.loading).toBe(false));
    

    expect(getCurrent).toHaveBeenCalledWith({ latitude: -26.2041, longitude: 28.0473 });
    

    expect(result.current.weather).toEqual(mockData.data[0]);
    expect(result.current.error).toBe(null);
  });

  test('should call fetchCurrentLocation when location is not available', async () => {
    vi.mocked(useLocationStore).mockReturnValue({
      location: null,
      fetchCurrentLocation: vi.fn()
    });
    
    renderHook(() => useGetCurrentWeather());
    
    const { fetchCurrentLocation } = useLocationStore();
    expect(fetchCurrentLocation).toHaveBeenCalled();
    expect(getCurrent).not.toHaveBeenCalled();
  });

  test('should handle API error gracefully', async () => {
    vi.mocked(getCurrent).mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => useGetCurrentWeather());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.weather).toBe(null);
    expect(result.current.error).toBe('Network error');
  });

  test('should refetch weather when location changes', async () => {
    const { rerender } = renderHook(() => useGetCurrentWeather());
    
    await waitFor(() => expect(getCurrent).toHaveBeenCalledTimes(1));
    
    vi.mocked(useLocationStore).mockReturnValue({
      location: { latitude: 34.0522, longitude: -118.2437 },
      fetchCurrentLocation: vi.fn()
    });
    
    rerender();
    
    await waitFor(() => expect(getCurrent).toHaveBeenCalledTimes(2));
    
    expect(getCurrent).toHaveBeenCalledWith({ latitude: 34.0522, longitude: -118.2437 });
  });

  test('should not fetch weather when location coordinates are missing', async () => {
    vi.mocked(useLocationStore).mockReturnValue({
      fetchCurrentLocation: vi.fn()
    });
    
    renderHook(() => useGetCurrentWeather());
    
    const { fetchCurrentLocation } = useLocationStore();
    expect(fetchCurrentLocation).toHaveBeenCalled();
    expect(getCurrent).not.toHaveBeenCalled();
  });

  test('should handle empty data from API response', async () => {
    vi.mocked(getCurrent).mockResolvedValue({
      count: 0,
      data: []
    });
    
    const { result } = renderHook(() => useGetCurrentWeather());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.weather).toBe(undefined);
  });
});