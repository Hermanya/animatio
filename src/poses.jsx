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

  render () {

    const poses = this.props.data.map((pose, index) => {
      return (
        <Pose data={pose} index={index} key={index} />
      )
    })

    const actors = ['rgba(174, 242, 127, 0.8)', 'rgba(254, 226, 102, 0.8)'].map((color, index) => {


      return (
          <FontIcon className="mdi mdi-account"/>
      )

      // <FloatingActionButton iconClassName="mdi mdi-account" style={{color: color}} mini={true}/>
    })

    return (
      <section id="frames" className="clearfix">

        <Toolbar>
          <ToolbarGroup key={0} float="left">
            {actors}
            <FontIcon className="mdi mdi-plus" />

            <FlatButton label={'hide other actors'} />
          </ToolbarGroup>
          <ToolbarGroup>
          </ToolbarGroup>
        </Toolbar>
        {poses}
        <div id="push-frame-container">
          <FloatingActionButton onClick={this.handleAdd.bind(this)} iconClassName="mdi mdi-plus" id="push-frame"/>
        </div>
      </section>
    )
  }

  handleAdd () {
    var {router} = this.context;
    router.transitionTo('/pose')
  }
  
}

Poses.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Poses;
