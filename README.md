# GoDeck

GoDeck is a web-based audio mixer for PulseAudio, allowing you to control application volumes through a clean and intuitive interface. It provides real-time volume control and muting capabilities for individual applications running on your Linux system.

## Features

- Real-time volume control for individual applications
- Application-specific mute toggles
- Clean, modern interface
- Auto-updating audio session display
- System-wide volume management
- Responsive design that works on desktop and mobile

## Prerequisites

- Linux system with PulseAudio
- Python 3.6 or higher
- pip (Python package installer)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/godeck.git
cd godeck
```

2. Install the required Python packages:
```bash
pip install flask pulsectl
```

## Usage

1. Start the application:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

The interface will automatically display all active audio sessions. Each application will have its own volume slider and mute button.

### Controls

- **Volume Slider**: Drag up/down to adjust application volume
- **Mute Button**: Click to toggle mute for specific applications
- **Volume Display**: Shows current volume percentage

## Development

The application structure is as follows:

```
godeck/
├── app.py              # Flask backend
├── static/
│   ├── script.js       # Frontend JavaScript
│   └── style.css       # CSS styling
└── templates/
    └── index.html      # Main HTML template
```

### Backend (app.py)
- Flask server handling HTTP requests
- PulseAudio integration via pulsectl
- REST API endpoints for volume control

### Frontend (script.js)
- Real-time audio session monitoring
- Volume control interface
- Mute toggle functionality

## API Endpoints

- `GET /api/audio-sessions`: Returns list of active audio sessions
- `POST /api/set-volume`: Sets volume for specific application
- `POST /api/toggle-mute`: Toggles mute for specific application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- PulseAudio team for the audio system
- Flask team for the web framework
- pulsectl developers for the Python PulseAudio bindings