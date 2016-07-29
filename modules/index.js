import React, { PropTypes } from 'react'

const touchX = (event) =>
  event.touches[0].clientX

const touchY = (event) =>
  event.touches[0].clientY

class Point extends React.Component {
  static propTypes = {
    onPoint: PropTypes.func
  }

  handleClick() {
    if (!this.usingTouch && this.props.onPoint)
      this.props.onPoint()
  }
  
  handleTouchStart(event) {
    this.usingTouch = true
    
    if (this.touchStarted)
      return
    
    this.touchStarted = true
    
    this.touchMoved = false
    this.startX = touchX(event)
    this.startY = touchY(event)
  }
  
  handleTouchMove(event) {
    if (!this.touchMoved)
      this.touchMoved = Math.abs(this.startX - touchX(event)) > 10 ||
                        Math.abs(this.startY - touchY(event)) > 10
  }
  
  handleTouchCancel() {
    this.touchStarted = this.touchMoved = false
    this.startX = this.startY = 0
  }
  
  handleTouchEnd() {
    this.touchStarted = false
    
    if (!this.touchMoved && this.props.onPoint)
      this.props.onPoint()
  }
  
  componentWillMount() {
    this.usingTouch = false
    
    // I, for one, welcome our new manual binding overlords.
    this.handleClick = this.handleClick.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchCancel = this.handleTouchCancel.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
  }
  
  render() {
    const { component, ...props } = this.props
    
    // Let React setup event handlers for us.
    // TODO: Warn if they try to pass these props in?
    props.onClick = this.handleClick
    props.onTouchStart = this.handleTouchStart
    props.onTouchMove = this.handleTouchMove
    props.onTouchCancel = this.handleTouchCancel
    props.onTouchEnd = this.handleTouchEnd
    
    return React.createElement(
      component,
      props
    )
  }
}

export default Point
