import * as React from 'react'
import clsx from 'clsx'
import { Bookmarks } from '@mui/icons-material'
import ClearIcon from '@mui/icons-material/Clear'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import {
  autoUpdate,
  flip,
  useFloating,
  useInteractions,
  useListNavigation,
  useTypeahead,
  useClick,
  useListItem,
  useDismiss,
  useRole,
  FloatingFocusManager,
  FloatingList,
} from '@floating-ui/react'
import AddBookmark from '../AddBookmark/AddBookmark'

import './select.css'

/*
interface SelectContextValue {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
  handleSelect: (index: number | null) => void;
}
*/

/*
var progressBar = document.querySelector('.ytp-progress-bar-padding')
var progressBarRect  = {
    left: progressBar.getBoundingClientRect().left,
    bottom: progressBar.getBoundingClientRect().bottom,
}
console.log('progressBarRect', progressBarRect)

var cursor = document.createElement('div')
cursor.classList.add('cursor-3')
cursor.style.cssText  = "position:absolute; left: 116px; z-index:2025; background: aliceblue; top: calc(753px - 29px); width: 10px; height: 25px;"
document.body.appendChild(cursor)

var video = document.querySelector('video')
console.log('DURATION', video.duration)
console.log('currentTime', video.currentTime)

exemple: 
  Current time | Duration
  8579.39096   | 15783.341

  Cursor position on the progress bar of the video: 8579 / 15783 * 100 = 54%

TODO:  Position on screen
var cursor3 = document.querySelector('.cursor-3')
const leftPosition = (video.currentTime / video.duration) * 100
cursor3.style.left = Math.round(leftPosition)+'%'
TODO:  Position on progress in relation to position screen
*/
const SelectContext = React.createContext({})

export function Option({ label, beforeLabel, onSelect, onDelete, index, thumbnail }) {
  const { activeIndex, selectedIndex, getItemProps, handleSelect } = React.useContext(SelectContext)

  const { ref } = useListItem({ label })

  const isActive = activeIndex === index
  const isSelected = selectedIndex === index

  return (
    <button
      type='button'
      ref={ref}
      role='option'
      aria-selected={isActive && isSelected}
      tabIndex={isActive ? 0 : -1}
      className={clsx({ selected: isSelected })}
      style={{
        // background: isActive ? "#1e1e1e" : "#181a1b",
        // color: isActive ? "#ffffff" : "#c7c7c7",
        fontWeight: isSelected ? 'bold' : '',
      }}
      {...getItemProps({
        onClick: () => {
          if (onSelect) {
            onSelect()
          }
          handleSelect(index)
        },
      })}>
      {thumbnail && <img src={thumbnail} width={90} alt='label' />}
      <div className='option-info'>
        <div className='button-label'>{label}</div>
        {beforeLabel && <div className='button-before'>{beforeLabel}</div>}
        {onDelete && (
          <div
            className='button-after'
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}>
            <ClearIcon />
          </div>
        )}
      </div>
    </button>
  )
}

function Select({ children, currentVideoID, stateStorage, setStateStorage, saveStorage }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(null)
  const [selectedLabel, setSelectedLabel] = React.useState(null)

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [flip()],
  })

  const elementsRef = React.useRef([])
  const labelsRef = React.useRef([])

  const handleSelect = React.useCallback((index) => {
    setSelectedIndex(index)
    setIsOpen(false)
    if (index !== null) {
      setSelectedLabel(labelsRef.current[index])
    }
  }, [])

  function handleTypeaheadMatch(index) {
    if (isOpen) {
      setActiveIndex(index)
    } else {
      handleSelect(index)
    }
  }

  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
  })
  /*
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  })
  */
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    listNav,
    click,
    dismiss,
    role,
  ])

  const selectContext = React.useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect],
  )

  //  tabIndex={0}
  /*
  {selectedLabel ?? 'Select...'}
  */
  return (
    <>
      <div className='select' ref={refs.setReference} {...getReferenceProps()}>
        <Bookmarks />
      </div>
      <SelectContext.Provider value={selectContext}>
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx('select-container', { active: isOpen })}>
            <AddBookmark
              youtubeId={currentVideoID}
              stateStorage={stateStorage}
              setStateStorage={setStateStorage}
              saveStorage={saveStorage}
            />
            <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
              {children}
            </FloatingList>
          </div>
        </FloatingFocusManager>
      </SelectContext.Provider>
    </>
  )
}

export default Select
