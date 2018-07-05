'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rect = function (_Component) {
  _inherits(Rect, _Component);

  function Rect(props) {
    _classCallCheck(this, Rect);

    var _this = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, props));

    _this.paint = function (coords) {
      var _this$props = _this.props,
          handlerSize = _this$props.handlerSize,
          pixelRatio = _this$props.pixelRatio;

      if (pixelRatio > 1) {
        coords = (0, _utils.multiply)(coords, pixelRatio);
        handlerSize = handlerSize * pixelRatio;
      }
      var _coords = coords,
          x = _coords.x,
          y = _coords.y,
          width = _coords.width,
          height = _coords.height;
      var _this$props2 = _this.props,
          canvasWidth = _this$props2.canvasWidth,
          canvasHeight = _this$props2.canvasHeight;

      var node = _reactDom2.default.findDOMNode(_this);
      var context = node.getContext('2d');
      context.clearRect(0, 0, node.width, node.height);
      if (!width || !height) {
        return;
      }
      context.strokeStyle = _this.props.borderColor;
      context.fillStyle = 'rgba(0, 0, 0, 0.3)';
      context.beginPath();
      context.rect(x, y, width, height);
      context.stroke();
      context.rect(node.width, 0, -node.width, node.height);
      // credit: http://stackoverflow.com/a/11770000/337480
      // fix for safari
      context.fill('evenodd');
      context.fillStyle = _this.props.borderColor;
      context.fillRect(x + width - handlerSize, y + height - handlerSize, handlerSize, handlerSize);
    };

    return _this;
  }

  _createClass(Rect, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _props = this.props,
          x = _props.x,
          y = _props.y,
          height = _props.height,
          width = _props.width;

      if (x !== null && y !== null) {
        this.paint({
          x: x,
          y: y,
          width: width,
          height: height
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          canvasWidth = _props2.canvasWidth,
          canvasHeight = _props2.canvasHeight,
          pixelRatio = _props2.pixelRatio;

      var props = {
        width: canvasWidth * pixelRatio,
        height: canvasHeight * pixelRatio
      };
      if (pixelRatio > 1) {
        props.style = {
          width: canvasWidth,
          height: canvasHeight
        };
      }
      return _react2.default.createElement('canvas', props);
    }
  }]);

  return Rect;
}(_react.Component);

Rect.propTypes = {
  canvasWidth: _propTypes2.default.number.isRequired,
  canvasHeight: _propTypes2.default.number.isRequired,
  handlerSize: _propTypes2.default.number.isRequired,
  borderColor: _propTypes2.default.string.isRequired,
  pixelRatio: _propTypes2.default.number.isRequired
};
exports.default = Rect;