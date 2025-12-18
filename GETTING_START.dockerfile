### Multi-stage build: first build frontend, then build Python image ###

# Builder stage: build the Vite/React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy frontend package files and install
COPY frontend/package*.json frontend/
WORKDIR /app/frontend
RUN npm ci --silent

# Copy frontend source and build into /app/static/react (vite outDir is ../static/react)
COPY frontend/ ./
RUN npm run build

# Final stage: Python app
FROM python:3.12-slim
WORKDIR /app

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Copy built frontend from the builder stage into the static folder
# Vite is configured to output to ../static/react, so the builder will have /app/static/react
COPY --from=frontend-builder /app/static/react /app/static/react

# Expose Flask port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
