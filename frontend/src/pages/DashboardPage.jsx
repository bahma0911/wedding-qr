import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventsByUser, getAllUsers, grantOrganizerRole } from '../services/eventService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    getEventsByUser(user.id).then(res => setEvents(res.events)).catch(() => setEvents([]));
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    getAllUsers().then(res => setUsers(res.users)).catch(() => setUsers([]));
  }, [user]);

  const handleGrantOrganizer = async targetUserId => {
    setAdminError('');
    setAdminSuccess('');
    try {
      const res = await grantOrganizerRole(targetUserId);
      setAdminSuccess(`${res.user.name} is now an organizer.`);
      setUsers(prev => prev.map(u => (u.id === targetUserId ? { ...u, role: 'organizer' } : u)));
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Could not grant organizer role');
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[32px] bg-white p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#7c4a37]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6c4c3d]">Manage your wedding events and guest media in one place.</p>
        </div>
        <Link to="/create-event" className="rounded-full bg-[#8a5b47] px-6 py-3 text-white">Create New Event</Link>
      </div>

      {user?.role === 'admin' && (
        <section className="mb-8 rounded-[32px] bg-white p-8 shadow-lg">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#7c4a37]">Admin: Grant Organizer Access</h2>
              <p className="mt-2 text-sm text-[#6c4c3d]">Select a user below to promote them to organizer so they can create events.</p>
            </div>
          </div>
          {adminSuccess && <p className="mb-3 rounded-3xl bg-green-50 p-4 text-sm text-green-700">{adminSuccess}</p>}
          {adminError && <p className="mb-3 rounded-3xl bg-red-50 p-4 text-sm text-red-700">{adminError}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {users.length ? users.map(u => (
              <div key={u._id || u.id} className="flex flex-col justify-between gap-4 rounded-[28px] border border-[#e6d1c9] bg-[#fff7f1] p-5 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#5b3f36]">{u.name}</p>
                  <p className="text-sm text-[#745548]">{u.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8a5b47]">Role: {u.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  {u.role === 'user' ? (
                    <button
                      type="button"
                      className="rounded-full bg-[#8a5b47] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6f4a37]"
                      onClick={() => handleGrantOrganizer(u._id || u.id)}
                    >
                      Grant organizer
                    </button>
                  ) : (
                    <span className="rounded-full bg-[#f3e0d5] px-4 py-2 text-sm font-semibold text-[#7c4a37]">{u.role}</span>
                  )}
                </div>
              </div>
            )) : (
              <p className="rounded-[28px] bg-[#fff1ec] p-6 text-[#7d5445]">No users found to manage.</p>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-6">
        {events.length ? events.map(event => (
          <div key={event._id} className="rounded-[32px] border border-[#e6d1c9] bg-[#fff7f1] p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#8a5b47]">{event.title}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#5b3f36]">{event.brideName} & {event.groomName}</h2>
                <p className="mt-1 text-sm text-[#745548]">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
              </div>
              <Link to={`/event/${event._id}/details`} className="rounded-full bg-[#8a5b47] px-5 py-3 text-white">View details</Link>
            </div>
          </div>
        )) : (
          <div className="rounded-[32px] bg-white p-8 text-center text-[#705045] shadow-sm">
            <p className="text-lg font-medium">You have no events yet.</p>
            <p className="mt-2 text-sm">Create a wedding event and invite guests with a QR code.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
