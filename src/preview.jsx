const React = require('react'),
render = require('./render.js'),
mui = require('material-ui'),
human = require('./human.js'),
part = require('./part.js'),
FloatingActionButton = mui.FloatingActionButton,
Paper = mui.Paper

class Preview extends React.Component {

  render () {
    return (
      <Paper zDepth={1}  id="preview">
        <canvas  id="preview-canvas" width="736" height="414" ref="canvas"></canvas>
        <FloatingActionButton iconClassName="mdi mdi-play" id="play" onClick={this.play.bind(this)} secondary={true} />
      </Paper>
    )
  }

  componentDidMount () {
    this.setState({
      restOfFrames: this.props.data
    });

    const element = React.findDOMNode(this.refs.canvas);
    const context = element.getContext('2d');

    var canvasWidth = element.width;
    var canvasHeight = element.height;

    element.width = canvasWidth * window.devicePixelRatio;
    element.height = canvasHeight * window.devicePixelRatio;
    element.style.width = canvasWidth + 'px';
    element.style.height = canvasHeight + 'px';

    context.rotate(-Math.PI/2);

    context.translate(-element.height, element.width/2);
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    context.lineJoin = 'round';
    context.lineCap = 'round';
    this.draw = (part) => {
      context.clearRect(0,-element.width/2,element.height,element.width)
      render(context, part)
    }
    this.draw(this.props.data[0] || human())
  }

  play () {

    var counter = 0;
    var steps = JSON.parse(localStorage.frames || '[]');

    var transition = (from, to, rate) => {

     counter++;
     if (counter === rate) {
       steps.shift();
       if (steps.length > 1) {
         counter = 0;
         transition(steps[0], steps[1], rate);
       }
       return;
     }

     var step = part.mapOverTwoParts(from, to, part.getIntermediatePart.bind(undefined, counter/rate));


       this.draw(step)

     window.requestAnimationFrame(transition.bind(undefined, from, to, to.transition.numberOfFrames));
   }

   transition(steps[0], steps[1], steps[1].transition.numberOfFrames);
  }
}

module.exports = Preview;
