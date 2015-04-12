module.exports = Part = {
  mapOverTwoParts: function (onePart, otherPart, callback) {
    var newPart = callback(onePart, otherPart);

    newPart.connectedTo = (onePart.connectedTo || []).map(function (_, index) {
      return Part.mapOverTwoParts(onePart.connectedTo[index], otherPart.connectedTo[index], callback);
    });

    return newPart;
  },
  getIntermediatePart: function (similarityToDad, mom, dad) {
    var child = {};

    var angleDifference = dad.rotation - mom.rotation
    if (angleDifference > Math.PI) {
      angleDifference -= Math.PI * 2
    }
    if (angleDifference < -Math.PI) {
      angleDifference += Math.PI * 2
    }
    child.rotation = mom.rotation + angleDifference*similarityToDad

    var otherProps = ['length', 'width']
    otherProps.forEach(function (prop) {
      child[prop] = (dad[prop] - mom[prop]) * similarityToDad + mom[prop]
    })

    return child;
  },
  renderPart: function (part, context) {
   var x = Math.cos(part.rotation) * part.length,
       y = Math.sin(part.rotation) * part.length

   context.lineWidth = part.width;
   context.beginPath();
   context.moveTo(0, 0);
   context.lineTo(x, y);
   context.translate(x, y);
   context.strokeStyle = 'rgba(174, 242, 127, 0.8)'// yellow 'rgba(254, 226, 102, 0.8)'
   context.stroke();
   (part.connectedTo || []).forEach(function (part) {
     context.save();
     Part.renderPart(part, context);
     context.restore();
   });
 },

 getRelativePosition: function (part, parent) {
   return {
     parent: parent,
     x: parent.x + Math.cos(part.rotation) * part.length,
     y: parent.y + Math.sin(part.rotation) * part.length
   }
 },

 getTargets: function (parentTarget, part) {
   var target
   if (!part) {
     target = parentTarget
   } else {
     target = getRelativePosition(part, parentTarget)
   }
   var targets = parent.connectedTo.map(Part.getTargets.bind(undefined, target))
   if (part.length > 1) {
     targets.push(target)
   }
   return targets
 },

 rotate: function (target, x, y) {
   var distance = Math.sqrt(Math.pow(target.baseX - x, 2) + Math.pow(target.baseY - y, 2));

   var angle = Math.acos((x - target.baseX) / distance);

   var sin = (y - target.baseY)/ distance;

   if (sin < 0) {
     angle = -angle;
   }

 }

}
