const React = require('react'),
render = require('./render.js'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
Slider = mui.Slider,
Paper = mui.Paper,
PoseOnCanvas = require('./pose-on-canvas.js')

class Preview extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      roles: props.data,
      currentRoles: props.data.map((role) => {
        role.currentPose = role.poses[0]
        return role
      }),
      overallFrameNumber: 0,
      isPlaying: false
    }
  }

  render () {
    var totalNumberOfFrames = Math.max.apply(Math, this.props.data.map((role) => {
      return role.poses.reduce((x, pose, index) => {
        if (index) {
          return x + pose.transition.numberOfFrames
        }
        return x
      }, 0)
    }))
    var action;

    if (this.state.isPlaying) {
      action = <FloatingActionButton iconClassName="mdi mdi-pause" id="play" onClick={this.pause.bind(this)} secondary={true} />
    } else {
      action = <FloatingActionButton iconClassName="mdi mdi-play" id="play" onClick={this.play.bind(this)} secondary={true} />

    }


    return (
      <Paper zDepth={1}  id="preview">
        <PoseOnCanvas id="preview-canvas" width={736}
          actor={this.state.currentRoles}></PoseOnCanvas>
        {action}
        <Slider name="slider1" className="preview-progress" value={this.state.overallFrameNumber / totalNumberOfFrames}/>
      </Paper>
    )
  }

  componentDidMount () {
    // if (this.props.data.length > 1) {
    //   this.play()
    // }
  }

  play () {
    this.setState({
      isPlaying: true
    })
    window.setTimeout(this.showNextFrame.bind(this))

  }

  pause () {
    this.setState({
      isPlaying: false
    })
  }

  showNextFrame() {

    var overallFrameNumber = this.state.overallFrameNumber;

    var currentRoles = this.props.data.map(function (role) {
      var from, to, progress;

      role.poses.reduce(function (frameNumber, pose, index) {
        if (index === 0) {
          from = pose;
          return frameNumber;
        } else if (to) {
          return;
        }
        if (frameNumber > pose.transition.numberOfFrames) {
          from = pose;
          return frameNumber - pose.transition.numberOfFrames;
        } else {
          to = pose;
          progress = frameNumber / pose.transition.numberOfFrames;
        }
      }, overallFrameNumber)

      if (from && to) {
        role.currentPose = part.mapOverTwoParts(from, to, part.getIntermediatePart.bind(undefined, progress));
        return role;
      } else if (role.poses.length === 1){
        role.currentPose = role.poses[0];
        //return role;
      }
    }).filter((currentRole) => currentRole !== undefined)

    if (currentRoles.length === 0) {
      this.setState({
        overallFrameNumber: 0
      })
    } else {
      this.setState({
        overallFrameNumber: overallFrameNumber + 1,
        currentRoles
      })
    }

    if (this.state.isPlaying) {
      window.requestAnimationFrame(this.showNextFrame.bind(this));
    }



  //   var poseNumber = 0;
  //   var poses = this.props.data;
   //
  //   var transition = (from, to, frameNumber) => {
  //     var numberOfFrames = to.transition.numberOfFrames;
   //
  //     if (frameNumber !== numberOfFrames) {
   //
  //       var pose = part.mapOverTwoParts(from, to, part.getIntermediatePart.bind(undefined, frameNumber/numberOfFrames));
  //       this.setState({
  //         pose: pose
  //       })
  //       window.requestAnimationFrame(transition.bind(undefined, from, to, frameNumber + 1));
   //
  //     } else if (poseNumber + 1 !== poses.length - 1) {
   //
  //       poseNumber++;
  //       transition(poses[poseNumber], poses[poseNumber + 1], 0)
   //
  //     } else {
   //
  //       this.play()
   //
  //       // this.setState({
  //       //   pose: this.props.data[0]
  //       // })
   //
  //     }
  //  }
   //
  //  transition(poses[poseNumber], poses[poseNumber + 1], 0);
  }


}

module.exports = Preview;
