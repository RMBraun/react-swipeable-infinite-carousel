import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react"
import styled from "@emotion/styled"

const Container = styled.div<{
  slideWidth: number
  displayCount: number
  minDisplayCount: number
  gridGap: number
}>`
  position: relative;
  min-width: ${(props) =>
    props.minDisplayCount && props.minDisplayCount > 0
      ? `calc(${props.minDisplayCount} * ${props.slideWidth}px)`
      : `auto`};
  width: ${(props) =>
    props.displayCount && props.displayCount > 0
      ? `calc(${props.slideWidth}px * ${props.displayCount} + (${
          props.displayCount - 1
        } * ${props.gridGap}px))`
      : "100%"};
  max-width: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: row;
  align-items: center;
`

const SlidesContainer = styled.div<{
  gridGap: number
}>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.gridGap}px;
  z-index: 1;
`

const Slide = styled.div``

const ArrowIcon = styled.span`
  width: 35%;
  height: 35%;
  border: 6px solid #1b1b1b;
  border-radius: 5px;
  transition: border-color 500ms;
`

const Arrow = styled.button<{
  isHidden: boolean
  size: number
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  margin: 0px;
  border: none;
  outline: none;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: transparent;
  opacity: ${(props) => (props.isHidden ? 0 : 0.5)};
  transition: opacity 500ms, background-color 500ms;
  background-image: url();
  /* box-shadow: 1px 1px 5px 2px #898989; */
  z-index: 2;
  pointer-events: ${(props) => (props.isHidden ? "none" : "auto")};

  :hover {
    opacity: ${(props) => (props.isHidden ? 0 : 1)};
    background-color: #efefefa9;
  }
`

const LeftArrow = styled(Arrow)`
  left: 10px;
`

const LeftArrowIcon = styled(ArrowIcon)`
  border-right: none;
  border-top: none;
  transform: translateX(2.5px) rotate(45deg);
`

const RightArrow = styled(Arrow)`
  right: 10px;
`

const RightArrowIcon = styled(ArrowIcon)`
  border-left: none;
  border-bottom: none;
  transform: translateX(-2.5px) rotate(45deg);
`

const getClientXOffset = (e: any) => e?.touches?.[0]?.clientX || e?.clientX || 0

export const InfiniteCarousel = ({
  startIndex = 0,
  minDisplayCount = 0,
  displayCount = 0,
  gridGap = 10,
  slideWidth,
  showArrows = true,
  isInfinite = false,
  children,
  ...props
}: {
  startIndex?: number
  minDisplayCount?: number
  displayCount?: number
  gridGap?: number
  slideWidth: number
  showArrows?: boolean
  isInfinite?: boolean
  children?: React.ReactNode
}) => {
  const slides = useMemo(() => {
    const mainChildren = React.Children.toArray(children) || []

    return isInfinite
      ? [
          ...mainChildren.slice(-displayCount),
          ...mainChildren,
          ...mainChildren.slice(0, displayCount),
        ]
      : mainChildren
  }, [children, displayCount, isInfinite])

  const slideCount = useMemo(() => slides.length, [slides])

  const slidesRefs = useMemo<Array<React.RefObject<HTMLDivElement>>>(
    () => Array(slideCount).fill(React.createRef()),
    [slideCount]
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const [maxDisplayCount, setMaxDisplayCount] = useState(
    Math.max(displayCount, 1)
  )

  const getTranslateOffset = useCallback(
    (newIndex: number, scrollDelta = 0) => {
      return newIndex * -1 * (slideWidth + gridGap) - scrollDelta
    },

    [slideWidth, gridGap]
  )

  const [index, setIndex] = useState(
    isInfinite ? startIndex + maxDisplayCount : startIndex
  )
  const [isDragging, setIsDragging] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [translateOffset, setTranslateOffset] = useState(
    getTranslateOffset(index, 0)
  )
  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)
  const scrollDebounceId = useRef<NodeJS.Timeout>()
  const lastScrollInfo = useRef({
    timestamp: 0,
  })

  const onResize = useCallback(() => {
    const containerWidth =
      containerRef.current?.clientWidth || slideCount * slideWidth

    const boundMaxDisplayCount = Math.max(
      Math.min(Math.floor(containerWidth / slideWidth), displayCount),
      1
    )

    const newBoundIndex =
      index < 0
        ? 0
        : index > slideCount - boundMaxDisplayCount
        ? slideCount - boundMaxDisplayCount
        : index

    const newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0)

    setTranslateOffset(newBoundScrollDelta)
    setMaxDisplayCount(boundMaxDisplayCount)
  }, [
    slideCount,
    slideWidth,
    index,
    displayCount,
    getTranslateOffset,
    setTranslateOffset,
    setMaxDisplayCount,
  ])

  const getNewScrollState = useCallback(
    (newIndex: number) => {
      const newBoundIndex =
        newIndex < 0
          ? 0
          : newIndex > slideCount - maxDisplayCount
          ? slideCount - maxDisplayCount
          : newIndex

      const newBoundScrollDelta = getTranslateOffset(newBoundIndex, 0)

      return {
        index: newBoundIndex,
        translateOffset: newBoundScrollDelta,
      }
    },
    [slideCount, maxDisplayCount, getTranslateOffset]
  )

  useLayoutEffect(() => {
    onResize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDisplayCount, displayCount, gridGap, slideWidth])

  useEffect(() => {
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [onResize])

  const maxScrollX = 0
  const minScrollX = useMemo(
    () => -1 * (slideCount - maxDisplayCount) * (slideWidth + gridGap),
    [slideCount, maxDisplayCount, slideWidth, gridGap]
  )

  const showLeftArrow = isInfinite || index !== 0
  const showRightArrow = isInfinite || index + maxDisplayCount < slideCount

  const onArrowClick = useCallback<
    (indexOffset: number) => React.MouseEventHandler
  >(
    (indexOffset) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const newIndex = index + indexOffset
      const newBoundIndex =
        newIndex < 0
          ? 0
          : newIndex > slideCount - maxDisplayCount
          ? slideCount - maxDisplayCount - 1
          : newIndex

      setIndex(newBoundIndex)
      setTranslateOffset(getTranslateOffset(newBoundIndex, 0))
    },
    [
      index,
      slideCount,
      maxDisplayCount,
      getTranslateOffset,
      setIndex,
      setTranslateOffset,
    ]
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
    [isScrolling, setIsDragging]
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

        if (isInfinite) {
          if (newScrollDelta >= maxScrollX) {
            requestAnimationFrame(() => {
              setTranslateOffset(
                getTranslateOffset(slideCount - 2 * maxDisplayCount)
              )
              setIndex(slideCount - 2 * maxDisplayCount)
              touchStartRef.current = getTranslateOffset(
                slideCount - 2 * maxDisplayCount
              )
            })
          } else if (newScrollDelta <= minScrollX) {
            requestAnimationFrame(() => {
              setTranslateOffset(getTranslateOffset(maxDisplayCount))
              setIndex(maxDisplayCount)
              touchStartRef.current = getTranslateOffset(maxDisplayCount)
            })
          } else {
            requestAnimationFrame(() => {
              setTranslateOffset(newScrollDelta)
            })
          }
        } else {
          setTranslateOffset(newScrollDelta)
        }
      }
    },
    [
      isScrolling,
      isDragging,
      index,
      isInfinite,
      maxDisplayCount,
      minScrollX,
      slideCount,
      setTranslateOffset,
      getTranslateOffset,
    ]
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
  }, [
    isScrolling,
    index,
    slideWidth,
    gridGap,
    setIndex,
    setTranslateOffset,
    getNewScrollState,
  ])

  const onScroll = useCallback<React.WheelEventHandler<HTMLDivElement>>(
    (e) => {
      if (isDragging) {
        return
      }

      const scrollDirection = Math.sign(e.deltaX)

      const isScrollMomentum =
        e.timeStamp - lastScrollInfo.current.timestamp > 30

      lastScrollInfo.current.timestamp = e.timeStamp

      if (isInfinite) {
        if (isScrollMomentum) {
          return
        }
      } else if (
        isScrollMomentum ||
        (translateOffset >= maxScrollX && scrollDirection === -1) ||
        (translateOffset <= minScrollX && scrollDirection === 1)
      ) {
        return
      }

      if (!isScrolling) {
        setIsScrolling(true)
      }

      const newScrollDelta = translateOffset - e.deltaX

      const debounceFunc = () => {
        requestAnimationFrame(() => {
          setIsScrolling(false)

          const newIndex = Math.round(
            Math.abs(newScrollDelta) / (slideWidth + gridGap)
          )

          const newScrollState = getNewScrollState(newIndex)

          setIndex(newScrollState.index)
          setTranslateOffset(newScrollState.translateOffset)
        })
      }

      if (scrollDebounceId.current) {
        clearTimeout(scrollDebounceId.current)
      }

      if (isInfinite) {
        if (newScrollDelta >= maxScrollX) {
          requestAnimationFrame(() => {
            setTranslateOffset(
              getTranslateOffset(slideCount - 2 * maxDisplayCount)
            )
            setIndex(slideCount - 2 * maxDisplayCount)
          })
        } else if (newScrollDelta <= minScrollX) {
          requestAnimationFrame(() => {
            setTranslateOffset(getTranslateOffset(maxDisplayCount))
            setIndex(maxDisplayCount)
          })
        } else {
          requestAnimationFrame(() => {
            setTranslateOffset(newScrollDelta)
          })

          scrollDebounceId.current = setTimeout(debounceFunc, 100)
        }
      } else {
        if (newScrollDelta >= maxScrollX) {
          setTranslateOffset(maxScrollX)
          debounceFunc()
        } else if (newScrollDelta <= minScrollX) {
          setTranslateOffset(minScrollX)
          debounceFunc()
        } else {
          requestAnimationFrame(() => {
            setTranslateOffset(newScrollDelta)
          })

          scrollDebounceId.current = setTimeout(debounceFunc, 100)
        }
      }
    },
    [
      isInfinite,
      getTranslateOffset,
      maxDisplayCount,
      slideCount,
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
    ]
  )

  return (
    <Container
      ref={containerRef}
      minDisplayCount={minDisplayCount}
      displayCount={displayCount}
      slideWidth={slideWidth}
      gridGap={gridGap}
      {...props}
    >
      {showArrows && (
        <LeftArrow
          onClick={showLeftArrow ? onArrowClick(-1) : undefined}
          isHidden={isScrolling || isDragging || !showLeftArrow}
          size={48}
        >
          <LeftArrowIcon />
        </LeftArrow>
      )}
      <SlidesContainer
        style={{
          transform: `translate(${translateOffset}px)`,
          transition: `transform ${
            isScrolling || isDragging ? "0ms" : "500ms"
          }`,
        }}
        gridGap={gridGap}
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
          <Slide ref={slidesRefs[i]} key={i}>
            {slide}
          </Slide>
        ))}
      </SlidesContainer>
      {showArrows && (
        <RightArrow
          onClick={showRightArrow ? onArrowClick(1) : undefined}
          isHidden={isScrolling || isDragging || !showRightArrow}
          size={48}
        >
          <RightArrowIcon />
        </RightArrow>
      )}
    </Container>
  )
}
