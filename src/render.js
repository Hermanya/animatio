renderPart = require('./part.js').renderPart
module.exports = (context, actor) => {
  //
  context.save()
  renderPart(actor, context)
  context.restore()
}
