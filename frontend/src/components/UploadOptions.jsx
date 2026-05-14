import { useRef } from 'react';

const UploadOptions = ({ onCapturePhoto, onCaptureVideo, onUploadGallery }) => {
  const photoInput = useRef(null);
  const videoInput = useRef(null);
  const galleryInput = useRef(null);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          className="flex h-20 flex-col items-center justify-center rounded-[28px] bg-[#f8e7df] px-4 text-sm font-semibold text-[#7a4e3a] shadow-sm transition hover:bg-[#f1d4c4]"
          onClick={() => photoInput.current?.click()}
        >
          <span className="mb-1 text-2xl">📸</span>
          Take Photo
        </button>
        <button
          type="button"
          className="flex h-20 flex-col items-center justify-center rounded-[28px] bg-[#f8e7df] px-4 text-sm font-semibold text-[#7a4e3a] shadow-sm transition hover:bg-[#f1d4c4]"
          onClick={() => videoInput.current?.click()}
        >
          <span className="mb-1 text-2xl">🎥</span>
          Record Video
        </button>
        <button
          type="button"
          className="flex h-20 flex-col items-center justify-center rounded-[28px] bg-[#f8e7df] px-4 text-sm font-semibold text-[#7a4e3a] shadow-sm transition hover:bg-[#f1d4c4]"
          onClick={() => galleryInput.current?.click()}
        >
          <span className="mb-1 text-2xl">🖼</span>
          Upload Gallery
        </button>
      </div>

      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => {
          onCapturePhoto(Array.from(e.target.files));
          e.target.value = null;
        }}
      />
      <input
        ref={videoInput}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={e => {
          onCaptureVideo(Array.from(e.target.files));
          e.target.value = null;
        }}
      />
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
