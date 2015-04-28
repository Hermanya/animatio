var React = require('react'),
Reflux = require('./reflux.js'),
Preview = require('./preview.jsx'),
PoseEditor = require('./pose-editor.jsx'),
Poses = require('./poses.jsx'),
{FloatingActionButton, Paper, TextField, Dialog} = require('material-ui'),
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
    this.unsubscribe = store.listen(this.onRolesChange.bind(this))

    var { router } = this.context
    var roleId = parseInt(router.getCurrentParams().roleId || 0)

    this.setState({
      selectedRole: this.state.roles[roleId]
    })
  }

  componentWillReceiveProps () {
    var { router } = this.context
    var roleId = parseInt(router.getCurrentParams().roleId || 0)

    this.setState({
      selectedRole: this.state.roles[roleId]
    })
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  selectText (event) {
    event.target.select()
  }


  render() {
    var maybeDialog;

    if (true) {
      //Standard Actions
      var standardActions = [
        { text: 'Not cool' },
        { text: 'Great stuff', ref: 'submit' }
      ];

    maybeDialog = (
      <div style={{textAlign: 'left'}}>
        <Dialog
            title="What is next?"
            actions={standardActions}
            actionFocus="submit"
            modal={false}
            ref="dialog"
            dismissOnClickAway={this.state.dismissOnClickAway}>

            <p><em>I do not have backed just yet.</em></p><p> Meanwhile we still can persist your work. It is just
              a little awkward. So, if you please hold
              <div>
              <TextField
                hintText=""
                defaultValue={JSON.stringify(store.roles)}
                floatingLabelText="this json"
                onClick={this.selectText.bind(this)}  />
                </div> and POST it (get it?)
              <a
                href="https://github.com/hermanya/animatio/new/master"
                style={{margin: '0.3em'}}
                target="_blank">there</a> for me.</p><p>
                Sorry for inconvenience.</p>
          </Dialog>
      </div>)
    }


    return (
      <Paper zDepth={1}>
        <header>
          <TextField
          hintText="Enter Title"
          floatingLabelText="Scene Title" />
        </header>

        <Preview data={this.state.roles}/>
        <Poses data={this.state.roles} selectedRole={this.state.selectedRole}/>

        <FloatingActionButton iconClassName="mdi mdi-check" id="complete" onClick={this.complete.bind(this)} />
        <FloatingActionButton iconClassName="mdi mdi-close" id="discard" disabled />

        {maybeDialog}
      </Paper>
    )
  }

  complete () {
    this.refs.dialog.show()
  }
}

SceneEditor.contextTypes = {
  router: React.PropTypes.func
};

module.exports = SceneEditor;
