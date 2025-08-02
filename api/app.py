# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel, validator
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import re
from typing import Optional, List

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Security: Input sanitization function
def sanitize_text(text: str) -> str:
    """Sanitize text input to prevent injection attacks"""
    if not text:
        return ""
    # Remove potentially dangerous characters and normalize
    sanitized = re.sub(r'[<>"\']', '', text.strip())
    return sanitized[:10000]  # Limit message length

# Define the data model for chat messages
class ChatMessage(BaseModel):
    role: str  # 'user' or 'ai'
    content: str
    
    @validator('role')
    def validate_role(cls, v):
        if v not in ['user', 'ai']:
            raise ValueError('Role must be either "user" or "ai"')
        return v
    
    @validator('content')
    def validate_content(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Content cannot be empty')
        return sanitize_text(v)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the developer/system
    user_message: str      # Message from the user
    chat_history: List[ChatMessage] = []  # Full conversation history
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication
    
    @validator('developer_message')
    def validate_developer_message(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Developer message cannot be empty')
        return sanitize_text(v)
    
    @validator('user_message')
    def validate_user_message(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('User message cannot be empty')
        return sanitize_text(v)
    
    @validator('model')
    def validate_model(cls, v):
        allowed_models = ['gpt-4.1-mini', 'gpt-4o-mini', 'gpt-3.5-turbo']
        if v not in allowed_models:
            raise ValueError(f'Model must be one of: {", ".join(allowed_models)}')
        return v
    
    @validator('chat_history')
    def validate_chat_history(cls, v):
        if len(v) > 50:  # Limit conversation history to prevent abuse
            raise ValueError('Chat history too long (max 50 messages)')
        return v
    
    @validator('api_key')
    def validate_api_key(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('API key cannot be empty')
        if not v.startswith('sk-'):
            raise ValueError('API key must start with "sk-"')
        return v.strip()

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the user-provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Build the messages array for OpenAI API
        messages = []
        
        # Add the system message (developer message)
        messages.append({"role": "system", "content": request.developer_message})
        
        # Add the conversation history
        for message in request.chat_history:
            # Convert 'ai' role to 'assistant' for OpenAI API
            role = "assistant" if message.role == "ai" else message.role
            messages.append({"role": role, "content": message.content})
        
        # Add the current user message
        messages.append({"role": "user", "content": request.user_message})
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=messages,
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
