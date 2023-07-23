import * as React from 'react'
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

import './select.scss'
import clsx from 'clsx'
import {Cancel} from '@mui/icons-material'

/*
interface SelectContextValue {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
  handleSelect: (index: number | null) => void;
}
*/
const SelectContext = React.createContext({})

export function Option({label, beforeLabel, onSelect, onDelete}) {
  const {activeIndex, selectedIndex, getItemProps, handleSelect} = React.useContext(SelectContext)

  const {ref, index} = useListItem({label})

  const isActive = activeIndex === index
  const isSelected = selectedIndex === index

  return (
    <button
      type='button'
      ref={ref}
      role='option'
      aria-selected={isActive && isSelected}
      tabIndex={isActive ? 0 : -1}
      className={clsx({selected: isSelected})}
      style={{
        // background: isActive ? "#1e1e1e" : "#181a1b",
        // color: isActive ? "#ffffff" : "#c7c7c7",
        fontWeight: isSelected ? 'bold' : '',
      }}
      {...getItemProps({
        onClick: () => {
          if (onSelect) {
            handleSelect(index)
            onSelect(index)
          }
        },
      })}>
      {beforeLabel && <div className='button-before'>{beforeLabel}</div>}
      <div className='button-label'>{label}</div>
      {onDelete && (
        <div className='button-after'>
          <Cancel
            onClick={(e) => {
              e.stopPropagation()
              onDelete(index)
            }}
          />
        </div>
      )}
    </button>
  )
}

function Select({children}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(null)
  const [selectedIndex, setSelectedIndex] = React.useState(null)
  const [selectedLabel, setSelectedLabel] = React.useState(null)

  const {refs, floatingStyles, context} = useFloating({
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
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, {role: 'listbox'})

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    listNav,
    typeahead,
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

  return (
    <>
      <div className='select' ref={refs.setReference} {...getReferenceProps()}>
        {selectedLabel ?? 'Select...'}
      </div>
      <SelectContext.Provider value={selectContext}>
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={clsx('select-container', {active: isOpen})}>
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
