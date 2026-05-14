import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { uploadMedia } from '../services/uploadService';
import { getEventById } from '../services/eventService';
import UploadOptions from '../components/UploadOptions';
import MediaPreview from '../components/MediaPreview';
import UploadProgress from '../components/UploadProgress';
import { compressImageFile, formatFileSize } from '../utils/fileUtils';

const MAX_VIDEO_SIZE = 80 * 1024 * 1024;
const MAX_FILE_SIZE = 120 * 1024 * 1024;

const createMediaItem = file => ({
  id: `media-${Date.now()}-${Math.random()}`,
  file,
  previewUrl: URL.createObjectURL(file),
  type: file.type.startsWith('video') ? 'video' : 'image',
  size: file.size,
  name: file.name,
  warning: null,
  status: 'pending',
  progress: 0,
});

const UploadPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [message, setMessage] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPercent, setCurrentPercent] = useState(0);

  useEffect(() => {
    getEventById(eventId).then(res => setEvent(res.event)).catch(() => setEvent(null));
  }, [eventId]);

  useEffect(() => {
    return () => {
      mediaItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const validateFile = file => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return 'Unsupported file type. Please choose an image or video.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File exceeds maximum allowed size of 120MB.';
    }
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      return 'Large video file. Please choose a shorter clip under 80MB.';
    }
    return null;
  };

  const addFiles = files => {
    const nextItems = [];
    const nextWarnings = [];

    files.forEach(file => {
      const fileWarning = validateFile(file);
      if (fileWarning) {
        nextWarnings.push(`${file.name}: ${fileWarning}`);
        return;
      }
      nextItems.push(createMediaItem(file));
    });

    if (nextWarnings.length) {
      setWarnings(prev => [...prev, ...nextWarnings]);
    }
    if (nextItems.length) {
      setMediaItems(prev => [...prev, ...nextItems]);
      setMessage('Files ready. Review them before upload.');
    }
  };

  const removeMedia = id => {
    setMediaItems(prev => {
      const next = prev.filter(item => item.id !== id);
      const removed = prev.find(item => item.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  };

  const handleUpload = async () => {
    if (!mediaItems.length) {
      setMessage('Please select photos or videos before uploading.');
      return;
    }

    setIsUploading(true);
    setWarnings([]);
    setMessage('Uploading selected files...');

    const updatedItems = [...mediaItems];

    for (let index = 0; index < updatedItems.length; index += 1) {
      const currentItem = updatedItems[index];
      setCurrentIndex(index + 1);
      setCurrentPercent(0);

      try {
        const originalFile = currentItem.file;
        let fileToUpload = originalFile;

        if (originalFile.type.startsWith('image/')) {
          fileToUpload = await compressImageFile(originalFile);
          if (fileToUpload.size < originalFile.size) {
            currentItem.warning = `Compressed to ${formatFileSize(fileToUpload.size)}.`;
          }
        }

        await uploadMedia(eventId, fileToUpload, percent => {
          currentItem.progress = percent;
          setCurrentPercent(percent);
        });

        currentItem.status = 'uploaded';
        currentItem.progress = 100;
        setMessage(`Uploaded ${currentItem.name} successfully.`);
      } catch (error) {
        currentItem.status = 'failed';
        setWarnings(prev => [...prev, `Upload failed for ${currentItem.name}.`]);
      }

      setMediaItems([...updatedItems]);
    }

    setIsUploading(false);
    setCurrentIndex(0);
    setCurrentPercent(0);
    setMessage('Upload complete. Thank you for sharing!');
  };

  const selectedCount = mediaItems.length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="rounded-[32px] border border-[#ecd8cf] bg-[#fffaf6] p-6 shadow-xl sm:p-8">
        <div className="mb-6 rounded-[28px] bg-[#f9ece7] p-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a5b47]">Share Your Wedding Memories</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#7c4a37] sm:text-4xl">Capture or upload your favorite moments</h1>
          <p className="mt-3 text-sm leading-6 text-[#6b4c3f]">Choose photo or video options and send your memories directly to the event gallery.</p>
        </div>

        {event && (
          <div className="mb-6 rounded-[28px] border border-[#e8d4cd] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8a5b47]">Event</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#5b3f36]">{event.title}</h2>
            <p className="mt-1 text-sm text-[#745548]">{event.brideName} & {event.groomName}</p>
            <p className="mt-1 text-sm text-[#745548]">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
          </div>
        )}

        <UploadOptions
          onCapturePhoto={addFiles}
          onCaptureVideo={addFiles}
          onUploadGallery={addFiles}
        />

        {warnings.length > 0 && (
          <div className="mt-5 rounded-[28px] border border-[#f5d1ca] bg-[#fff1ed] p-4 text-sm text-[#7c3a2d]">
            <p className="font-semibold">Attention</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedCount > 0 && (
          <div className="mt-6 rounded-[28px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#5b3f36]">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</p>
              <button
                type="button"
                className="rounded-full border border-[#8a5b47] px-4 py-2 text-sm text-[#8a5b47] hover:bg-[#fff1ed]"
                onClick={() => {
                  mediaItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
                  setMediaItems([]);
                }}
              >
                Clear selection
              </button>
            </div>
            <MediaPreview files={mediaItems} onRemove={removeMedia} />
          </div>
        )}

        <div className="mt-6 space-y-4">
          <button
            type="button"
            disabled={isUploading || selectedCount === 0}
            onClick={handleUpload}
            className="w-full rounded-3xl bg-[#8a5b47] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#6f4535] disabled:cursor-not-allowed disabled:bg-[#c7b1a4]"
          >
            {isUploading ? 'Uploading...' : 'Upload selected media'}
          </button>
          <Link
            to={`/event/${eventId}/gallery`}
            className="block rounded-3xl border border-[#8a5b47] bg-white px-6 py-4 text-center text-base font-semibold text-[#8a5b47] hover:bg-[#fff1ed]"
          >
            View event gallery
          </Link>
        </div>

        {isUploading && (
          <div className="mt-6">
            <UploadProgress progress={currentPercent} currentIndex={currentIndex} totalCount={selectedCount} />
          </div>
        )}

        {message && <p className="mt-5 text-sm text-[#5e4337]">{message}</p>}
      </div>
    </main>
  );
};

export default UploadPage;
