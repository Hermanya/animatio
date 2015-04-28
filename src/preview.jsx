var React = require('react'),
human = require('./human.js'),
util = require('./util.js'),
Frame = require('./frame.js'),
{ FloatingActionButton, Paper, Slider } = require('material-ui'),
isMounted

class Preview extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      currentRoles: [],
      overallFrameNumber: 0,
      isPlaying: false
    }
  }

  componentWillReceiveProps (props) {
    this.setState ({
      currentRoles: props.data.map((role) => {
        role.currentPose = role.poses[0]
        return role
      })
    })
  }

  render () {
    var totalNumberOfFrames = util.getTotalNumberOfFrames(this.props.data)
    var action;

    if (this.state.isPlaying) {
      action = (<FloatingActionButton
        iconClassName="mdi mdi-pause"
        id="play"
        onClick={this.pause.bind(this)}
        secondary={true} />)
    } else {
      action = (<FloatingActionButton
        iconClassName="mdi mdi-play"
        id="play"
        onClick={this.play.bind(this)}
        secondary={true} />)
    }

    return (
      <Paper zDepth={1}  id="preview">
        <Frame id="preview-canvas"
          width={736}
          roles={this.state.currentRoles} />
        {action}
        <Slider
          name="progress"
          onChange={this.updateProgress.bind(this)}
          className="preview-progress"
          value={this.state.overallFrameNumber / totalNumberOfFrames}/>
      </Paper>
    )
  }

  componentDidMount () {
    isMounted = true
  }

  componentWillUnmount () {
    isMounted = false
    this.pause()
  }

  updateProgress (event, value) {
    this.setState({
        isPlaying: false,
        overallFrameNumber: value  * util.getTotalNumberOfFrames(this.props.data)
    })
    this.showNextFrame()
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
    var overallFrameNumber = this.state.overallFrameNumber
    var allRoles = this.props.data
    var currentRoles = util.getRolesAtFrameNumber(overallFrameNumber, allRoles)

    if (this.state.isPlaying && isMounted) {
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
      window.requestAnimationFrame(this.showNextFrame.bind(this));
    }
  }
}

module.exports = Preview;
