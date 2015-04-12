const React = require('react'),
draw = require('./render.js'),
mui = require('material-ui'),
frameActions = require('./frame-actions.js'),
Paper = mui.Paper,
FloatingActionButton = mui.FloatingActionButton



class Pose extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isUpdatingTransitionLength: false
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  render () {
    var canvasWidth = 148;
    var containerWidth = canvasWidth;
    var transitionLength;
    if (this.state.isUpdatingTransitionLength) {
      transitionLength = this.state.intermidiateLength
    } else {
      transitionLength = this.props.data.transition.numberOfFrames
    }
    var transitionElement;
    if (this.props.index) { // first pose does not have a transition
      transitionElement = <div className="transition-length-line" style={{width: transitionLength + 'px'}}></div>
      containerWidth = (canvasWidth + transitionLength + 2) + 'px';
    }
    return (
      <div className="pose-container" style={{width: containerWidth}}>
        {transitionElement}
        <Paper zDepth={this.state.isUpdatingTransitionLength ? 2 : 1}
          className="paper"
          onMouseDown={this.handleMouseDown}>
          <canvas width={canvasWidth} height={82} ref="canvas"></canvas>

          <FloatingActionButton
            onClick={frameActions.deleteFrameById.bind(this, this.props.data.id)}
            iconClassName="mdi mdi-delete"
            className="delete"
            mini={true}/>
        </Paper>
      </div>
    )
  }

  handleMouseDown () {
    this.setState({
      isUpdatingTransitionLength: true,
      intermidiateLength: this.props.data.transition.numberOfFrames
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove (event) {
    var newValue = this.state.intermidiateLength + event.movementX;
    if (newValue >= 10 && newValue < 120) {
      this.setState({
        intermidiateLength: newValue
      });
    }
  }

  handleMouseUp () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    var newValue = this.state.intermidiateLength

    frameActions.updateFrameTransition(this.props.data.id, newValue);
    window.setTimeout(() => {
      this.setState({
        isUpdatingTransitionLength: false
      })
    }, 0)

  }

  componentDidMount () {
    var element = React.findDOMNode(this.refs.canvas);
    var context = element.getContext('2d');

    var canvasWidth = element.width;
    var canvasHeight = element.height;

    element.width = canvasWidth * window.devicePixelRatio;
    element.height = canvasHeight * window.devicePixelRatio;
    element.style.width = canvasWidth + 'px';
    element.style.height = canvasHeight + 'px';

    this.paint();
  }

  componentDidUpdate () {
    this.paint();
  }

  paint (context) {
    var element = React.findDOMNode(this.refs.canvas);
    var context = element.getContext('2d');
    context.clearRect(0, 0, element.width, element.height);


    context.save();
    context.rotate(-Math.PI/2);
    context.translate(-element.height, element.width/2);
    context.scale(window.devicePixelRatio * 0.18, window.devicePixelRatio * 0.18);
    context.lineJoin = 'round';
    context.lineCap = 'round';
    draw(context, this.props.data)
    context.restore();
  }

}

module.exports = Pose;
