const React = require('react'),
render = require('./render.js'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
RaisedButton = mui.RaisedButton,
Paper = mui.Paper,
PoseOnCanvas = require('./pose-on-canvas.js'),
poseStore = require('./pose-store.js'),
poseActions = require('./pose-actions.js')


class PoseEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pose: human()
    }
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount () {
    var { router } = this.context;
    var id = parseInt(router.getCurrentParams().id);

    var pose = poseStore.getInitialState().filter(function (pose) {
      return pose.id === id;
    })[0] || human()

    this.setState({
      pose
    })
  }

  render () {
    var width = 736 //document.getElementById('page').offsetWidth
    this.state.canvasScale = width / 736;
    return (
      <Paper zDepth={1} ref="editor"  id="pose-editor" onMouseDown={this.handleMouseDown} >
        <PoseOnCanvas width={width}
          actor={this.state.pose}
          scale={this.state.canvasScale}
          ></PoseOnCanvas>

          <FloatingActionButton iconClassName="mdi mdi-check" onClick={this.save.bind(this)} className="pose-editor-button" mini={true} />
          <FloatingActionButton iconClassName="mdi mdi-close" onClick={this.back.bind(this)} className="pose-editor-button" mini={true} secondary={true}/>
          <RaisedButton label="save as next pose" className="pose-editor-button" />

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
    if (element === document.body) {
      return element[prop];
    }
    return element[prop] + this.getOffset(prop, element.offsetParent);
  }

  handleMouseMove (event) {
    var {x, y} = this.getCursorCoordinates();

    if (event.shiftKey || event.ctrlKey || event.altKey) {
      this.state.pose.translateX = x
      this.state.pose.translateY = y
    } else {
      Part.rotate(this.state.target, y, x)
    }
    this.forceUpdate();
  }

  handleMouseUp () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  save () {
    if (this.state.pose.id) {
      poseActions.update(this.state.pose)
    } else {
      poseActions.append(this.state.pose)
    }
    this.back.call(this)
  }

  back () {
    var {router} = this.context;
    router.transitionTo('/scene')
  }

}

PoseEditor.contextTypes = {
  router: React.PropTypes.func
};

module.exports = PoseEditor;
