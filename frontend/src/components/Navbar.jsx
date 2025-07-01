import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-lg">Job Tracker</Link>
      <div className="space-x-4">
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
