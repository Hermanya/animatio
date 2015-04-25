var React = require('react'),
actions = require('./new-scene-actions.js'),
mui = require('material-ui'),
Pose = require('./pose.jsx'),
FloatingActionButton = mui.FloatingActionButton,
DropDownIcon = mui.DropDownIcon,
Toolbar = mui.Toolbar,
ToolbarGroup = mui.ToolbarGroup,
FlatButton = mui.FlatButton,
FontIcon = mui.FontIcon,
Paper = mui.Paper

class Poses extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {

    var poses = this.props.selectedRole.poses.map((pose, index) => {
      return (
        <Pose data={pose} index={index} key={index} role={this.props.selectedRole}/>
      )
    })

    var actors = this.props.data.map((role, index) => {

      return (
          <FlatButton key={index} onClick={this.selectRole.bind(this, role)} draggable="true" primary={role === this.props.selectedRole}>
            [<FontIcon className="button-icon mdi mdi-account" style={{color: role.color + ' '}}/>]
          </FlatButton>
      )

    }).concat([
      <FlatButton onClick={this.addRole.bind(this)} key={'add'} >
        [<FontIcon className="button-icon mdi mdi-plus"/>]
      </FlatButton>
    ])

    actors = ([<FlatButton onClick={this.deleteRole.bind(this)} key={'delete'}>
      [<FontIcon className="button-icon mdi mdi-delete"/>]
    </FlatButton>]).concat(actors)


    return (
      <section id="frames" className="clearfix">

        <div>
            {actors}
        </div>

        {poses}

        <div id="push-frame-container">
          <FloatingActionButton onClick={this.addPose.bind(this)} iconClassName="mdi mdi-plus" id="push-frame"/>
        </div>
      </section>
    )
  }

  selectRole (role) {
    this.context.router.transitionTo('/scene/role/' + role.id)
  }


  addPose () {
    this.context.router.transitionTo('/role/' + this.props.data.indexOf(this.props.selectedRole) + '/pose')
  }

  addRole () {
    actions.addRole();
    window.setTimeout(
      this.context.router.transitionTo.bind(this.context.router.transitionTo, '/scene/role/' + this.props.data.length)
    )
  }

  deleteRole () {
    actions.deleteRole(this.props.selectedRole)
    window.setTimeout(
      this.context.router.transitionTo.bind(this.context.router.transitionTo, '/scene')
    )
  }

}

Poses.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Poses;
