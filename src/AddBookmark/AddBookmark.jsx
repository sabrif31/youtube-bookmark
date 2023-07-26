import { useRef, useState } from 'react'
import clsx from 'clsx'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'

import { getCurrentTime } from '../utils/video'
import { thumbnailCapture } from '../utils/youtube'

import './addBookmark.css'

const styleBodyBg =
  'position:absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2025; background-color: rgba(0,0,0,0.5); display: none;'

function AddBookmark({ youtubeId, setStateStorage, stateStorage, saveStorage }) {
  const canvasRef = useRef()
  const bodyBgRef = useRef()
  const [bookmarkLabel, setBookmarkLabel] = useState('')

  const handleChange = (e) => {
    if (!e) return
    const {
      currentTarget: { value },
    } = e
    setBookmarkLabel(value)
  }

  const saveBookmark = async () => {
    let localStorageData = { ...stateStorage }
    // thumbnailCapture
    const imageUrl = await thumbnailCapture(canvasRef.current, bodyBgRef.current)

    if (stateStorage === null || !stateStorage[youtubeId]) {
      const videoTitle = document?.querySelector('#above-the-fold yt-formatted-string')?.innerText
      const newYtB = {
        title: videoTitle,
        thumbnail: imageUrl,
        bookmark: [],
      }
      localStorageData = { ...localStorageData, [youtubeId]: newYtB } // Init if not exist
    }

    const data = {
      ...localStorageData,
      [youtubeId]: {
        ...localStorageData[youtubeId],
        bookmark: [
          ...localStorageData[youtubeId].bookmark,
          { name: bookmarkLabel, secs: getCurrentTime(), thumbnail: imageUrl },
        ],
      },
    }
    saveStorage(data)
    setStateStorage(data)
    setBookmarkLabel('')
  }

  return (
    <div id='bookmark-form'>
      <canvas
        ref={canvasRef}
        id='capture-video-thumbnail'
        width='480'
        height='270'
        style={{ position: 'absolute', top: 0, right: -500, display: 'none' }}
      />
      <input
        id='bookmark-name'
        placeholder='Add a bookmark'
        value={bookmarkLabel}
        onChange={handleChange}
        type='text'
      />
      <button
        id='bookmark-add-button'
        className={clsx({ active: bookmarkLabel.length > 0 })}
        disabled={bookmarkLabel.length === 0}
        type='button'
        onClick={saveBookmark}>
        <BookmarkAddIcon />
      </button>
      {/* 
      <div
        ref={bodyBgRef}
        id='block-body'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2023,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'none',
        }}
      />
      */}
    </div>
  )
}

export default AddBookmark
