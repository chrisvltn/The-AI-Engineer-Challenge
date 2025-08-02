# AI Engineer Challenge Frontend

A beautiful, modern chat interface for the AI Engineer Challenge built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 💬 **Real-time Chat**: Stream responses from GPT-4.1-mini and other models
- ⚙️ **Configurable Settings**: Customize API key, system prompt, and model selection
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔒 **Secure API Key Input**: Password-style input for sensitive information
- ⚡ **Streaming Responses**: See AI responses appear in real-time
- 🎯 **Modern UX**: Smooth animations, loading states, and intuitive interface

## Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- FastAPI backend running (see `/api` directory)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

Make sure your FastAPI backend is running:

```bash
cd api
pip install -r requirements.txt
python app.py
```

The backend should be running on `http://localhost:8000`.

## Usage

1. **Configure Settings**: Click the "Settings" button in the top-right corner
2. **Enter API Key**: Add your OpenAI API key in the settings panel
3. **Customize System Prompt**: Modify the developer message to change AI behavior
4. **Select Model**: Choose between GPT-4.1-mini, GPT-4o-mini, or GPT-3.5-turbo
5. **Start Chatting**: Type your message and press Enter or click Send

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main chat interface
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

### Styling

The application uses a custom boho color palette:

- **Boho Colors**: Warm beige and cream tones
- **Sage Colors**: Muted green tones for accents
- **Typography**: Inter font family for modern readability
- **Animations**: Smooth transitions and loading states

## Deployment

This frontend is designed to be deployed on Vercel. The `next.config.js` includes API rewrites to proxy requests to your FastAPI backend.

### Environment Variables

For production deployment, you may want to set environment variables for the API endpoint:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure your FastAPI backend is running on port 8000
2. **CORS Issues**: The backend includes CORS middleware, but check if it's properly configured
3. **API Key Issues**: Verify your OpenAI API key is valid and has sufficient credits

### Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API key and backend connection
3. Ensure all dependencies are properly installed

## Contributing

This frontend is part of the AI Engineer Challenge. Feel free to enhance it with additional features while maintaining the boho aesthetic and user experience.