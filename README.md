# Community Forum App

A modern, full-featured community forum built with React, Redux Toolkit, and React Query.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server (Terminal 1):**
   ```bash
   npm run server
   ```
   Backend will run on http://localhost:3001

3. **Start the frontend (Terminal 2):**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173 (or 5174 if 5173 is in use)

## 🔐 Test Credentials

The authentication system is fully functional. You can:

### Option 1: Use Demo Account
- **Email:** demo@example.com
- **Password:** password123

### Option 2: Create New Account
Simply click "Register" on the login page and create your own account with:
- Name
- Email
- Password

**Note:** The backend auto-creates accounts, so any valid email/password combination will work!

## 🌟 Features

### ✅ Authentication
- Login/Register with email & password
- JWT-like token authentication
- Auto-redirect based on auth state
- Persistent sessions (localStorage)

### ✅ Posts
- View all posts in feed
- Create new posts with title, content, and tags
- Like posts (with optimistic UI updates)
- View counter
- Rich post details

### ✅ Comments
- Add comments to posts
- Reply to comments (nested up to 3 levels)
- Like comments
- Lazy-loaded for performance

### ✅ Themes
- Light/Dark mode toggle
- Persists across sessions

### ✅ UI/UX
- Clean, hand-written CSS
- Responsive design
- Loading states
- Error handling
- Smooth transitions

## 📁 Project Structure

```
src/
├── api/              # API clients and endpoints
├── app/              # Redux store configuration
├── features/         # Redux slices (auth, theme)
├── pages/            # Page components
├── components/       # Reusable components
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - Vite (build tool)
  - Redux Toolkit (global state)
  - React Query (server state)
  - React Router (routing)
  - Axios (HTTP client)

- **Backend:**
  - JSON Server (mock REST API)
  - Custom authentication middleware

## 📝 Available Routes

- `/login` - Authentication page
- `/feed` - All posts feed
- `/posts/:id` - Single post with comments
- `/new` - Create new post

## 🎯 Key Implementations

1. **Optimistic UI Updates:** Likes update immediately before server confirms
2. **Lazy Loading:** Comments section loads on-demand with React.lazy
3. **Auto-focus:** Title input auto-focuses on New Post page (useRef)
4. **Nested Comments:** Support for threaded discussions up to 3 levels
5. **Persistent State:** Auth and theme persist across sessions

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `GET /auth/me` - Get current user

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create post
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Comments
- `GET /comments?postId=:id` - Get comments for post
- `POST /comments` - Create comment
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## 🎨 Customization

The app uses CSS variables for theming. You can customize colors in `src/index.css`:

```css
:root {
  --bg-primary: #ffffff;
  --accent-primary: #4a90e2;
  /* ... more variables */
}
```

## 📦 Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3001 or 5173 is already in use:
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Authentication Not Working
1. Make sure backend server is running on port 3001
2. Check browser console for CORS errors
3. Clear localStorage and try again

## 📄 License

MIT

---

**Enjoy building your community! 🎉**
