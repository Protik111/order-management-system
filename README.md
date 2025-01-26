# Order Management System

This project is an **Order Management System** that consists of a **backend API** and a **frontend client**. The backend is built with Node.js, and the frontend is built with React. The system allows users to manage orders, products, and promotions efficiently.

## Features

- **User Authentication**: Login and registration with JWT-based authentication.
- **Order Management**: Create, update, and view orders.
- **Product Management**: Add, update, and delete products.
- **Promotion Management**: Apply promotions to products based on weight slabs.
- **Responsive Frontend**: Built with React and Ant Design for a seamless user experience.

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- Yarn (v1.22 or higher)
- PostgreSQL (for the database)
- Docker Desktop (if you want to use docker)

### Clone the Repository

```bash
git clone https://github.com/Protik111/video-upload-service.git
cd video-upload-service
```

#### Backend Setup

- Navigate to the backend directory:

```bash
cd order-management-backend
```

- Install dependencies:

```bash
yarn install
```

- Create a .env file in the backend directory with the following variables

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres-user:postgres-password@localhost:5432/manush-order-management?schema=public"
POSTGRES_USER=postgres-user
POSTGRES_PASSWORD=postgres-password
POSTGRES_DB=manush-order-management
JWT_SECRET='your_jwt_secret'
JWT_REFRESH_SECRET='your_jwt_refresh_secret'
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d
BCRYPT_SALT_ROUNDS=10
PWD=your_present_backend_directory
```

# Note:

If you setup with docker then the DATABASE_URL will have a little change.

```bash
for local machine
DATABASE_URL="postgresql://postgres-user:postgres-password@localhost:5432/manush-order-management?schema=public"
```

```bash
for docker environment
DATABASE_URL="postgresql://postgres-user:postgres-password@db:5432/manush-order-management?schema=public"
```

#### Frontend Setup

- Navigate to the frontend directory:

```bash
cd order-management-frontend
```

- Install dependencies:

```bash
yarn install
```

- Start the frontend development server:

```bash
yarn dev
```

## Docker Setup

Coming Soon
