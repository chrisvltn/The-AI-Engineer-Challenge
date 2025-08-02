# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a streaming chat interface using OpenAI's API with enhanced security measures. Users provide their own OpenAI API keys to pay for their own AI usage.

## 🔒 Security Features

- **User-provided API keys** - Users provide their own OpenAI API keys
- **Input validation & sanitization** - Prevents injection attacks and ensures data integrity
- **CORS protection** - Configurable cross-origin resource sharing
- **Request validation** - Comprehensive input validation using Pydantic

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Users need their own OpenAI API key

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install the required dependencies:
```bash
pip install fastapi uvicorn openai pydantic
```

## Running the Server

1. Make sure you're in the `api` directory:
```bash
cd api
```

2. Start the server:
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
```json
{
    "developer_message": "string",
    "user_message": "string",
    "chat_history": [
        {
            "role": "user|ai",
            "content": "string"
        }
    ],
    "model": "gpt-4.1-mini",  // optional
    "api_key": "sk-your-openai-api-key"
}
```
- **Response**: Streaming text response

### Health Check
- **URL**: `/api/health`
- **Method**: GET
- **Response**: `{"status": "ok"}`

## Security Configuration

### Input Validation
- Message length limit: 10,000 characters
- Chat history limit: 50 messages
- Allowed models: `gpt-4.1-mini`, `gpt-4o-mini`, `gpt-3.5-turbo`
- Input sanitization removes potentially dangerous characters
- API key validation (must start with "sk-")

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CORS Configuration

The API is configured to accept requests from any origin (`*`). This can be modified in the `app.py` file if you need to restrict access to specific domains.

## Error Handling

The API includes comprehensive error handling for:
- Invalid input validation (422)
- Invalid API keys
- OpenAI API errors
- General server errors (500)

## Production Deployment

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set up proper logging
- [ ] Configure firewall rules
- [ ] Use a reverse proxy (nginx/Apache)
- [ ] Set up monitoring and alerting

## Troubleshooting

### Common Issues
1. **"API key must start with sk-"**
   - Solution: Ensure you're using a valid OpenAI API key
   
2. **"Validation error"**
   - Solution: Check your input format and ensure all required fields are present

## Contributing

When contributing to this API:
- Follow security best practices
- Add tests for new features
- Update documentation for any changes
- Ensure input validation is comprehensive 