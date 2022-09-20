import React, { useCallback, useMemo, useRef } from 'react'
import styles from './Indexes.module.css'

export const Indexes = ({
  activeIndexes,
  startIndex,
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
