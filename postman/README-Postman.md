# Honda Dealership API - Postman Collection

## Overview

This document provides a complete API reference for the Honda Dealership Backend. All endpoints follow a consistent response format.

---

## Response Format

All API responses follow this structure:

```json
{
  "code": 1000,
  "message": "Success",
  "result": { ... }
}
```

### Response Codes

| Code | Description |
|------|-------------|
| 1000 | Success |
| 9999 | Internal Error |
| 1001 | Bad Request |
| 1003 | Unauthorized |
| 1004 | Forbidden |
| 1005 | Not Found |

---

## Authentication Flow

### 1. Register
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0912345678"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User",
    "phone": "0912345678",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "createdAt": "2026-05-02T00:00:00"
  }
}
```

### 2. Login
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User",
    "phone": "0912345678",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 86400000,
    "createdAt": "2026-05-02T00:00:00"
  }
}
```

### 3. Refresh Token
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

---

## Public Endpoints (No Auth Required)

### Motorcycles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/motorcycles` | Get all motorcycles (paginated) |
| GET | `/api/v1/motorcycles/{id}` | Get motorcycle by ID |
| GET | `/api/v1/motorcycles/slug/{slug}` | Get motorcycle by slug |
| GET | `/api/v1/motorcycles/search` | Search motorcycles |
| GET | `/api/v1/motorcycles/{id}/variants` | Get variants by motorcycle |

**Query Parameters for GET /motorcycles:**
- `page` (default: 0)
- `size` (default: 20)
- `sort` (default: createdAt,DESC)
- `brandId` (optional)
- `categoryId` (optional)
- `status` (ACTIVE, INACTIVE)
- `keyword` (search keyword)

**MotorcycleListResponse:**
```json
{
  "id": 1,
  "name": "Honda Vision 2026",
  "slug": "honda-vision-2026",
  "minPrice": 35000000,
  "thumbnailUrl": "https://res.cloudinary.com/...",
  "totalStock": 23,
  "brandName": "Honda",
  "categoryName": "Scooter"
}
```

### Brands & Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/brands` | Get all brands |
| GET | `/api/v1/categories` | Get all categories |

### Variants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/variants` | Get all variants (paginated) |
| GET | `/api/v1/variants/{id}` | Get variant by ID |
| GET | `/api/v1/variants/{id}/images` | Get images by variant |

---

## Protected Endpoints (Auth Required)

### Cart (Role: CUSTOMER)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/cart/items` | Add item to cart |
| GET | `/api/v1/cart` | Get cart |
| PUT | `/api/v1/cart/items/{itemId}` | Update item quantity |
| DELETE | `/api/v1/cart/items/{itemId}` | Remove item |
| DELETE | `/api/v1/cart/clear` | Clear cart |

**AddCartItemRequest:**
```json
{
  "variantId": 1,
  "quantity": 1
}
```

**CartResponse:**
```json
{
  "items": [
    {
      "id": 1,
      "variantId": 1,
      "variantName": "Honda Vision Black",
      "colorName": "Black",
      "imageUrl": "https://...",
      "motorcycleName": "Honda Vision 2026",
      "motorcycleSlug": "honda-vision-2026",
      "quantity": 1,
      "unitPrice": 35000000,
      "subtotal": 35000000
    }
  ],
  "totalQuantity": 1,
  "subtotal": 35000000,
  "estimatedTotal": 35000000
}
```

### Orders (Role: CUSTOMER)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/orders/checkout` | Create order |
| GET | `/api/v1/orders/my-orders` | Get my orders |
| GET | `/api/v1/orders/{orderId}` | Get order detail |
| PUT | `/api/v1/orders/{orderId}/cancel` | Cancel order |

**CheckoutRequest:**
```json
{
  "shippingName": "John Doe",
  "shippingPhone": "0912345678",
  "shippingAddress": "123 Main St, District 1, Ho Chi Minh City",
  "paymentMethod": "COD",
  "note": "Please deliver before 5 PM"
}
```

**PaymentMethod:** `COD`, `ONLINE`

**OrderResponse:**
```json
{
  "id": 1,
  "orderCode": "ORD-20260502-0001",
  "status": "PENDING",
  "totalAmount": 35000000,
  "shippingName": "John Doe",
  "shippingPhone": "0912345678",
  "shippingAddress": "123 Main St, District 1, Ho Chi Minh City",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "notes": "Please deliver before 5 PM",
  "totalItems": 1,
  "createdAt": "2026-05-02T00:00:00"
}
```

---

## Admin Endpoints (Role: ADMIN)

### Motorcycles

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/motorcycles` | Create motorcycle |
| PUT | `/api/v1/admin/motorcycles/{id}` | Update motorcycle |
| DELETE | `/api/v1/admin/motorcycles/{id}` | Delete motorcycle |

**CreateMotorcycleRequest:**
```json
{
  "name": "Honda Vision 2026",
  "code": "HVN-2026",
  "slug": "honda-vision-2026",
  "description": "Honda Vision 2026 - Reliable scooter",
  "specsJson": "{}",
  "brandId": 1,
  "categoryId": 1,
  "status": "ACTIVE"
}
```

**MotorcycleStatus:** `ACTIVE`, `INACTIVE`

### Brands & Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/brands` | Create brand |
| POST | `/api/v1/admin/categories` | Create category |

### Variants

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/variants` | Create variant |
| PUT | `/api/v1/admin/variants/{id}` | Update variant |
| DELETE | `/api/v1/admin/variants/{id}` | Delete variant |

**CreateVariantRequest:**
```json
{
  "motorcycleId": 1,
  "sku": "HVN-2026-BLK",
  "variantName": "Honda Vision Black",
  "colorName": "Black",
  "colorCode": "#000000",
  "price": 35000000,
  "stockQuantity": 10,
  "status": "AVAILABLE"
}
```

**VariantStatus:** `AVAILABLE`, `OUT_OF_STOCK`, `DISCONTINUED`

### Variant Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/variant-images` | Add image (URL) |
| DELETE | `/api/v1/admin/variant-images/{id}` | Delete image |

---

## Admin/Staff Endpoints (Role: ADMIN, STAFF)

### Image Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/variants/{id}/images` | Upload image (multipart) |
| PUT | `/api/admin/images/{id}/thumbnail` | Set as thumbnail |
| DELETE | `/api/admin/images/{id}` | Delete image |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/orders` | Get all orders |
| GET | `/api/v1/admin/orders/{id}` | Get order detail |
| PUT | `/api/v1/admin/orders/{id}/status` | Update order status |

**UpdateOrderStatusRequest:**
```json
{
  "status": "CONFIRMED"
}
```

**OrderStatus:** `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## Admin Dashboard (Role: ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard/summary` | Get dashboard summary |
| GET | `/api/v1/admin/dashboard/revenue` | Get revenue data |
| GET | `/api/v1/admin/dashboard/top-products` | Get top products |
| GET | `/api/v1/admin/dashboard/order-status` | Get order status counts |

**Revenue Query Params:** `range` (7days, 30days, 90days, 1year)

---

## Enums Reference

### UserRole
- `ADMIN`
- `STAFF`
- `CUSTOMER`

### MotorcycleStatus
- `ACTIVE`
- `INACTIVE`

### VariantStatus
- `AVAILABLE`
- `OUT_OF_STOCK`
- `DISCONTINUED`

### OrderStatus
- `PENDING`
- `CONFIRMED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

### PaymentMethod
- `COD` (Cash on Delivery)
- `ONLINE`

### PaymentStatus
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

---

## Error Response Example

```json
{
  "code": 1001,
  "message": "Bad Request",
  "result": null
}
```

---

## Postman Setup

1. Import `Honda-Dealership.postman_collection.json`
2. Import `Honda-Dealership.postman_environment.json`
3. Set your base URL in environment variables
4. Login to get access token
5. Token is automatically saved in environment

## Running the Application

```bash
cd C:\Project\vibe-code\main-project\honda-dealership
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`