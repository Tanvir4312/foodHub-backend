# 🍔 FoodHub Backend

A robust REST API backend for the FoodHub food delivery platform, handling authentication, meal management, orders, and provider operations.

---

## 📖 About The Project

FoodHub backend powers the entire food delivery ecosystem — managing customer orders, provider profiles, meal listings, discount codes, and reviews with a clean, scalable architecture built on Node.js and PostgreSQL.

---

## 🛠️ Tech Stack

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Better Auth

---

## ✨ Key Features

- 🔐 Authentication with Better Auth
- 🍽️ Meal & category management
- 🏪 Provider profile management
- 🛒 Order processing
- 🏷️ Discount code system
- ⭐ Review system

---

## 📁 Project Structure Highlights

- `prisma/schema` — Database schema & migrations
- `src/modules` — Feature-based modules (auth, meals, orders etc.)
- `src/middleware` — Custom middlewares (auth guard, error handler etc.)
- `src/lib` — Shared utilities & helpers

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/Tanvir4312/foodHub-backend
cd foodHub-backend
npm install
npx prisma migrate dev
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```dotenv
PORT=5000
BETTER_AUTH_SECRET=your_BETTER_AUTH_SECRET
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000
```

---

## 🔗 Links

- **Frontend Repo:** [foodHub-client](https://github.com/Tanvir4312/foodHub-client)
