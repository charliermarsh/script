var React = require('react');
var ZeroClipboard = require('zeroclipboard');
var keyGen = require('../src/key-gen.js');
var HoverButton = require('./hover-button.jsx');

function truncate(s) {
  return s.substr(0, 6) + '...';
}

var SigGenerator = React.createClass({
  getInitialState: function() {
    return {
      signatureString: null,
      pubKeyString: null
    };
  },

  componentWillMount: function() {
    this.generateSignature();
  },

  componentDidMount: function() {
    ZeroClipboard.config({
      swfPath: '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf'
    });
    new ZeroClipboard(this.refs.sig.getDOMNode());
    new ZeroClipboard(this.refs.pubKey.getDOMNode());
    $(function () {
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    });
  },

  generateSignature: function() {
    this.setState(keyGen.generateSignature());
  },

  getData: function() {
    return '(' + this.state.signatureString + ', ' + this.state.pubKeyString + ')';
  },

  buttonForData: function(data, tooltip, ref) {
    return <div className='btn-group' role='group'>
      <HoverButton data-clipboard-text={data} data-toggle='tooltip' data-placement='bottom' ref={ref} title={tooltip} type='button' className='btn btn-default'>
        <span className='glyphicon glyphicon-paperclip' />
      </HoverButton>
      <button type='button' className='btn btn-default' disabled='disabled'>
        {truncate(data)}
      </button>
    </div>;
  },

  render: function() {
    var refreshButtonGroup =
      <div className='btn-group' role='group'>
        <button
            type='button'
            className='btn btn-default'
            data-toggle='tooltip'
            data-placement='bottom'
            title='Generate a new signature'
            onClick={this.generateSignature}>
          <span className='glyphicon glyphicon-refresh' />
        </button>
      </div>;
    var sigButtonGroup = this.buttonForData(this.state.signatureString,
      'Copy full signature', 'sig');
    var pubKeyButtonGroup = this.buttonForData(this.state.pubKeyString,
      'Copy full public key', 'pubKey');
    return <div className='btn-toolbar' role='toolbar'>
      {refreshButtonGroup}
      {sigButtonGroup}
      {pubKeyButtonGroup}
    </div>;
  }
});

module.exports = SigGenerator;
