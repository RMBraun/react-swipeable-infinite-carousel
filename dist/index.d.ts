import React from 'react'
export interface CarouselProps {
  isInfinite?: number
  startIndex?: number
  isScrollable?: boolean
  isDraggable?: boolean
  hasDragMomentum?: boolean
  dragMomentumSpeed?: number
  dragMomentumDecay?: number
  minDisplayCount?: number
  displayCount?: number
  gridGap?: number
  arrows?: React.FC<any>
  arrowLeftProps?: Record<string, unknown>
  arrowRightProps?: Record<string, unknown>
  scrollSpeed?: number
  showIndexes?: boolean
  indexesPerRow?: number
  renderIndexes?: React.FunctionComponent<any>
  indexContainerProps?: Record<string, unknown>
  indexProps?: Record<string, unknown>
  style?: React.CSSProperties
  slideContainerStyle?: React.CSSProperties
  slideStyle?: React.CSSProperties
  children?: React.ReactNode
}
export interface RenderArrowsProps {
  isLeft: boolean
  isRight: boolean
  isHidden: boolean
  scrollBy: (scrollBy: number) => void
}

export interface RenderIndexesProps {
  activeIndexes: Array<number>
  startIndex: number
  endIndex: number
  indexesPerRow: number
  slideAnchors: {
    start: number
    end: number
    width: number
  }
  scrollBy: (scrollCount: number) => void
}

export declare const Carousel: React.FC<CarouselProps>
