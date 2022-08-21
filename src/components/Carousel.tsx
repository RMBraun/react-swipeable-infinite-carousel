import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect, ReactNode } from 'react'

const ContainerCss = ({
  slideWidth,
  displayCount,
  minDisplayCount,
  gridGap,
}: {
  slideWidth: number
  displayCount: number
  minDisplayCount: number
  gridGap: number
}): React.CSSProperties => ({
  position: 'relative',
  minWidth: `${minDisplayCount && minDisplayCount > 0 ? `calc(${minDisplayCount} * ${slideWidth}px)` : `auto`}`,
  width: `${
    displayCount && displayCount > 0
      ? `calc(${slideWidth}px * ${displayCount} + (${displayCount - 1} * ${gridGap}px))`
      : '100%'
  }`,
  maxWidth: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

const SlidesContainerCss = ({
  gridGap,
  isScrolling,
  isDragging,
}: {
  gridGap: number
  isScrolling: boolean
  isDragging: boolean
}): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  gap: `${gridGap}px`,
  zIndex: 1,
  transition: `transform ${isScrolling || isDragging ? '0ms' : '500ms'}`,
})

const ArrowIconCss: React.CSSProperties = {
  width: '35%',
  height: '35%',
  border: '6px solid #1b1b1b',
  borderRadius: '5px',
  transition: 'border-color 500ms',
}

type ArrowCssProps = {
  size: number
}

const ArrowCss = ({ size }: ArrowCssProps): React.CSSProperties => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  margin: '0px',
  border: 'none',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  backgroundColor: 'transparent',
  transition: 'opacity 500ms, background-color 500ms',
  zIndex: '2',
  cursor: 'pointer',
})

const LeftArrowCSs = (props: ArrowCssProps): React.CSSProperties => ({
  ...ArrowCss(props),
  left: '10px',
})

const LeftArrowIconCss: React.CSSProperties = {
  ...ArrowIconCss,
  borderRight: 'none',
  borderTop: 'none',
  transform: 'translateX(2.5px) rotate(45deg)',
}

const RightArrowCss = (props: ArrowCssProps): React.CSSProperties => ({
  ...ArrowCss(props),
  right: '10px',
})

const RightArrowIconCss: React.CSSProperties = {
  ...ArrowIconCss,
  borderLeft: 'none',
  borderBottom: 'none',
  transform: 'translateX(-2.5px) rotate(45deg)',
}

const Arrow: React.FunctionComponent<{
  style: React.CSSProperties
  isHidden: boolean
  onClick?: React.EventHandler<React.MouseEvent>
  children: ReactNode
}> = ({ isHidden, style, onClick, children }) => {
  const [isHover, setIsHover] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <button
      style={{
        ...style,
        opacity: isHidden ? '0' : isHover ? '1' : '0.5',
        pointerEvents: `${isHidden ? 'none' : 'auto'}`,
        backgroundColor: isActive ? '#929292a9' : isHover ? '#efefefa9' : 'transparent',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false)
        setIsActive(false)
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      <>{children}</>
    </button>
  )
}

const getClientXOffset = (e: any) => e?.touches?.[0]?.clientX || e?.clientX || 0

export const Carousel = ({
  startIndex = 0,
  minDisplayCount = 0,
  displayCount = 0,
  gridGap = 10,
  slideWidth,
  showArrows = true,
  children,
}: {
  startIndex?: number
  minDisplayCount?: number
  displayCount?: number
  gridGap?: number
  slideWidth: number
  showArrows?: boolean
  children?: React.ReactNode
}) => {
  const slides = useMemo(() => React.Children.toArray(children) || [], [children])

  const slideCount = useMemo(() => slides.length, [slides])

  const slidesRefs = useMemo<Array<React.RefObject<HTMLDivElement>>>(
    () => Array(slideCount).fill(React.createRef()),
    [slideCount],
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const slideContainerRef = useRef<HTMLDivElement>(null)

  const [maxDisplayCount, setMaxDisplayCount] = useState(Math.max(displayCount, 1))

  const getTranslateOffset = useCallback(
    (newIndex: number, scrollDelta = 0) => {
      return newIndex * -1 * (slideWidth + gridGap) - scrollDelta
    },

    [slideWidth, gridGap],
  )

  const [index, setIndex] = useState(startIndex)
  const [isDragging, setIsDragging] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const translateOffset = useRef<number>(getTranslateOffset(index, 0))

  const setTranslateOffset = useCallback((offset: number) => {
    translateOffset.current = offset
    requestAnimationFrame(() => {
      if (slideContainerRef.current) {
        slideContainerRef.current.style.transform = `translate(${offset}px)`
      }
    })
  }, [])

  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)
  const scrollDebounceId = useRef<NodeJS.Timeout>()
  const lastScrollInfo = useRef({
    timestamp: 0,
  })

  const onResize = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || slideCount * slideWidth

    const boundMaxDisplayCount = Math.max(Math.min(Math.floor(containerWidth / slideWidth), displayCount), 1)

    const newBoundIndex =
      index < 0 ? 0 : index > slideCount - boundMaxDisplayCount ? slideCount - boundMaxDisplayCount : index

    const newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0)

    setTranslateOffset(newBoundScrollDelta)
    setMaxDisplayCount(boundMaxDisplayCount)
  }, [slideCount, slideWidth, index, displayCount, getTranslateOffset, setTranslateOffset, setMaxDisplayCount])

  const getNewScrollState = useCallback(
    (newIndex: number) => {
      const newBoundIndex =
        newIndex < 0 ? 0 : newIndex > slideCount - maxDisplayCount ? slideCount - maxDisplayCount : newIndex

      const newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0)

      return {
        index: newBoundIndex,
        translateOffset: newBoundScrollDelta,
      }
    },
    [slideCount, maxDisplayCount, getTranslateOffset],
  )

  useLayoutEffect(() => {
    onResize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideCount, minDisplayCount, displayCount, gridGap, slideWidth])

  useEffect(() => {
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  const maxScrollX = 0
  const minScrollX = useMemo(
    () => -1 * (slideCount - maxDisplayCount) * (slideWidth + gridGap),
    [slideCount, maxDisplayCount, slideWidth, gridGap],
  )

  const showLeftArrow = index !== 0
  const showRightArrow = index + maxDisplayCount < slideCount

  const onArrowClick = useCallback<(indexOffset: number) => React.MouseEventHandler>(
    (indexOffset) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const newIndex = index + indexOffset
      const newBoundIndex =
        newIndex < 0 ? 0 : newIndex > slideCount - maxDisplayCount ? slideCount - maxDisplayCount - 1 : newIndex

      setIndex(newBoundIndex)
      setTranslateOffset(getTranslateOffset(newBoundIndex, 0))
    },
    [index, slideCount, maxDisplayCount, getTranslateOffset, setIndex, setTranslateOffset],
  )

  const onTouchStart = useCallback(
    (e: any) => {
      if (isScrolling) {
        return
      }

      setIsDragging(true)

      const xOffset = getClientXOffset(e)
      touchStartRef.current = xOffset
      touchEndRef.current = xOffset
    },
    [isScrolling, setIsDragging],
  )

  const onTouchMove = useCallback(
    (e: any) => {
      if (!isDragging || isScrolling) {
        return
      }

      touchEndRef.current = getClientXOffset(e)
      const delta = touchStartRef.current - touchEndRef.current

      if (delta !== 0) {
        const newScrollDelta = getTranslateOffset(index, delta)

        setTranslateOffset(newScrollDelta)
      }
    },
    [isScrolling, isDragging, index, setTranslateOffset, getTranslateOffset],
  )

  const onTouchEnd = useCallback(() => {
    if (isScrolling) {
      return
    }

    const delta = touchStartRef.current - touchEndRef.current

    if (delta !== 0) {
      const newIndex = Math.round(index + delta / (slideWidth + gridGap))

      const newScrollState = getNewScrollState(newIndex)

      setIndex(newScrollState.index)
      setTranslateOffset(newScrollState.translateOffset)

      touchStartRef.current = 0
      touchEndRef.current = 0
    }

    setIsDragging(false)
  }, [isScrolling, index, slideWidth, gridGap, setIndex, setTranslateOffset, getNewScrollState])

  const onScroll = useCallback<React.WheelEventHandler<HTMLDivElement>>(
    (e) => {
      if (isDragging) {
        return
      }

      const scrollDirection = Math.sign(e.deltaX)

      const isScrollMomentum = e.timeStamp - lastScrollInfo.current.timestamp > 30

      lastScrollInfo.current.timestamp = e.timeStamp

      if (
        isScrollMomentum ||
        (translateOffset.current >= maxScrollX && scrollDirection === -1) ||
        (translateOffset.current <= minScrollX && scrollDirection === 1)
      ) {
        return
      }

      if (!isScrolling) {
        setIsScrolling(true)
      }

      const newScrollDelta = translateOffset.current - e.deltaX

      const debounceFunc = () => {
        setIsScrolling(false)

        const newIndex = Math.round(Math.abs(newScrollDelta) / (slideWidth + gridGap))

        const newScrollState = getNewScrollState(newIndex)

        setIndex(newScrollState.index)
        setTranslateOffset(newScrollState.translateOffset)
      }

      if (scrollDebounceId.current) {
        clearTimeout(scrollDebounceId.current)
      }

      if (newScrollDelta >= maxScrollX) {
        setTranslateOffset(maxScrollX)
        debounceFunc()
      } else if (newScrollDelta <= minScrollX) {
        setTranslateOffset(minScrollX)
        debounceFunc()
      } else {
        setTranslateOffset(newScrollDelta)

        scrollDebounceId.current = setTimeout(debounceFunc, 100)
      }
    },
    [
      gridGap,
      isScrolling,
      minScrollX,
      translateOffset,
      slideWidth,
      isDragging,
      setIsScrolling,
      setIndex,
      setTranslateOffset,
      getNewScrollState,
    ],
  )

  return (
    <div
      style={ContainerCss({
        minDisplayCount,
        displayCount,
        slideWidth,
        gridGap,
      })}
      ref={containerRef}
    >
      {showArrows && (
        <Arrow
          style={LeftArrowCSs({
            size: 48,
          })}
          isHidden={isScrolling || isDragging || !showLeftArrow}
          onClick={showLeftArrow ? onArrowClick(-1) : undefined}
        >
          <span style={LeftArrowIconCss} />
        </Arrow>
      )}
      <div
        ref={slideContainerRef}
        style={SlidesContainerCss({
          gridGap,
          isScrolling,
          isDragging,
        })}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
        onWheel={onScroll}
      >
        {slides.map((slide, i) => (
          <div ref={slidesRefs[i]} key={i}>
            {slide}
          </div>
        ))}
      </div>
      {showArrows && (
        <Arrow
          style={RightArrowCss({
            size: 48,
          })}
          isHidden={isScrolling || isDragging || !showRightArrow}
          onClick={showRightArrow ? onArrowClick(1) : undefined}
        >
          <span style={RightArrowIconCss} />
        </Arrow>
      )}
    </div>
  )
}
