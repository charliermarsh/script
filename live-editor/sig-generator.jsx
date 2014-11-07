var React = require('react');
var keyGen = require('../key-gen.js');

var SigGenerator = React.createClass({
  getInitialState: function() {
    return {
      signatureString: null,
      pubKeyString: null
    };
  },

  generateSignature: function() {
    this.setState(keyGen.generateSignature());
  },

  render: function() {
    var firstItemStyle = {
      'padding': 10
    };
    var otherItemStyle = {
      'padding': '0 10px 10px 10px'
    };

    return <div className='signer'>
      <button onClick={this.generateSignature}>Click to generate signature</button>
      {this.state.signatureString &&
        <div style={firstItemStyle}>
          <b>Signature</b>:<br />
          {this.state.signatureString}
        </div>}
      {this.state.pubKeyString &&
        <div style={otherItemStyle}>
          <b>PubKey</b>:<br />
          {this.state.pubKeyString}
        </div>}
    </div>
  }
});

module.exports = SigGenerator;
