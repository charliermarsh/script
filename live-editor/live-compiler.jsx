var React = require('react');
var CodeMirrorEditor = require('./code-mirror-editor.jsx');
var ValidationBadge = require('./validation-badge.jsx');
var parser = require('../src/index.js');

var selfCleaningTimeout = {
  componentDidUpdate: function() {
    clearTimeout(this.timeoutID);
  },

  setTimeout: function() {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout.apply(null, arguments);
  }
};

var ComponentPreview = React.createClass({
    propTypes: {
      code: React.PropTypes.string.isRequired
    },

    mixins: [selfCleaningTimeout],

    render: function() {
        return <div ref='mount' />;
    },

    componentDidMount: function() {
      this.executeCode();
    },

    componentDidUpdate: function(prevProps) {
      // execute code only when the state's not being updated by switching tab
      // this avoids re-displaying the error, which comes after a certain delay
      if (this.props.code !== prevProps.code) {
        this.executeCode();
      }
    },

    parseCode: function() {
      return parser.parse(this.props.code, /* enableDisabled */ true);
    },

    executeCode: function() {
      var mountNode = this.refs.mount.getDOMNode();

      try {
        React.unmountComponentAtNode(mountNode);
      } catch (e) { }

      try {
        var parsedCode = this.parseCode();
        React.render(
          <div>
            <CodeMirrorEditor
              codeText={parsedCode.code}
              readOnly={true}
              lineNumbers={true}
              mode='javascript' />
            <ValidationBadge isValid={parsedCode.value} />
          </div>,
          mountNode
        );
      } catch (err) {
        this.setTimeout(function() {
          React.render(
            <div className='playgroundError'>{err.toString()}</div>,
            mountNode
          );
        }, 500);
      }
    }
});

module.exports = ComponentPreview;
