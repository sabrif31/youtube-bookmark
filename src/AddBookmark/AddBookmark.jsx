import { useState } from 'react'
import clsx from 'clsx'

import { useLocalStorage } from '@uidotdev/usehooks'

import { getCurrentTime } from '../utils/video'

import './addBookmark.scss'

function AddBookmark({ youtubeId }) {
  const [drawing, saveDrawing] = useLocalStorage('youtube-bookmark', null)
  const [bookmarkLabel, setBookmarkLabel] = useState('')

  const handleChange = (e) => {
    const value = e?.currentTarget.value
    setBookmarkLabel(value)
  }

  const saveBookmark = () => {
    let localStorageData = { ...drawing }

    if (drawing === null || !drawing[youtubeId]) {
      const videoTitle =
        document?.querySelector('#above-the-fold yt-formatted-string')?.innerText || 'DEBUG'
      const newYtB = {
        title: videoTitle,
        picture: '',
        bookmark: [],
      }
      localStorageData = { ...localStorageData, [youtubeId]: newYtB } // Init if not exist
    }

    saveDrawing({
      ...localStorageData,
      [youtubeId]: {
        ...localStorageData[youtubeId],
        bookmark: [
          ...localStorageData[youtubeId].bookmark,
          { name: bookmarkLabel, secs: getCurrentTime(), image: '' },
        ],
      },
    })
  }

  return (
    <div id='bookmark-form'>
      <input id='bookmark-name' placeholder='Bookmark name' onChange={handleChange} />
      <button
        id='bookmark-add-button'
        className={clsx({ active: bookmarkLabel.length > 0 })}
        disabled={bookmarkLabel.length === 0}
        type='button'
        onClick={saveBookmark}>
        <svg
          width='24px'
          height='24px'
          strokeWidth='1.5'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          color='#6f6f6f'>
          <path
            d='M13 21H3.6a.6.6 0 01-.6-.6V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6V13M16 19h3m3 0h-3m0 0v-3m0 3v3'
            stroke='#6f6f6f'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M9.898 8.513a.6.6 0 00-.898.52v5.933a.6.6 0 00.898.521l5.19-2.966a.6.6 0 000-1.042l-5.19-2.966z'
            stroke='#6f6f6f'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </div>
  )
}

export default AddBookmark
