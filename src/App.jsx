import React, { useEffect, useState } from 'react'

import SideBar from './PanelRight/SideBar'
import Select, { Option } from './Components/Select'
import AddBookmark from './AddBookmark/AddBookmark'
import useLocalStorage from './hooks/useLocalStorage'

import { parserVideoId } from './utils/youtube'
import { toHHMMSS } from './utils/date'
import { seek } from './utils/video'

import './App.css'

const mockYoutubeId = 'QwaFjIU2NXU'

function App() {
  const [storage, saveStorage] = useLocalStorage('youtube-bookmark', {})
  const [currentVideo, setCurrentVideo] = useState(null)
  const [currentVideoID, setCurrentVideoID] = useState('')

  useEffect(() => {
    const currentVideoId = parserVideoId(document.location.href) || mockYoutubeId
    setCurrentVideoID(parserVideoId(document.location.href))
    if (storage[currentVideoId]) setCurrentVideo(storage[currentVideoId])
    console.log(storage)
  }, [storage])

  const selectItem = (index) => {
    if (index && currentVideo.bookmark[index]) seek(currentVideo.bookmark[index].secs)
  }

  useEffect(() => {
    function listenForStorage(e) {
      if (storage) {
        console.log('listenForStorage', storage)
        setCurrentVideo(storage[e.detail.youtubeId])
        setCurrentVideoID(e.detail.youtubeId)
      }
    }

    window.addEventListener('storage', listenForStorage)
    return () => {
      window.removeEventListener('storage', listenForStorage)
    }
  }, [])

  const onDeleteBookmark = async (index) => {
    const youtubeId = parserVideoId(document.location.href) || mockYoutubeId
    if (storage[youtubeId]) {
      console.log(
        'DELETE',
        storage[youtubeId].bookmark.filter((_, idx) => idx !== index),
      )
      // if (storage[youtubeId].bookmark.length > 0) {
      await saveStorage({
        ...storage,
        [youtubeId]: {
          ...storage[youtubeId],
          bookmark: storage[youtubeId].bookmark.filter((_, idx) => idx !== index),
        },
      })
      window.dispatchEvent(new CustomEvent('storage', { detail: { youtubeId } }))
      // }
    }
  }

  return (
    <>
      <SideBar />
      <div style={{ position: 'absolute', top: 0, left: 250, zIndex: 2025, display: 'flex' }}>
        <AddBookmark youtubeId={currentVideoID} />
        <Select>
          {currentVideo && currentVideo.bookmark.length > 0 ? (
            currentVideo.bookmark.map((item, index) => (
              <Option
                index={index}
                key={item.secs}
                onSelect={selectItem}
                label={item.name}
                beforeLabel={toHHMMSS(item.secs)}
                onDelete={onDeleteBookmark}
              />
            ))
          ) : (
            <Option label={<p className='no-item'>0 item found</p>} />
          )}
        </Select>
      </div>
    </>
  )
}

export default App
