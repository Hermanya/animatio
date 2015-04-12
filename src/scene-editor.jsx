const React = require('react'),
  Reflux = require('./reflux.js'),
  Preview = require('./preview.jsx'),
  Poses = require('./poses.jsx'),
  mui = require('material-ui'),
  FloatingActionButton = mui.FloatingActionButton,
  Paper = mui.Paper,
  TextField = mui.TextField,
  frames = JSON.parse(localStorage.frames || '[]'),
  frameStore = require('./frame-store.js')

class SceneEditor extends React.Component {

  constructor (props) {
    super(props)
    // this.mixins = [Reflux.connect(frameStore, 'frames')]
    this.state = {
        frames: frameStore.getInitialState()
    }
  }

  onFramesChange (frames) {
      this.setState({
          frames: frames
      })
  }
  componentDidMount () {
      this.unsubscribe = frameStore.listen(this.onFramesChange.bind(this));
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
              floatingLabelText="Title" />
          </header>
          <Preview data={this.state.frames}/>

          <Poses data={this.state.frames}/>

          <FloatingActionButton iconClassName="mdi mdi-check" id="complete" disabled />
          <FloatingActionButton iconClassName="mdi mdi-close" id="discard" disabled />
      </Paper>
    )
  }
}
module.exports = SceneEditor;
