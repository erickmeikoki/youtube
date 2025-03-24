# YouTube Analytics App

A React application that provides personalized YouTube video recommendations and tracks your viewing habits with detailed analytics.

## Features

- YouTube video recommendations based on your watch history
- Personalized recommendations using category analysis
- Watch history tracking
- Detailed analytics dashboard with:
  - Daily watch time tracking
  - Video count tracking
  - Usage graphs and statistics
- Accessibility features:
  - Font size controls
  - High contrast mode
  - Reduced motion options
- Offline support with data caching
- Responsive design

## Tech Stack

- React
- Material-UI
- React Router
- YouTube Data API
- Recharts for analytics visualization
- Local Storage for data persistence

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/youtube-analytics-app.git
   cd youtube-analytics-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your YouTube API key:

   ```
   VITE_YOUTUBE_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and service functions
├── theme/             # Theme configuration
└── App.jsx           # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# youtube
