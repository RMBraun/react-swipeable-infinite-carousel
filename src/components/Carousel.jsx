import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect, memo } from 'react'
import styles from './Carousel.module.css'

const getClientXOffset = (e) => e?.touches?.[0]?.clientX || e?.clientX || 0

const calculateAnchors = (slideRefs = [], gridGap = 0) =>
  slideRefs.reduce((acc, ref, i) => {
    if (ref?.current) {
      const width = ref.current.clientWidth
      const start = i === 0 ? 0 : acc[i - 1].end + gridGap
      const end = start + width
      acc.push({ start, end, width })
    }
    return acc
  }, [])

const calcMinWidth = (slideAnchors, count) =>
  slideAnchors?.length && count && count > 0
    ? slideAnchors.reduce((acc, { start }, i) => {
        const groupWidth = slideAnchors[Math.min(i + count - 1, slideAnchors.length - 1)].end - start

        return groupWidth > acc ? groupWidth : acc
      }, 0)
    : 0

const ContainerCss = ({ displayCount, minDisplayCount, slideAnchors }) => {
  const minWidth = calcMinWidth(slideAnchors, minDisplayCount)
  const width = calcMinWidth(slideAnchors, displayCount)

  return {
    minWidth: minWidth ? `${minWidth}px` : 'auto',
    width: width ? `${width}px` : '100%',
  }
}

const SlidesContainerCss = ({ gridGap, isScrolling, isDragging }) => ({
  gap: `${gridGap}px`,
  transition: `transform ${isScrolling || isDragging ? '0ms' : '500ms'}`,
})

const Arrow = ({ isLeft, isHidden, scrollBy }) => {
  const onClick = useCallback((scrollCount) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    scrollBy(scrollCount)
  })

  return (
    <button
      className={`${styles.arrow} ${isLeft ? styles.leftArrow : styles.rightArrow} ${
        isHidden ? styles.isArrowHidden : ''
      }`}
      onClick={onClick(isLeft ? -1 : 1)}
    >
      <span className={`${styles.arrowIcon} ${isLeft ? styles.leftArrowIcon : styles.rightArrowIcon}`} />
    </button>
  )
}

const Indexes = memo(function Indexes({ startIndex, endIndex, slideAnchors, scrollBy }) {
  const containerRef = useRef()
  const gap = 5
  const borderWidth = 2
  const indexShowCount = 10
  const width = useMemo(() => `calc((100% - ${(indexShowCount - 1) * gap}px) / ${indexShowCount})`, [])

  return (
    <div ref={containerRef} className={styles.indexContainer} style={{ gap: `${gap}px` }}>
      {slideAnchors?.map((_, i) => (
        <button
          key={i}
          className={styles.index}
          style={{
            backgroundColor: i >= startIndex && i <= endIndex ? 'black' : 'transparent',
            width,
            borderWidth: `${borderWidth}px`,
          }}
          onClick={() => {
            scrollBy(i - startIndex)
          }}
        />
      ))}
    </div>
  )
})

export const Carousel = ({
  startIndex = 0,
  minDisplayCount = 0,
  displayCount = 0,
  gridGap = 10,
  showArrows = true,
  renderArrows: RenderArrows = Arrow,
  scrollSpeed = 75,
  showIndexes = true,
  renderIndexes: RenderIndexes = Indexes,
  style = {},
  slideContainerStyle = {},
  slideStyle = {},
  children,
}) => {
  const resizeObserverRef = useRef()
  const slides = React.Children.toArray(children) || []
  const slideCount = slides.length
  const slidesRefs = useMemo(
    () =>
      Array(slideCount)
        .fill(null)
        .map((_, i) => slidesRefs?.[i] || React.createRef()),
    [slideCount],
  )
  const [slideAnchors, setSlideAnchors] = useState([])
  const containerRef = useRef(null)
  const slideContainerRef = useRef(null)
  const getTranslateOffset = useCallback(
    (newIndex, newSlideAnchors = slideAnchors) => {
      const start = newSlideAnchors?.[newIndex]?.start
      return start != null ? -1 * start : 0
    },

    [slideAnchors],
  )
  const [index, setIndexState] = useState({ left: startIndex, right: startIndex })
  const indexRef = useRef(index)
  const setIndex = useCallback(
    (newIndex) => {
      indexRef.current = newIndex
      setIndexState(newIndex)
    },
    [setIndexState],
  )
  const [maxIndex, setMaxIndex] = useState(slideCount)
  const [isDragging, setIsDragging] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const isMouseHover = useRef(false)

  const onMouseEnter = useCallback(() => {
    isMouseHover.current = true
  }, [])

  const translateOffset = useRef(getTranslateOffset(index.left))
  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)
  const scrollDebounceId = useRef()
  const maxScrollX = 0
  const minScrollX = useMemo(() => {
    const start = slideAnchors?.[maxIndex]?.start

    return start != null ? -1 * start : 0
  }, [slideAnchors, slideCount, maxIndex])
  const showLeftArrow = index.left !== 0
  const showRightArrow =
    translateOffset.current != null && containerRef.current != null && slideAnchors?.[slideCount - 1] != null
      ? -1 * translateOffset.current + containerRef.current.clientWidth < slideAnchors?.[slideCount - 1].end
      : true

  const getBoundIndex = useCallback(
    (newIndex, newMaxIndex = maxIndex) => Math.max(0, Math.min(newMaxIndex, newIndex)),
    [maxIndex],
  )

  const getScrollIndex = useCallback(
    (newTranslateOffset, newSlideAnchors = slideAnchors) => {
      const currentOffset = -1 * newTranslateOffset

      const newIndex = newSlideAnchors.reduce(
        (acc, { start, end, width }, i) => {
          acc.left = currentOffset >= start ? (currentOffset >= start + width / 2 ? i + 1 : i) : acc.left
          acc.right =
            containerRef.current != null
              ? currentOffset + containerRef.current.clientWidth >= end
                ? i
                : acc.right
              : slideCount - 1

          return acc
        },
        {
          left: 0,
          right: 0,
        },
      )

      return {
        left: getBoundIndex(newIndex.left),
        right: Math.max(Math.min(slideCount - 1, newIndex.right), newIndex.left),
      }
    },
    [slideCount, slideAnchors, getBoundIndex],
  )

  const setTranslateOffset = useCallback((offset) => {
    translateOffset.current = offset
    requestAnimationFrame(() => {
      if (slideContainerRef.current) {
        slideContainerRef.current.style.transform = `translate(${offset}px)`
      }
    })
  }, [])

  const onResize = () => {
    const newSlideAnchors = calculateAnchors(slidesRefs, gridGap)
    const containerWidth = containerRef.current.clientWidth
    const lastEnd = newSlideAnchors[newSlideAnchors.length - 1].end
    const newMaxIndex = getBoundIndex(
      newSlideAnchors.findIndex(({ start }) => start + containerWidth >= lastEnd),
      newSlideAnchors.length - 1,
    )
    const newLeftIndex = getBoundIndex(indexRef.current.left, newMaxIndex)
    const newTranslateOffset = getTranslateOffset(newLeftIndex, newSlideAnchors)
    const newScrollIndex = getScrollIndex(newTranslateOffset, newSlideAnchors)

    setIndex(newScrollIndex)
    setSlideAnchors(newSlideAnchors)
    setMaxIndex(newMaxIndex)
    setTranslateOffset(newTranslateOffset)
  }

  useLayoutEffect(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }

    resizeObserverRef.current = new ResizeObserver(onResize)
    slidesRefs.forEach(({ current }) => resizeObserverRef.current.observe(current))

    onResize()
  }, [slideCount, minDisplayCount, displayCount, gridGap])

  useEffect(() => {
    window.addEventListener('resize', onResize)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      window.removeEventListener('resize', onResize)
    }
  }, [])

  const onArrowClick = useCallback(
    (indexOffset) => {
      const newBoundIndex = getBoundIndex(index.left + indexOffset)
      const newTranslateOffset = getTranslateOffset(newBoundIndex)
      const newScrollIndex = getScrollIndex(newTranslateOffset)

      setIndex(newScrollIndex)
      setTranslateOffset(newTranslateOffset)
    },
    [index, slideCount, getTranslateOffset, setIndex, setTranslateOffset, getBoundIndex],
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
      touchStartRef.current = touchEndRef.current

      if (delta !== 0) {
        const newTranslateOffset = translateOffset.current - delta
        const newScrollIndex = getScrollIndex(newTranslateOffset)

        setIndex(newScrollIndex)
        setTranslateOffset(newTranslateOffset)
      }
    },
    [slideAnchors, isScrolling, isDragging, index, setTranslateOffset],
  )

  const onTouchEnd = useCallback(
    (e) => {
      if (isScrolling || e.touches?.length > 0) {
        return
      }

      setIsDragging(false)
    },
    [isScrolling, setIsDragging],
  )

  const onMouseLeave = useCallback(
    (e) => {
      isMouseHover.current = false
      onTouchEnd(e)
    },
    [onTouchEnd],
  )

  useEffect(() => {
    if (!isDragging) {
      const currentOffset = -1 * translateOffset.current

      const newIndex = slideAnchors.reduce((acc, { start, width }, i) => {
        return currentOffset >= start ? (currentOffset >= start + width / 2 ? i + 1 : i) : acc
      }, 0)

      const newBoundIndex = getBoundIndex(newIndex)
      const newTranslateOffset = getTranslateOffset(newBoundIndex)
      const newScrollIndex = getScrollIndex(newTranslateOffset)

      setIndex(newScrollIndex)
      setTranslateOffset(newTranslateOffset)

      touchStartRef.current = 0
      touchEndRef.current = 0
    }
  }, [isDragging])

  const onScroll = useCallback(
    (e) => {
      if (isDragging) {
        return
      }

      const isWheel = isMouseHover.current && e.deltaX === 0 && Math.abs(e.deltaY) > 0
      const scrollDelta = isWheel ? -1 * e.deltaY : e.deltaX
      const scrollDirection = Math.sign(scrollDelta)

      if (
        (translateOffset.current >= maxScrollX && scrollDirection === -1) ||
        (translateOffset.current <= minScrollX && scrollDirection === 1)
      ) {
        return
      }

      if (!isScrolling && !isWheel) {
        setIsScrolling(true)
      }

      const newTranslateOffset =
        translateOffset.current - scrollDirection * Math.min(scrollSpeed, Math.abs(scrollDelta))

      const newBoundIndex = getScrollIndex(newTranslateOffset)

      if (index.left !== newBoundIndex.left || index.right !== newBoundIndex.right) {
        setIndex(newBoundIndex)
      }

      const debounceFunc = () => {
        if (isScrolling) {
          setIsScrolling(false)
          const finalTranslateOffset = getTranslateOffset(newBoundIndex.left)
          const finalBoundIndex = getScrollIndex(finalTranslateOffset)
          setIndex(finalBoundIndex)
          setTranslateOffset(finalTranslateOffset)
        }
      }

      if (scrollDebounceId.current) {
        clearTimeout(scrollDebounceId.current)
      }

      if (newTranslateOffset >= maxScrollX) {
        setTranslateOffset(maxScrollX)
        debounceFunc()
      } else if (newTranslateOffset <= minScrollX) {
        setTranslateOffset(minScrollX)
        debounceFunc()
      } else {
        setTranslateOffset(newTranslateOffset)

        scrollDebounceId.current = setTimeout(debounceFunc, 100)
      }
    },
    [
      index,
      slideAnchors,
      scrollSpeed,
      gridGap,
      isScrolling,
      minScrollX,
      translateOffset,
      isDragging,
      setIsScrolling,
      setIndex,
      setTranslateOffset,
    ],
  )

  const slideContainerCss = useMemo(
    () =>
      SlidesContainerCss({
        gridGap,
        isScrolling,
        isDragging,
      }),
    [gridGap, isScrolling, isDragging],
  )

  return (
    <div
      className={styles.container}
      style={{
        ...ContainerCss({
          minDisplayCount,
          displayCount,
          slideAnchors,
        }),
        ...style,
      }}
      ref={containerRef}
    >
      <div className={styles.slidesAndArrowsContainer}>
        {showArrows && (
          <RenderArrows
            isLeft={true}
            isRight={false}
            isHidden={isScrolling || isDragging || !showLeftArrow}
            scrollBy={onArrowClick}
          />
        )}
        <div
          ref={slideContainerRef}
          className={styles.slideContainer}
          style={{
            ...slideContainerCss,
            ...slideContainerStyle,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onMouseLeave={onMouseLeave}
          onMouseEnter={onMouseEnter}
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
            scrollBy={onArrowClick}
          />
        )}
      </div>
      {showIndexes && (
        <RenderIndexes
          startIndex={index.left}
          endIndex={index.right}
          slideCount={slideCount}
          slideAnchors={slideAnchors}
          scrollBy={onArrowClick}
        />
      )}
    </div>
  )
}
