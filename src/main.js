var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var React = require('react');
var SceneEditor = require('./scene-editor.jsx');
React.render(
  React.createElement(SceneEditor, null),
  document.getElementById('page')
);
