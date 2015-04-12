var frameActions = require('./frame-actions.js');
var Reflux = require('./reflux.js');
var human = require('./human.js');
var localStorageKey = "frames";

function getItemById(list,itemId){
  return list.filter(function(item) {
    return item.id === itemId;
  })[0];
}

function setDefaults (pose) {
  pose.id = Date.now();
  pose.transition = {
    numberOfFrames: 30
  }
}

function clone (item) {
  return JSON.parse(JSON.stringify(item));
}

module.exports = Reflux.createStore({
  listenables: [frameActions],
  onUpdateFrameTransition: function(itemId, transition) {
    var foundItem = getItemById(this.list,itemId);
    if (!foundItem) {
      return;
    }
    foundItem.transition.numberOfFrames = transition;
    this.updateList(this.list);
  },
  onAddFrame: function(frame) {
    setDefaults(frame)
    this.updateList(this.list.concat([clone(frame)]));
  },
  onDeleteFrameById: function(itemId) {
    console.log(itemId)
    this.updateList(this.list.filter(function(item){
      return item.id!==itemId;
    }));
  },
  // called whenever we change a list. normally this would mean a database API call
  updateList: function(list){
    localStorage.setItem(localStorageKey, JSON.stringify(list));
    // if we used a real database, we would likely do the below in a callback
    this.list = list;
    this.trigger(list);
  },
  getInitialState: function() {
    var loadedList = localStorage.getItem(localStorageKey);
    if (!loadedList) {
      var frame = human();

      setDefaults(frame)

      this.list = [frame];
    } else {
      this.list = JSON.parse(loadedList);
    }
    return this.list;
  }
});
