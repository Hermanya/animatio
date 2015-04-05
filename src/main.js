 function random (array) {
    return array[Math.floor(Math.random()*array.length)]
  }

  document.body.style.background = random([
    '#E6E477', '#F98A30', '#FEE266', '#AEF27F'
    ]);

  var canvas = document.getElementById('preview');
  var context = canvas.getContext('2d');

  context.rotate(-Math.PI/2);
  context.translate(-canvas.height, canvas.width/2);
 // context.scale(2,2);

 context.lineJoin = 'round';
 context.lineCap = 'round';


 var leftFoot = foot({
  rotation: 0,
  connectedTo: []
})

 var leftCalf = calf({
  rotation: Math.PI,
  connectedTo: [leftFoot]
})

 var leftThigh = thigh({
  rotation: Math.PI/36*35,
  connectedTo: [leftCalf]
})

 var leftHip = hip({
  rotation: Math.PI/3,
  connectedTo: [leftThigh]
});



 var head = {
  name: 'head',
  width: 45,
  length: 20,
  rotation: 0
}

var neck = {
  name: 'neck',
  width: 30,
  length: 65,
  rotation: 0,
  connectedTo: [head]
}

var leftArm = arm({isLeft: true})
var rightArm = arm({isRight: true})

var torso = {
  name: 'torso',
  width: 80,
  length: 110,
  rotation: 0,
  connectedTo: [neck, leftArm, rightArm]
}



var rightHip = hip({
  rotation: 2*Math.PI/3,
  connectedTo: [torso, leftHip]
});

var rightThigh = thigh({
  rotation: Math.PI/36,
  connectedTo: [rightHip]
});

var rightCalf = calf({
  rotation: 0,
  connectedTo: [rightThigh]
});

var rightFoot = foot({
  rotation: 0,
  connectedTo: [rightCalf]
});


function arm (options) {
  var sign = options.isLeft ? 1 : -1;
  return shoulder({
    rotation: Math.PI/2.5*sign,
    connectedTo: [upperArm({
      rotation: Math.PI/36*35*sign,
      connectedTo: [foreArm({
        rotation: Math.PI/36*35*sign,
        connectedTo: [palm({
          rotation: Math.PI/36*35*sign,
          connectedTo: []
        })]
      })]
    })]
  });
}

function palm (part) {
  part.name = arguments.callee.name;

  part.width = 36;
  part.length = 10;
  return part;
}

function foreArm (part) {
  part.width = 25;
  part.length = 65;
  part.name = arguments.callee.name;

  return part;
}

function upperArm (part) {
  part.width = 30;
  part.length = 65;
  part.name = arguments.callee.name;

  return part;
}

function shoulder (part) {
  part.name = arguments.callee.name;

  part.width = 35;
  part.length = 50;
  return part;
}

function hip (part) {
  part.name = arguments.callee.name;
  part.width = 45;
  part.length = 25;
  return part;
}

function thigh (part) {
  part.name = arguments.callee.name;

  part.width = 40;
  part.length = 110;
  return part;
}


function calf (part) {
  part.name = arguments.callee.name;

  part.width = 30;
  part.length = 120;
  return part;
}

function foot (part) {
  part.name = arguments.callee.name;

  part.width = 35;
  part.length = 1;
  return part;
}

function clone (x) {
  return JSON.parse(JSON.stringify(x));
}

var currentPoint = {
  x: 0,
  y: 0
};

var targets = [];

function drawPart (part, currentPoint) {
  var adjastedX = Math.cos(part.rotation)*part.length;
  var adjastedY = Math.sin(part.rotation)*part.length;

  currentPoint = clone(currentPoint);
  currentPoint.baseX = currentPoint.x;
  currentPoint.baseY = currentPoint.y;
  currentPoint.x += adjastedX;
  currentPoint.y += adjastedY;
  currentPoint.part = part;
  if (part.length > 1) {
    targets.push(currentPoint);
  }

  context.lineWidth = part.width;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(adjastedX, adjastedY);

  context.translate(adjastedX, adjastedY);
  context.strokeStyle = 'rgba(30, 30, 30, .9)'
  context.stroke();
  (part.connectedTo || []).forEach(function (part) {
    context.save();
    drawPart(part, currentPoint);
    context.restore();
  });
}


function draw (x) {
  context.clearRect(0,-canvas.width/2,canvas.height,canvas.width)
  context.save()
  drawPart(x || rightFoot, currentPoint);
  context.restore()
}

draw(); 

var target;

canvas.addEventListener('mousedown', function findTarget (event) {
  var x = -event.clientY + canvas.height + canvas.offsetParent.offsetTop + canvas.offsetTop;
  var y =  event.clientX - canvas.width/2 - canvas.offsetParent.offsetLeft - canvas.offsetLeft;

  target = targets.map(function (target) {
    target.distance = Math.sqrt(Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2));
    return target;
  }).reduce(function (min, target) {
    if (min.distance > target.distance) {
      return target;
    }
    return min;
  });
});

canvas.addEventListener('mousemove', function rotateTargetedPart (event) {
  if (target) {
    var x = -event.clientY + canvas.height  + canvas.offsetParent.offsetTop + canvas.offsetTop;
    var y =  event.clientX - canvas.width/2 - canvas.offsetParent.offsetLeft - + canvas.offsetLeft;

    var distance = Math.sqrt(Math.pow(target.baseX - x, 2) + Math.pow(target.baseY - y, 2));

    var angle = Math.acos((x - target.baseX) / distance);

    var sin = (y - target.baseY)/ distance;

    if (sin < 0) {
      angle = -angle;
    }

    target.part.rotation = angle;
    draw();
  }
});

document.addEventListener('mouseup', function forgetTargetedPart (argument) {
  target = undefined;
});

var steps = JSON.parse(localStorage.steps || '[]');


function mapOverTwoParts (onePart, otherPart, callback) {
  var resultingPart = callback(onePart, otherPart);

  resultingPart.connectedTo = (onePart.connectedTo || []).map(function (_, index) {
    return mapOverTwoParts(onePart.connectedTo[index], otherPart.connectedTo[index], callback);
  });

  return resultingPart;
}

var counter = 0;

function transition (from, to, rate) {

  counter++;
  if (counter === rate) {
    steps.shift();
    if (steps.length > 1) {
      counter = 0; 
      transition(steps[0], steps[1], rate);
    }
    return;
  }

  var step = mapOverTwoParts(from, to, function (from, to) {
    var intermediate = clone(from);
    var angleDifference = to.rotation - from.rotation;

    if (angleDifference > Math.PI) {
      angleDifference -= Math.PI*2;
    }

    if (angleDifference < -Math.PI) {
      angleDifference += Math.PI*2;
    }
      intermediate.rotation += angleDifference /rate * counter; //* when / outOf;
      intermediate.width += (to.width - from.width) /rate * counter; //* when / outOf;
      intermediate.length += (to.length - from.length) /rate * counter; //* when / outOf;
      return intermediate;
    });

  draw(step)

  window.requestAnimationFrame(transition.bind(this, from, to, rate));
}

document.getElementById('play').addEventListener('click', function play (argument) {
  counter = 0;
  steps = JSON.parse(localStorage.steps || '[]');
  transition(steps[0], steps[1], 60);
});

document.getElementById('add-step').addEventListener('click', function play (argument) {
  counter = 0;
  steps = JSON.parse(localStorage.steps || '[]');
  steps.push(rightFoot);
  localStorage.steps = JSON.stringify(steps);
  renderSteps();
});



function renderSteps() {
  document.getElementById('steps').innerHTML = '';
  steps.forEach(function (step) {
    var element = document.createElement('canvas');
    element.setAttribute('height', 96);
    element.setAttribute('width', 128);
    element.setAttribute('class', 'step');
    var mainContext = context;
    context = element.getContext('2d');
    context.rotate(-Math.PI/2);
    context.translate(-element.height, element.width/2);
    context.scale(0.2, 0.2);
    context.lineJoin = 'round';
    context.lineCap = 'round';
    draw(step);
    context = mainContext;
    document.getElementById('steps').appendChild(element)
  })
}

renderSteps();