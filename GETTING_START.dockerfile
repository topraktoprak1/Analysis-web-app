# Use the official Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy your Python files and requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app
CMD ["python", "app.py"]
