import React from 'react'
export interface CarouselProps {
  startIndex?: number
  minDisplayCount?: number
  displayCount?: number
  gridGap?: number
  showArrows?: boolean
  renderArrows?: React.FC<any>
  scrollSpeed?: number
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

export declare const Carousel: React.FC<CarouselProps>
