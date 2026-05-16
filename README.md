# 📓 Notebook App
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
A modern note-taking application built with Next.js, featuring rich text editing, and secure authentication.

## ✨ Features

- **🔐 Secure Authentication** - Discord OAuth integration via NextAuth.js
- **✏️ Rich Text Editor** - Powered by TipTap with full formatting capabilities
- **🎨 Beautiful UI** - Built with Tailwind CSS
- **😊 Emoji Support** - Inline emoji picker and support
- **🗂️ Note Management** - Create, read, update, and organize your notes
- **💾 Data Persistence** - MongoDB integration for reliable data storage
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🐳 Docker Support** - Ready for containerized deployment

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (recommended)
- OR: Node.js 18+ and npm, plus a MongoDB instance

### Installation with Docker (Recommended)

1. **Clone the repository**

```bash
git clone <repository-url>
cd notebook
```

2. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret

# MongoDB
MONGO_USER=your_mongo_username
MONGO_PASSWORD=your_mongo_password
MONGO_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo:27017/notebook?authSource=admin
```

See `.env.example` for reference.

3. **Start the development environment**

```bash
docker-compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000)

**Features:**
- App and MongoDB run in isolated containers
- Hot reload enabled (code changes reflect immediately)
- Database persists in Docker volumes
- MongoDB accessible at `mongo:27017` (from containers) or `localhost:27018` (from host)

4. **View logs**

```bash
docker-compose logs -f app
```

5. **Stop the services**

```bash
docker-compose down
```

### Local Installation (Without Docker)

1. **Clone the repository**

```bash
git clone <repository-url>
cd notebook
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:

```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
MONGO_USER=your_mongo_username
MONGO_PASSWORD=your_mongo_password
MONGO_URI=mongodb://localhost:27017/notebook
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Built With

- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with SSR/SSG
- **[React 19.2.3](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[TipTap 3.20+](https://www.tiptap.dev/)** - Headless rich text editor
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[NextAuth.js 4.24.13](https://next-auth.js.org/)** - Authentication
- **[Mongoose 9.2.4](https://mongoosejs.com/)** - MongoDB ODM

## 🏗️ Project Structure

```
├── src/
│   ├── app/                 # Next.js pages & API routes
│   ├── components/          # Reusable React components
│   ├── models/              # Mongoose schemas (Note model)
│   ├── context/             # React Context (NoteContext)
│   ├── lib/                 # Utilities (MongoDB, helpers)
│   └── types/               # TypeScript definitions
├── Dockerfile              # Multi-stage build (dev/prod)
├── docker-compose.yml      # Development setup
├── prod.docker-compose.yml # Production setup
└── package.json            # Dependencies
```

## 🔧 Scripts

```bash
# Development
npm run dev       # Start development server (http://localhost:3000)

# Production
npm run build     # Build for production
npm run start     # Start production server

# Code Quality
npm run lint      # Run ESLint
```

## 🐳 Docker Setup

The project includes a multi-stage Dockerfile and docker-compose configurations for both development and production.

### Architecture

- **Node.js 22** - Lightweight and performant
- **Multi-stage builds** - Separate dev and prod stages for optimized images
- **MongoDB 7** - Integrated database service in compose files

### Development Environment

```bash
docker-compose up -d
```

**What runs:**
- Next.js app in development mode (with hot reload)
- MongoDB with authentication
- Automatic restart policies

**Configuration (docker-compose.yml):**
- App port: `3000`
- MongoDB port: `27018` (host) → `27017` (container)
- Live file watching with automatic restart
- Volume mounts for code and node_modules

### Production Environment

```bash
docker-compose -f prod.docker-compose.yml up -d
```

**What runs:**
- Next.js app in production mode (optimized)
- MongoDB with authentication enabled
- Auto-restart on failure

**Configuration (prod.docker-compose.yml):**
- App port: `3000`
- MongoDB authentication enforced
- Optimized builds with pruned dependencies
- Environment set to `production`

### Build Custom Images

```bash
# Build development image
docker build -t notebook:dev --target dev .

# Build production image
docker build -t notebook:prod --target prod .

# Run custom image
docker run -p 3000:3000 --env-file .env notebook:prod
```

## 🔐 Authentication

The app uses **Discord OAuth** for secure authentication via NextAuth.js:

1. Users are redirected to Discord login if not authenticated
2. Upon successful authentication, a session is created
3. User data is stored securely with NextAuth
4. Notes are linked to authenticated user IDs

To set up Discord OAuth:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Add OAuth2 redirect URI: `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Client Secret to `.env.local`

## 📝 API Endpoints

### Notes

- `POST /api/note` - Create a new note
- `GET /api/note/[id]` - Fetch a specific note
- `PUT /api/note/[id]` - Update a note
- `DELETE /api/note/[id]` - Delete a note

### Authentication

- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/discord` - Discord OAuth callback
- `GET /api/auth/signout` - Sign out

## 🛠️ Development

### Code Style

- ESLint configuration included (see `eslint.config.mjs`)
- TypeScript for type safety
- Component-based architecture

## 📋 Todo

See [TODO.md](./TODO.md) for planned features and improvements.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! 🎉

You can contribute by:
- 🐛 Reporting bugs or suggesting improvements
- ✨ Proposing new features
- 📝 Improving documentation
- 🔧 Submitting pull requests

**How to contribute:**
1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## 📞 Support

Have questions or issues? Feel free to contact me on **Discord: rapha1004**

I'm here to help!
