import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import SideBar from './PanelRight/SideBar'
import Select, { Option } from './Components/Select'
import AddBookmark from './AddBookmark/AddBookmark'
import useLocalStorage from './hooks/useLocalStorage'

import { parserVideoId } from './utils/youtube'
import { toHHMMSS } from './utils/date'
import { seek } from './utils/video'

import './App.css'

function debounce(fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this)
    }, ms)
  }
}

function App() {
  const [storage, saveStorage] = useLocalStorage('youtube-bookmark', {})
  const [currentVideo, setCurrentVideo] = useState(null)
  const [stateStorage, setStateStorage] = useState(storage)
  const [currentVideoID, setCurrentVideoID] = useState('')
  const addBookmarkContainerRef = useRef()

  useEffect(() => {
    const currentVideoId = parserVideoId(document.location.href)
    setCurrentVideoID(parserVideoId(document.location.href))
    if (storage[currentVideoId]) setCurrentVideo(storage[currentVideoId])
  }, [])

  const selectItem = (index) => {
    if (stateStorage[currentVideoID]?.bookmark?.[index])
      seek(stateStorage[currentVideoID].bookmark[index].secs)
  }

  const setPositionAddBookmark = () => {
    const video = document.querySelector('video')
    const { bottom, right } = video.getBoundingClientRect()
    addBookmarkContainerRef.current.style.top = `${bottom}px`
    addBookmarkContainerRef.current.style.left = `${
      right - addBookmarkContainerRef.current.offsetWidth
    }px`
    addBookmarkContainerRef.current.style.opacity = 1
  }

  /*
  useEffect(() => {
    function listenForStorage(e) {
      // setCurrentVideo(storage[e.detail.youtubeId])
    }

    setTimeout(() => setPositionAddBookmark, 1500)

    document.addEventListener('storage', listenForStorage, false)
    return () => {
      document.removeEventListener('storage', listenForStorage)
    }
  }, [])
  */

  useLayoutEffect(() => {
    window.addEventListener('resize', debounce(setPositionAddBookmark, 500))
    return () => {
      window.removeEventListener('resize', debounce(setPositionAddBookmark, 500))
    }
  }, [])

  const onDeleteBookmark = (index) => {
    if (stateStorage[currentVideoID]) {
      const data = {
        ...stateStorage,
        [currentVideoID]: {
          ...stateStorage[currentVideoID],
          bookmark: stateStorage[currentVideoID].bookmark.filter((_, idx) => idx !== index),
        },
      }
      saveStorage(data)
      setStateStorage(data)
    }
  }

  const deleteVideoOnBookmark = (videoId) => {
    const copyStorage = { ...stateStorage }
    delete copyStorage[videoId]
    saveStorage(copyStorage)
    setStateStorage(copyStorage)
  }

  /*
  
            <Option label={<p className='no-item'>0 item found</p>} />
            */
  return (
    <>
      <SideBar deleteVideoOnBookmark={deleteVideoOnBookmark} stateStorage={stateStorage} />
      <div ref={addBookmarkContainerRef} className='add-bookmark-container'>
        {/*
        <button type='button' onClick={deleteVideoOnBookmark}>
          Delete video bookmark
        </button>
        <AddBookmark
          youtubeId={currentVideoID}
          stateStorage={stateStorage}
          setStateStorage={setStateStorage}
          saveStorage={saveStorage}
        />
        */}
        <Select
          currentVideoID={currentVideoID}
          stateStorage={stateStorage}
          setStateStorage={setStateStorage}
          saveStorage={saveStorage}>
          <div className='all-options'>
            {stateStorage?.[currentVideoID]?.bookmark.map((item, index) => (
              <Option
                index={index}
                key={`${item.name}-${item.secs}`}
                onSelect={() => selectItem(index)}
                label={item.name}
                beforeLabel={toHHMMSS(item.secs)}
                thumbnail={item.thumbnail}
                onDelete={() => onDeleteBookmark(index)}
              />
            ))}
          </div>
        </Select>
      </div>
    </>
  )
}

export default App
