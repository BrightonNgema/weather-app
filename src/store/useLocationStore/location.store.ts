import { create } from 'zustand';

interface Location {
  latitude: number | null;
  longitude: number | null;
  city?: string;
  state?: string;
  country?: string;
}

interface LocationStore {
  location: Location;
  setLocation: (location: Location) => void;
  fetchCurrentLocation: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: {
    latitude: null,
    longitude: null,
  },
  setLocation: (location) => set({ location }),
  fetchCurrentLocation: () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        set({
          location: {
            latitude,
            longitude,
          },
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  },
}));
