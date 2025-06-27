# Monroe Bot Dashboard

Advanced Discord Bot Management System with stunning animations and modern UI design.

## 🚀 Features

- **Real-time Bot Monitoring** - Track bot status, server count, and user metrics
- **Interactive Dashboard** - Beautiful animations and smooth transitions
- **User Management** - Role-based authentication and user administration
- **Broadcast Messaging** - Send messages to all connected Discord servers
- **Command Overview** - Comprehensive bot command management
- **Moderation Tools** - Advanced moderation panel for server management
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Theme** - Modern dark UI with gradient accents and glow effects

## 🎨 Animation Features

- **Stretching Buttons** - Buttons stretch horizontally on hover and return to normal smoothly
- **Loading Screens** - Beautiful fake loading screen with bot initialization steps
- **Page Transitions** - Smooth slide and fade animations between pages
- **Floating Particles** - Animated background particles for visual appeal
- **Interactive Elements** - Hover effects, glow animations, and elastic transforms

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Session-based Authentication**
- **Bcrypt** password hashing
- **File-based storage** (expandable to PostgreSQL)

### Deployment
- **Docker** containerization
- **Render** cloud deployment
- **GitHub Actions** CI/CD pipeline

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd monroe-bot-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

### Default Login Credentials
- **Username:** admin
- **Password:** admin123

## 🌐 Deployment

### Deploy to Render

1. **Fork this repository**

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure Environment Variables**
   ```
   NODE_ENV=production
   SESSION_SECRET=your-secret-key
   API_SECRET=your-api-secret
   BOT_API_URL=https://your-bot-api-url.com
   ```

4. **Deploy**
   - Render will automatically build and deploy your application
   - Your app will be available at `https://your-app-name.onrender.com`

### Deploy with Docker

1. **Build the image**
   ```bash
   docker build -t monroe-bot-dashboard .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 \
     -e NODE_ENV=production \
     -e SESSION_SECRET=your-secret \
     monroe-bot-dashboard
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `5000` | No |
| `SESSION_SECRET` | Session encryption key | - | Yes |
| `API_SECRET` | API authentication secret | - | Yes |
| `BOT_API_URL` | Discord bot API URL | - | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | No |

### Bot Configuration

Connect your Discord bot by setting up the API endpoints in your bot application:

1. **Health Check**: `GET /api/health`
2. **Bot Status**: `GET /api/status`
3. **Server Stats**: `GET /api/stats`
4. **Broadcast**: `POST /api/broadcast`

## 🎯 Bot Integration

This dashboard is designed to work with the Monroe Discord Bot. Key integration features:

- **Real-time Status Monitoring**
- **Server and User Count Tracking**
- **Command Management**
- **Broadcast Messaging**
- **Moderation Tools**
- **Roblox Integration**
- **QOTD (Question of the Day)**
- **Server Announcements**

## 📱 Screenshots

### Login Page
Beautiful animated login with floating particles and gradient effects.

### Dashboard
Real-time metrics with interactive cards and smooth transitions.

### User Management
Role-based user administration with modern UI components.

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Bot Management
- `GET /api/bot/status` - Bot online status
- `GET /api/bot/stats` - Server and user counts
- `GET /api/bot/commands` - Available commands
- `POST /api/bot/broadcast` - Send broadcast message

### User Management
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

## 🧪 Development

### Project Structure
```
monroe-bot-dashboard/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
└── deployment/            # Docker and CI/CD configurations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for the Monroe Discord Community
   