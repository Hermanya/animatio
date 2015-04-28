var React = require('react')
var util = require('./util.js')
var {renderPart} = util


class FrameOnCanvas extends React.Component {

  render () {
    return (
      <canvas width={this.props.width} height={this.props.width / 16 * 9} ref="canvas"></canvas>
    )
  }

  componentDidMount () {
    this.beRetinaReady()
    this.paint()
  }

  componentDidUpdate () {
    this.paint()
  }

  beRetinaReady () {
    var canvas = React.findDOMNode(this.refs.canvas)
    var width = canvas.width
    var height = canvas.height

    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
  }

  paint (context) {
    var element = React.findDOMNode(this.refs.canvas);
    var context = element.getContext('2d');
    var {roles, target, targets} = this.props;
    context.clearRect(0, 0, element.width, element.height);

    context.save();
    this.normalize(context, element)
    roles.forEach(this.paintRole.bind(this, context))
    if (target) {
      this.paintActiveTarget(context)
    } else if (targets) {
      this.paintAllTargets(context)
    }
    context.restore();
  }

  normalize (context, element) {
    var scalingValue = window.devicePixelRatio * (this.props.width ?  this.props.width/736 : 1);
    context.rotate(-Math.PI/2);
    context.translate(-element.height, element.width/2);
    context.scale(scalingValue, scalingValue);
    context.lineJoin = 'round';
    context.lineCap = 'round';
  }

  paintRole (context, role) {
    var pose = role.currentPose
    context.save()
    context.scale(pose.scale, pose.scale)
    context.translate(pose.translateY, pose.translateX)
    context.strokeStyle = role.color || 'rgba(0, 191, 165, 0.8)'
    renderPart(context, pose)
    context.restore()
  }

  paintActiveTarget (context) {
    context.save()
    context.scale(this.props.pose.scale, this.props.pose.scale)

    var newTarget = this.props.targets.filter((target) => {
      return target.part === this.props.target.part
    })[0]
    this.paintTarget(context, newTarget)

    context.beginPath()
    context.arc(
      newTarget.parentTarget.x,
      newTarget.parentTarget.y,
      newTarget.part.length,
      newTarget.part.rotation - Math.PI/6,
      newTarget.part.rotation + Math.PI/6
    )
    context.strokeStyle = 'rgba(66, 66, 66, 1)'
    context.strokeWidth = '2px'
    context.stroke();

    context.restore()
  }

  paintAllTargets (context) {
    context.save()
    context.scale(this.props.pose.scale, this.props.pose.scale)
    this.props.targets.forEach(this.paintTarget.bind(this, context))
    context.restore()
  }

  paintTarget (context, target) {
    context.beginPath()
    context.arc(target.x, target.y, 15, 0, Math.PI*2)
    context.fillStyle = 'rgba(66, 66, 66, 0.1)'
    context.fill();

    context.beginPath()
    context.arc(target.x, target.y, 10, 0, Math.PI*2)
    context.fillStyle = 'rgba(66, 66, 66, 0.2)'
    context.fill();

    context.beginPath()
    context.arc(target.x, target.y, 5, 0, Math.PI*2)
    context.fillStyle = 'rgba(66, 66, 66, 1)'
    context.fill();
  }

}

module.exports = FrameOnCanvas;


/*
<svg width="120" height="120"
     viewPort="0 0 120 120" version="1.1"
     xmlns="http://www.w3.org/2000/svg">

    <line stroke-linecap="round"
          x1="60" y1="30" x2="60" y2="90"
          stroke="black" stroke-width="20"/>

    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>

*/
