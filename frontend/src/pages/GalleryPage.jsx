import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMedia } from '../services/uploadService';

const GalleryPage = () => {
  const { eventId } = useParams();
  const [media, setMedia] = useState([]);

  useEffect(() => {
    getMedia(eventId).then(res => setMedia(res.media)).catch(() => setMedia([]));
  }, [eventId]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-[#7c4a37]">Wedding Gallery</h1>
      <p className="mt-2 text-sm text-[#6c4c3d]">Scroll through uploaded photos and videos from your event.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map(item => (
          <div key={item._id} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
            {item.mediaType === 'video' ? (
              <video controls className="h-64 w-full object-cover"> <source src={item.mediaUrl} type="video/mp4" /> </video>
            ) : (
              <img src={item.mediaUrl} alt="Wedding upload" className="h-64 w-full object-cover" />
            )}
          </div>
        ))}
        {!media.length && <p className="col-span-full rounded-3xl bg-[#fff1ec] p-6 text-[#7d5445]">No uploads yet. Share the QR code and start collecting moments.</p>}
      </div>
    </main>
  );
};

export default GalleryPage;
