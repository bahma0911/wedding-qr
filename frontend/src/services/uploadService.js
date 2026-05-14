import api from './api';

export const uploadMedia = (eventId, fileData, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', fileData);
  return api.post(`/upload/${eventId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      if (onUploadProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || fileData.size));
        onUploadProgress(percentCompleted);
      }
    },
  }).then(res => res.data);
};

export const getMedia = eventId => api.get(`/upload/${eventId}`).then(res => res.data);
export const deleteMedia = photoId => api.delete(`/upload/${photoId}`).then(res => res.data);
