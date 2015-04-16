const React = require('react'),
render = require('./render.js'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
RaisedButton = mui.RaisedButton,
Paper = mui.Paper,
PoseOnCanvas = require('./pose-on-canvas.js')

class PoseEditor extends React.Component {

  constructor (props) {
    super(props)

    var pose = human()

    this.state = {
      pose
    }
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  render () {
    return (
      <Paper zDepth={1} ref="editor"  id="pose-editor" onMouseDown={this.handleMouseDown} >
        <PoseOnCanvas width={736}
          actor={this.state.pose}
          ></PoseOnCanvas>
          <div className="clearfix">
          <FloatingActionButton iconClassName="mdi mdi-check" className="pose-editor-button" mini={true} />
          <FloatingActionButton iconClassName="mdi mdi-close" className="pose-editor-button" mini={true} secondary={true}/>
          <RaisedButton label="save as next pose" className="pose-editor-button" />
          </div>
      </Paper>
    )
  }


  handleMouseDown () {
    var canvas = document.querySelector('#pose-editor canvas')
    var x = (event.pageY - canvas.height/window.devicePixelRatio - this.getOffset('offsetTop', canvas)) / -this.state.pose.scale
    var y = (event.pageX - canvas.width/2/window.devicePixelRatio - this.getOffset('offsetLeft', canvas)) / this.state.pose.scale

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

  getOffset (prop, element) {
    if (element === document.body) {
      return element[prop];
    }
    return element[prop] + this.getOffset(prop, element.offsetParent);
  }

  handleMouseMove (event) {
    var canvas = document.querySelector('#pose-editor canvas')
    var y = (event.pageY - canvas.height/window.devicePixelRatio - this.getOffset('offsetTop', canvas)) / -this.state.pose.scale;
    var x = (event.pageX - canvas.width/2/window.devicePixelRatio - this.getOffset('offsetLeft', canvas)) / this.state.pose.scale;

    Part.rotate(this.state.target, y, x)
    this.forceUpdate();
  }

  handleMouseUp () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }



}

module.exports = PoseEditor;
