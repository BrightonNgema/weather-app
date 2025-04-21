import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { useGetWeeklyWeather } from './useGetWeeklyWeather';
import { getHistorical, getForecast } from '../../api/weather';
import { useLocationStore } from '../../store';
import { DailyForecastResponse } from '../../types/dailyForecast.type';
import { mockHistoricalData } from './mockData/mockHistoricalData';


vi.mock('../../api/weather');
vi.mock('../../store');
vi.mock('moment', () => {
  const momentMock = () => {
    return {
      subtract: () => ({
        format: () => '2025-04-18'
      }),
      format: () => '2025-04-21'
    };
  };
  momentMock.format = vi.fn();

  return {
    default: momentMock
  };
});

describe('useGetWeeklyWeather', () => {
  afterEach(() => {
    cleanup();
  });
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    vi.mocked(useLocationStore).mockReturnValue({
      location: { latitude: -26.2041, longitude: 28.0473 },
      fetchCurrentLocation: vi.fn()
    });

    const mockForecastData = {
      data: [
        {
          valid_date: '2025-04-21',
          temp: 22.5,
          weather: { description: 'Clear' }
        },
        {
          valid_date: '2025-04-22',
          temp: 23.1,
          weather: { description: 'Clear' }
        },
        {
          valid_date: '2025-04-23',
          temp: 21.5,
          weather: { description: 'Partly cloudy' }
        },
        {
          valid_date: '2025-04-24',
          temp: 20.2,
          weather: { description: 'Cloudy' }
        },
        {
          valid_date: '2025-04-25',
          temp: 19.8,
          weather: { description: 'Light rain' }
        }
      ]
    };
    
    vi.mocked(getHistorical).mockResolvedValue(mockHistoricalData);
    vi.mocked(getForecast).mockResolvedValue(mockForecastData as DailyForecastResponse);
  });

  test('should fetch weekly weather data when location is available', async () => {
    const { result } = renderHook(() => useGetWeeklyWeather());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.history).toEqual([]);
    expect(result.current.forecast).toBe(null);
    expect(result.current.error).toBe(null);
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(getHistorical).toHaveBeenCalledWith(
      { latitude: -26.2041, longitude: 28.0473 },
      '2025-04-18',
      '2025-04-21'
    );
    
    expect(getForecast).toHaveBeenCalledWith({ latitude: -26.2041, longitude: 28.0473 });
    
    expect(result.current.history).toHaveLength(3);
    expect(result.current.forecast?.data).toHaveLength(3);
    expect(result.current.error).toBe(null);
  });

  test('should call fetchCurrentLocation when location is not available', async () => {
    vi.mocked(useLocationStore).mockReturnValue({
      location: null,
      fetchCurrentLocation: vi.fn()
    });
    
    renderHook(() => useGetWeeklyWeather());
    
    const { fetchCurrentLocation } = useLocationStore();
    expect(fetchCurrentLocation).toHaveBeenCalled();
    expect(getHistorical).not.toHaveBeenCalled();
    expect(getForecast).not.toHaveBeenCalled();
  });

  test('should handle API error gracefully', async () => {
    vi.mocked(getHistorical).mockRejectedValue(new Error('Failed to fetch historical data'));
    
    const { result } = renderHook(() => useGetWeeklyWeather());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.history).toEqual([]);
    expect(result.current.forecast).toBe(null);
    expect(result.current.error).toBe('Failed to fetch historical data');
  });

  test('should refetch weather when location changes', async () => {
    const { rerender } = renderHook(() => useGetWeeklyWeather());
    
    await waitFor(() => expect(getHistorical).toHaveBeenCalledTimes(1));
    
    vi.mocked(useLocationStore).mockReturnValue({
      location: { latitude: 34.0522, longitude: -118.2437 },
      fetchCurrentLocation: vi.fn()
    });
    
    rerender();
    
    await waitFor(() => expect(getHistorical).toHaveBeenCalledTimes(2));
    
    expect(getHistorical).toHaveBeenCalledWith(
      { latitude: 34.0522, longitude: -118.2437 },
      '2025-04-18',
      '2025-04-21'
    );
    
    expect(getForecast).toHaveBeenCalledWith({ latitude: 34.0522, longitude: -118.2437 });
  });

  test('should not fetch weather when location coordinates are missing', async () => {
    vi.mocked(useLocationStore).mockReturnValue({
      location: {},
      fetchCurrentLocation: vi.fn()
    });
    
    renderHook(() => useGetWeeklyWeather());
    
    const { fetchCurrentLocation } = useLocationStore();
    expect(fetchCurrentLocation).toHaveBeenCalled();
    expect(getHistorical).not.toHaveBeenCalled();
    expect(getForecast).not.toHaveBeenCalled();
  });

  test('should filter out current day from forecast', async () => {
    const { result } = renderHook(() => useGetWeeklyWeather());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.forecast?.data.some(item => item.valid_date === '2025-04-21')).toBe(false);
    expect(result.current.forecast?.data).toHaveLength(3);
  });

  test('should allow manual refresh via fetchWeeklyWeather', async () => {
    const { result } = renderHook(() => useGetWeeklyWeather());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    vi.clearAllMocks();
    
    await result.current.fetchWeeklyWeather();
    
    expect(getHistorical).toHaveBeenCalledTimes(1);
    expect(getForecast).toHaveBeenCalledTimes(1);
  });
});