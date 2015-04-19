const React = require('react'),
draw = require('./render.js'),
mui = require('material-ui'),
poseActions = require('./pose-actions.js'),
Paper = mui.Paper,
FloatingActionButton = mui.FloatingActionButton,
PoseOnCanvas = require('./pose-on-canvas.js')

class Pose extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isUpdatingTransitionLength: false
    };
    this.contextTypes = {
      router: React.PropTypes.func
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  render () {
    var canvasWidth = 148;
    var scale = canvasWidth / 736;
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

    var actions = [];

    if (!this.state.style) {
      actions.push(<FloatingActionButton
        onClick={poseActions.delete.bind(this, this.props.data.id)}
        iconClassName="mdi mdi-delete"
        className="delete"
        mini={true}/>)

      actions.push(
        <FloatingActionButton
          onClick={this.handleEdit.bind(this)}
          iconClassName="mdi mdi-pencil"
          className="edit"
          mini={true}/>)
    }
    return (
      <div className="pose-container" style={{width: containerWidth}}>
        {transitionElement}
        <Paper zDepth={this.state.isUpdatingTransitionLength ? 2 : 1}
          className="paper" ref="pose"
          style={this.state.style}
          onMouseDown={this.handleMouseDown}>
          <PoseOnCanvas width={canvasWidth} actor={this.props.data} scale={this.state.scale || scale}></PoseOnCanvas>

          {actions}

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

    poseActions.updateTransition(this.props.data.id, newValue);
    window.setTimeout(() => {
      this.setState({
        isUpdatingTransitionLength: false
      })
    }, 0)

  }

  handleEdit () {
    var {router} = this.context;
    router.transitionTo('/pose/' + this.props.data.id)
  }

}

Pose.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Pose;
