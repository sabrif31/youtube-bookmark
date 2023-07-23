export const seek = (secs) => {
  const videoPlayer = document.querySelector('.video-stream');
  if (videoPlayer.fastSeek) videoPlayer.fastSeek(secs);
  else videoPlayer.currentTime = secs;
};

export const getCurrentTime = () => {
  const videoPlayer = document.querySelector('.video-stream');
  return videoPlayer.currentTime;
};
