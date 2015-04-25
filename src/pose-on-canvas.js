const React = require('react'),
part = require('./part.js'),
{renderPart} = part


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
    var roles = this.props.actor;
    var scalingValue = window.devicePixelRatio * (this.props.scale || 1);
    context.clearRect(0, 0, element.width, element.height);

    context.save();

    context.rotate(-Math.PI/2);
    context.translate(-element.height, element.width/2);
    context.scale(scalingValue, scalingValue);
    context.lineJoin = 'round';
    context.lineCap = 'round';

    roles.forEach((role) => {
      var pose = role.currentPose
      context.save()
      context.scale(pose.scale, pose.scale)
      context.translate(pose.translateY, pose.translateX)
      context.strokeStyle = role.color || 'rgba(0, 191, 165, 0.8)'
      renderPart(context, pose)
      context.restore()
    })


    if (this.props.targets) {
      context.save()

      context.scale(this.props.pose.scale, this.props.pose.scale)

      this.props.targets.forEach((target) => {
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
      })

      context.restore()

    }

    context.restore();
  }

  normalizeContext (context) {

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
