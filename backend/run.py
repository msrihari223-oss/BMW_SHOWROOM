import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from dotenv import load_dotenv
import uvicorn
import main

if __name__ == "__main__":
    load_dotenv()
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"[Server] Starting BMW Luxury Showroom API on http://{host}:{port} ...")
    uvicorn.run(main.app, host=host, port=port)
