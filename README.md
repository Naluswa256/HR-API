
```markdown
# HR Dashboard Management API

This repository contains a REST API for managing HR operations such as attendance, leave requests, overtime, shifts, user authentication, and department management. The API is built using Node.js, TypeScript, Express, and MongoDB, providing a robust backend for HR systems with a focus on security, scalability, and performance.

## Features

- Attendance Management: Mark attendance, generate attendance reports, and view summaries.
- Leave Management: Submit, approve, and reject leave requests.
- Overtime Management: Submit, approve, and reject overtime requests.
- Shifts Management: Manage shifts for employees.
- Authentication & Authorization: Secure endpoints using JWT authentication via `passport`.
- Logging: Using `winston` and `morgan` for logging HTTP requests and errors.
- Error Handling: Centralized error handling mechanism for consistent API responses.
- API Documentation: Automatically generated documentation using `swagger-jsdoc` and `swagger-ui-express`.
- Environment Variables: Manage environment variables using `dotenv` and `cross-env`.
- Security: Set security HTTP headers using `helmet`.
- Sanitizing: Sanitize request data against XSS and query injection attacks.
- CORS: Cross-Origin Resource Sharing enabled using `cors`.
- Compression: Gzip compression with `compression`.
- Linting: Code linting with `ESLint` and `Prettier`.
- Uniform Response Structure: Consistent API responses with success and error states.
- File Upload: Handle file uploads using `Multer`.
- Email Notifications: Send emails using `Nodemailer`.

## Technology Stack

- Node.js with Express.js for REST API.
- TypeScript for type-safe development.
- MongoDB for data persistence.
- Passport JWT for secure authentication.
- Zod for request validation.
- Swagger for API documentation.

## API Documentation

The API is fully documented with Swagger. Once the application is running, you can access the documentation at `/api-docs`.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Request Validation](#request-validation)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/hr-dashboard-api.git
   cd hr-dashboard-api
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and configure the following variables:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/hr_dashboard
   JWT_SECRET=your_jwt_secret
   ```

4. Start the application:

   ```bash
   npm run start
   ```

5. Access the API at `http://localhost:3000` and the Swagger documentation at `http://localhost:3000/api-docs`.

---

## API Endpoints

| Route                           | Method | Description                                  | Requires Auth |
|----------------------------------|--------|----------------------------------------------|---------------|
| `/attendance/mark`               | POST   | Mark employee attendance                     | Yes           |
| `/attendance/report`             | GET    | Generate an attendance report                | Yes           |
| `/attendance/summary/:id/:filter`| GET    | Get attendance summary for an employee       | Yes           |
| `/attendance/employee/:id/:filter`| GET    | Get attendance for a specific employee       | Yes           |
| `/leave/submit`                  | POST   | Submit a leave request                       | Yes           |
| `/leave/approve/:leaveId`        | POST   | Approve a leave request                      | Yes           |
| `/leave/reject/:leaveId`         | POST   | Reject a leave request                       | Yes           |
| `/leave/status/:status`          | GET    | Get leaves filtered by status                | Yes           |
| `/leave/employee/:employee_id`   | GET    | Get leave history of an employee             | Yes           |
| `/overtime`                      | POST   | Submit an overtime request                   | Yes           |
| `/overtime/:employee_id`         | GET    | Get overtime requests by employee ID         | Yes           |
| `/overtime/approve/:overtime_id` | PUT    | Approve an overtime request                  | Yes           |
| `/overtime/reject/:overtime_id`  | PUT    | Reject an overtime request                   | Yes           |
| `/shifts`                        | POST   | Create a new shift                           | Yes           |
| `/shifts/:shiftId`               | GET    | Get details of a specific shift              | Yes           |
| `/shifts/employee/:employeeId`   | GET    | Get shifts assigned to an employee           | Yes           |
| `/shifts/update/:shiftId`        | PUT    | Update a specific shift                      | Yes           |
| `/shifts/delete/:shiftId`        | DELETE | Delete a specific shift                      | Yes           |
| `/auth/register`                 | POST   | Register a new user (admin only)             | No            |
| `/auth/login`                    | POST   | Log in                                       | No            |
| `/auth/logout`                   | POST   | Log out                                      | Yes           |
| `/auth/refresh-tokens`           | POST   | Refresh JWT tokens                           | Yes           |
| `/auth/forgot-password`          | POST   | Request password reset email                 | No            |
| `/auth/reset-password`           | POST   | Reset password using token                   | No            |
| `/auth/send-verification-email`  | POST   | Send verification email                      | Yes           |
| `/auth/verify-email`             | POST   | Verify email using token                     | No            |

---

## Authentication and Authorization

The API uses JWT (JSON Web Token) for securing the routes. Authentication is handled using the `passport-jwt` middleware.

### How to Secure Routes

To protect an API route, the `auth()` middleware is used. Additionally, you can pass specific permissions as arguments to `auth()` to enforce role-based access control.

Example:

```typescript
router.post(
  '/attendance/mark',
  auth(), // Ensures only authenticated users can access this route
  validate(createAttendanceSchema),
  attendanceController.markAttendance
);
```

---

## Request Validation

All requests are validated using Zod schemas. Validation ensures the integrity of incoming data and prevents invalid data from being processed by the server.

Example of a Zod schema for attendance:

```typescript
import { z } from 'zod';

export const createAttendanceSchema = z.object({
  employeeId: z.string(),
  date: z.date(),
  status: z.enum(['present', 'absent']),
});
```

Each route uses the `validate()` middleware to apply validation before passing control to the route handler.

---

## Error Handling

The API uses centralized error handling to catch and respond to errors consistently across all routes. All error responses follow a uniform structure:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "details": "Detailed error description"
  }
}
```

### Example Error Response:

```json
{
  "success": false,
  "message": "Invalid request data",
  "error": {
    "details": "employeeId is required"
  }
}
```




## Project Structure

```plaintext
src\
 |--config\         # configuration
 |--controllers\    # Route controllers
 |--docs\           # Swagger files
 |--middlewares\    # Express middlewares
 |--models\         # Mongoose models
 |--routes\         # Application routes
 |--services\       # Business logic
 |--utils\          # Utility functions
 |--validations\    # Request validation schemas
 |--app.ts          # Express app
 |--server.ts        # App entry point
```


