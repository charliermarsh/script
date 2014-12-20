var React = require('react');

function classForValidity(isValid) {
    return isValid ? 'label-success' : 'label-danger';
}

function textForValidity(isValid) {
    return isValid ? '✓' : '✖';
}

var ValidationBadge = React.createClass({
  propTypes: {
    isValid: React.PropTypes.bool
  },

  render: function() {
    var className = 'label ' + classForValidity(this.props.isValid);
    var style = {
      position: 'absolute',
      right: 20,
      bottom: 5,
      fontSize: 18
    };
    return <span className={className} style={style}>
      {textForValidity(this.props.isValid)}
    </span>
  }
});

module.exports = ValidationBadge;
