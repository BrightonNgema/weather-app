# 🌤️ Weather App

A sleek and responsive weather dashboard built with **React**, **Vite**, and **Tailwind CSS**. It visualizes real-time, hourly, weekly, and historical weather data using clean components and custom logic.

## 🔗 Live Preview

Check out the live demo: [https://weather-app-dusky-seven-79.vercel.app/](https://weather-app-dusky-seven-79.vercel.app/)

---

## 🚀 Features

- **Current Weather Overview**  
  Shows live conditions: temperature, UV index, wind speed/direction, pressure, humidity, and more.

- **Hourly Forecast**  
  Displays the next 8 hours of weather using hourly snapshots.

- **3-Day Forecast**  
  Provides an interactive summary of the upcoming week’s weather.

- **Historical Weather Insights**  
  Shows the last 3 days of historical weather with icon estimation via custom logic.

- **Day Selection**  
  Click a forecast day to view detailed weather in the summary panel.

- **Responsive UI**  
  Built with Tailwind CSS for mobile-first design and graceful scaling.

- **Loader Handling**  
  Displays a loading animation during async fetches for a smoother experience.

---

## 🛠️ Tech Stack

- **React + Vite** for a blazing-fast dev/build workflow
- **Tailwind CSS** for utility-first styling
- **Moment.js** for time formatting
- **Vitest** for unit testing
- **Weather APIs** for real-time and historical data

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project with the following:

```env
VITE_WEATHER_API_KEY=your_weather_api_key
VITE_BASE_URL=https://api.weatherbit.io/v2.0/
```

> - `VITE_WEATHER_API_KEY`: Your API key from a weather provider (e.g. Weatherbit, OpenWeather).
> - `VITE_BASE_URL`: The base URL of the API service you are using (e.g.`https://api.weatherbit.io/v2.0`).

---

## 🔧 Running the App Locally

```bash
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

---

## 🧪 Running Tests

```bash
yarn test
```

Includes unit tests for:
- Data hooks
- Weather estimation utils
- Core components (with mocking)

---

## 📁 Directory Structure

```
/
├── src/
│   ├── components/       # UI widgets (cards, info panels, etc.)
│   ├── hooks/            # Weather data-fetching hooks
│   ├── utils/            # Logic to estimate rain, weather codes
│   ├── types/            # TypeScript models
│   └── App.tsx           # Main component
├── public/               # Static assets (icons, manifest, etc.)
├── .env                  # Local environment variables
├── vite.config.ts        # Vite config
└── index.html            # Entry HTML
```

---

## 🔮 Nice to have features

- 🌙 Dark mode toggle  
- 🌍 Multi-language support (i18n)  
- 📍 City search and location-based results  
- ❤️ Store favourite cities

---