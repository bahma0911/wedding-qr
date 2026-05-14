import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { uploadMedia } from '../services/uploadService';
import { getEventById } from '../services/eventService';

const UploadPage = () => {
  const { eventId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(eventId).then(res => setEvent(res.event)).catch(() => setEvent(null));
  }, [eventId]);

  const handleFileChange = e => {
    setSelectedFile(e.target.files[0]);
    setStatus('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedFile) return setStatus('Please pick a photo or video.');

    try {
      setStatus('Uploading...');
      await uploadMedia(eventId, selectedFile);
      setStatus('Upload successful!');
      setSelectedFile(null);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Upload failed.');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-[32px] border border-[#e9d9d3] bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-[#7c4a37]">Upload photos or videos</h1>
        <p className="mt-2 text-sm text-[#6c4c3d]">Scan the event QR code and share moments instantly with the wedding gallery.</p>
        {event && (
          <div className="my-6 rounded-3xl bg-[#f9ece7] p-5">
            <p className="text-sm text-[#5b3f33]">Event:</p>
            <h2 className="text-xl font-semibold text-[#5b3f33]">{event.title}</h2>
            <p className="text-sm text-[#7c5b4c]">{event.brideName} & {event.groomName}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="flex min-h-[220px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d7bfb5] bg-[#fff2ed] p-8 text-center text-[#5c4337]">
            <span className="mb-3 text-lg font-medium">Drag & drop or select a file</span>
            <span className="text-sm">JPEG, PNG, WEBP, MP4 | max 120MB</span>
            <input type="file" className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
          </label>
          <button type="submit" className="w-full rounded-3xl bg-[#8a5b47] px-5 py-3 text-white">Upload Media</button>
        </form>
        {status && <p className="mt-4 text-sm text-[#6f4b3a]">{status}</p>}
        <div className="mt-6 text-sm text-[#6a4c3f]">
          <Link className="font-semibold text-[#8a5b47] hover:text-[#6f4535]" to={`/event/${eventId}/gallery`}>View event gallery</Link>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;
