import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventsByUser } from '../services/eventService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;
    getEventsByUser(user.id).then(res => setEvents(res.events)).catch(() => setEvents([]));
  }, [user]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[32px] bg-white p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#7c4a37]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6c4c3d]">Manage your wedding events and guest media in one place.</p>
        </div>
        <Link to="/create-event" className="rounded-full bg-[#8a5b47] px-6 py-3 text-white">Create New Event</Link>
      </div>

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
