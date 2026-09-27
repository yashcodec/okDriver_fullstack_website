FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source files
COPY . .

EXPOSE 8001

# Run Django dev server (for demo purposes)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
