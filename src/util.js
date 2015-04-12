module.exports = {
  getRandomElementFromArray: function (array) {
    return array[Math.floor(Math.random()*array.length)]
  },
  getSomeColor: function () {
    return randomElementFromArray([
      '#E6E477', '#F98A30', '#FEE266', '#AEF27F'
    ])
  },
  clone: function (x) {
   return JSON.parse(JSON.stringify(x))
  }
}
