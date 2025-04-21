import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLocationStore } from './location.store';

beforeEach(() => {
  useLocationStore.setState({
    location: { latitude: null, longitude: null },
  });
});

describe('useLocationStore', () => {
  it('sets location when fetchCurrentLocation is called', async () => {
    const mockCoords = {
      coords: {
        latitude: -26.2041,
        longitude: 28.0473,
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn((success) =>
        success(mockCoords)
      ),
    };

    useLocationStore.getState().fetchCurrentLocation();

    const { latitude, longitude } = useLocationStore.getState().location;

    expect(latitude).toBe(mockCoords.coords.latitude);
    expect(longitude).toBe(mockCoords.coords.longitude);
  });
});
