const React = require('react'),
mui = require('material-ui'),
actions = require('./new-scene-actions.js'),
Paper = mui.Paper,
FloatingActionButton = mui.FloatingActionButton,
PoseOnCanvas = require('./pose-on-canvas.js')

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
    var scale = canvasWidth / 736;
    var containerWidth = canvasWidth;
    var transitionLength;
    if (this.state.isUpdatingTransitionLength) {
      transitionLength = this.state.intermidiateLength
    } else {
      transitionLength = this.props.data.transition.numberOfFrames
    }
    var transitionElement, transitionButton;
    if (this.props.index) { // first pose does not have a transition
      transitionElement = <div className="transition-length-line" style={{width: transitionLength + 'px'}}></div>
      containerWidth = (canvasWidth + transitionLength + 2) + 'px';

      transitionButton =  (<FloatingActionButton
        iconClassName="mdi mdi-swap-horizontal"
        className="update-number-of-frames"
        mini={true}
        secondary={true}
        onMouseDown={this.handleMouseDown}/>)
    }

    var role = JSON.parse(JSON.stringify(this.props.role))
    role.currentPose = this.props.data;
    return (
      <div className="pose-container" style={{width: containerWidth}}>
        {transitionElement}
        <Paper zDepth={this.state.isUpdatingTransitionLength ? 2 : 1}
          className="paper" ref="pose"
          style={this.state.style}>
          <PoseOnCanvas width={canvasWidth} actor={[role]} scale={this.state.scale || scale}></PoseOnCanvas>

          <FloatingActionButton
            onClick={actions.deletePose.bind(this, this.props.role.id, this.props.data)}
            iconClassName="mdi mdi-delete"
            className="delete"
            mini={true}/>

            {transitionButton}

            <FloatingActionButton
              onClick={this.handleEdit.bind(this)}
              iconClassName="mdi mdi-pencil"
              className="edit"
              secondary={true}
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
    var pose = JSON.parse(JSON.stringify(this.props.data))
    pose.transition.numberOfFrames = this.state.intermidiateLength

    actions.updatePose(this.props.role.id, pose);
    window.setTimeout(() => {
      this.setState({
        isUpdatingTransitionLength: false
      })
    }, 0)

  }

  handleEdit (event) {
    event.stopPropagation();
    var {router} = this.context;

    router.transitionTo('/role/' + this.props.role.id + '/pose/' + this.props.data.id)
  }

}

Pose.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Pose;
