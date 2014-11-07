var React = require('react');
var ScriptPlayground = require('./live-editor.jsx');

var HELLO_COMPONENT = 'OP_0 OP_0 OP_EQUAL OP_VERIFY';

React.render(
  <ScriptPlayground codeText={HELLO_COMPONENT} />,
  document.getElementById('scriptCompiler')
);
