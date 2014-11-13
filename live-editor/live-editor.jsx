var React = require('react');

var CodeMirrorEditor = require('./code-mirror-editor.jsx');
var ComponentPreview = require('./live-compile.jsx');
var SigGenerator = require('./sig-generator.jsx');

var ScriptPlayground = React.createClass({
  propTypes: {
    codeText: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      code: this.props.codeText
    };
  },

  handleCodeChange: function(code) {
    this.setState({ code });
  },

  render: function() {
    var header =
      <div className='page-header'>
        <h1>Script Playground</h1>
      </div>;

    var editor =
      <div className='row'>
        <div className='col-md-12'>
          <CodeMirrorEditor key='script'
                            mode='script'
                            onChange={this.handleCodeChange}
                            className='playgroundStage'
                            codeText={this.state.code} />
        </div>
      </div>;

    var preview =
      <div className='row'>
        <div className='col-md-12'>
          <ComponentPreview code={this.state.code} />
        </div>
      </div>;

    var generator =
      <div className='row'>
        <SigGenerator />
      </div>;

    var footer =
      <div className='footer'>
        <div className='container-fluid' style={{textAlign: 'center'}}>
          <p style={{margin: 5}}>
            Created by <a href='https://www.princeton.edu/~crmarsh'>Charlie Marsh</a>.
            Code and documentation available on <a href='https://www.github.com/crm416/script'>GitHub</a>.
          </p>
        </div>
      </div>;

    return <div>
      <div className='playground container-fluid'>
        {header}
        {editor}
        {preview}
        {generator}
      </div>
      {footer}
    </div>;
  },
});

module.exports = ScriptPlayground;
