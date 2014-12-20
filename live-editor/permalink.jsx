var React = require('react');
var HoverButton = require('./hover-button.jsx');

var Permalink = React.createClass({
  embedLink: function() {
    document.location.hash = window.encodeURIComponent(this.props.code);
  },

  render: function() {
    return <HoverButton
          type='button'
          className='btn btn-default'
          data-toggle='tooltip'
          data-placement='bottom'
          title='Permalink this script'
          style={this.props.style}
          onClick={this.embedLink}>
        <span className='glyphicon glyphicon-link' />
      </HoverButton>;
  }
});

module.exports = Permalink;
