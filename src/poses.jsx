const React = require('react'),
poseActions = require('./pose-actions.js'),
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
    this.state = {
      currentRole: props.data[0]
    }
  }

  render () {

    const poses = this.state.currentRole.poses.map((pose, index) => {
      var role = JSON.parse(JSON.stringify(this.state.currentRole))
      role.currentPose = pose
      return (
        <Pose data={[role]} index={index} key={index} />
      )
    })

    const actors = this.props.data.map((role, index) => {


          // <FontIcon className="mdi mdi-account" title="{role.color}"/>
      return (
          <FlatButton onClick={this.selectRole.bind(this, role)} primary={role === this.state.currentRole}>
            [<FontIcon className="button-icon mdi mdi-account" style={{color: role.color + ' '}}/>]
          </FlatButton>
      )

    }).concat([
      <FlatButton onClick={this.addRole.bind(this)} >
        [<FontIcon className="button-icon mdi mdi-plus"/>]
      </FlatButton>
    ])


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
    this.setState({
      currentRole: role
    })
  }


  addPose () {
    var {router} = this.context;
    router.transitionTo('/role/' + this.state.currentRole.id + '/pose')
  }

  addRole () {

  }

}

Poses.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Poses;
