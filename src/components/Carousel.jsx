/* eslint-disable react/prop-types */
import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import styles from './Carousel.module.css'

const getClientXOffset = (e) => e?.touches?.[0]?.clientX || e?.clientX || 0

const calculateAnchors = (slideRefs = [], gridGap) =>
  slideRefs.reduce((acc, ref, i) => {
    if (ref?.current) {
      const width = ref.current.clientWidth - gridGap
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
    minWidth: minWidth > 0 ? `${minWidth}px` : 'auto',
    width: width > 0 ? `${width}px` : '100%',
  }
}

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
const Indexes = ({
  activeIndexes,
  startIndex,
  // eslint-disable-next-line no-unused-vars
  endIndex,
  indexesPerRow,
  slideAnchors,
  scrollBy,
  indexContainerProps,
  indexProps,
}) => {
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
    [scrollBy],
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
            backgroundColor: activeIndexes.includes(i) ? 'black' : 'transparent',
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
  isInfinite = false,
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
  const momentumDebounceId = useRef()

  const transitionDebounceId = useRef()

  const areArrowsLocked = useRef(false)

  const currentDragSpeed = useRef(0)

  const resizeObserverRef = useRef()

  const rawSlides = React.Children.toArray(children) || []

  const [clonesLength, setClonesLength] = useState(isInfinite ? rawSlides.length : 0)

  const slides = useMemo(
    () =>
      isInfinite && clonesLength
        ? [
            ...rawSlides.slice(rawSlides.length - clonesLength, rawSlides.length),
            ...rawSlides,
            ...rawSlides.slice(0, clonesLength),
          ]
        : rawSlides,
    [rawSlides.length, isInfinite, clonesLength],
  )

  const slideCount = slides.length

  const slidesRefs = useMemo(
    () =>
      Array(slideCount)
        .fill(null)
        .map((_, i) => slidesRefs?.[i] || React.createRef()),
    [slideCount],
  )

  const [slideAnchors, setSlideAnchors] = useState([])

  const coreSlideAnchors = useMemo(
    () => (isInfinite ? slideAnchors.slice(clonesLength, slideAnchors.length - clonesLength) : slideAnchors),
    [slideAnchors, slideAnchors.length, isInfinite],
  )

  const containerRef = useRef(null)

  const slideContainerRef = useRef(null)

  const getTranslateOffset = useCallback(
    (newIndex, newSlideAnchors = slideAnchors) => {
      const start = newSlideAnchors?.[newIndex]?.start
      return start != null ? -1 * start : 0
    },

    [slideAnchors],
  )

  const [index, setIndexState] = useState({ left: startIndex + clonesLength, right: startIndex + clonesLength })

  const activeIndexes = useMemo(() => {
    if (index?.left != null && index?.right != null) {
      return Array(index.right - index.left + 1)
        .fill(index.left)
        .map((_, i) => (index.left + i - clonesLength) % rawSlides.length)
    } else {
      return []
    }
  }, [index?.left, index?.right, clonesLength])

  const indexRef = useRef(index)

  const [maxIndex, setMaxIndex] = useState(slideCount)

  const [isDragging, setIsDragging] = useState(false)

  const [isScrolling, setIsScrolling] = useState(true)

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

  const showLeftArrow = isInfinite || index.left !== 0

  const showRightArrow =
    isInfinite ||
    (translateOffset.current != null && containerRef.current != null && slideAnchors?.[slideCount - 1] != null
      ? -1 * translateOffset.current + containerRef.current.clientWidth < slideAnchors?.[slideCount - 1].end
      : true)

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

  const setTranslateOffset = useCallback(
    ({ offset, index, newSlideAnchors = slideAnchors, newClonesLength = clonesLength }) => {
      requestAnimationFrame(() => {
        if (!slideContainerRef.current) {
          return
        }

        let boundOffset = offset

        if (isInfinite && newClonesLength && newSlideAnchors.length) {
          const rightAnchor = newSlideAnchors[newSlideAnchors.length - newClonesLength - 1].end + gridGap
          const leftAnchor = newSlideAnchors[newClonesLength].start

          if (offset + rightAnchor < 0) {
            boundOffset = offset + rightAnchor - leftAnchor
          } else if (offset + leftAnchor > 0) {
            boundOffset = offset + leftAnchor - rightAnchor
          }
        }

        const newIndex = index == null ? getScrollIndex(boundOffset) : index

        if (transitionDebounceId.current) {
          cancelAnimationFrame(transitionDebounceId.current)
        }

        if (isScrolling || isDragging) {
          slideContainerRef.current.style.transitionDuration = '0ms'
        }

        slideContainerRef.current.style.transform = `translate(${boundOffset}px)`

        transitionDebounceId.current = requestAnimationFrame(() => {
          slideContainerRef.current.style.transitionDuration = '500ms'
        })

        translateOffset.current = boundOffset
        setIndexState(newIndex)
      })
    },
    [
      gridGap,
      isScrolling,
      isDragging,
      slideAnchors,
      slideAnchors?.length,
      clonesLength,
      getScrollIndex,
      setIndexState,
      getScrollIndex,
    ],
  )

  const calcClonesLength = (newSlideAnchors) => {
    if (!isInfinite) {
      return 0
    }

    const containerWidth = slideContainerRef.current.clientWidth

    const coreSlideAnchors = isInfinite
      ? newSlideAnchors.slice(clonesLength, newSlideAnchors.length - clonesLength)
      : newSlideAnchors

    const leftCount = coreSlideAnchors.reduce(
      (acc, { width }, i) => {
        acc.width = acc.width + width

        if (acc.index == null && acc.width > containerWidth) {
          acc.index = i + 1
        }

        return acc
      },
      {
        width: 0,
        index: null,
      },
    ).index

    const rightCount = coreSlideAnchors.reduceRight(
      (acc, { width }, i) => {
        acc.width = acc.width + width

        if (acc.index == null && acc.width > containerWidth) {
          acc.index = coreSlideAnchors.length - i
        }

        return acc
      },
      {
        width: 0,
        index: null,
      },
    ).index

    return Math.max(leftCount, rightCount, 1)
  }

  const onResize = () => {
    const newSlideAnchors = calculateAnchors(slidesRefs, gridGap)
    if (newSlideAnchors?.length) {
      const containerWidth = slideContainerRef.current.clientWidth

      const newClonesLength = calcClonesLength(newSlideAnchors)

      const lastEnd = newSlideAnchors[newSlideAnchors.length - 1].end

      const newMaxIndex = getBoundIndex(
        newSlideAnchors.findIndex(({ start }) => start + containerWidth >= lastEnd),
        newSlideAnchors.length - 1,
      )
      const newLeftIndex = getBoundIndex(indexRef.current.left + newClonesLength, newMaxIndex)
      const newTranslateOffset = getTranslateOffset(newLeftIndex, newSlideAnchors)
      const newScrollIndex = getScrollIndex(newTranslateOffset, newSlideAnchors)

      setClonesLength(newClonesLength)
      setIndexState(newScrollIndex)
      setSlideAnchors(newSlideAnchors)
      setMaxIndex(newMaxIndex)
      setTranslateOffset({ offset: newTranslateOffset, index: newScrollIndex })
    }
  }

  useLayoutEffect(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }

    resizeObserverRef.current = new ResizeObserver(onResize)
    resizeObserverRef.current.observe(containerRef.current)
    slidesRefs.forEach(({ current }) => resizeObserverRef.current.observe(current))

    onResize()
  }, [slideCount, clonesLength, minDisplayCount, displayCount, gridGap, isInfinite])

  useEffect(() => {
    setIsScrolling(false)

    if (isInfinite) {
      onResize()
    }
  }, [])

  const onArrowClick = useCallback(
    (indexOffset) => {
      if (!areArrowsLocked.current) {
        areArrowsLocked.current = true
        let newBoundIndex = getBoundIndex(index.left + indexOffset)

        if (isInfinite) {
          const wrappedIndex =
            newBoundIndex >= slideAnchors.length - clonesLength
              ? newBoundIndex - rawSlides.length - 1
              : newBoundIndex < clonesLength - 1
              ? rawSlides.length + 1 + newBoundIndex
              : null

          if (wrappedIndex != null) {
            slideContainerRef.current.style.transitionDuration = '0ms'

            const wrappedTranslateOffset = -slideAnchors[wrappedIndex].start
            slideContainerRef.current.style.transform = `translate(${wrappedTranslateOffset}px)`

            translateOffset.current = wrappedTranslateOffset
            newBoundIndex = getBoundIndex(wrappedIndex + indexOffset)
          }
        }

        requestAnimationFrame(() => {
          slideContainerRef.current.style.transitionDuration = '500ms'
          requestAnimationFrame(() => {
            if (newBoundIndex !== index.left) {
              const newTranslateOffset = getTranslateOffset(newBoundIndex)
              const newScrollIndex = getScrollIndex(newTranslateOffset)
              setIndexState(newScrollIndex)

              slideContainerRef.current.addEventListener(
                'transitionend',
                () => {
                  areArrowsLocked.current = false
                },
                { once: true },
              )

              slideContainerRef.current.style.transform = `translate(${newTranslateOffset}px)`

              translateOffset.current = newTranslateOffset
            } else {
              areArrowsLocked.current = false
            }
          })
        })
      }
    },
    [
      slideAnchors,
      isInfinite,
      index,
      slideCount,
      getScrollIndex,
      getTranslateOffset,
      setTranslateOffset,
      getBoundIndex,
      setIndexState,
    ],
  )

  const onTouchStart = useCallback(
    (e) => {
      if (momentumDebounceId.current) {
        cancelAnimationFrame(momentumDebounceId.current)
      }

      if (areArrowsLocked.current || !isDraggable || isScrolling || e.touches?.length > 1) {
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

      if (areArrowsLocked.current || isMomentum.current || !isDraggable || !isDragging || isScrolling) {
        return
      }

      touchEndRef.current = getClientXOffset(e)
      const delta = touchStartRef.current - touchEndRef.current
      touchStartRef.current = touchEndRef.current

      currentDragSpeed.current = delta

      if (delta !== 0) {
        setTranslateOffset({ offset: translateOffset.current - delta })
      }
    },
    [isDraggable, isScrolling, isDragging, setTranslateOffset],
  )

  const onTouchEnd = useCallback(
    (e) => {
      if (momentumDebounceId.current) {
        cancelAnimationFrame(momentumDebounceId.current)
      }

      if (areArrowsLocked.current || !isDraggable || isScrolling || e.touches?.length > 0) {
        return
      }

      if (hasDragMomentum) {
        isMomentum.current = true

        const momentumFunc = (speed) => {
          momentumDebounceId.current = requestAnimationFrame(() => {
            const newTranslateOffset = translateOffset.current - speed

            if (Math.abs(speed) <= 1 || newTranslateOffset >= maxScrollX || newTranslateOffset <= minScrollX) {
              isMomentum.current = false
              setIsDragging(false)
              currentDragSpeed.current = 0
            } else {
              setTranslateOffset({ offset: newTranslateOffset })
              momentumFunc(speed * dragMomentumDecay)
            }
          })
        }

        momentumFunc(
          currentDragSpeed.current < 0
            ? Math.max(currentDragSpeed.current, -dragMomentumSpeed)
            : Math.min(currentDragSpeed.current, dragMomentumSpeed),
        )
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
      setTranslateOffset,
    ],
  )

  const onScroll = useCallback(
    (e) => {
      if (areArrowsLocked.current || !isScrollable || isDragging) {
        return
      }

      const isWheel = e.deltaX === 0 && Math.abs(e.deltaY) > 0
      const scrollDelta = isWheel ? -1 * e.deltaY : e.deltaX
      const scrollDirection = Math.sign(scrollDelta)

      if (
        (translateOffset.current >= maxScrollX && scrollDirection === -1) ||
        (translateOffset.current <= minScrollX && scrollDirection === 1)
      ) {
        setIsScrolling(false)
        return
      }

      if (!isScrolling) {
        setIsScrolling(true)
      }

      const newTranslateOffset =
        translateOffset.current - scrollDirection * Math.min(scrollSpeed, Math.abs(scrollDelta))

      const debounceFunc = () => {
        setIsScrolling(false)
      }

      if (scrollDebounceId.current) {
        clearTimeout(scrollDebounceId.current)
      }

      if (!isInfinite && newTranslateOffset >= maxScrollX) {
        setTranslateOffset({ offset: maxScrollX })
      } else if (!isInfinite && newTranslateOffset <= minScrollX) {
        setTranslateOffset({ offset: minScrollX })
      } else {
        setTranslateOffset({ offset: newTranslateOffset })

        scrollDebounceId.current = setTimeout(debounceFunc, 100)
      }
    },
    [
      isInfinite,
      isScrollable,
      scrollSpeed,
      isScrolling,
      minScrollX,
      translateOffset,
      isDragging,
      setIsScrolling,
      setTranslateOffset,
    ],
  )

  useEffect(() => {
    if (!areArrowsLocked.current && !(isDraggable && isDragging) && !(isScrollable && isScrolling)) {
      if (momentumDebounceId.current) {
        cancelAnimationFrame(momentumDebounceId.current)
      }

      if (scrollDebounceId.current) {
        clearTimeout(scrollDebounceId.current)
      }

      const newTranslateOffset = getTranslateOffset(index.left)
      setTranslateOffset({ offset: newTranslateOffset })

      touchStartRef.current = 0
      touchEndRef.current = 0
    }
  }, [isDragging, isDraggable, isScrolling, isScrollable])

  const containerCss = useMemo(
    () =>
      ContainerCss({
        minDisplayCount,
        displayCount,
        slideAnchors,
      }),
    [slideAnchors, slideAnchors?.length, minDisplayCount, displayCount],
  )

  return (
    <div
      className={styles.container}
      style={{
        ...containerCss,
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
          style={slideContainerStyle}
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
              style={{ paddingRight: `${!isInfinite && i === slides.length - 1 ? 0 : gridGap}px`, ...slideStyle }}
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
          startIndex={index.left - clonesLength}
          endIndex={index.right - clonesLength}
          activeIndexes={activeIndexes}
          indexesPerRow={indexesPerRow || rawSlides.length}
          slideAnchors={coreSlideAnchors}
          scrollBy={onArrowClick}
          indexContainerProps={indexContainerProps}
          indexProps={indexProps}
        />
      )}
    </div>
  )
}
