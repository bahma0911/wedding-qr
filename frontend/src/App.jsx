import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-[#fff8f4] text-[#2a2a2a]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/event/:eventId/upload" element={<UploadPage />} />
        <Route path="/event/:eventId/gallery" element={<GalleryPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
        <Route path="/event/:eventId/details" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
