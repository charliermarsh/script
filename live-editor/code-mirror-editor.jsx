var React = require('react');
var _ = require('underscore');

// Syntax highlighter for Bitcoin Script
CodeMirror.defineSimpleMode('script', {
  start: [
    // The regex matches the token, the token property contains the type
    {regex: /([0-9]|[A-F]|[a-f])+\b/, token: 'number'},
    {regex: /OP\_(IF|ENDIF|ELSE|NOTIF)\b/, token: 'keyword'},
    {regex: /OP\_(VERIFY|EQUALVERIFY|RETURN|CHECKSIGVERIFY|CHECKMULTISIGVERIFY)\b/, token: 'keyword'},
    {regex: /OP\_(.+?)\b/, token: 'variable'},
  ]
});

var CodeMirrorEditor = React.createClass({
  componentDidMount: function() {

    var editorProps = _.extend({
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme: 'solarized-dark',
      readOnly: false
    }, this.props);

    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(),
      editorProps);
    this.editor.on('change', this.handleChange);
  },

  componentDidUpdate: function() {
    if (this.props.readOnly) {
      this.editor.setValue(this.props.codeText);
    }
  },

  handleChange: function() {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(this.editor.getValue());
    }
  },

  render: function() {
    return (
      <div style={this.props.style} className={this.props.className}>
        <textarea ref='editor' defaultValue={this.props.codeText} />
      </div>
    );
  }
});

module.exports = CodeMirrorEditor;
