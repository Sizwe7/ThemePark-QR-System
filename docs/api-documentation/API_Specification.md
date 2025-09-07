# Theme Park QR Payment & Entrance System
## API Specification Document

**Version:** 1.0  
**Author:** SC MASEKO 402110470  
**Date:** September 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs](#base-urls)
4. [Common Response Formats](#common-response-formats)
5. [User Management APIs](#user-management-apis)
6. [Authentication APIs](#authentication-apis)
7. [Ticket Management APIs](#ticket-management-apis)
8. [Payment Processing APIs](#payment-processing-apis)
9. [Access Control APIs](#access-control-apis)
10. [Analytics APIs](#analytics-apis)
11. [System Configuration APIs](#system-configuration-apis)
12. [Error Codes](#error-codes)

---

## Overview

The Theme Park QR Payment & Entrance System API provides comprehensive endpoints for managing all aspects of the theme park operations, including user management, ticket sales, payment processing, access control, and analytics.

### API Design Principles

- **RESTful Architecture**: All endpoints follow REST conventions
- **JSON Communication**: All requests and responses use JSON format
- **Stateless**: Each request contains all necessary information
- **Versioned**: API versioning through URL path (`/api/v1/`)
- **Secure**: JWT-based authentication with role-based access control
- **Consistent**: Standardized response formats and error handling

### Rate Limiting

- **Authenticated Users**: 1000 requests per hour
- **Anonymous Users**: 100 requests per hour
- **Staff/Admin**: 5000 requests per hour

---

## Authentication

### JWT Token Structure

All authenticated requests must include a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Token Claims

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "VISITOR|STAFF|MANAGER|ADMIN",
  "iat": 1693123200,
  "exp": 1693209600
}
```

---

## Base URLs

- **Development**: `http://localhost:8080/api/v1`
- **Staging**: `https://staging-api.themepark.com/api/v1`
- **Production**: `https://api.themepark.com/api/v1`

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-07T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  },
  "timestamp": "2025-09-07T10:30:00Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "timestamp": "2025-09-07T10:30:00Z"
}
```

---

## User Management APIs

### Create User Account

**POST** `/users/register`

Creates a new user account in the system.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "VISITOR",
    "emailVerified": false,
    "createdAt": "2025-09-07T10:30:00Z"
  }
}
```

### Get User Profile

**GET** `/users/profile`

Retrieves the authenticated user's profile information.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "role": "VISITOR",
    "profileImageUrl": "https://example.com/profile.jpg",
    "preferences": {
      "language": "en",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }
  }
}
```

### Update User Profile

**PUT** `/users/profile`

Updates the authenticated user's profile information.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "preferences": {
    "language": "en",
    "notifications": {
      "email": true,
      "push": false,
      "sms": true
    }
  }
}
```

### Get User Preferences

**GET** `/users/preferences`

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "accessibility": {
      "largeText": false,
      "highContrast": false
    },
    "privacy": {
      "dataSharing": false,
      "analytics": true
    }
  }
}
```

---

## Authentication APIs

### User Login

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600,
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "VISITOR"
    }
  }
}
```

### Refresh Token

**POST** `/auth/refresh`

Refreshes an expired JWT token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### User Logout

**POST** `/auth/logout`

Invalidates the current user session.

**Headers:**
- `Authorization: Bearer <jwt_token>`

### Password Reset Request

**POST** `/auth/password-reset-request`

Initiates a password reset process.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Password Reset Confirm

**POST** `/auth/password-reset-confirm`

Completes the password reset process.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "newSecurePassword123"
}
```

---

## Ticket Management APIs

### Purchase Ticket

**POST** `/tickets/purchase`

Purchases a new ticket for the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "ticketType": "SINGLE_DAY",
  "validFrom": "2025-09-07",
  "validUntil": "2025-09-07",
  "paymentMethodId": "payment_method_id",
  "specialRequests": {
    "accessibility": false,
    "vipAccess": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "750e8400-e29b-41d4-a716-446655440000",
    "qrCodeData": "QR_CODE_STRING",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "ticketType": "SINGLE_DAY",
    "price": 89.99,
    "validFrom": "2025-09-07",
    "validUntil": "2025-09-07",
    "purchaseDate": "2025-09-07T10:30:00Z"
  }
}
```

### Get User Tickets

**GET** `/tickets/my-tickets`

Retrieves all tickets for the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `status` (optional): Filter by ticket status
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "ticketId": "750e8400-e29b-41d4-a716-446655440000",
        "ticketType": "SINGLE_DAY",
        "status": "VALID",
        "qrCodeData": "QR_CODE_STRING",
        "validFrom": "2025-09-07",
        "validUntil": "2025-09-07",
        "currentEntries": 0,
        "maxEntries": 1
      }
    ],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Ticket Details

**GET** `/tickets/{ticketId}`

Retrieves detailed information about a specific ticket.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "750e8400-e29b-41d4-a716-446655440000",
    "ticketType": "SINGLE_DAY",
    "status": "VALID",
    "qrCodeData": "QR_CODE_STRING",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "validFrom": "2025-09-07",
    "validUntil": "2025-09-07",
    "currentEntries": 0,
    "maxEntries": 1,
    "price": 89.99,
    "purchaseDate": "2025-09-07T10:30:00Z",
    "specialAccess": {}
  }
}
```

### Validate Ticket

**POST** `/tickets/validate`

Validates a ticket for entry (Staff/Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "qrCodeData": "QR_CODE_STRING",
  "entryPoint": "Main Entrance Gate 1",
  "deviceInfo": {
    "deviceId": "scanner_001",
    "location": "Main Entrance"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "ticketId": "750e8400-e29b-41d4-a716-446655440000",
    "visitorName": "John Doe",
    "ticketType": "SINGLE_DAY",
    "remainingEntries": 0,
    "specialAccess": {},
    "entryLogId": "entry_log_id"
  }
}
```

---

## Payment Processing APIs

### Add Payment Method

**POST** `/payments/methods`

Adds a new payment method for the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "methodType": "CREDIT_CARD",
  "cardToken": "stripe_card_token",
  "billingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345",
    "country": "US"
  },
  "isDefault": true
}
```

### Get Payment Methods

**GET** `/payments/methods`

Retrieves all payment methods for the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "paymentMethodId": "pm_id",
      "methodType": "CREDIT_CARD",
      "cardLastFour": "1234",
      "cardBrand": "Visa",
      "expiryMonth": 12,
      "expiryYear": 2026,
      "isDefault": true,
      "isActive": true
    }
  ]
}
```

### Process Payment

**POST** `/payments/process`

Processes a payment transaction.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "amount": 89.99,
  "currency": "USD",
  "paymentMethodId": "pm_id",
  "description": "Single Day Ticket Purchase",
  "items": [
    {
      "itemType": "TICKET",
      "itemId": "ticket_id",
      "quantity": 1,
      "unitPrice": 89.99
    }
  ]
}
```

### Get Transaction History

**GET** `/payments/transactions`

Retrieves transaction history for the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `status` (optional): Filter by status
- `page` (optional): Page number
- `size` (optional): Page size

---

## Access Control APIs

### Get Attractions

**GET** `/attractions`

Retrieves list of all attractions with current status.

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `includeQueue` (optional): Include queue information

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "attractionId": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Thunder Mountain Coaster",
      "description": "High-speed roller coaster with thrilling drops",
      "category": "Thrill Rides",
      "status": "OPEN",
      "currentOccupancy": 18,
      "maxCapacity": 24,
      "estimatedWaitTime": 15,
      "minimumAge": 12,
      "heightRequirement": 140,
      "duration": 3,
      "accessibility": {
        "wheelchairAccessible": false,
        "hearingAssistance": true
      }
    }
  ]
}
```

### Join Attraction Queue

**POST** `/attractions/{attractionId}/queue/join`

Adds the authenticated user to an attraction queue.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "ticketId": "750e8400-e29b-41d4-a716-446655440000",
  "specialAssistance": false,
  "groupSize": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "queueId": "queue_id",
    "position": 5,
    "estimatedWaitTime": 20,
    "joinedAt": "2025-09-07T10:30:00Z"
  }
}
```

### Get Queue Status

**GET** `/attractions/{attractionId}/queue/status`

Retrieves current queue status for an attraction.

**Response:**
```json
{
  "success": true,
  "data": {
    "attractionName": "Thunder Mountain Coaster",
    "queueLength": 12,
    "averageWaitTime": 18,
    "status": "OPEN",
    "lastUpdated": "2025-09-07T10:30:00Z"
  }
}
```

### Leave Queue

**DELETE** `/attractions/{attractionId}/queue/leave`

Removes the authenticated user from an attraction queue.

**Headers:**
- `Authorization: Bearer <jwt_token>`

### Get My Queue Status

**GET** `/attractions/my-queues`

Retrieves all current queue positions for the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt_token>`

---

## Analytics APIs

### Get Visitor Analytics

**GET** `/analytics/visitor-stats`

Retrieves visitor analytics data (Staff/Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `startDate`: Start date for analytics
- `endDate`: End date for analytics
- `granularity`: `hour`, `day`, `week`, `month`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 1250,
    "averageVisitDuration": 240,
    "totalRevenue": 112500.00,
    "averageSpending": 90.00,
    "satisfactionScore": 4.2,
    "peakHours": [
      {"hour": 13, "visitors": 180},
      {"hour": 14, "visitors": 165}
    ]
  }
}
```

### Get Real-time Dashboard

**GET** `/analytics/real-time`

Retrieves real-time operational metrics (Staff/Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "currentVisitors": 342,
    "activeQueues": 8,
    "averageQueueTime": 16,
    "systemLoad": 68.5,
    "paymentSuccessRate": 99.2,
    "apiResponseTime": 145,
    "concurrentUsers": 89,
    "lastUpdated": "2025-09-07T10:30:00Z"
  }
}
```

### Get Attraction Analytics

**GET** `/analytics/attractions`

Retrieves attraction-specific analytics (Staff/Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `attractionId` (optional): Specific attraction
- `startDate`: Start date
- `endDate`: End date

### Submit Feedback

**POST** `/analytics/feedback`

Submits visitor feedback and rating.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "rating": 5,
  "comments": "Amazing experience! The QR system made everything smooth.",
  "categories": {
    "entryExperience": 5,
    "attractionQuality": 5,
    "staffService": 4,
    "valueForMoney": 5
  }
}
```

---

## System Configuration APIs

### Get System Settings

**GET** `/config/settings`

Retrieves system configuration settings (Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

### Update System Setting

**PUT** `/config/settings/{settingKey}`

Updates a system configuration setting (Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "value": "new_value",
  "description": "Updated setting description"
}
```

### Get Audit Logs

**GET** `/config/audit-logs`

Retrieves system audit logs (Admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date
- `userId` (optional): Filter by user
- `action` (optional): Filter by action
- `severity` (optional): Filter by severity

---

## Error Codes

### Authentication Errors (4xx)

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `AUTH_004`: Insufficient permissions
- `AUTH_005`: Account not verified
- `AUTH_006`: Account suspended

### Validation Errors (4xx)

- `VAL_001`: Required field missing
- `VAL_002`: Invalid field format
- `VAL_003`: Field value out of range
- `VAL_004`: Duplicate value
- `VAL_005`: Invalid date range

### Business Logic Errors (4xx)

- `BIZ_001`: Ticket already used
- `BIZ_002`: Ticket expired
- `BIZ_003`: Attraction closed
- `BIZ_004`: Queue full
- `BIZ_005`: Insufficient funds
- `BIZ_006`: Payment failed
- `BIZ_007`: Maximum capacity reached

### System Errors (5xx)

- `SYS_001`: Database connection error
- `SYS_002`: External service unavailable
- `SYS_003`: Internal server error
- `SYS_004`: Service timeout
- `SYS_005`: Configuration error

---

## Rate Limiting Headers

All API responses include rate limiting headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1693123200
```

---

## Webhook Events

The system supports webhooks for real-time notifications:

### Payment Events
- `payment.completed`
- `payment.failed`
- `payment.refunded`

### Ticket Events
- `ticket.purchased`
- `ticket.validated`
- `ticket.expired`

### Queue Events
- `queue.joined`
- `queue.served`
- `queue.abandoned`

---

This API specification provides comprehensive coverage of all system functionality while maintaining consistency, security, and scalability. All endpoints include proper authentication, validation, and error handling to ensure robust operation in production environments.

