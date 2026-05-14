import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMedia } from '../services/uploadService';

const GalleryPage = () => {
  const { eventId } = useParams();
  const [media, setMedia] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(null);

  useEffect(() => {
    getMedia(eventId).then(res => setMedia(res.media)).catch(() => setMedia([]));
  }, [eventId]);

  const isSelected = itemId => selectedIds.includes(itemId);

  const toggleSelect = itemId => {
    setSelectedIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const selectAll = () => setSelectedIds(media.map(item => item._id));

  const createFilename = item => {
    const extension = item.mediaType === 'video' ? 'mp4' : 'jpg';
    return `${eventId}_${item._id}.${extension}`;
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadItems = async items => {
    if (!items.length) return;
    for (const item of items) {
      // download sequentially to avoid browser popup blocking
      // and give the user a chance to save each file.
      // eslint-disable-next-line no-await-in-loop
      await downloadFile(item.mediaUrl, createFilename(item));
    }
  };

  const downloadAll = async () => {
    await downloadItems(media);
  };

  const downloadSelected = async () => {
    const selectedItems = media.filter(item => selectedIds.includes(item._id));
    await downloadItems(selectedItems);
  };

  const openViewer = index => setViewerIndex(index);

  const closeViewer = () => setViewerIndex(null);

  const showPrevious = () => {
    if (viewerIndex === null) return;
    setViewerIndex((viewerIndex - 1 + media.length) % media.length);
  };

  const showNext = () => {
    if (viewerIndex === null) return;
    setViewerIndex((viewerIndex + 1) % media.length);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#7c4a37]">Wedding Gallery</h1>
          <p className="mt-2 text-sm text-[#6c4c3d]">Browse uploaded photos and videos from your event.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-[#8a5b47] bg-[#fffaf6] px-4 py-2 text-sm font-semibold text-[#7c4a37] transition hover:bg-[#f3e0d5]"
            onClick={downloadAll}
            disabled={!media.length}
          >
            Download all
          </button>
          <button
            type="button"
            className="rounded-full border border-[#8a5b47] bg-[#8a5b47] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6f4a37]"
            onClick={downloadSelected}
            disabled={!selectedIds.length}
          >
            Download selected ({selectedIds.length})
          </button>
          <button
            type="button"
            className="rounded-full border border-[#8a5b47] bg-[#fffaf6] px-4 py-2 text-sm font-semibold text-[#7c4a37] transition hover:bg-[#f3e0d5]"
            onClick={selectedIds.length ? clearSelection : selectAll}
            disabled={!media.length}
          >
            {selectedIds.length ? 'Clear selection' : 'Select all'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item, index) => (
          <div key={item._id} className="group relative overflow-hidden rounded-[28px] bg-white shadow-sm">
            <button
              type="button"
              className={`absolute left-3 top-3 z-10 rounded-full border-2 p-2 text-xs font-semibold transition ${isSelected(item._id) ? 'border-[#8a5b47] bg-[#8a5b47] text-white' : 'border-white bg-white/80 text-[#6b4a3f] hover:bg-white'}`}
              onClick={e => {
                e.stopPropagation();
                toggleSelect(item._id);
              }}
            >
              {isSelected(item._id) ? 'Selected' : 'Select'}
            </button>
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
              onClick={e => {
                e.stopPropagation();
                openViewer(index);
              }}
            >
              View
            </button>
            <div
              className="cursor-pointer"
              onClick={() => openViewer(index)}
            >
              {item.mediaType === 'video' ? (
                <video controls className="h-64 w-full object-cover" preload="metadata">
                  <source src={item.mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img src={item.mediaUrl} alt="Wedding upload" className="h-64 w-full object-cover" />
              )}
            </div>
          </div>
        ))}

        {!media.length && (
          <p className="col-span-full rounded-3xl bg-[#fff1ec] p-6 text-[#7d5445]">
            No uploads yet. Share the QR code and start collecting moments.
          </p>
        )}
      </div>

      {viewerIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={closeViewer} />
          <div className="relative z-10 flex max-h-full w-full max-w-6xl flex-col items-center gap-4 overflow-hidden rounded-[32px] bg-[#111] p-4 shadow-2xl sm:p-6">
            <div className="flex w-full items-center justify-between gap-4">
              <button
                type="button"
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#6b4a3f] shadow-sm"
                onClick={closeViewer}
              >
                Close
              </button>
              <div className="flex gap-2 text-sm text-white/80">
                <button type="button" onClick={showPrevious} className="rounded-full bg-white/10 px-3 py-2 font-semibold hover:bg-white/20">Prev</button>
                <button type="button" onClick={showNext} className="rounded-full bg-white/10 px-3 py-2 font-semibold hover:bg-white/20">Next</button>
              </div>
            </div>

            <div className="flex h-[70vh] w-full items-center justify-center overflow-hidden rounded-[24px] bg-black">
              {media[viewerIndex].mediaType === 'video' ? (
                <video controls autoPlay className="max-h-full max-w-full object-contain">
                  <source src={media[viewerIndex].mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img src={media[viewerIndex].mediaUrl} alt="Wedding upload" className="max-h-full max-w-full object-contain" />
              )}
            </div>

            <div className="w-full overflow-x-auto pb-2">
              <div className="flex gap-3">
                {media.map((item, thumbIndex) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setViewerIndex(thumbIndex)}
                    className={`shrink-0 overflow-hidden rounded-3xl border-2 transition ${viewerIndex === thumbIndex ? 'border-[#8a5b47]' : 'border-white/20'}`}
                  >
                    {item.mediaType === 'video' ? (
                      <video className="h-24 w-32 object-cover" muted>
                        <source src={item.mediaUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={item.mediaUrl} alt="Thumbnail" className="h-24 w-32 object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
