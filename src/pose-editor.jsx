const React = require('react'),
render = require('./render.js'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
Paper = mui.Paper,
PoseOnCanvas = require('./pose-on-canvas.js')

class PoseEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pose: JSON.parse(JSON.stringify(props.pose))
    }
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  render () {
    return (
      <Paper zDepth={1} ref="editor"  id="pose-editor" onMouseDown={this.handleMouseDown}>
        <PoseOnCanvas width={736}
          actor={this.state.pose}
          ></PoseOnCanvas>
      </Paper>
    )
  }

  handleMouseDown () {
    var canvas = document.querySelector('#pose-editor canvas')
    var x = -event.clientY + canvas.height/window.devicePixelRatio + canvas.offsetParent.offsetTop + canvas.offsetTop;
    var y =  event.clientX - canvas.width/2/window.devicePixelRatio - canvas.offsetParent.offsetLeft - canvas.offsetLeft;

    var target = Part.getTargets(this.state.pose).map(function (target) {
      target.distance = Math.sqrt(Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2));
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

  handleMouseMove (event) {
    var canvas = document.querySelector('#pose-editor canvas')
    var x = -event.clientY - event.movementY + canvas.height/window.devicePixelRatio + canvas.offsetParent.offsetTop + canvas.offsetTop;
    var y =  event.clientX + event.movementX - canvas.width/2/window.devicePixelRatio - canvas.offsetParent.offsetLeft - canvas.offsetLeft;

    Part.rotate(this.state.target, x, y)
    this.forceUpdate();
  }

  handleMouseUp () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)


  }



}

module.exports = PoseEditor;
