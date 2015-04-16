const React = require('react'),
  Reflux = require('./reflux.js'),
  Preview = require('./preview.jsx'),
  PoseEditor = require('./pose-editor.jsx'),
  Poses = require('./poses.jsx'),
  mui = require('material-ui'),
  FloatingActionButton = mui.FloatingActionButton,
  Paper = mui.Paper,
  TextField = mui.TextField,
  frames = JSON.parse(localStorage.frames || '[]'),
  poseStore = require('./pose-store.js')

class SceneEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
        poses: poseStore.getInitialState()
    }
  }

  onFramesChange (poses) {
      this.setState({
        poses: poses
      })
  }
  componentDidMount () {
      this.unsubscribe = poseStore.listen(this.onFramesChange.bind(this));
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
          <Preview data={this.state.poses}/>

          <Poses data={this.state.poses}/>

          <FloatingActionButton iconClassName="mdi mdi-check" id="complete" disabled />
          <FloatingActionButton iconClassName="mdi mdi-close" id="discard" disabled />
      </Paper>
    )
  }
}
module.exports = SceneEditor;
