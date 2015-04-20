var frameActions = require('./pose-actions.js');
var Reflux = require('./reflux.js');
var human = require('./human.js');
var localStorageKey = "frames";



function setDefaults (pose) {
  pose.id = Date.now();
}

function clone (item) {
  return JSON.parse(JSON.stringify(item));
}

module.exports = Reflux.createStore({
  listenables: [frameActions],
  getPoseById: function (poseId){
    return this.roles.reduce(function (pose, role) {
      if (pose) {
        return pose
      }
      return role.poses.filter(function(pose) {
        return pose.id === poseId;
      })[0]
    }, undefined);
  },
  getRoleByPoseId: function (poseId){
    return this.roles.filter(function (role) {
      return role.poses.filter(function(pose) {
        return pose.id === poseId;
      })[0]
    })[0];
  },
  getRoleById: function (roleId){
    return this.roles.filter(function (role) {
      return role.id === roleId;
    })[0];
  },
  onUpdateTransition: function(poseId, transition) {
    var foundItem = this.getPoseById(poseId);
    if (!foundItem) {
      return;
    }
    foundItem.transition.numberOfFrames = transition;
    this.updateList(this.roles);
  },
  onUpdate: function(pose) {
    var foundItem = this.getPoseById(pose.id);
    if (!foundItem) {
      return;
    }
    Object.keys(pose).forEach(function (key) {
      foundItem[key] = pose[key]
    })
    this.updateList(this.roles);
  },
  onAppend: function(item, roleId) {
    setDefaults(item)
    var role = this.getRoleById(roleId)
    role.poses.push(item)
    this.updateList(this.roles);
  },
  onInsertAfter: function(item) {
    var role = this.getRoleByPoseId(item.id)
    var foundItem = this.getPoseById(item.id);

    var list = role.poses;
    setDefaults(item);
    var index = list.indexOf(foundItem)
    role.poses = list.splice(0, index + 1).concat([item]).concat(list)
    this.updateList( this.roles  );
  },
  onDelete: function(item) {
    var role = this.getRoleByPoseId(item.id)
    role.poses = role.poses.filter(function (pose) {
      return pose.id === item.id;
    })
    this.updateList( this.roles  );
  },
  updateList: function(list){
    localStorage.setItem(localStorageKey, JSON.stringify(list));
    this.list = list.map((x) => x);
    this.trigger(list);
  },
  getInitialState: function() {
    var loadedList = localStorage.getItem(localStorageKey);
    if (!loadedList) {
      var pose = human();
      var anotherPose = human();
      anotherPose.translateX = 200;
      setDefaults(pose)

      this.roles = [{
        color: 'rgba(3, 169, 244, 0.8)',
        poses: [pose],
        id: 1
      },{
        color: 'rgba(139, 195, 74, 0.8)',
        poses: [anotherPose],
        id: 2
      }];
    } else {
      this.roles = JSON.parse(loadedList);
    }
    return this.roles;
  }
});
