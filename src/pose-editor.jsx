var React = require('react'),
human = require('./human.js'),
util = require('./util.js'),
{ FloatingActionButton, RaisedButton, Paper } = require('material-ui'),
Frame = require('./frame.js'),
store = require('./new-scene-store.js'),
actions = require('./new-scene-actions.js')
store.getInitialState()

class PoseEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pose: human(),
      roles: []
    }

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseWheel = this.handleMouseWheel.bind(this)
  }

  componentDidMount () {
    window.addEventListener('mousewheel', this.handleMouseWheel)

    var { router } = this.context
    var params = router.getCurrentParams()
    var poseId = parseInt(params.poseId || 0)
    var roleId = parseInt(params.roleId || 0)
    var role = store.getRole(roleId)

    var pose
    if (params.poseId === undefined) {
      pose = human()
    } else {
      pose = store.getPose(roleId, poseId)
    }

    role.currentPose = pose;

    var oldRole = JSON.parse(JSON.stringify(role))
    oldRole.color = 'rgba(222, 222, 222, 0.5)'

    var indexOfOldPose = role.poses.indexOf(pose) + 1 || undefined

    var overallFrameNumber = role.poses
      .slice(0, indexOfOldPose )
      .reduce((frameNumber, pose, index) => {
        if (index === 0) {
          return frameNumber
        } else {
          return frameNumber + pose.transition.numberOfFrames
        }
      }, 0)

    this.setState({
      roles: util.getRolesAtFrameNumber(overallFrameNumber, JSON.parse(JSON.stringify(store.roles)))
        .filter((role) => role.id !== roleId)
        .concat([oldRole, role]),
      pose,
      roleId
    })

  }

  componentWillUnmount () {
    window.removeEventListener('mousewheel', this.handleMouseWheel)
  }

  render () {
    var width = document.body.offsetWidth

    var maybeSaveAsNext;
    if (this.state.pose.id !== undefined) {
      maybeSaveAsNext = (<RaisedButton
        onClick={this.saveAsNext.bind(this)}
        label="save as next pose"
        className="pose-editor-button" />)
    }

    return (
      <Paper id="pose-editor"
        onMouseDown={this.handleMouseDown}>

        <ul id="hints">
          <li><strong>shift + drag</strong> to move around</li>
          <li><strong>shift + scroll</strong> to scale</li>
          <li><strong>drag</strong> to rotate parts</li>
          <li>You may need to <strong>scroll down</strong></li>
        </ul>
        <Frame width={width}
          roles={this.state.roles}
          targets={util.getTargets(this.state.pose)}
          pose={this.state.pose}
          target={this.state.target} />

        <FloatingActionButton onClick={this.save.bind(this)}
          iconClassName="mdi mdi-check"
          className="pose-editor-button"
          mini={true} />

        <FloatingActionButton onClick={this.back.bind(this)}
          iconClassName="mdi mdi-close"
          className="pose-editor-button"
          mini={true}
          secondary={true}/>

        {maybeSaveAsNext}
      </Paper>
    )
  }

  getCursorCoordinates (event) {
    var canvas = document.querySelector('#pose-editor canvas')
    var canvasScale = document.body.offsetWidth / 736
    var scale = canvasScale * this.state.pose.scale
    return {
      y:-(event.pageY - canvas.height/window.devicePixelRatio  - util.getOffset('offsetTop', canvas))  / scale,
      x: (event.pageX - canvas.width/2/window.devicePixelRatio - util.getOffset('offsetLeft', canvas)) / scale
    }
  }


  handleMouseDown (event) {
    var coordinates = this.getCursorCoordinates(event)
    var target = util.getClosestTarget(this.state.pose, coordinates)
    if (!(event.shiftKey || event.ctrlKey || event.altKey)) {
      this.setState({
        target: target
      })
    }
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove (event) {
    var {x, y} = this.getCursorCoordinates(event)

    if (event.shiftKey || event.ctrlKey || event.altKey) {
      this.state.pose.translateX += event.movementX
      this.state.pose.translateY -= event.movementY
      this.state.target = undefined
    } else if (this.state.target) {
      util.rotate(this.state.target, y, x)
    }
    this.forceUpdate()
  }

  handleMouseUp () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this.setState({
      target: undefined
    })
  }

  handleMouseWheel (event) {
    if (event.shiftKey || event.ctrlKey || event.altKey) {
      event.preventDefault()
      this.state.target = undefined
      this.state.pose.scale += event.wheelDelta / 1000
      this.forceUpdate()
    }
  }

  save () {
    if (this.state.pose.id === undefined) {
      actions.appendPose(this.state.roleId, this.state.pose)
    } else {
      actions.updatePose(this.state.roleId, this.state.pose)
    }
    this.back()
  }

  saveAsNext () {
    actions.insertPoseAfter(this.state.roleId, this.state.pose)
    this.back()
  }

  back () {
    this.context.router.transitionTo('/scene/role/' + this.state.roleId)
  }

}

PoseEditor.contextTypes = {
  router: React.PropTypes.func
}

module.exports = PoseEditor
