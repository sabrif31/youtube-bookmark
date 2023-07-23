import React, { useEffect, useState } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

import SideBar from './PanelRight/SideBar'
import Select, { Option } from './Components/Select'
import AddBookmark from './AddBookmark/AddBookmark'

import { parserVideoId } from './utils/youtube'
import { toHHMMSS } from './utils/date'
import { seek } from './utils/video'

import './App.scss'

const mockYoutubeId = 'QwaFjIU2NXU'

function App() {
  const [drawing, saveDrawing] = useLocalStorage('youtube-bookmark', {})
  const [currentVideo, setCurrentVideo] = useState(null)

  useEffect(() => {
    const currentVideoId = parserVideoId(document.location.href) || mockYoutubeId
    if (drawing[currentVideoId]) setCurrentVideo(drawing[currentVideoId])
  }, [drawing])

  const selectItem = (index) => {
    if (index && currentVideo.bookmark[index]) seek(currentVideo.bookmark[index].secs)
  }

  const onDeleteBookmark = async (index) => {
    const youtubeId = parserVideoId(document.location.href) || mockYoutubeId
    if (drawing[youtubeId]) {
      if (drawing[youtubeId].bookmark.length > 0) {
        await saveDrawing({
          ...drawing,
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
    </>
  )
}

export default App
