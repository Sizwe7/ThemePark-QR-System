# 🚀 Deployment Guide - Theme Park QR Payment & Entrance System

This guide provides step-by-step instructions for deploying the Theme Park QR Payment & Entrance System in various environments.

## 📋 Prerequisites

### System Requirements

- **Operating System**: Linux (Ubuntu 20.04+), macOS 10.15+, or Windows 10+
- **Memory**: Minimum 8GB RAM (16GB recommended for production)
- **Storage**: Minimum 20GB free space
- **Network**: Internet connection for package downloads

### Required Software

- **Java 17+** (OpenJDK or Oracle JDK)
- **Python 3.11+** with pip
- **Node.js 20+** with npm/pnpm
- **PostgreSQL 15+**
- **Redis 7+**
- **Git**
- **Docker & Docker Compose** (optional but recommended)

## 🏗️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ThemePark-QR-System.git
cd ThemePark-QR-System
```

### 2. Database Setup

#### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

#### Database Configuration

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE themepark_qr_system;
CREATE USER themepark_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE themepark_qr_system TO themepark_user;
\q

# Initialize database schema
psql -U themepark_user -d themepark_qr_system -f backend/database/init-scripts/01_create_schemas.sql
psql -U themepark_user -d themepark_qr_system -f backend/database/init-scripts/02_sample_data.sql
```

### 3. Redis Setup

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows:**
Download from [Redis official website](https://redis.io/download) or use WSL

### 4. Backend Services Setup

#### Core API (Spring Boot)

```bash
cd backend/core-api

# Create application.yml configuration
cat > src/main/resources/application.yml << EOF
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/themepark_qr_system
    username: themepark_user
    password: your_secure_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  redis:
    host: localhost
    port: 6379
    timeout: 2000ms
  
  security:
    jwt:
      secret: your_jwt_secret_key_here_make_it_long_and_secure
      expiration: 86400000

server:
  port: 8080

logging:
  level:
    com.themepark.qrsystem: INFO
EOF

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

#### Analytics Service (Flask)

```bash
cd backend/analytics-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://themepark_user:your_secure_password@localhost:5432/themepark_qr_system
FLASK_ENV=development
SECRET_KEY=your_flask_secret_key_here
REDIS_URL=redis://localhost:6379/0
EOF

# Run the service
python src/main.py
```

### 5. Frontend Applications Setup

#### Visitor Mobile App

```bash
cd frontend/visitor-mobile-app

# Install dependencies
pnpm install

# Create environment file
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ANALYTICS_API_URL=http://localhost:5001/api/v1
EOF

# Start development server
pnpm run dev
```

#### Staff Dashboard

```bash
cd frontend/staff-dashboard

# Install dependencies
pnpm install

# Create environment file
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ANALYTICS_API_URL=http://localhost:5001/api/v1
EOF

# Start development server
pnpm run dev
```

### 6. Verify Installation

Access the following URLs to verify everything is working:

- **Visitor App**: http://localhost:3000
- **Staff Dashboard**: http://localhost:3001
- **Core API**: http://localhost:8080/api/v1/health
- **Analytics API**: http://localhost:5001/api/v1/health
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 🐳 Docker Deployment

### 1. Using Docker Compose (Recommended)

```bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: themepark_qr_system
      POSTGRES_USER: themepark_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/database/init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - themepark-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - themepark-network

  core-api:
    build: ./backend/core-api
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/themepark_qr_system
      SPRING_DATASOURCE_USERNAME: themepark_user
      SPRING_DATASOURCE_PASSWORD: your_secure_password
      SPRING_REDIS_HOST: redis
      JWT_SECRET: your_jwt_secret_key_here
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    networks:
      - themepark-network

  analytics-service:
    build: ./backend/analytics-service
    environment:
      DATABASE_URL: postgresql://themepark_user:your_secure_password@postgres:5432/themepark_qr_system
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: your_flask_secret_key
    ports:
      - "5001:5001"
    depends_on:
      - postgres
      - redis
    networks:
      - themepark-network

  visitor-app:
    build: ./frontend/visitor-mobile-app
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api/v1
      VITE_ANALYTICS_API_URL: http://localhost:5001/api/v1
    ports:
      - "3000:3000"
    networks:
      - themepark-network

  staff-dashboard:
    build: ./frontend/staff-dashboard
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api/v1
      VITE_ANALYTICS_API_URL: http://localhost:5001/api/v1
    ports:
      - "3001:3001"
    networks:
      - themepark-network

volumes:
  postgres_data:

networks:
  themepark-network:
    driver: bridge
EOF

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Individual Docker Builds

#### Core API Dockerfile

```bash
# Create backend/core-api/Dockerfile
cat > backend/core-api/Dockerfile << EOF
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
EOF
```

#### Analytics Service Dockerfile

```bash
# Create backend/analytics-service/Dockerfile
cat > backend/analytics-service/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 5001

CMD ["python", "src/main.py"]
EOF
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# Security Group: Allow ports 22, 80, 443, 8080, 5001, 3000, 3001

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone https://github.com/your-username/ThemePark-QR-System.git
cd ThemePark-QR-System
docker-compose up -d
```

#### 2. RDS Database Setup

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
    --db-instance-identifier themepark-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username themepark_user \
    --master-user-password your_secure_password \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx

# Update connection strings in docker-compose.yml
```

#### 3. ElastiCache Redis Setup

```bash
# Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
    --cache-cluster-id themepark-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1
```

### Google Cloud Platform

#### 1. Cloud Run Deployment

```bash
# Build and push images
gcloud builds submit --tag gcr.io/PROJECT_ID/themepark-core-api backend/core-api
gcloud builds submit --tag gcr.io/PROJECT_ID/themepark-analytics backend/analytics-service

# Deploy services
gcloud run deploy themepark-core-api \
    --image gcr.io/PROJECT_ID/themepark-core-api \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated

gcloud run deploy themepark-analytics \
    --image gcr.io/PROJECT_ID/themepark-analytics \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

#### 2. Cloud SQL Setup

```bash
# Create Cloud SQL instance
gcloud sql instances create themepark-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1

# Create database and user
gcloud sql databases create themepark_qr_system --instance=themepark-db
gcloud sql users create themepark_user --instance=themepark-db --password=your_secure_password
```

### Azure Deployment

#### 1. Container Instances

```bash
# Create resource group
az group create --name ThemeParkRG --location eastus

# Create container instances
az container create \
    --resource-group ThemeParkRG \
    --name themepark-core-api \
    --image your-registry/themepark-core-api:latest \
    --ports 8080 \
    --environment-variables \
        SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-server:5432/themepark_qr_system
```

## 🔒 Production Security

### 1. Environment Variables

```bash
# Create secure .env files
cat > .env.production << EOF
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_SSL_MODE=require

# JWT
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
JWT_EXPIRATION=3600000

# Redis
REDIS_URL=redis://user:password@host:6379/0
REDIS_SSL=true

# External APIs
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO
EOF
```

### 2. SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 8080  # Only allow through reverse proxy
sudo ufw deny 5001  # Only allow through reverse proxy
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

### 2. Log Aggregation

```yaml
# ELK Stack
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
  environment:
    - discovery.type=single-node
    - xpack.security.enabled=false

logstash:
  image: docker.elastic.co/logstash/logstash:8.8.0
  volumes:
    - ./logstash/pipeline:/usr/share/logstash/pipeline

kibana:
  image: docker.elastic.co/kibana/kibana:8.8.0
  ports:
    - "5601:5601"
  environment:
    - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run tests
        run: |
          cd backend/core-api
          ./mvnw test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment script here
          ./scripts/deploy.sh
```

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U themepark_user -d themepark_qr_system -h localhost -p 5432

# Check logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Check logs
sudo tail -f /var/log/redis/redis-server.log
```

#### Application Startup Issues
```bash
# Check Java application logs
docker-compose logs core-api

# Check Python application logs
docker-compose logs analytics-service

# Check system resources
htop
df -h
```

### Performance Optimization

#### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_tickets_user_id ON access_control.tickets(user_id);
CREATE INDEX idx_transactions_created_at ON payment_system.transactions(created_at);
CREATE INDEX idx_visitor_logs_timestamp ON analytics.visitor_logs(timestamp);
```

#### Application Tuning
```yaml
# JVM tuning for Core API
JAVA_OPTS: "-Xms512m -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Python tuning for Analytics Service
GUNICORN_WORKERS: 4
GUNICORN_THREADS: 2
```

## 📞 Support

For deployment issues or questions:

- **Documentation**: Check the [project wiki](https://github.com/your-username/ThemePark-QR-System/wiki)
- **Issues**: Create an issue on [GitHub](https://github.com/your-username/ThemePark-QR-System/issues)
- **Email**: sc.maseko@themepark.com

---

**Happy Deploying! 🚀**

