import { resizeCanvas } from './canvas'

export function parserVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : false
}

/**
 * USE THUMBNAIL CAPTURE
 * if (document.body) {
 *      const video = document.querySelector('video');
 *      const getBoundingClientRectVideo = video.getBoundingClientRect()
 *      const btnCapture = document.querySelector('#download-link');
 *      btnCapture.style.top = getBoundingClientRectVideo.top + 'px'
 *      btnCapture.style.left = getBoundingClientRectVideo.right - btnCapture.clientWidth - (getBoundingClientRectVideo.x / 2) + 2 + 'px'
 *      btnCapture.addEventListener('click', () => thumbnailCapture())
 *   }
 * @returns string data:image/base64
 */
// Generate thumbnail from the video
export const thumbnailCapture = async (canvasId, blockBodyId) => {
  const video = document.querySelector('video')
  if (!canvasId) throw console.error('canvasId is required')
  const canvas = document.getElementById(canvasId)
  // let blockBody;
  if (blockBodyId) {
    // blockBody = document.getElementById(blockBodyId);
    // blockBody.style.display = 'block'
    /*
        if (anime) {
            anime.timeline()
                .add({
                    targets: blockBody,
                    opacity: [0,1],
                    easing: "linear",
                    duration: 100,
                    delay: 0,
                    begin: function() {
                        document.getElementById(blockBodyId).style.display = 'block';
                    },
                })
                .add({
                    targets: blockBody,
                    opacity: [1,0],
                    easing: "linear",
                    duration: 500,
                    delay: 700,
                    complete: function() {
                        document.getElementById(blockBodyId).style.display = 'none';
                    },
                })
        }
        */
  }
  // canvas.style.opacity = 1;
  // canvas.style.display = 'block';

  // Draw the thumbnailz
  // const previousCurrentTime = video.currentTime
  let imageUrl = ''
  video.width = video.videoWidth
  video.height = video.videoHeight
  // video.currentTime = 10; // video.duration * 0.25; = 1/4 video

  const canvasCtx = canvas.getContext('2d')
  const { xOffset, yOffset, newWidth, newHeight } = resizeCanvas(video, canvas)
  canvasCtx.drawImage(video, xOffset, yOffset, newWidth, newHeight)

  imageUrl = canvas.toDataURL('image/png')
  // HOw declenche manual ????
  /*
    if (anime) {
        anime.timeline()
        .add({
            targets: canvas,
            translateX: [270, -270],
            opacity: [0,1],
            easing: "linear",
            duration: 300,
            delay: 700 // 200 + 30
        })
        .add({
            targets: canvas,
            translateX: [-270, 270],
            opacity: [1,0],
            easing: "linear",
            duration: 1000,
            delay: 1500 // 200 + 30
        })
    }
    */

  return imageUrl
}
