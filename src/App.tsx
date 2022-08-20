import React, { useEffect, useState } from 'react'
import { Carousel } from './components/Carousel'

const MainContainerCss = ({ width }: { width: string }): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: `${width}`,
  border: '5px solid gray',
  gap: '15px',
  padding: '5px',
})

const TileCss = ({ color, width }: { color: string; width: string }): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2rem',
  width: `${width}`,
  height: '300px',
  backgroundColor: `${color}`,
  borderRadius: '5px',
})

const getRandomColor = (): number => Math.floor(Math.random() * 205) + 50
const randomColors = Array(25)
  .fill(null)
  .map(() => `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`)

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (!isMobile && window.innerWidth <= 475) {
        setIsMobile(true)
      } else if (isMobile && window.innerWidth > 475) {
        setIsMobile(false)
      }
    }

    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  })

  return (
    <div
      style={MainContainerCss({
        width: isMobile ? '75vw' : '75vw',
      })}
    >
      <Carousel
        slideWidth={isMobile ? 100 : 200}
        gridGap={10}
        displayCount={4}
        minDisplayCount={isMobile ? 1 : 2}
        showArrows={!isMobile}
      >
        {randomColors.map((color, i) => (
          <div
            key={i}
            style={TileCss({
              color,
              width: isMobile ? '100px' : '200px',
            })}
          >
            {i}
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default App
