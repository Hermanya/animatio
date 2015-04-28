module.exports = Human

function Human () {
  var human = belly({
    connectedTo: [
      torso({
        connectedTo: [
          neck({ connectedTo: [head()] }),
          arm({ isLeft: true }),
          arm({ isRight: true })
        ]
      }),
      leg({isLeft: true}),
      leg({isLeft: false})
    ],

    translateX: 0,
    translateY: 250,
    scale: 0.8,
    transition: {
      numberOfFrames: 30
    }
  })

  return human;
}


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
  })
}

function palm (part) {
  part.name = arguments.callee.name;
  part.width = 36;
  part.length = 10;
  return part;
}

function foreArm (part) {
  part.name = arguments.callee.name;
  part.width = 25;
  part.length = 65;
  return part;
}

function upperArm (part) {
  part.name = arguments.callee.name;
  part.width = 30;
  part.length = 65;
  return part;
}

function shoulder (part) {
  part.name = arguments.callee.name;
  part.width = 35;
  part.length = 50;
  return part;
}

function leg (options) {
  var sign = options.isLeft ? 1 : -1;
  return hip({
    rotation: Math.PI*2/3*sign,
    connectedTo: [thigh({
      rotation: Math.PI/36*35*sign,
      connectedTo: [calf({
        rotation: Math.PI*sign,
        connectedTo: [foot({
          rotation: 0,
          connectedTo: []
        })]
      })]
    })]
  })
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

function head (part) {
  part = part || {}
  part.name = arguments.callee.name;
  part.width = 45;
  part.length = 20;
  part.rotation = 0;
  return part;
}

function neck (part) {
  part.name = arguments.callee.name;
  part.width = 30;
  part.length = 65;
  part.rotation = 0;
  return part;
}

function torso (part) {
  part.name = arguments.callee.name;
  part.width = 80;
  part.length = 110;
  part.rotation = 0;
  return part;
}

function belly (part) {
  part.name = arguments.callee.name;
  part.width = 0;
  part.length = 0;
  part.rotation = 0;
  return part;
}
