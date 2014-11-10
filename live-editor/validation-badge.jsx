var React = require('react');

function classForValidity(isValid) {
    return isValid ? 'label-success' : 'label-danger';
}

function textForValidity(isValid) {
    return isValid ? 'Valid' : 'Invalid';
}

var ValidationBadge = React.createClass({
  propTypes: {
    isValid: React.PropTypes.bool
  },

  render: function() {
    var className = 'label ' + classForValidity(this.props.isValid);
    return <span className={className}>
      {textForValidity(this.props.isValid)}
    </span>
  }
});

module.exports = ValidationBadge;
