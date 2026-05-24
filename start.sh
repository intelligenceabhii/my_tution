#!/bin/bash

# MY Tuition — One-Click Start Script
# Starts Backend + Frontend + optional MCP server

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

CONDA_ENV="my_project"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
MCP_PORT="${MCP_PORT:-8001}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

cleanup() {
    echo -e "\n${YELLOW}Shutting down all services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill $MCP_PID 2>/dev/null
    wait 2>/dev/null
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

port_available() {
    ! ss -tlnp "sport = :$1" 2>/dev/null | grep -q LISTEN
}

find_free_port() {
    local port="$1"
    while ! port_available "$port"; do
        echo -e "${YELLOW}  Port $port is in use, trying $((port + 1))...${NC}"
        port=$((port + 1))
    done
    echo "$port"
}

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}    MY Tuition — Starting All Services   ${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# ── Check conda ──
if ! command -v conda &>/dev/null; then
    echo -e "${RED}Error: conda not found.${NC}"
    exit 1
fi

# ── Check .env ──
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Warning: backend/.env not found. Creating default...${NC}"
    cat > "$BACKEND_DIR/.env" << 'ENVEOF'
DATABASE_URL=sqlite:///./data/mytution.db
SECRET_KEY=my-tuition-jwt-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
GEMINI_API_KEY=your-gemini-api-key-here
ENVEOF
fi

# ── Backend ──
BACKEND_PORT=$(find_free_port "$BACKEND_PORT")
echo -e "${GREEN}[1/3] Starting Backend (uvicorn on port $BACKEND_PORT)...${NC}"
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate "$CONDA_ENV" 2>/dev/null
cd "$BACKEND_DIR"
mkdir -p data uploads
uvicorn app.main:app --reload --host 0.0.0.0 --port "$BACKEND_PORT" &
BACKEND_PID=$!
sleep 3

if kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo -e "${GREEN}  ✓ Backend running at http://localhost:$BACKEND_PORT${NC}"
else
    echo -e "${RED}  ✗ Backend failed to start${NC}"
    exit 1
fi

# ── Frontend ──
FRONTEND_PORT=$(find_free_port "$FRONTEND_PORT")
echo -e "${GREEN}[2/3] Starting Frontend (Vite on port $FRONTEND_PORT)...${NC}"
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  Installing frontend dependencies...${NC}"
    npm install
fi
npx vite --port "$FRONTEND_PORT" --host &
FRONTEND_PID=$!
sleep 3

if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo -e "${GREEN}  ✓ Frontend running at http://localhost:$FRONTEND_PORT${NC}"
else
    echo -e "${RED}  ✗ Frontend failed to start${NC}"
fi

# ── MCP Server (optional) ──
if [ "${START_MCP:-no}" = "yes" ]; then
    MCP_PORT=$(find_free_port "$MCP_PORT")
    echo -e "${GREEN}[3/3] Starting MCP Server (port $MCP_PORT)...${NC}"
    conda activate "$CONDA_ENV" 2>/dev/null
    cd "$BACKEND_DIR"
    python app/mcp/mcp_server.py --port "$MCP_PORT" &
    MCP_PID=$!
    sleep 2
    if kill -0 "$MCP_PID" 2>/dev/null; then
        echo -e "${GREEN}  ✓ MCP Server running on port $MCP_PORT${NC}"
    else
        echo -e "${RED}  ✗ MCP Server failed to start${NC}"
    fi
else
    echo -e "${GREEN}[3/3] MCP Server skipped (set START_MCP=yes to enable)${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  All services are running!              ${NC}"
echo -e "${CYAN}                                        ${NC}"
echo -e "${CYAN}  Frontend : http://localhost:$FRONTEND_PORT${NC}"
echo -e "${CYAN}  Backend  : http://localhost:$BACKEND_PORT${NC}"
echo -e "${CYAN}  Health   : http://localhost:$BACKEND_PORT/health${NC}"
echo -e "${CYAN}                                        ${NC}"
echo -e "${CYAN}  Press Ctrl+C to stop all services.    ${NC}"
echo -e "${CYAN}========================================${NC}"

wait
