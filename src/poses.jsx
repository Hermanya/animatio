const React = require('react'),
actions = require('./frame-actions.js'),
mui = require('material-ui'),
Pose = require('./pose.jsx'),
FloatingActionButton = mui.FloatingActionButton,
Paper = mui.Paper

class Poses extends React.Component {

  render () {

    const frames = this.props.data.map((frame, index) => {
      return (
        <Pose data={frame} index={index} key={index}/>
      )
    })

    return (
      <section id="frames" className="clearfix">
        {frames}
        <div id="push-frame-container">
          <FloatingActionButton onClick={this.handleAdd.bind(this)} iconClassName="mdi mdi-plus" id="push-frame"/>
        </div>
      </section>
    )
  }

  handleAdd () {
    actions.addFrame(require('./human.js')());
  }
}

module.exports = Poses;
