var actions = require('./new-scene-actions.js');
var Reflux = require('./reflux.js');
var human = require('./human.js');
var localStorageKey = "frames";


function clone (item) {
  return JSON.parse(JSON.stringify(item));
}

module.exports = Reflux.createStore({
  listenables: [actions],

  onAppendPose: function(roleId, pose) {
    this.roles[roleId].poses.push(pose)
    this.updateList(this.roles);
  },
  onInsertPoseAfter: function(roleId, pose) {
    var poses = this.roles[roleId].poses;
    var at = pose.id + 1;
    poses = poses.slice(0, at).concat([pose]).concat(poses.slice(at))
    this.roles[roleId].poses = poses;
    this.updateList(this.roles);
  },
  getPose: function (roleId, poseId){
    return this.roles[roleId] && this.roles[roleId].poses[poseId];
  },
  onUpdatePose: function(roleId, pose) {
    this.roles[roleId].poses[pose.id] = pose;
    this.updateList(this.roles);
  },
  onDeletePose: function(roleId, pose) {
    var role = this.roles[roleId];
    role.poses = role.poses.filter((_, index) => index !== pose.id)
    this.updateList(this.roles);
  },

  getRole: function (roleId){
    return this.roles[roleId]
  },
  createRole: function () {
    var colors = [
      'rgba(3, 169, 244, 0.8)',
      'rgba(233, 30, 99, 0.8)',
      'rgba(139, 195, 74, 0.8)',
      'rgba(244, 67, 54, 0.8)',
      'rgba(0, 188, 212, 0.8)',
      'rgba(103, 58, 183, 0.8)'
    ]
    if (this.roles.length < colors.length) {
      return {
        color: colors.filter((color) => {
          return this.roles.every((role) => {
            return role.color !== color
          })
        })[0],
        poses: [
          human(), human()
        ]
      }
    }
  },

  addRole: function () {
    var newRole = this.createRole()
    if (newRole) {
      this.roles.push(newRole)
    }

    this.updateList(this.roles);
  },

  swapRoles: function (roleId, anotherRoleId) {
    var role = this.roles[roleId];
    var anotherhRole = this.roles[anotherRoleId];
    this.roles[roleId] = anotherRole;
    this.roles[anotherRoleId] = role;
    this.updateList(this.roles);
  },

  deleteRole: function (role) {
    this.roles = this.roles.slice(0, role.id).concat(this.roles.slice(role.id + 1));
    this.updateList(this.roles);
  },

  indexList: function (list) {
    return list.map((role, index) => {
      role.id = index
      role.poses.map((pose, index) => {
        pose.id = index
        return pose
      })
      return role
    })
  },

  updateList: function(){
    var list = this.indexList(this.roles);
    localStorage.setItem(localStorageKey, JSON.stringify(list));
    this.trigger(list);
  },
  getInitialState: function() {
    var loadedList = localStorage.getItem(localStorageKey);
    if (!loadedList) {
      var pose = human();
      var anotherPose = human();
      anotherPose.translateX = 200;
      setDefaults(pose)

      this.roles = [];
      this.roles.push(this.createRole())
      this.roles.push(this.createRole())
      this.roles.push(this.createRole())
      this.roles = this.indexList(this.roles)

    } else {
      this.roles = JSON.parse(loadedList);
    }
    return this.roles;
  }
});
