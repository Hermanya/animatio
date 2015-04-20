const React = require('react'),
  Reflux = require('./reflux.js'),
  Preview = require('./preview.jsx'),
  PoseEditor = require('./pose-editor.jsx'),
  Poses = require('./poses.jsx'),
  mui = require('material-ui'),
  FloatingActionButton = mui.FloatingActionButton,
  Paper = mui.Paper,
  TextField = mui.TextField,
  roleStore = require('./pose-store.js')

class SceneEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
        roles: roleStore.getInitialState()
    }
  }

  onRolesChange (roles) {
      this.setState({
        roles: roles
      })
  }
  componentDidMount () {
      this.unsubscribe = roleStore.listen(this.onRolesChange.bind(this));
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

          <Poses data={this.state.roles}/>

          <FloatingActionButton iconClassName="mdi mdi-check" id="complete" disabled />
          <FloatingActionButton iconClassName="mdi mdi-close" id="discard" disabled />
      </Paper>
    )
  }
}
module.exports = SceneEditor;
