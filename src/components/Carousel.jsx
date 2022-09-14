/* eslint-disable react/prop-types */
import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import styles from './Carousel.module.css'

const getClientXOffset = (e) => e?.touches?.[0]?.clientX || e?.clientX || 0

const calculateAnchors = (slideRefs = []) =>
  slideRefs.reduce((acc, ref, i) => {
    if (ref?.current) {
      const width = ref.current.clientWidth
      const start = i === 0 ? 0 : acc[i - 1].end
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

const SlidesContainerCss = ({ isScrolling, isDragging }) => ({
  transition: `transform ${isScrolling || isDragging ? '0ms' : '500ms'}`,
})

// eslint-disable-next-line no-unused-vars
const Arrow = ({ isLeft, isRight, isHidden, scrollBy, arrowProps, arrowIconProps }) => {
  const arrowClassName = useMemo(
    () =>
      `${styles.arrow} ${isLeft ? styles.leftArrow : styles.rightArrow} ${isHidden ? styles.isArrowHidden : ''} ${
        arrowProps?.className || ''
      }`,
    [arrowProps?.className, isLeft, isHidden],
  )

  const onClick = useCallback(
    (callback, scrollCount) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (typeof callback === 'function') {
        callback(e)
      }

      scrollBy(scrollCount)
    },
    [arrowProps?.onClick, scrollBy, isLeft],
  )

  const iconClassName = useMemo(
    () =>
      `${styles.arrowIcon} ${isLeft ? styles.leftArrowIcon : styles.rightArrowIcon} ${arrowIconProps?.className || ''}`,
    [arrowIconProps?.className, isLeft],
  )

  return (
    <button {...arrowProps} className={arrowClassName} onClick={onClick(arrowProps?.onClick, isLeft ? -1 : 1)}>
      <span {...arrowIconProps} className={iconClassName} />
    </button>
  )
}

// eslint-disable-next-line no-unused-vars
const Indexes = ({ startIndex, endIndex, indexesPerRow, slideAnchors, scrollBy, indexContainerProps, indexProps }) => {
  const containerRef = useRef()
  const gap = 5
  const borderWidth = 2
  const width = useMemo(() => `calc((100% - ${(indexesPerRow - 1) * gap}px) / ${indexesPerRow})`, [indexesPerRow])

  const containerClassName = useMemo(
    () => `${styles.indexContainer} ${indexContainerProps?.className || ''}`,
    [indexContainerProps?.className],
  )

  const iconClassName = useMemo(() => `${styles.index} ${indexProps?.className || ''}`, [indexProps?.className])

  const onClick = useCallback(
    (callback, scrollCount) => (e) => {
      if (typeof callback === 'function') {
        callback(e)
      }

      scrollBy(scrollCount)
    },
    [indexProps?.onClick, scrollBy, startIndex],
  )

  return (
    <div
      {...indexContainerProps}
      ref={containerRef}
      className={containerClassName}
      style={{ gap: `${gap}px`, ...indexContainerProps?.style }}
    >
      {slideAnchors?.map((_, i) => (
        <button
          key={i}
          {...indexProps}
          className={iconClassName}
          style={{
            backgroundColor: i >= startIndex && i <= endIndex ? 'black' : 'transparent',
            width,
            borderWidth: `${borderWidth}px`,
            ...indexProps?.style,
          }}
          onClick={onClick(indexProps?.onClick, i - startIndex)}
        />
      ))}
    </div>
  )
}

export const Carousel = ({
  startIndex = 0,
  isScrollable = true,
  isDraggable = true,
  hasDragMomentum = true,
  dragMomentumSpeed = 25,
  dragMomentumDecay = 0.98,
  minDisplayCount = 0,
  displayCount = 0,
  gridGap = 10,
  showArrows = true,
  renderArrows: RenderArrows = Arrow,
  arrowLeftProps = {},
  arrowRightProps = {},
  scrollSpeed = 75,
  showIndexes = true,
  indexesPerRow = 0,
  renderIndexes: RenderIndexes = Indexes,
  indexContainerProps = {},
  indexProps = {},
  style = {},
  slideContainerStyle = {},
  slideStyle = {},
  children,
}) => {
  const momentumTimeoutId = useRef()
  const currentDragSpeed = useRef(0)
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
  const isMomentum = useRef(false)

  const translateOffset = useRef(() => getTranslateOffset(index.left))
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
    const newSlideAnchors = calculateAnchors(slidesRefs)
    if (newSlideAnchors?.length) {
      const containerWidth = slideContainerRef.current.clientWidth
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
      if (momentumTimeoutId.current) {
        cancelAnimationFrame(momentumTimeoutId.current)
      }

      if (!isDraggable || isScrolling || e.touches?.length > 1) {
        return
      }

      isMomentum.current = false
      setIsDragging(true)

      const xOffset = getClientXOffset(e)
      touchStartRef.current = xOffset
      touchEndRef.current = xOffset
    },
    [isDraggable, isScrolling, setIsDragging],
  )

  const onTouchMove = useCallback(
    (e) => {
      e.stopPropagation()

      if (isMomentum.current || !isDraggable || !isDragging || isScrolling) {
        return
      }

      touchEndRef.current = getClientXOffset(e)
      const delta = touchStartRef.current - touchEndRef.current
      touchStartRef.current = touchEndRef.current

      currentDragSpeed.current = delta

      if (delta !== 0) {
        const newTranslateOffset = translateOffset.current - delta
        const newScrollIndex = getScrollIndex(newTranslateOffset)

        setIndex(newScrollIndex)
        setTranslateOffset(newTranslateOffset)
      }
    },
    [isDraggable, slideAnchors, isScrolling, isDragging, index, setTranslateOffset],
  )

  const onTouchEnd = useCallback(
    (e) => {
      if (momentumTimeoutId.current) {
        cancelAnimationFrame(momentumTimeoutId.current)
      }

      if (!isDraggable || isScrolling || e.touches?.length > 0) {
        return
      }

      if (hasDragMomentum) {
        isMomentum.current = true

        const momentumFunc = (speed) => {
          momentumTimeoutId.current = requestAnimationFrame(() => {
            const newTranslateOffset = translateOffset.current - speed

            if (Math.abs(speed) <= 1 || newTranslateOffset >= maxScrollX || newTranslateOffset <= minScrollX) {
              isMomentum.current = false
              setIsDragging(false)
            } else {
              const newScrollIndex = getScrollIndex(newTranslateOffset)

              setIndex(newScrollIndex)
              setTranslateOffset(newTranslateOffset)

              momentumFunc(speed * dragMomentumDecay)
            }
          })
        }

        momentumFunc(
          currentDragSpeed.current < 0
            ? Math.max(currentDragSpeed.current, -dragMomentumSpeed)
            : Math.min(currentDragSpeed.current, dragMomentumSpeed),
        )
        currentDragSpeed.current = 0
      } else {
        setIsDragging(false)
      }
    },
    [
      hasDragMomentum,
      dragMomentumSpeed,
      dragMomentumDecay,
      minScrollX,
      maxScrollX,
      isDraggable,
      isScrolling,
      setIsDragging,
    ],
  )

  useEffect(() => {
    if (!isDragging || !isDraggable) {
      if (momentumTimeoutId.current) {
        cancelAnimationFrame(momentumTimeoutId.current)
      }

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
  }, [isDragging, isDraggable])

  const onScroll = useCallback(
    (e) => {
      if (!isScrollable || isDragging) {
        return
      }

      const isWheel = e.deltaX === 0 && Math.abs(e.deltaY) > 0
      const scrollDelta = isWheel ? -1 * e.deltaY : e.deltaX
      const scrollDirection = Math.sign(scrollDelta)

      if (
        (translateOffset.current >= maxScrollX && scrollDirection === -1) ||
        (translateOffset.current <= minScrollX && scrollDirection === 1)
      ) {
        return
      }

      if (!isScrolling) {
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
      isScrollable,
      index,
      slideAnchors,
      scrollSpeed,
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
        isScrolling,
        isDragging,
      }),
    [isScrolling, isDragging],
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
      <div className={styles.slidesAndArrowsContainer} onMouseLeave={onTouchEnd}>
        {showArrows && (
          <RenderArrows
            isLeft={true}
            isRight={false}
            isHidden={isScrolling || isDragging || !showLeftArrow}
            scrollBy={onArrowClick}
            arrowProps={arrowLeftProps}
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
          onWheel={onScroll}
        >
          {slides.map((slide, i) => (
            <div
              style={{ paddingRight: `${i === slides.length ? 0 : gridGap}px`, ...slideStyle }}
              ref={slidesRefs[i]}
              key={i}
            >
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
            arrowProps={arrowRightProps}
          />
        )}
      </div>
      {showIndexes && (
        <RenderIndexes
          startIndex={index.left}
          endIndex={index.right}
          indexesPerRow={indexesPerRow || slideCount}
          slideAnchors={slideAnchors}
          scrollBy={onArrowClick}
          indexContainerProps={indexContainerProps}
          indexProps={indexProps}
        />
      )}
    </div>
  )
}
