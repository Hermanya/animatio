module.exports = Human

function Human () {

  var leftLeg = leg({isLeft: true})
  var rightLeg = leg({isLeft: false})



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

  var belly = {
    name: 'belly',
    width: 0,
    length: 0,
    rotation: 0,
    connectedTo: [torso, leftLeg, rightLeg]
  }

  var rightHip = hip({
    rotation: 2*Math.PI/3,
    connectedTo: [torso, leftLeg]
  })

  var rightThigh = thigh({
    rotation: Math.PI/36,
    connectedTo: [rightHip]
  })

  var rightCalf = calf({
    rotation: 0,
    connectedTo: [rightThigh]
  })

  var rightFoot = foot({
    rotation: 0,
    connectedTo: [rightCalf]
  })

  belly.translateX = 0;
  belly.translateY = 250;
  belly.scale = 0.8
  belly.transition = {numberOfFrames: 30}

  return belly;
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
