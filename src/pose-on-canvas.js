const React = require('react'),
draw = require('./render.js')



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

    roles.forEach(function (role) {
      var pose = role.currentPose
      context.save()
      context.scale(pose.scale, pose.scale)
      context.translate(pose.translateY, pose.translateX)
      context.strokeStyle = role.color || 'rgba(0, 191, 165, 0.8)'
      draw(context, pose)
      context.restore()
    })

    context.restore();
  }

  normalizeContext (context) {

  }

}

module.exports = FrameOnCanvas;
