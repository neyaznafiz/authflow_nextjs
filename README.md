# Authflow

A clean, highly secure, and beautifully designed authentication system built with Next.js 15, React 19, and MongoDB.

**NOTE:** There is the basic user data structure in the `User` model in `models/User.ts` change the data structure based on your needs for your project, and everything is stored securely in MongoDB like `access_token`, `refresh_token`, `reset_token`, `verification_otp`, etc, but the `refresh_token` is specifically managed via HTTP-Only Cookies to maximize security and prevent XSS (Cross-Site Scripting). You can change and configure storage engines like `redis` or somewhere else to fit your scaling needs, also update the data structure accordingly.

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Frontend library**: React
- **Styling**: Tailwind CSS v4, Framer Motion (for sleek animations)
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, crypto for secure reset tokens

## 🌟 Key Features

### 1. User Registration (Sign up)

Creates new user accounts with encrypted passwords using bcrypt. Generates an initial 6-digit OTP code stored in the MongoDB schema to verify the user.

- Automatically blocks sign-in until the email is verified through OTP.
- Includes a UUIDv7 generated unique user ID directly stored in MongoDB.

### 2. OTP Account Verification

Verifies a newly registered user using a 6-digit one-time password (OTP).

- **Resend OTP Functionality**: Allows users to quickly request a new code if they missed it.
- **Cooldown Timer**: Includes a robust 60-second cooldown timer on the frontend before allowing another OTP generation to prevent spamming APIs.

### 3. User Login (Sign in)

Authenticates a user by matching their plain text password to the hashed version in the database.

- Issues a dual-token payload: a short-lived **15-minute** `accessToken` and a secure **7-day** `refreshToken`.
- Stores short-lived access tokens and user contexts in local storage, while instantly vaulting the `refreshToken` into a strict, secure HTTP-only cookie.
- Blocks access for registered but unverified accounts.

### 4. Password Reset Flow (Forgot Password)

A complete system to recover lost passwords without jeopardizing security.

- **Token Generation**: Uses Node's builtin `crypto` to generate a 32-byte secure hex string.
- **Expiry Rules**: The token is strictly set to expire in 1 hour.
- **Security First**: Designed to abstract backend failures to avoid username enumeration techniques.

### 5. Protected Routes

Handles user persistent sessions using local storage checks and React hooks on route transitions, ensuring unauthenticated or unverified users remain securely locked out of private dashboard access.

### 6. Secure Sign Out

Fully invalidates user sessions on both the client side and the server side.

- Features a **dedicated, beautifully animated landing page** (`/signout`) that securely orchestrates the logout flow via a background API fetch.
- Instantly nullifies both the active protocol and refresh tokens seamlessly from the backend database.
- Immediately flushes local storage and natively commands the browser to wipe the HTTP-only cookie.

### 7. Silent Token Refresh

Securely handles token expirations using a seamless background refresh mechanism.

- Automatically leverages the secure HTTP-only cookie containing the `refreshToken` to silently exchange it for a net-new 15-minute access token upon expiration.
- Keeps dashboard sessions uninterrupted indefinitely without forcing the user to repetitively sign back in.

---

## 📂 Project API Structure

- `POST /api/auth/signup` - Registers a user, hashes password, outputs dev-only OTP.
- `POST /api/auth/verify-otp` - Verifies user using 6-digit OTP string.
- `POST /api/auth/resend-otp` - Issues new OTP for unverified users.
- `POST /api/auth/signin` - Authenticates via identifier + password and responds with JWT.
- `POST /api/auth/signout` - Invalidates the current user session securely in the database.
- `GET /api/auth/verify-session` - Validates the current access token and returns User context.
- `POST /api/auth/refresh` - Issues a new 15-minute access token automatically utilizing the secure `refreshToken` HTTP-only cookie.
- `POST /api/auth/forgot-password` - Creates expiring reset-token, simulating an outbound reset email.
- `POST /api/auth/reset-password` - Updates hashed password if reset token remains valid.

---

## 💻 Step-by-Step Guide to Run Locally

Follow these precise steps to get a development environment up and running beautifully.

### 1. Prerequisites

- Node.js installed on your machine (`v18` or newer is recommended)
- A MongoDB instance (Local or Atlas URI)
- Git (if cloning directly)

### 2. Install Dependencies

Navigate into the root of the project and run your preferred package manager to install the listed packages:

```bash
npm install
```

### 3. Setup Environment Variables

Clone the `.env_example` (or use the template below) to a new `.env` file in the root directory:

```env
# Database name
DB_NAME=authflow_next

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority

# JWT Secret for Signing Authentication Tokens
JWT_SECRET=your_super_secret_jwt_string_here

# Frontend Application URL for generate link
APP_URL=http://localhost:3000
```

### 4. Launch the Development Server

With the environment correctly mapped to your MongoDB cluster and JWT Secret applied, run:

```bash
npm run dev
```

The server will boot up and be accessible locally at `http://localhost:3000`.

### 5. Testing the Application

- **Registration**: Visit `http://localhost:3000/signup`. Enter your details. It will seamlessly redirect to the verify page displaying your required OTP in a neat developer-preview container.
- **Verification**: Insert the OTP code to verify your profile. Only then will your session be authenticated fully into the dashboard!
