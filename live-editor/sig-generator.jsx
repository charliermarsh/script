var React = require('react');
var ZeroClipboard = require('zeroclipboard');
var keyGen = require('../key-gen.js');

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
    var client = new ZeroClipboard(this.refs.copy.getDOMNode());
    client.on( "ready", function( readyEvent ) {
      console.log( "ZeroClipboard SWF is ready!");

      client.on("aftercopy", function(event) {
        console.log("Copied text to clipboard: " + event.data["text/plain"]);
      });
    });
  },

  generateSignature: function() {
    this.setState(keyGen.generateSignature());
  },

  getData: function() {
    return '(' + this.state.signatureString + ', ' + this.state.pubKeyString + ')';
  },

  render: function() {
    return <button ref='copy' data-clipboard-text={this.getData()} onClick={this.generateSignature}>
      Click to copy (signature, public key) pair
    </button>;
  }
});

module.exports = SigGenerator;
