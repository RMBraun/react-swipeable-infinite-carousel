import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import styles from './Carousel.module.css'

const calcContainerWidth = (width, count, gap) => `calc(${width}px * ${count} + (${count - 1} * ${gap}px))`

const ContainerCss = ({ slideWidth, displayCount, minDisplayCount, gridGap }) => ({
  minWidth: `${
    minDisplayCount && minDisplayCount > 0 ? calcContainerWidth(slideWidth, minDisplayCount, gridGap) : 'auto'
  }`,
  width: `${displayCount && displayCount > 0 ? calcContainerWidth(slideWidth, displayCount, gridGap) : '100%'}`,
})

const SlidesContainerCss = ({ gridGap, isScrolling, isDragging }) => ({
  gap: `${gridGap}px`,
  transition: `transform ${isScrolling || isDragging ? '0ms' : '500ms'}`,
})

const Arrow = ({ isLeft, isHidden, style, onClick }) => {
  return (
    <button
      className={`${styles.arrow} ${isLeft ? styles.leftArrow : styles.rightArrow} ${
        isHidden ? styles.isArrowHidden : ''
      }`}
      style={style}
      onClick={onClick}
    >
      <span className={`${styles.arrowIcon} ${isLeft ? styles.leftArrowIcon : styles.rightArrowIcon}`} />
    </button>
  )
}

const getClientXOffset = (e) => e?.touches?.[0]?.clientX || e?.clientX || 0

export const Carousel = ({
  startIndex = 0,
  minDisplayCount = 0,
  displayCount = 0,
  gridGap = 10,
  slideWidth = 0,
  showArrows = true,
  renderArrows: RenderArrows = Arrow,
  style = {},
  slideContainerStyle = {},
  slideStyle = {},
  children,
}) => {
  const slides = useMemo(() => React.Children.toArray(children) || [], [children])

  const slideCount = useMemo(() => slides.length, [slides])

  const slidesRefs = useMemo(() => Array(slideCount).fill(React.createRef()), [slideCount])

  const containerRef = useRef(null)
  const slideContainerRef = useRef(null)

  const [maxDisplayCount, setMaxDisplayCount] = useState(Math.max(displayCount, 1))

  const getTranslateOffset = useCallback(
    (newIndex, scrollDelta = 0) => {
      return newIndex * -1 * (slideWidth + gridGap) - scrollDelta
    },

    [slideWidth, gridGap],
  )

  const [index, setIndex] = useState(startIndex)
  const [isDragging, setIsDragging] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const translateOffset = useRef(getTranslateOffset(index, 0))

  const setTranslateOffset = useCallback((offset) => {
    translateOffset.current = offset
    requestAnimationFrame(() => {
      if (slideContainerRef.current) {
        slideContainerRef.current.style.transform = `translate(${offset}px)`
      }
    })
  }, [])

  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)
  const scrollDebounceId = useRef()
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
    (newIndex) => {
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

  const onArrowClick = useCallback(
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
    (e) => {
      if (isScrolling || e.touches?.length > 1) {
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
    (e) => {
      e.stopPropagation()

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

  const onTouchEnd = useCallback(
    (e) => {
      if (isScrolling || e.touches?.length > 0) {
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
    },
    [isScrolling, index, slideWidth, gridGap, setIndex, setTranslateOffset, getNewScrollState],
  )

  const onScroll = useCallback(
    (e) => {
      if (isDragging) {
        return
      }

      const isWheel = e.deltaX === 0 && Math.abs(e.deltaY) > 0
      const scrollDelta = isWheel ? -1 * e.deltaY : e.deltaX
      const scrollDirection = Math.sign(scrollDelta)

      lastScrollInfo.current.timestamp = e.timeStamp

      if (
        (translateOffset.current >= maxScrollX && scrollDirection === -1) ||
        (translateOffset.current <= minScrollX && scrollDirection === 1)
      ) {
        return
      }

      if (!isScrolling && !isWheel) {
        setIsScrolling(true)
      }

      const newScrollDelta = translateOffset.current - scrollDirection * Math.min(slideWidth, Math.abs(scrollDelta))

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
      className={styles.container}
      style={{
        ...ContainerCss({
          minDisplayCount,
          displayCount,
          slideWidth,
          gridGap,
        }),
        ...style,
      }}
      ref={containerRef}
    >
      {showArrows && (
        <RenderArrows
          isLeft={true}
          isRight={false}
          isHidden={isScrolling || isDragging || !showLeftArrow}
          onClick={showLeftArrow ? onArrowClick(-1) : undefined}
        />
      )}
      <div
        ref={slideContainerRef}
        className={styles.slideContainer}
        style={{
          ...SlidesContainerCss({
            gridGap,
            isScrolling,
            isDragging,
          }),
          ...slideContainerStyle,
        }}
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
          <div style={slideStyle} ref={slidesRefs[i]} key={i}>
            {slide}
          </div>
        ))}
      </div>
      {showArrows && (
        <RenderArrows
          isLeft={false}
          isRight={true}
          isHidden={isScrolling || isDragging || !showRightArrow}
          onClick={showRightArrow ? onArrowClick(1) : undefined}
        />
      )}
    </div>
  )
}
