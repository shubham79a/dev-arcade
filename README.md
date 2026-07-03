# DevArcade – Coding Interview Preparation Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](YOUR_LIVE_LINK)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)]()
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)]()
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)]()

DevArcade is a full-stack coding interview preparation platform that combines structured learning paths, interactive coding exercises, and personalized progress tracking. The platform enables learners to move seamlessly from theory to hands-on coding practice through an integrated learning experience.

---

# Why DevArcade?

Most learning platforms focus only on video content, while coding platforms focus only on solving problems.

**DevArcade bridges this gap** by combining structured learning, interactive coding exercises, premium learning resources, and progress tracking into a single platform designed for interview preparation.

---

# Features

## Authentication & User Management

- Secure authentication using Clerk
- User onboarding and profile management
- Protected routes
- Subscription management

---

## Learning Platform

- Browse structured learning paths
- Enroll in courses
- Free preview chapters
- Premium course unlocking
- Chapter-wise learning progression

---

## Interactive Coding Workspace

- Browser-based coding environment
- CodeMirror editor
- Sandpack-powered code execution
- Exercise descriptions
- Integrated hints
- Sample inputs and expected outputs

---

## Progress Tracking

Track learning progress through:

- Enrolled courses
- Completed exercises
- XP progression
- Course-wise statistics
- Personalized dashboard

---

## Premium Features

- Pro subscription
- Premium course access
- Clerk Billing integration
- Subscription management

---

# Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions, API Routes |
| Database | PostgreSQL, Drizzle ORM |
| Authentication | Clerk |
| Billing | Clerk Billing |
| Code Editor | CodeMirror |
| Code Execution | Sandpack |
| Deployment | Vercel |

---

# System Architecture

```text
                        User
                          │
                          ▼
                  Next.js Frontend
                          │
          Server Actions / API Routes
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       Clerk         PostgreSQL      Sandpack
 Authentication       (Drizzle)    Code Execution
```

---

# User Flow

```text
Sign Up / Login
        │
        ▼
Browse Courses
        │
        ▼
Enroll
        │
        ▼
Learn Chapter
        │
        ▼
Practice Exercise
        │
        ▼
Run Code
        │
        ▼
Mark Completed
        │
        ▼
XP Updated
        │
        ▼
Dashboard Progress
```

---

# Folder Structure

```text
app/
components/
actions/
lib/
hooks/
drizzle/
public/
```

---

# Local Setup

### Clone Repository

```bash
git clone https://github.com/shubham79a/dev-arcade.git

cd dev-arcade
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
```

### Start Development Server

```bash
npm run dev
```

---

# Engineering Highlights

- Built using the Next.js App Router architecture.
- Designed modular server actions for scalable backend logic.
- Integrated Clerk for authentication, subscription management, and protected routes.
- Implemented XP-based learning progression with personalized dashboards.
- Developed an interactive browser-based coding workspace using CodeMirror and Sandpack.
- Structured PostgreSQL database using Drizzle ORM.

---

# Roadmap

- [ ] Judge0 integration for multi-language code execution
- [ ] Automatic solution evaluation using hidden test cases
- [ ] Submission history
- [ ] Enhanced learning analytics

---

# Screenshots

> Add screenshots or GIFs demonstrating:
>
> - Landing Page
> - Course Details
> - Coding Workspace
> - Dashboard
> - Premium Subscription

---

# Lessons Learned

While building DevArcade, I gained hands-on experience with:

- Designing a modular full-stack application using Next.js App Router
- Managing authentication and subscription workflows with Clerk
- Building interactive coding interfaces with CodeMirror and Sandpack
- Structuring relational data models using PostgreSQL and Drizzle ORM
- Designing scalable server actions and reusable UI components

---

# Author

**Shubham Kumar**

- GitHub: https://github.com/shubham79a
- LinkedIn: https://www.linkedin.com/in/shubham-kumar-894799290

---

If you found this project interesting, consider ⭐ starring the repository.