var React = require('react');

function classForValidity(isValid) {
    return isValid ? 'valid' : 'invalid';
}

function textForValidity(isValid) {
    return isValid ? 'Valid' : 'Invalid';
}

var ValidationBadge = React.createClass({
    propTypes: function() {
      return {
        isValid: React.PropTypes.bool
      };
    },

    render: function() {
      var className = 'badge ' + classForValidity(this.props.isValid);
      return <div className={className}>
        {textForValidity(this.props.isValid)}
      </div>
    }
});

module.exports = ValidationBadge;
