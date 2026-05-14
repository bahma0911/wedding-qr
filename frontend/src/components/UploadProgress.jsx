const UploadProgress = ({ progress, currentIndex, totalCount }) => {
  const percent = Math.round(progress || 0);

  return (
    <div className="rounded-[28px] bg-[#fff1ec] p-4 text-sm text-[#6b4a3f] shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">Uploading {currentIndex}/{totalCount}</p>
        <p>{percent}%</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#ddc3b8]">
        <div className="h-full rounded-full bg-[#8a5b47]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default UploadProgress;
