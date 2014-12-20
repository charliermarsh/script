var React = require('react');
var _ = require('underscore');

var HoverButton = React.createClass({
  getInitialState: function() {
    return {
      isHovering: false
    };
  },

  _toggleHover: function() {
    this.setState({ isHovering: !this.state.isHovering });
  },

  render: function() {
    var style = _.extend({
      backgroundColor: this.state.isHovering ? '#e6e6e6' : '#fff',
      borderColor: this.state.isHovering ? '#adadad' : '#ccc'
    }, this.props.style);

    return <button {...this.props}
              style={style}
              onMouseOver={this._toggleHover}
              onMouseOut={this._toggleHover}>
      {this.props.children}
    </button>
  }
});

module.exports = HoverButton;
