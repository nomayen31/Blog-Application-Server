# Prisma Blog Application

A robust and scalable blog application backend built with **TypeScript**, **Express**, **Prisma ORM**, and **PostgreSQL**. It features secure authentication using **Better-Auth**, advanced pagination, sorting, filtering, and a nested comment system.

## 🚀 Technologies

- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Authentication:** [Better-Auth](https://better-auth.com/)
- **Documentation:** Swagger UI

## ✨ Features

- **Authentication & User Management**
  - Secure Sign-up & Sign-in
  - Role-based access control (Admin/User)
  
- **Blog Posts**
  - Create, Read, Delete posts
  - **Advanced Pagination**: Custom page size and limits
  - **Sorting & Filtering**: Sort by title, views, dates; Filter by tags, status, author
  - **Search**: Full-text search on title, content, and tags
  - **View Counting**: Auto-increment view count on fetching post details

- **Comments System**
  - Add comments to posts
  - **Nested Replies**: Support for threading/replying to other comments
  - Author attribution

- **Developer Tools**
  - Swagger API Documentation
  - Prisma Studio for DB management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL installed and running

### 1. Clone the Repository
```bash
git clone https://github.com/nomayen31/Blog-Application-Server.git
cd Blog-Application-Server
```

### 2. Install Dependencies
This project uses `pnpm` (or `npm`/`yarn`).
```bash
npm install
# or
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure your environment variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"
# Add other necessary env vars for Better-Auth if required
```

### 4. Database Setup
Generate Prisma client and push schema to the database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
# or
pnpm dev
```
The server will start at `http://localhost:3000` (default).

## 📖 API Documentation

Swagger UI is available for exploring and testing the API endpoints.
Visit: **`http://localhost:3000/api-docs`**

### Key Endpoints
- **Posts**
  - `GET /posts` - List all posts (supports `page`, `limit`, `sortBy`, `search`, `tags`)
  - `GET /posts/:id` - Get single post details (increments view count)
  - `POST /posts` - Create a new post (Auth required)
  - `DELETE /posts/:id` - Delete a post

- **Comments**
  - `POST /comments` - Add a comment or reply

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `pnpm dev` | Starts the development server with hot-reload |
| `pnpm build` | Compiles TypeScript to JavaScript |
| `pnpm start` | Runs the built production server |
| `npx prisma studio` | Opens Prisma Studio GUI to view/edit data |
| `seed:admin` | Runs the admin seeding script |

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.
