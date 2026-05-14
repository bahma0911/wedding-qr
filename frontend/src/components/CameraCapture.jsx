import { useRef } from 'react';

const CameraCapture = ({ captureMode, setCaptureMode, onCapture, remainingBytes }) => {
  const cameraInput = useRef(null);

  return (
    <div className="space-y-5 rounded-[28px] border border-[#e8d4cd] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-full bg-[#f7e8e0] p-1 text-sm text-[#7a4e3a] shadow-sm">
          {['photo', 'video'].map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setCaptureMode(mode)}
              className={`px-4 py-2 rounded-full transition ${captureMode === mode ? 'bg-[#8a5b47] text-white' : 'text-[#6b4a3f] hover:bg-[#f1d4c4]'}`}
            >
              {mode === 'photo' ? 'Photo' : 'Video'}
            </button>
          ))}
        </div>
        <div className="rounded-full bg-[#f3e2d9] px-4 py-2 text-xs font-semibold text-[#7a4e3a]">
          Remaining: {(remainingBytes / 1024 / 1024).toFixed(1)} MB
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-[28px] bg-[#8a5b47] px-5 py-4 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#6f4535]"
        onClick={() => cameraInput.current?.click()}
      >
        {captureMode === 'photo' ? 'Capture Photo' : 'Record Video'}
      </button>

      <input
        ref={cameraInput}
        type="file"
        accept={captureMode === 'photo' ? 'image/*' : 'video/*'}
        capture="environment"
        className="hidden"
        onChange={e => {
          onCapture(Array.from(e.target.files));
          e.target.value = null;
        }}
      />
    </div>
  );
};

export default CameraCapture;
