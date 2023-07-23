import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useLocalStorage } from '@uidotdev/usehooks'

import './sidebar.scss'

function SideBar() {
  const [drawing, saveDrawing] = useLocalStorage('youtube-bookmark', null)
  const itemsBookmarkRef = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const openSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen) {
      // Animate link title
      /*
        const buildTitleAnime = (title) => {
            return title.replace(/\S/g, "<span class='letter'>$&</span>");
        }
        if (itemsBookmarkRef.current) {
            const allLink = itemsBookmarkRef.current.querySelectorAll('.ml12')
            allLink.forEach(item => {
                item.innerHTML = item.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
            })
        }
      */
      /*
        const textWrapper = document.querySelectorAll('#items-bookmark .item-bookmark a');
        textWrapper.forEach(item => {
            item.innerHTML = item.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        })
        var elements = document.querySelectorAll('#items-bookmark .item-bookmark a .letter');
        this.anime.timeline({ loop: false, duration: 500 }).add({
            targets: elements,
            translateX: [40,0],
            translateZ: 0,
            opacity: [0,1],
            easing: "easeOutExpo",
            duration: 500,
            delay: (el, i) => 5 * i // 200 + 30
        });
      */
    }
  }, [isOpen])

  return (
    <div className={clsx('sidebar-container', { active: isOpen })}>
      <div id='btn-container-bookmark'>
        <div id='btn-bookmark' className={clsx({ active: isOpen })} onClick={() => openSidebar()}>
          <div id='top' />
          <div id='middle' />
          <div id='bottom' />
        </div>
      </div>
      <div id='box-bookmark' className={clsx({ active: isOpen })}>
        <div id='items-bookmark'>
          {drawing &&
            Object.keys(drawing).map((index) => (
              <div key={index} className='list-navigation'>
                <img alt='Thumbnail Video' src={drawing[index]?.thumbnail} width='250' />
                <div className={clsx(`item-bookmark item-bookmark-anime-${index}`)}>
                  <a className='ml12' href={`https://www.youtube.com/watch?v=${drawing[index].id}`}>
                    {drawing[index].title}
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SideBar
