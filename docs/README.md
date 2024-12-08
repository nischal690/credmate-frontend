# Credmate Web App Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Core Features](#core-features)
5. [Technical Documentation](#technical-documentation)
6. [API Documentation](#api-documentation)

## Introduction
Credmate is a comprehensive web application for managing credit profiles, loan applications, and financial services. This documentation provides detailed information about the application's architecture, features, and implementation details.

## Project Structure
```
credmate-web-app/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable UI components
│   ├── contexts/         # React contexts for state management
│   ├── lib/             # Utility functions and configurations
│   ├── styles/          # Global styles and CSS modules
│   └── [routes]/        # Page components and routing
├── docs/                # Documentation files
├── public/             # Static assets
└── prisma/            # Database schema and migrations
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API endpoints
- `NEXT_PUBLIC_API_VERSION`: API version
- Add other environment variables...

## Core Features

### 1. User Authentication
- Phone number-based authentication
- OTP verification
- Session management
- Token-based authentication with refresh mechanism

### 2. Profile Management
- User profile creation and updates
- Document verification (KYC)
- Profile caching for optimal performance
- Real-time profile updates

### 3. Credit Services
- Credit score display
- Credit history tracking
- Credit improvement tips
- Credit factors analysis

### 4. Loan Management
- Loan application processing
- EMI calculator
- Document upload
- Application status tracking

### 5. Search Functionality
- Face recognition search
- GST number search
- PAN card search
- Aadhaar verification

For detailed documentation of each feature, refer to the respective documentation files in the `/docs` directory.
