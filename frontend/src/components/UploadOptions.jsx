import { useRef } from 'react';

const UploadOptions = ({ onUploadGallery, autoUpload, setAutoUpload, totalSelectedSize }) => {
  const galleryInput = useRef(null);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <button
          type="button"
          className="flex h-20 flex-col items-center justify-center rounded-[28px] bg-[#f8e7df] px-4 text-sm font-semibold text-[#7a4e3a] shadow-sm transition hover:bg-[#f1d4c4]"
          onClick={() => galleryInput.current?.click()}
        >
          <span className="mb-1 text-2xl">🖼</span>
          Add Photos/Videos
        </button>
        <div className="rounded-[28px] border border-[#e8d4cd] bg-white p-4 text-sm text-[#5f4338] shadow-sm">
          <p className="font-semibold">Auto upload</p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-3 text-[#6b4a3f]">
            <input
              type="checkbox"
              checked={autoUpload}
              onChange={e => setAutoUpload(e.target.checked)}
              className="h-5 w-5 rounded border-[#d8c1b8] text-[#8a5b47] focus:ring-[#8a5b47]"
            />
            Auto-upload after camera capture only
          </label>
          <p className="mt-3 text-xs text-[#92766b]">Total selected: {(totalSelectedSize / 1024 / 1024).toFixed(1)} MB</p>
        </div>
      </div>

      <input
        ref={galleryInput}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={e => {
          onUploadGallery(Array.from(e.target.files));
          e.target.value = null;
        }}
      />
    </div>
  );
};

export default UploadOptions;
