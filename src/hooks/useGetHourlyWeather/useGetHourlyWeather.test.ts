import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { useGetHourlyWeather } from './useGetHourlyWeather';
import { getHourly } from '../../api/weather';
import { useLocationStore } from '../../store';
import { mockWeatherData } from './mockData/hourlyMockData';

vi.mock('../../api/weather');
vi.mock('../../store');

describe('useGetHourlyWeather', () => {
  afterEach(() => {
    cleanup();
  });
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    vi.mocked(useLocationStore).mockReturnValue({
      location: { latitude: -26.2041, longitude: 28.0473 },
      fetchCurrentLocation: vi.fn()
    });
    
    vi.mocked(getHourly).mockResolvedValue({
        data: mockWeatherData,
        city_name: '',
        country_code: '',
        lat: 0,
        lon: 0,
        state_code: '',
        timezone: ''
    });
  });

  test('should fetch hourly weather data when location is available', async () => {
    const { result } = renderHook(() => useGetHourlyWeather());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.hourlyWeather).toEqual([]);
    expect(result.current.error).toBe(null);
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(getHourly).toHaveBeenCalledWith({ latitude: -26.2041, longitude: 28.0473 });
    
    expect(result.current.hourlyWeather).toHaveLength(4);
    expect(result.current.hourlyWeather[0].temp).toBe(12.3);
    expect(result.current.hourlyWeather[1].datetime).toBe('2025-04-21:01');
    expect(result.current.error).toBe(null);
  });

  test('should call fetchCurrentLocation when location is not available', async () => {
    vi.mocked(useLocationStore).mockReturnValue({
      location: null,
      fetchCurrentLocation: vi.fn()
    });
    
    renderHook(() => useGetHourlyWeather());
    
    const { fetchCurrentLocation } = useLocationStore();
    expect(fetchCurrentLocation).toHaveBeenCalled();
    expect(getHourly).not.toHaveBeenCalled();
  });

  test('should handle API error gracefully', async () => {
    vi.mocked(getHourly).mockRejectedValue(new Error('Failed to fetch hourly weather'));
    
    const { result } = renderHook(() => useGetHourlyWeather());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.hourlyWeather).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch hourly weather');
  });

  test('should refetch weather when location changes', async () => {
    const { rerender } = renderHook(() => useGetHourlyWeather());
    
    await waitFor(() => expect(getHourly).toHaveBeenCalledTimes(1));
    
    vi.mocked(useLocationStore).mockReturnValue({
      location: { latitude: 34.0522, longitude: -118.2437 },
      fetchCurrentLocation: vi.fn()
    });
    
    rerender();
    
    await waitFor(() => expect(getHourly).toHaveBeenCalledTimes(2));
    
    expect(getHourly).toHaveBeenCalledWith({ latitude: 34.0522, longitude: -118.2437 });
  });

  test('should not fetch weather when location coordinates are missing', async () => {
    vi.mocked(useLocationStore).mockReturnValue({
      location: { },
      fetchCurrentLocation: vi.fn()
    });
    
    renderHook(() => useGetHourlyWeather());
    
    const { fetchCurrentLocation } = useLocationStore();
    expect(fetchCurrentLocation).toHaveBeenCalled();
    expect(getHourly).not.toHaveBeenCalled();
  });

  test('should set empty array when API returns no data', async () => {
    vi.mocked(getHourly).mockResolvedValue({
        city_name: 'jhb',
        data: [],
        country_code: '',
        lat: 0,
        lon: 0,
        state_code: '',
        timezone: ''
    });
    
    const { result } = renderHook(() => useGetHourlyWeather());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.hourlyWeather).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});