# API Documentation

Auto-generated documentation via swagger-jsdoc.

## 🚀 Access

**Development**: Visit `http://localhost:3000/api/docs/ui` during development for interactive documentation.

**⚠️ Development only** (403 in production)

## 🔐 Authentication Endpoints

**Implementation**: See `server/api/auth/` for complete authentication endpoint implementations including registration, login, logout, and password reset.

## 🛡️ Protected Routes

All API routes except authentication and public endpoints require authentication:

- **Protected:** POST/PUT/DELETE operations on posts
- **Public:** GET operations on posts, authentication endpoints, documentation

Authentication is handled automatically by the global auth middleware.

## 📝 Adding an endpoint

**Implementation**: See existing API routes in `server/api/` for OpenAPI comment patterns and endpoint structure examples.

## ✅ Benefits

- ✅ **Auto-generated** from code
- ✅ **Always synchronized**
- ✅ **Zero maintenance**
- ✅ **Secure** (dev only)
