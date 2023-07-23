import React, { useEffect, useState } from "react";
import { useLocalStorage } from '@uidotdev/usehooks';

import SideBar from './PanelRight/SideBar'
import Select, { Option } from "./Components/Select";

import { parserVideoId } from "./utils/youtube";
import { toHHMMSS } from "./utils/date";

import "./App.scss";

const mockYoutubeId = 'G1YknY-Ne4E'

function App() {
    const [drawing, saveDrawing] = useLocalStorage("bookmark", null);
    const [currentVideo, setCurrentVideo] = useState(null)
    const [data, setData] = useState(drawing)

    useEffect(() => {
        const currentVideoId = parserVideoId(document.location.href) || mockYoutubeId
        if (drawing[currentVideoId]) setCurrentVideo(drawing[currentVideoId])
    }, [drawing])

    const selectItem = (index) => {
        console.log('selectItem', index)
    }

    const onDeleteBookmark = async (index) => {
        if (drawing) {
            // const localStorageData = drawing
            const youtubeId = parserVideoId(document.location.href) || mockYoutubeId
            if (drawing[youtubeId]) {
                // const selectedItem = drawing[youtubeId].bookmark[index];
                if (drawing[youtubeId].bookmark.length > 0) {
                    // const newLocalStorageDataBookmark = drawing[youtubeId].bookmark.filter(item => Number(item.secs) !== Number(selectedItem.secs));
                    
                    /*
                    await saveDrawing('bookmark', {
                        ...drawing,
                        [youtubeId]: {
                            ...currentVideo,
                            bookmark: currentVideo.bookmark.filter((_, idx) => idx !== index)
                        }
                    })
                    */
                    console.log('delete item', {
                        ...drawing,
                        [youtubeId]: {
                            ...currentVideo,
                            bookmark: currentVideo.bookmark.filter((_, idx) => idx !== index)
                        }
                    })
                    setCurrentVideo(prevState => ({
                        ...prevState,
                        bookmark: prevState.bookmark.filter((_, idx) => idx !== index)
                    }))
                    // selectedItem.remove()
                }
            }
        }
    }

    return (
        <>
            <div className="yt-bookmark">
                Youtube Bookmark
            </div>
            <SideBar />
            {currentVideo && (
                <Select>
                    {currentVideo.bookmark.length > 0 ? currentVideo.bookmark.map(item => (
                        <Option onSelect={selectItem} label={item.name} beforeLabel={toHHMMSS(item.secs)} onDelete={onDeleteBookmark} />
                    )) : (
                        <Option label={<p className="no-item">0 item found</p>} />
                    )}
                </Select>
            )}
        </>
    );
}

export default App;
