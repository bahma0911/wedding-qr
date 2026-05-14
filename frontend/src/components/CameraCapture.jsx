import { useRef } from 'react';

const CameraCapture = ({ captureMode, setCaptureMode, onCapture, remainingBytes }) => {
  const cameraInput = useRef(null);

  return (
    <div className="space-y-5 rounded-[28px] border border-[#e8d4cd] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-[28px] bg-[#f7e8e0] p-3 shadow-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#8a5b47]">Camera mode</p>
          <div className="flex gap-2">
            {['photo', 'video'].map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setCaptureMode(mode)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${captureMode === mode ? 'bg-[#8a5b47] text-white' : 'text-[#6b4a3f] hover:bg-[#f1d4c4]'}`}
              >
                {mode === 'photo' ? 'Photo' : 'Video'}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] bg-[#f3e2d9] px-4 py-3 text-sm font-semibold text-[#7a4e3a] shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7a4e3a]">Remaining size</p>
          <p className="mt-1 text-base">{(remainingBytes / 1024 / 1024).toFixed(1)} MB</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#d8c1b8] bg-[#fff9f5] p-4 text-center text-[#5b4034] shadow-sm">
        <p className="mb-3 text-sm font-medium">Tap below to open your camera</p>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-[28px] bg-[#8a5b47] px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#6f4535]"
          onClick={() => cameraInput.current?.click()}
        >
          {captureMode === 'photo' ? 'Capture photos' : 'Record videos'}
        </button>
        <p className="mt-3 text-xs text-[#7c5e52]">You can select multiple files if your device supports it.</p>
      </div>

      <input
        ref={cameraInput}
        type="file"
        accept={captureMode === 'photo' ? 'image/*' : 'video/*'}
        capture="environment"
        multiple
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
