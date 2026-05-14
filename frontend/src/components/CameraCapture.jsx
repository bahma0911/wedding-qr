import { useRef, useState, useEffect } from 'react';

const CameraCapture = ({ captureMode, setCaptureMode, onCapture, remainingBytes }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOpen, captureMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: captureMode === 'video',
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture([file]);
      }, 'image/jpeg', 0.8);
    }
  };

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        onCapture([file]);
        setRecordedChunks([]);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordedChunks(chunks);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleCamera = async () => {
    const newIsOpen = !isCameraOpen;
    setIsCameraOpen(newIsOpen);
    
    if (newIsOpen) {
      // Check if small screen (less than 768px width)
      if (window.innerWidth < 768 && cameraContainerRef.current) {
        try {
          await cameraContainerRef.current.requestFullscreen();
        } catch (error) {
          console.warn('Fullscreen not supported or failed:', error);
        }
      }
    } else {
      // Exit fullscreen when closing camera
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (error) {
          console.warn('Exit fullscreen failed:', error);
        }
      }
    }
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-[#e8d4cd] bg-white p-5 shadow-sm">
      {!isCameraOpen ? (
        <div className="rounded-[28px] border border-[#d8c1b8] bg-[#fff9f5] p-4 text-center text-[#5b4034] shadow-sm">
          <p className="mb-3 text-sm font-medium">Tap below to open your camera</p>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-[28px] bg-[#8a5b47] px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#6f4535]"
            onClick={toggleCamera}
          >
            Open Camera
          </button>
        </div>
      ) : (
        <div ref={cameraContainerRef} className="relative rounded-[28px] border border-[#d8c1b8] bg-black overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex gap-2">
              {['photo', 'video'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCaptureMode(mode)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${captureMode === mode ? 'bg-[#8a5b47] text-white' : 'bg-white/80 text-[#6b4a3f] hover:bg-white'}`}
                >
                  {mode === 'photo' ? 'Photo' : 'Video'}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-black/50 px-3 py-2 text-xs font-semibold text-white">
              <p>Remaining</p>
              <p>{(remainingBytes / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            {captureMode === 'photo' ? (
              <button
                type="button"
                onClick={capturePhoto}
                className="rounded-full bg-white p-4 shadow-lg"
              >
                <div className="w-6 h-6 bg-[#8a5b47] rounded-full"></div>
              </button>
            ) : (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`rounded-full p-4 shadow-lg ${isRecording ? 'bg-red-500' : 'bg-white'}`}
              >
                <div className={`w-6 h-6 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`}></div>
              </button>
            )}
            <button
              type="button"
              onClick={toggleCamera}
              className="rounded-full bg-white/80 p-3 text-[#6b4a3f] hover:bg-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
