var frameActions = require('./pose-actions.js');
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
  onUpdateTransition: function(itemId, transition) {
    var foundItem = getItemById(this.list,itemId);
    if (!foundItem) {
      return;
    }
    foundItem.transition.numberOfFrames = transition;
    this.updateList(this.list);
  },
  onUpdate: function(item) {
    var foundItem = getItemById(this.list,item.id);
    if (!foundItem) {
      return;
    }
    Object.keys(item).forEach(function (key) {
      foundItem[key] = item[key]
    })
    this.updateList(this.list);
  },
  onAppend: function(item) {
    this.updateList(this.list.concat([clone(item)]));
  },
  onInsertAfter: function(item, precedingId) {

    this.updateList(this.list.concat([clone(frame)]));
  },
  onDelete: function(itemId) {
    this.updateList(this.list.filter(function(item){
      return item.id!==itemId;
    }));
  },
  updateList: function(list){
    localStorage.setItem(localStorageKey, JSON.stringify(list));
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
