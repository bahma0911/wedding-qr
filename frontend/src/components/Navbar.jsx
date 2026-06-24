import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-[#e6d7d1] bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link to="/" className="text-xl font-semibold text-[#8a5b47]">SnapGallery Ethiopia</Link>
        <div className="flex items-center gap-3">
          <Link className="text-sm text-[#6f4b3a] hover:text-[#8a5b47]" to="/">Home</Link>
          <Link className="text-sm text-[#6f4b3a] hover:text-[#8a5b47]" to="/event/123/gallery">Gallery</Link>
          {user ? (
            <>
              {(() => {
                const isAdminFromUser = user && user.role && String(user.role).toLowerCase() === 'admin';
                if (isAdminFromUser) return true;
                if (!token) return false;
                try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  return payload && payload.role && String(payload.role).toLowerCase() === 'admin';
                } catch (e) {
                  return false;
                }
              })() && (
                <Link className="text-sm text-[#6f4b3a] hover:text-[#8a5b47]" to="/dashboard">Dashboard</Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-full bg-[#8a5b47] px-4 py-2 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-full border border-[#8a5b47] px-4 py-2 text-sm text-[#8a5b47] hover:bg-[#f8ece7]" to="/login">Login</Link>
              <Link className="rounded-full bg-[#8a5b47] px-4 py-2 text-sm text-white" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
