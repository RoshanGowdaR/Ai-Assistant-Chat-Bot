# AI Chat Assistant

A modern, intelligent chat assistant built with cutting-edge web technologies. This application provides a seamless conversational experience with AI-powered responses, user authentication, and chat history management.

## 🚀 Features

- **AI-Powered Conversations**: Intelligent responses powered by advanced AI webhook integration
- **User Authentication**: Secure signup/signin with email verification via Supabase Auth
- **Chat History**: Persistent conversation history with organized session management
- **Real-time Messaging**: Instant message delivery and response handling
- **Modern UI/UX**: Clean, responsive interface with dark mode support
- **Markdown Support**: Rich text formatting with syntax highlighting for code blocks
- **Copy Functionality**: Easy copying of AI responses and code snippets
- **User Profiles**: Personalized user profiles with custom avatars and settings
- **Secure Database**: Row-level security (RLS) policies ensuring data privacy

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development environment
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Shadcn/UI** - High-quality, accessible UI components

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data synchronization
- **Authentication** - JWT-based auth with email verification

### Key Libraries
- **React Router DOM** - Client-side routing
- **React Markdown** - Markdown rendering with syntax highlighting
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Toast notifications
- **React Hook Form** - Form management with validation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── ChatInterface.tsx
│   ├── ChatSidebar.tsx
│   ├── MarkdownMessage.tsx
│   └── ProfileDropdown.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   └── use-toast.ts    # Toast notifications
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── pages/              # Application pages
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # Main chat dashboard
│   └── Index.tsx       # Landing page
└── lib/                # Utility functions
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Set up your Supabase project
   - Configure authentication providers
   - Set up the database tables and policies
   - Configure your AI webhook endpoint

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Database Schema

The application uses the following main tables:

- **profiles** - User profile information
- **chat_sessions** - Chat conversation sessions
- **messages** - Individual chat messages

All tables include Row Level Security (RLS) policies to ensure users can only access their own data.

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: Required email confirmation for new accounts
- **Input Validation**: Comprehensive form and data validation
- **HTTPS Only**: Secure data transmission

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Built-in dark theme support
- **Accessibility**: WCAG compliant components
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and recovery

## 🚀 Deployment

The application can be deployed to any modern hosting platform that supports:
- Node.js applications
- Static site hosting
- Environment variable configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Bug Reports & Feature Requests

Please use the GitHub Issues tab to report bugs or request new features.

---

Built with ❤️ using modern web technologies for a seamless chat experience.