var React = require('react');

var CodeMirrorEditor = require('./code-mirror-editor.jsx');
var LiveCompiler = require('./live-compiler.jsx');
var SigGenerator = require('./sig-generator.jsx');
var Permalink = require('./permalink.jsx');

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

  wrap: function(component) {
    return <div className='row'>
      <div className='col-md-12'>
        {component}
      </div>
    </div>;
  },

  render: function() {
    var save = <Permalink style={{marginTop: -7}} code={this.state.code} />
    var header =
      <div className='page-header'>
        <h1>Script Playground {save}</h1>
      </div>;
    var editor = this.wrap(
          <CodeMirrorEditor key='script'
                            mode='script'
                            onChange={this.handleCodeChange}
                            className='playgroundStage'
                            codeText={this.state.code} />);
    var preview = this.wrap(<LiveCompiler code={this.state.code} />);
    var generator = this.wrap(<SigGenerator />);
    var footer =
      <div className='footer'>
        <div className='container-fluid' style={{textAlign: 'center'}}>
          <p style={{margin: 5}}>
            Created by <a target='_blank' href='http://crmarsh.com/script/'>Charlie Marsh</a>.
            Source available on <a target='_blank' href='https://www.github.com/crm416/script'>GitHub</a> and <a target='_blank' href='https://www.npmjs.com/package/bitcoin-script'>npm</a>.
          </p>
        </div>
      </div>;

    return <div>
      <div className='playground container-fluid'>
        {header}
        {editor}
        {preview}
        <div style={{marginTop: 5}} />
        {generator}
      </div>
      {footer}
    </div>;
  },
});

module.exports = ScriptPlayground;
