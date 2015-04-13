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
  frameStore = require('./pose-store.js')

class SceneEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
        poses: frameStore.getInitialState()
    }
  }

  onFramesChange (poses) {
      this.setState({
        poses: poses
      })
  }
  componentDidMount () {
      this.unsubscribe = frameStore.listen(this.onFramesChange.bind(this));
  }
  componentWillUnmount () {
      this.unsubscribe();
  }


  render() {
//  <Preview data={this.state.poses}/>
    return (
      <Paper zDepth={1}>
          <header>
            <TextField
              hintText="Enter Title"
              floatingLabelText="Title" />
          </header>
          <PoseEditor pose={this.state.poses[0]}/>

          <Poses data={this.state.poses}/>

          <FloatingActionButton iconClassName="mdi mdi-check" id="complete" disabled />
          <FloatingActionButton iconClassName="mdi mdi-close" id="discard" disabled />
      </Paper>
    )
  }
}
module.exports = SceneEditor;
