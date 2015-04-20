var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var React = require('react');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler} = Router;


var SceneEditor = require('./scene-editor.jsx');
var PoseEditor = require('./pose-editor.jsx');

var App = React.createClass({
  render: function () {
    return (
      <div>
      <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={SceneEditor} />
    <Route name="scene-creator" path="scene" handler={SceneEditor} />
    <Route name="scene-editor" path="scene/:id" handler={SceneEditor} />
    <Route name="pose-editor" path="pose/:id" handler={PoseEditor} />
    <Route name="pose-creator" path="role/:roleId/pose" handler={PoseEditor} />
  </Route>
);


Router.run(routes /* , Router.HistoryLocation */, function (Handler) {
  React.render(<Handler/>, document.getElementById('page'));
});
