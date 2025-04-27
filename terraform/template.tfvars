database_url = "postgresql://username:password@hostname:5432/database_name"
google_auth_endpoint = "https://your-google-auth-endpoint.com"

engine_image = "public.ecr.aws/h9h4w9x1/chess-engine:latest" # Fall back "hekypto/chess-engine:latest"

websocket_image = "public.ecr.aws/h9h4w9x1/websocketchesscloud:latest"

matchmaking_image = "public.ecr.aws/h9h4w9x1/matchmaking:latest"

# engine_api_url = "http://custom-engine-url:4000"
# websocket_url = "ws://custom-websocket-url:8000/ws"
# matchmaking_url = "http://custom-matchmaking-url:8001"