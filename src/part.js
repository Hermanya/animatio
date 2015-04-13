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

    var otherProps = ['length', 'width', 'translateX', 'translateY', 'scale']
    otherProps.forEach(function (prop) {
      if (dad[prop]) {
        child[prop] = (dad[prop] - mom[prop]) * similarityToDad + mom[prop]
      }
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
   context.stroke();
   (part.connectedTo || []).forEach(function (part) {
     context.save();
     Part.renderPart(part, context);
     context.restore();
   });
 },

 setRelativePosition: function (part, parent) {
   part.parent = parent
   part.x = parent.x + Math.cos(part.rotation) * part.length
   part.y = parent.y + Math.sin(part.rotation) * part.length
 },

 getTargets: function (parentTarget, part) {
   if (!part) {
     part = parentTarget
     part.x = part.translateY
     part.y = part.translateX
   } else {
     this.setRelativePosition(part, parentTarget)
   }
   var targets = [].concat.apply([],(part.connectedTo || []).map(Part.getTargets.bind(this, part)))
   if (part.length > 1) {
     targets.push(part)
   }
   return targets
 },

 rotate: function (target, x, y) {

   var distance = Math.sqrt(Math.pow(target.parent.x - x, 2) + Math.pow(target.parent.y - y, 2));

   var angle = Math.acos((x - target.parent.x) / distance);

   var sin = (y - target.parent.y)/ distance;

   if (sin < 0) {
     angle = -angle;
   }

   target.rotation = angle;

 }

}
