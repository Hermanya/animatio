renderPart = require('./part.js').renderPart
module.exports = (context, actor) => {
  // actor.x = 100
  // actor.y = 0
  // actor.scale = 1.5
  context.save()
  // context.translate(actor.y, actor.x)
  // context.scale(actor.scale, actor.scale)
  // context.strokeStyle = 'rgba(174, 242, 127, 0.8)'// yellow 'rgba(254, 226, 102, 0.8)'

  renderPart(actor, context)
  context.restore()
}
