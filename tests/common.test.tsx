import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'

import { Carousel } from '../index'

describe('Common render', () => {
  it('renders without crashing', () => {
    render(<Carousel slideWidth={200} />)
  })
})
