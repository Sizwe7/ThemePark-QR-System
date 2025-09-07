# Theme Park QR Payment & Entrance System

**Version:** 1.0.0  
**Author:** SC MASEKO 402110470  
**Date:** September 2025

A comprehensive digital solution for theme park operations, featuring QR-based payment processing, entrance management, real-time analytics, and visitor experience optimization.

## 🎯 Project Overview

The Theme Park QR Payment & Entrance System is a full-stack application designed to modernize theme park operations through digital transformation. The system provides seamless visitor experiences while offering powerful management tools for park staff and administrators.

### Key Features

- **QR-Based Entry System**: Contactless ticket validation and park entry
- **Mobile Payment Processing**: Secure, multi-method payment integration
- **Real-Time Analytics**: Comprehensive operational insights and reporting
- **Visitor Mobile App**: Intuitive interface for ticket management and park navigation
- **Staff Dashboard**: Professional management interface with real-time monitoring
- **Queue Management**: Dynamic wait time tracking and optimization
- **Multi-Language Support**: Accessible to international visitors

## 🏗️ System Architecture

### Technology Stack

#### Backend Services
- **Core API**: Spring Boot 3.1.5 (Java 17)
- **Analytics Service**: Flask (Python 3.11)
- **Database**: PostgreSQL 15+ with Redis caching
- **Authentication**: JWT-based security with role-based access control

#### Frontend Applications
- **Visitor Mobile App**: React 18 with Vite
- **Staff Dashboard**: React 18 with advanced analytics
- **UI Framework**: Tailwind CSS + shadcn/ui components

#### Infrastructure
- **Containerization**: Docker & Docker Compose
- **API Documentation**: OpenAPI/Swagger
- **Monitoring**: Built-in health checks and metrics
- **Payment Processing**: Stripe integration

### Project Structure

```
ThemePark-QR-System/
├── docs/                           # Project documentation
│   ├── api-documentation/          # API specifications
│   ├── architecture/               # System design documents
│   └── deployment/                 # Deployment guides
├── backend/                        # Backend services
│   ├── core-api/                   # Spring Boot core API
│   │   ├── src/main/java/          # Java source code
│   │   ├── src/main/resources/     # Configuration files
│   │   └── pom.xml                 # Maven dependencies
│   ├── analytics-service/          # Flask analytics service
│   │   ├── src/                    # Python source code
│   │   ├── requirements.txt        # Python dependencies
│   │   └── venv/                   # Virtual environment
│   └── database/                   # Database scripts
│       └── init-scripts/           # Schema and sample data
├── frontend/                       # Frontend applications
│   ├── visitor-mobile-app/         # React visitor app
│   │   ├── src/                    # React components
│   │   ├── public/                 # Static assets
│   │   └── package.json            # Node dependencies
│   └── staff-dashboard/            # React staff dashboard
│       ├── src/                    # React components
│       ├── public/                 # Static assets
│       └── package.json            # Node dependencies
├── deployment/                     # Deployment configurations
│   ├── docker/                     # Docker configurations
│   └── kubernetes/                 # K8s manifests (if applicable)
└── scripts/                        # Utility scripts
    ├── setup.sh                    # Environment setup
    └── deploy.sh                   # Deployment script
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+** (for Spring Boot core API)
- **Python 3.11+** (for analytics service)
- **Node.js 20+** (for React applications)
- **PostgreSQL 15+** (database)
- **Redis 7+** (caching)
- **Git** (version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ThemePark-QR-System.git
   cd ThemePark-QR-System
   ```

2. **Set up the database**
   ```bash
   # Install PostgreSQL and create database
   createdb themepark_qr_system
   
   # Run initialization scripts
   psql -d themepark_qr_system -f backend/database/init-scripts/01_create_schemas.sql
   psql -d themepark_qr_system -f backend/database/init-scripts/02_sample_data.sql
   ```

3. **Start the analytics service**
   ```bash
   cd backend/analytics-service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python src/main.py
   ```

4. **Start the core API service**
   ```bash
   cd backend/core-api
   ./mvnw spring-boot:run
   ```

5. **Start the frontend applications**
   ```bash
   # Visitor mobile app
   cd frontend/visitor-mobile-app
   pnpm install
   pnpm run dev
   
   # Staff dashboard (in a new terminal)
   cd frontend/staff-dashboard
   pnpm install
   pnpm run dev
   ```

### Access Points

- **Visitor Mobile App**: http://localhost:3000
- **Staff Dashboard**: http://localhost:3001
- **Core API**: http://localhost:8080/api/v1
- **Analytics Service**: http://localhost:5001/api/v1
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 📱 Application Features

### Visitor Mobile App

- **Secure Authentication**: Email/password login with session management
- **Digital Tickets**: QR code generation and display
- **Attraction Information**: Real-time wait times and status
- **Payment Management**: Multiple payment method support
- **Queue Management**: Join virtual queues and track position
- **Profile Management**: Personal preferences and settings

### Staff Dashboard

- **Real-Time Monitoring**: Live visitor counts and system metrics
- **Attraction Management**: Status updates and capacity monitoring
- **Ticket Validation**: QR code scanning and entry verification
- **Analytics Dashboard**: Comprehensive reporting and insights
- **Payment Analytics**: Transaction monitoring and trends
- **System Health**: Performance metrics and alerts

## 🔧 Configuration

### Environment Variables

Create `.env` files in each service directory:

#### Core API (.env)
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/themepark_qr_system
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

#### Analytics Service (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/themepark_qr_system
FLASK_ENV=development
SECRET_KEY=your_flask_secret_key
```

### Database Configuration

The system uses PostgreSQL with the following schemas:
- `user_management`: User accounts and preferences
- `payment_system`: Payment methods and transactions
- `access_control`: Tickets, attractions, and entry logs
- `analytics`: Visitor analytics and operational metrics
- `system_config`: Application settings and audit logs

## 🧪 Testing

### Backend Testing
```bash
# Core API tests
cd backend/core-api
./mvnw test

# Analytics service tests
cd backend/analytics-service
source venv/bin/activate
python -m pytest tests/
```

### Frontend Testing
```bash
# Visitor app tests
cd frontend/visitor-mobile-app
pnpm test

# Staff dashboard tests
cd frontend/staff-dashboard
pnpm test
```

## 📊 API Documentation

### Core API Endpoints

- **Authentication**: `/api/v1/auth/*`
- **User Management**: `/api/v1/users/*`
- **Ticket Management**: `/api/v1/tickets/*`
- **Payment Processing**: `/api/v1/payments/*`
- **Access Control**: `/api/v1/attractions/*`

### Analytics API Endpoints

- **Visitor Analytics**: `/api/v1/analytics/visitor-stats`
- **Real-Time Data**: `/api/v1/analytics/real-time`
- **Dashboard Data**: `/api/v1/dashboard/overview`
- **Reports**: `/api/v1/reports/*`

Full API documentation is available at `/swagger-ui.html` when the services are running.

## 🚢 Deployment

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Individual service deployment**
   ```bash
   # Core API
   cd backend/core-api
   docker build -t themepark-core-api .
   docker run -p 8080:8080 themepark-core-api
   
   # Analytics Service
   cd backend/analytics-service
   docker build -t themepark-analytics .
   docker run -p 5001:5001 themepark-analytics
   ```

### Production Deployment

1. **Environment Setup**
   - Configure production database
   - Set up Redis cluster
   - Configure load balancers
   - Set up SSL certificates

2. **Security Configuration**
   - Update JWT secrets
   - Configure CORS policies
   - Set up API rate limiting
   - Enable audit logging

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission system
- **Data Encryption**: Sensitive data protection
- **API Rate Limiting**: DDoS protection
- **Audit Logging**: Comprehensive activity tracking
- **Input Validation**: SQL injection prevention
- **CORS Configuration**: Cross-origin request security

## 📈 Monitoring & Analytics

### Real-Time Metrics
- Current visitor count
- System performance metrics
- Payment success rates
- Queue wait times
- Attraction capacity utilization

### Business Intelligence
- Daily/weekly/monthly reports
- Revenue analytics
- Visitor behavior patterns
- Operational efficiency metrics
- Customer satisfaction tracking

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests**
5. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push to your fork**
7. **Create a Pull Request**

### Code Standards

- **Java**: Follow Spring Boot best practices
- **Python**: PEP 8 compliance
- **JavaScript**: ESLint configuration
- **Documentation**: Comprehensive inline comments
- **Testing**: Minimum 80% code coverage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions:

- **Email**: sc.maseko@themepark.com
- **Documentation**: [Project Wiki](https://github.com/your-username/ThemePark-QR-System/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/ThemePark-QR-System/issues)

## 🎉 Acknowledgments

- **Spring Boot Community**: For the excellent framework
- **React Team**: For the powerful frontend library
- **shadcn/ui**: For beautiful UI components
- **Stripe**: For secure payment processing
- **PostgreSQL**: For robust database management

---

**Built with ❤️ by SC MASEKO 402110470**

*Transforming theme park experiences through innovative technology*

