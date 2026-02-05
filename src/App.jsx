import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
import Login from './pages/Login';

function App() {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className={`app ${mode}`}>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" />} />
          <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/posts/:id" element={user ? <PostDetail /> : <Navigate to="/login" />} />
          <Route path="/new" element={user ? <NewPost /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/feed" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
