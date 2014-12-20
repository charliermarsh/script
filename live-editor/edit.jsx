var React = require('react');
var LiveEditor = require('./live-editor.jsx');

function getCodeFromURL() {
    var hashText = document.location.hash;
    return hashText && window.decodeURIComponent(hashText.substr(1));
}

var HELLO_COMPONENT = getCodeFromURL() || 'OP_0 OP_0 OP_EQUAL OP_VERIFY';

React.render(
  <LiveEditor codeText={HELLO_COMPONENT} />,
  document.getElementById('scriptCompiler')
);
