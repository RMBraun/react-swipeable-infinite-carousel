import React, { useCallback, useMemo } from 'react'
import styles from './Arrows.module.css'

export const Arrows = ({ isLeft, isHidden, scrollBy, scrollCount, arrowProps, arrowIconProps }) => {
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
    <button
      {...arrowProps}
      className={arrowClassName}
      onClick={onClick(arrowProps?.onClick, isLeft ? -scrollCount : scrollCount)}
    >
      <span {...arrowIconProps} className={iconClassName} />
    </button>
  )
}
