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
      if (dad[prop] !== undefined) {
        child[prop] = (dad[prop] - mom[prop]) * similarityToDad + mom[prop]
      }
    })

    return child;
  },
  renderPart: function (context, part) {
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
     Part.renderPart(context, part);
     context.restore();
   });
 },

 setRelativePosition: function (parentTarget, part) {
   return {
     parentTarget,
     part,
     x: parentTarget.x + Math.cos(part.rotation) * part.length,
     y: parentTarget.y + Math.sin(part.rotation) * part.length
   }
 },

 getTargets: function (parentTarget, part) {
   var target;
   if (!part) {
     part = parentTarget;
     target = {
       part: part,
       x: part.translateY,
       y: part.translateX,
     }
   } else {
     target = this.setRelativePosition(parentTarget, part)
   }
   var targets = [].concat.apply([],(part.connectedTo || []).map(Part.getTargets.bind(this, target)))
   if (part.length > 1) {
     targets.push(target)
   }
   return targets
 },

 rotate: function (target, x, y) {

   var distance = Math.sqrt(Math.pow(target.parentTarget.x - x, 2) + Math.pow(target.parentTarget.y - y, 2));

   var angle = Math.acos((x - target.parentTarget.x) / distance);

   var sin = (y - target.parentTarget.y)/ distance;

   if (sin < 0) {
     angle = -angle;
   }

   target.part.rotation = angle;

 }

}
