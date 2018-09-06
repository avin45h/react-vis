'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Voronoi = require('d3-voronoi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NOOP = function NOOP(f) {
  return f;
};

// Find the index of the node at coordinates of a touch point
function getNodeIndex(evt) {
  var _evt$nativeEvent = evt.nativeEvent,
      pageX = _evt$nativeEvent.pageX,
      pageY = _evt$nativeEvent.pageY;

  var target = document.elementFromPoint(pageX, pageY);
  if (!target) {
    return -1;
  }
  var parentNode = target.parentNode;

  return Array.prototype.indexOf.call(parentNode.childNodes, target);
}

function Voronoi(_ref) {
  var className = _ref.className,
      extent = _ref.extent,
      nodes = _ref.nodes,
      onBlur = _ref.onBlur,
      _onClick = _ref.onClick,
      _onMouseUp = _ref.onMouseUp,
      _onMouseDown = _ref.onMouseDown,
      onHover = _ref.onHover,
      polygonStyle = _ref.polygonStyle,
      style = _ref.style,
      x = _ref.x,
      y = _ref.y;

  // Create a voronoi with each node center points
  var voronoiInstance = (0, _d3Voronoi.voronoi)().x(x).y(y).extent(extent);

  // Create an array of polygons corresponding to the cells in voronoi
  var polygons = voronoiInstance.polygons(nodes);

  // Create helper function to handle special logic for touch events
  var handleTouchEvent = function handleTouchEvent(handler) {
    return function (evt) {
      evt.preventDefault();
      var index = getNodeIndex(evt);
      if (index > -1 && index < polygons.length) {
        var d = polygons[index];
        handler(d.data);
      }
    };
  };

  return _react2.default.createElement(
    'g',
    {
      className: className + ' rv-voronoi',
      style: style
      // Because of the nature of how touch events, and more specifically touchmove
      // and how it differs from mouseover, we must manage touch events on the parent
      , onTouchEnd: handleTouchEvent(_onMouseUp),
      onTouchStart: handleTouchEvent(_onMouseDown),
      onTouchMove: handleTouchEvent(onHover),
      onTouchCancel: handleTouchEvent(onBlur)
    },
    polygons.map(function (d, i) {
      return _react2.default.createElement('path', {
        className: 'rv-voronoi__cell ' + (d.data && d.data.className || ''),
        d: 'M' + d.join('L') + 'Z',
        onClick: function onClick() {
          return _onClick(d.data);
        },
        onMouseUp: function onMouseUp() {
          return _onMouseUp(d.data);
        },
        onMouseDown: function onMouseDown() {
          return _onMouseDown(d.data);
        },
        onMouseOver: function onMouseOver() {
          return onHover(d.data);
        },
        onMouseOut: function onMouseOut() {
          return onBlur(d.data);
        },
        fill: 'none',
        style: _extends({
          pointerEvents: 'all'
        }, polygonStyle, d.data && d.data.style),
        key: i });
    })
  );
}

Voronoi.requiresSVG = true;

Voronoi.defaultProps = {
  className: '',
  onBlur: NOOP,
  onClick: NOOP,
  onHover: NOOP,
  onMouseDown: NOOP,
  onMouseUp: NOOP,
  x: function x(d) {
    return d.x;
  },
  y: function y(d) {
    return d.y;
  }
};

Voronoi.propTypes = {
  className: _propTypes2.default.string,
  extent: _propTypes2.default.arrayOf(_propTypes2.default.arrayOf(_propTypes2.default.number)).isRequired,
  nodes: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
  onBlur: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onHover: _propTypes2.default.func,
  onMouseDown: _propTypes2.default.func,
  onMouseUp: _propTypes2.default.func,
  x: _propTypes2.default.func,
  y: _propTypes2.default.func
};

exports.default = Voronoi;