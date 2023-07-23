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

  useEffect(() => {
    const currentVideoId = parserVideoId(document.location.href) || mockYoutubeId
    if (storage[currentVideoId]) setCurrentVideo(storage[currentVideoId])
  }, [storage])

  const selectItem = (index) => {
    if (index && currentVideo.bookmark[index]) seek(currentVideo.bookmark[index].secs)
  }

  const onDeleteBookmark = async (index) => {
    const youtubeId = parserVideoId(document.location.href) || mockYoutubeId
    if (storage[youtubeId]) {
      if (storage[youtubeId].bookmark.length > 0) {
        await saveStorage({
          ...storage,
          [youtubeId]: {
            ...currentVideo,
            bookmark: currentVideo.bookmark.filter((_, idx) => idx !== index),
          },
        })
      }
    }
  }

  return (
    <>
      <SideBar />
      <div style={{ position: 'absolute', top: 0, left: 250, zIndex: 2025, display: 'flex' }}>
        <AddBookmark
          currentVideo={currentVideo}
          setCurrentVideo={setCurrentVideo}
          youtubeId={mockYoutubeId}
        />
        {currentVideo && (
          <Select>
            {currentVideo.bookmark.length > 0 ? (
              currentVideo.bookmark.map((item) => (
                <Option
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
        )}
      </div>
    </>
  )
}

export default App
