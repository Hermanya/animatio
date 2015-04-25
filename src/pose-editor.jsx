const React = require('react'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
RaisedButton = mui.RaisedButton,
Paper = mui.Paper,
PoseOnCanvas = require('./pose-on-canvas.js'),
store = require('./new-scene-store.js'),
actions = require('./new-scene-actions.js')


class PoseEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pose: human(),
      roles: []
    }
    store.getInitialState()
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
  }

  componentDidMount () {
    var { router } = this.context;
    var poseId = router.getCurrentParams().poseId;
    var roleId = parseInt(router.getCurrentParams().roleId);

    var pose, role;

    if (poseId === undefined) {
      poseId = parseInt(poseId);
      role = store.getRole(roleId)
      pose = human()
    } else {
      role = store.getRole(roleId)
      pose = store.getPose(roleId, poseId)
    }

    role.currentPose = pose;

    var oldRole = JSON.parse(JSON.stringify(role))
    oldRole.color = 'rgba(222, 222, 222, 0.5)'
debugger
    this.setState({
      roles: store.roles.concat([oldRole, role]),
      pose,
      roleId
    })

    window.addEventListener('mousewheel', this.handleMouseWheel)
  }

  componentWillUnmount () {
    window.removeEventListener('mousewheel', this.handleMouseWheel)
  }

  render () {
    var width = document.body.offsetWidth //document.getElementById('page').offsetWidth
    this.state.canvasScale = width / 736;

    var maybeSaveAsNext;
    if (this.state.pose.id !== undefined) {
      maybeSaveAsNext = <RaisedButton onClick={this.saveAsNext.bind(this)} label="save as next pose" className="pose-editor-button" />
    }
//
    return (
      <Paper zDepth={1} ref="editor"
        style={{position: 'absolute', top: 0, left: 0}}
        id="pose-editor"
        onMouseDown={this.handleMouseDown}
        >
        <PoseOnCanvas width={width}
          actor={this.state.roles}
          scale={this.state.canvasScale}
          targets={Part.getTargets(this.state.pose)}
          pose={this.state.pose}
          ></PoseOnCanvas>

          <FloatingActionButton iconClassName="mdi mdi-check" onClick={this.save.bind(this)} className="pose-editor-button" mini={true} />
          <FloatingActionButton iconClassName="mdi mdi-close" onClick={this.back.bind(this)} className="pose-editor-button" mini={true} secondary={true}/>
          {maybeSaveAsNext}
      </Paper>
    )
  }

  getCursorCoordinates () {
    var canvas = document.querySelector('#pose-editor canvas')
    return {
      y:-(event.pageY - this.getOffset('offsetTop', canvas) - canvas.height/window.devicePixelRatio) /this.state.canvasScale/ this.state.pose.scale  ,
      x: (event.pageX - this.getOffset('offsetLeft', canvas) - canvas.width/2/window.devicePixelRatio) /this.state.canvasScale/ this.state.pose.scale
    }
  }


  handleMouseDown () {
    var {x, y} = this.getCursorCoordinates();

    var target = Part.getTargets(this.state.pose).map(function (target) {
      target.distance = Math.sqrt(Math.pow(target.x - y, 2) + Math.pow(target.y - x, 2));
      return target;
    }).reduce(function (min, target) {
      if (min.distance > target.distance) {
        return target;
      }
      return min;
    });

    this.setState({
      target: target
    })

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  getOffset (prop, element) {
    if (!element || element === document.body) {
      return 0;
    }
    return element[prop] + this.getOffset(prop, element.offsetParent);
  }

  handleMouseMove (event) {
    var {x, y} = this.getCursorCoordinates();

    if (event.shiftKey || event.ctrlKey || event.altKey) {
      this.state.pose.translateX += event.movementX
      this.state.pose.translateY -= event.movementY
    } else {
      Part.rotate(this.state.target, y, x)
    }
    this.forceUpdate();
  }

  handleMouseUp () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseWheel (event) {
    if (event.shiftKey || event.ctrlKey || event.altKey) {
      event.preventDefault()

      this.state.pose.scale += event.wheelDelta /1000
      this.forceUpdate()
    }
  }

  save () {
    if (this.state.pose.id === undefined) {
      actions.appendPose(this.state.roleId, this.state.pose, this.state.roleId)
    } else {
      actions.updatePose(this.state.roleId, this.state.pose)
    }
    this.back.call(this)
  }

  saveAsNext () {
    actions.insertPoseAfter(this.state.roleId, this.state.pose);
    this.back.call(this)
  }

  back () {
    var {router} = this.context;
    router.transitionTo('/scene/role/' + this.state.roleId)
  }

}

PoseEditor.contextTypes = {
  router: React.PropTypes.func
};

module.exports = PoseEditor;
