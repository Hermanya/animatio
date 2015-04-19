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
    setDefaults(item)
    this.updateList(this.list.concat([clone(item)]));
  },
  onInsertAfter: function(item) {
    var list = this.list;
    var foundItem = getItemById(list,item.id);
    setDefaults(item);
    var index = list.indexOf(foundItem)
    var newList = list.splice(0, index + 1).concat([item]).concat(list)
    this.updateList( newList  );
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
