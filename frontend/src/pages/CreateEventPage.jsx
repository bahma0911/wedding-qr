import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';

const CreateEventPage = () => {
  const [form, setForm] = useState({
    title: '', brideName: '', groomName: '', date: '', location: '', coverImage: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await createEvent(form);
      setSuccess('Event created successfully');
      navigate(`/event/${data.event._id}/details`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create event');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-[32px] bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-[#7c4a37]">Create Wedding Event</h1>
        <p className="mt-2 text-sm text-[#6c4c3d]">Build a new event and generate your QR upload page instantly.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {['title','brideName','groomName','date','location','coverImage'].map(field => (
            <label key={field} className="block text-sm text-[#5d4037]">
              {field === 'coverImage' ? 'Cover Image URL (optional)' : field === 'brideName' ? 'Bride name' : field === 'groomName' ? 'Groom name' : field === 'date' ? 'Wedding date' : 'Event title'}
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field === 'date' ? 'date' : 'text'}
                className="mt-2 w-full rounded-3xl border border-[#e2cfc5] px-4 py-3"
                required={field !== 'coverImage'}
              />
            </label>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button type="submit" className="w-full rounded-3xl bg-[#8a5b47] px-5 py-3 text-white">Create Event</button>
        </form>
      </div>
    </main>
  );
};

export default CreateEventPage;
