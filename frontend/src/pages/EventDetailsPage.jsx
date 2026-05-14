import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(eventId).then(res => setEvent(res.event)).catch(() => setEvent(null));
  }, [eventId]);

  if (!event) {
    return <div className="mx-auto max-w-4xl px-6 py-10">Loading event details...</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-[32px] bg-white p-8 shadow-xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <h1 className="text-3xl font-semibold text-[#7c4a37]">{event.title}</h1>
            <p className="text-sm text-[#6c4c3d]">{event.brideName} & {event.groomName}</p>
            <p className="text-sm text-[#6c4c3d]">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
            <div className="rounded-3xl border border-[#e6d1c9] bg-[#fdf0ea] p-5">
              <p className="text-sm font-semibold text-[#8a5b47]">Upload page</p>
              <p className="mt-2 text-sm text-[#705045]">Guests can scan the QR code or open upload page directly.</p>
            </div>
            <div className="space-y-3">
              <Link className="block rounded-full bg-[#8a5b47] px-5 py-3 text-center text-white" to={`/event/${eventId}/upload`}>Open Upload Page</Link>
              <Link className="block rounded-full border border-[#8a5b47] px-5 py-3 text-center text-[#8a5b47]" to={`/event/${eventId}/gallery`}>Open Gallery</Link>
            </div>
          </div>
          <div className="rounded-[32px] bg-[#fff3ed] p-6 text-center shadow-sm">
            <img src={event.qrCodeUrl} alt="Event QR code" className="mx-auto h-64 w-64 rounded-3xl object-cover" />
            <p className="mt-4 text-sm text-[#6f4c3d]">Save or download this QR code to print for your wedding.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetailsPage;
