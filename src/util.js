var util
module.exports = util = {
  mapOverTwoParts: function (onePart, otherPart, callback) {
    var newPart = callback(onePart, otherPart);
    newPart.connectedTo = (onePart.connectedTo || []).map(function (_, index) {
      return util.mapOverTwoParts(onePart.connectedTo[index], otherPart.connectedTo[index], callback);
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
     util.renderPart(context, part);
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
   var targets = [].concat.apply([],(part.connectedTo || []).map(util.getTargets.bind(this, target)))
   if (part.length > 1) {
     targets.push(target)
   }
   return targets
 },

 getClosestTarget: function (pose, {x, y}) {
   return util.getTargets(pose).map(function (target) {
     target.distance = Math.sqrt(Math.pow(target.x - y, 2) + Math.pow(target.y - x, 2))
     return target
   }).reduce(function (min, target) {
     if (min.distance > target.distance) {
       return target
     }
     return min
   })
 },

 getOffset: function (prop, element) {
   if (!element || element === document.body) {
     return 0;
   }
   return element[prop] + util.getOffset(prop, element.offsetParent);
 },

 rotate: function (target, x, y) {
   var distance = Math.sqrt(Math.pow(target.parentTarget.x - x, 2) + Math.pow(target.parentTarget.y - y, 2));
   var angle = Math.acos((x - target.parentTarget.x) / distance);
   var sin = (y - target.parentTarget.y)/ distance;
   if (sin < 0) {
     angle = -angle;
   }
   target.part.rotation = angle;
 },

 getRolesAtFrameNumber: function (overallFrameNumber, roles) {
   return roles.map(function (role) {
     var {from, to, progress} = role.poses.reduce(function (frame, pose, index) {
       if (index === 0) {
         frame.from = pose
       } else if (!frame.to) {
         if (frame.number > pose.transition.numberOfFrames) {
           frame.from = pose
           frame.number -= pose.transition.numberOfFrames
         } else {
           frame.to = pose
           frame.progress = frame.number / pose.transition.numberOfFrames
         }
       }
       return frame
     }, {number: overallFrameNumber})

     if (from && to) {
       role.currentPose = util.mapOverTwoParts(from, to, util.getIntermediatePart.bind(undefined, progress));
       return role;
     }
   }).filter((currentRole) => currentRole !== undefined)
 },

 getTotalNumberOfFrames: function (roles) {
   return Math.max.apply(Math, roles.map((role) => {
    return role.poses.reduce((x, pose, index) => {
      if (index) {
        return x + pose.transition.numberOfFrames
      }
      return x
    }, 0)
  }))
 }

}
