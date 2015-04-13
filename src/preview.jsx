const React = require('react'),
render = require('./render.js'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
Paper = mui.Paper,
PoseOnCanvas = require('./pose-on-canvas.js')

class Preview extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pose: props.data[0]
    }
  }

  render () {
    return (
      <Paper zDepth={1}  id="preview">
        <PoseOnCanvas id="preview-canvas" width={736}
          actor={this.state.pose || this.props.data[0]}></PoseOnCanvas>

        <FloatingActionButton iconClassName="mdi mdi-play" id="play" onClick={this.play.bind(this)} secondary={true} />
      </Paper>
    )
  }

  play () {

    var poseNumber = 0;
    var poses = this.props.data;

    var transition = (from, to, frameNumber) => {
      var numberOfFrames = to.transition.numberOfFrames;

      if (frameNumber !== numberOfFrames) {

        var pose = part.mapOverTwoParts(from, to, part.getIntermediatePart.bind(undefined, frameNumber/numberOfFrames));
        this.setState({
          pose: pose
        })
        window.requestAnimationFrame(transition.bind(undefined, from, to, frameNumber + 1));

      } else if (poseNumber + 1 !== poses.length - 1) {

        poseNumber++;
        transition(poses[poseNumber], poses[poseNumber + 1], 0)

      } else {

        this.setState({
          pose: this.props.data[0]
        })

      }
   }

   transition(poses[poseNumber], poses[poseNumber + 1], 0);
  }


}

module.exports = Preview;
