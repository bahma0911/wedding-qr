import { useMemo } from 'react';

const MediaPreview = ({ files, onRemove }) => {
  const previews = useMemo(
    () => files.map(file => ({
      id: file.id,
      type: file.file.type.startsWith('video') ? 'video' : 'image',
      url: file.previewUrl,
      name: file.file.name,
      size: file.file.size,
    })),
    [files]
  );

  return (
    <div className="space-y-4">
      {previews.map((item, index) => (
        <div key={item.id} className="rounded-[28px] border border-[#e8d4cd] bg-[#fff5f0] p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[96px_1fr] sm:items-center">
            <div className="h-24 w-full overflow-hidden rounded-3xl bg-[#f5e6df]">
              {item.type === 'video' ? (
                <video src={item.url} controls className="h-full w-full object-cover" />
              ) : (
                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#5f4338]">{item.name}</p>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="rounded-full bg-[#8a5b47] px-3 py-1 text-xs font-semibold text-white"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-[#6d5048]">{(item.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;
