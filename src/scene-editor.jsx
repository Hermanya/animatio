const React = require('react'),
  Reflux = require('./reflux.js'),
  Preview = require('./preview.jsx'),
  PoseEditor = require('./pose-editor.jsx'),
  Poses = require('./poses.jsx'),
  mui = require('material-ui'),
  {FloatingActionButton} = mui,
  {Paper} = mui,
  TextField = mui.TextField,
  store = require('./new-scene-store.js')

class SceneEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
        roles: store.getInitialState(),
        selectedRole: store.roles[0]
    }
  }

  onRolesChange (roles) {

      this.setState({
        roles: roles
      })

  }
  componentDidMount () {
      this.unsubscribe = store.listen(this.onRolesChange.bind(this));

      var { router } = this.context;
      var roleId = parseInt(router.getCurrentParams().roleId || 0);

        this.setState({
          selectedRole: this.state.roles[roleId]
        })

  }

  componentWillReceiveProps () {
    var { router } = this.context;
    var roleId = parseInt(router.getCurrentParams().roleId || 0);

      this.setState({
        selectedRole: this.state.roles[roleId]
      })

  }


  componentWillUnmount () {
      this.unsubscribe();
  }


  render() {

    return (
      <Paper zDepth={1}>
          <header>
            <TextField
              hintText="Enter Title"
              floatingLabelText="Scene Title" />
          </header>
          <Preview data={this.state.roles}/>

          <Poses data={this.state.roles} selectedRole={this.state.selectedRole}/>

          <FloatingActionButton iconClassName="mdi mdi-check" id="complete" disabled />
          <FloatingActionButton iconClassName="mdi mdi-close" id="discard" disabled />
      </Paper>
    )
  }
}

SceneEditor.contextTypes = {
  router: React.PropTypes.func
};

module.exports = SceneEditor;
