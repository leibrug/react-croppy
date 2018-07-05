'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Rect = require('./Rect');

var _Rect2 = _interopRequireDefault(_Rect);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cropper = function (_Component) {
  _inherits(Cropper, _Component);

  function Cropper(props) {
    _classCallCheck(this, Cropper);

    var _this = _possibleConstructorReturn(this, (Cropper.__proto__ || Object.getPrototypeOf(Cropper)).call(this, props));

    _this.getPosition = function (e) {
      var offset = (0, _utils.getOffset)(_this.node);
      var x = e.pageX - offset.left;
      var y = e.pageY - offset.top;
      return { x: x, y: y };
    };

    _this.posCollidesCrop = function (pos) {
      // does the provided mouse position collide with the crop box
      var x = pos.x,
          y = pos.y;

      return x >= _this.state.x && x <= _this.state.x + _this.state.width && y >= _this.state.y && y <= _this.state.y + _this.state.height;
    };

    _this.posCollidesResizeHandler = function (pos) {
      // does the provided mouse position collide with the resize handler
      var handlerSize = _this.props.handlerSize;
      var x = pos.x,
          y = pos.y;

      var handlerX = _this.state.x + _this.state.width - handlerSize;
      var handlerY = _this.state.y + _this.state.height - handlerSize;
      return x >= handlerX && x <= handlerX + handlerSize && y >= handlerY && y <= handlerY + handlerSize;
    };

    _this.cropIsActive = function () {
      // is there currently an active cropbox?
      return _this.state.width && _this.state.height;
    };

    _this.getDelta = function (pos) {
      // diff between mouse position and left/top position of crop box
      return {
        x: pos.x - _this.state.x,
        y: pos.y - _this.state.y
      };
    };

    _this.onMouseDown = function (e) {
      e.preventDefault();

      var pos = _this.getPosition(e);
      var isActive = _this.cropIsActive();
      var collides = _this.posCollidesCrop(pos);

      if (!isActive || !collides) {
        // reset starting position
        _this.setState(_extends({}, pos, {
          width: 0,
          height: 0,
          resizing: true,
          startX: pos.x,
          startY: pos.y
        }));
      } else {

        var delta = _this.getDelta(pos);
        var _this$state = _this.state,
            width = _this$state.width,
            height = _this$state.height;


        if (_this.posCollidesResizeHandler(pos)) {
          _this.setState({
            resizing: true,
            // calc distance between left bottom corner and mouse pos
            deltaHandler: { x: width - delta.x, y: height - delta.y }
          });
        } else {
          _this.setState({
            dragging: true,
            delta: delta
          });
        }
      }
    };

    _this.onResize = function (_ref) {
      var width = _ref.width,
          height = _ref.height;
      var _this$props = _this.props,
          aspectRatio = _this$props.aspectRatio,
          minCropWidth = _this$props.minCropWidth,
          minCropHeight = _this$props.minCropHeight;

      if (minCropWidth) {
        width = Math.max(minCropWidth, width);
      }
      if (minCropHeight) {
        height = Math.max(minCropHeight, height);
      }
      if (aspectRatio) {
        height = width / aspectRatio;
      }
      return { width: width, height: height };
    };

    _this.onMouseMove = function (e) {
      if (!_this.state.dragging && !_this.state.resizing) {
        return;
      }
      e.preventDefault();

      var _this$getPosition = _this.getPosition(e),
          x = _this$getPosition.x,
          y = _this$getPosition.y;

      var ratio = _this.getRatio();
      var _this$state2 = _this.state,
          width = _this$state2.width,
          height = _this$state2.height,
          delta = _this$state2.delta,
          domWidth = _this$state2.domWidth,
          domHeight = _this$state2.domHeight;

      var newState = {};
      var maxWidth = void 0;
      var maxHeight = void 0;

      if (_this.state.dragging) {
        newState = {
          x: (0, _utils.clip)(x - delta.x, 0, domWidth - width),
          y: (0, _utils.clip)(y - delta.y, 0, domHeight - height),
          width: width,
          height: height
        };
      } else if (_this.state.resizing) {
        width = x - _this.state.x;
        height = y - _this.state.y;

        if (!_this.props.aspectRatio) {
          maxWidth = domWidth - _this.state.x;
          maxHeight = domHeight - _this.state.y;
        } else {
          maxWidth = domWidth - _this.state.x;
          maxHeight = (domHeight - _this.state.y) * _this.props.aspectRatio;
          maxWidth = maxHeight = Math.min(maxWidth, maxHeight);
        }

        newState = _extends({
          x: _this.state.x,
          y: _this.state.y
        }, _this.onResize({
          width: (0, _utils.clip)(width + _this.state.deltaHandler.x, 1, maxWidth),
          height: (0, _utils.clip)(height + _this.state.deltaHandler.y, 1, maxHeight)
        }));
      }
      if (_this.props.onCrop) {
        _this.props.onCrop(_this.toNativeMetrics(newState));
      }
      _this.setState(newState);
    };

    _this.onMouseUp = function () {
      if (!_this.state.dragging && !_this.state.resizing) {
        return;
      }
      var _this$state3 = _this.state,
          x = _this$state3.x,
          y = _this$state3.y,
          width = _this$state3.width,
          height = _this$state3.height;

      var data = _extends({
        nativeSize: _this.image.nativeSize
      }, _this.toNativeMetrics({ x: x, y: y, width: width, height: height }));

      _this.setState({
        resizing: false,
        dragging: false
      });

      if (width && height && _this.props.onCropEnd) {
        _this.props.onCropEnd(data);
      }
    };

    _this.onWindowResize = function () {
      _this.computeDOMSizes();
    };

    _this.setImageRef = function (element) {
      _this.image = element;
    };

    _this.onImageLoad = function () {
      var imgNode = _this.getImageNode();
      _this.node = imgNode;
      var domSize = _this.imageDomSize();

      _this.image = _this.image || {};
      _this.image.nativeSize = {
        width: imgNode.naturalWidth,
        height: imgNode.naturalHeight
      };

      var update = {
        domWidth: domSize.width,
        domHeight: domSize.height
      };

      if (_this.props.start) {
        var aspectRatio = _this.props.aspectRatio;

        var _this$props$start = _slicedToArray(_this.props.start, 4),
            x = _this$props$start[0],
            y = _this$props$start[1],
            width = _this$props$start[2],
            height = _this$props$start[3];

        var ratio = domSize.width / _this.image.nativeSize.width;
        if (aspectRatio) {
          height = width / aspectRatio;
        }
        (0, _utils.assign)(update, {
          x: x * ratio,
          y: y * ratio,
          width: width * ratio,
          height: height * ratio
        });
      }
      _this.setState(update);
    };

    _this.computeDOMSizes = function () {
      // size of the image cropper in the DOM
      var domSize = _this.imageDomSize();
      var update = {
        domWidth: domSize.width,
        domHeight: domSize.height
      };
      _this.setState(update);
      return update;
    };

    _this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      domHeight: 0,
      domWidth: 0,
      resizing: false,
      dragging: false,
      deltaHandler: { x: 0, y: 0 },
      pixelRatio: (0, _utils.getPixelRatio)()
    };
    _this.image = null;
    return _this;
  }

  _createClass(Cropper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setupListeners();
      this.computeDOMSizes();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.teardownListeners();
    }
  }, {
    key: 'setupListeners',
    value: function setupListeners() {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('resize', this.onWindowResize);
    }
  }, {
    key: 'teardownListeners',
    value: function teardownListeners() {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('resize', this.onWindowResize);
    }
  }, {
    key: 'getRatio',
    value: function getRatio() {
      return this.image.nativeSize.width / this.state.domWidth;
    }
  }, {
    key: 'toNativeMetrics',
    value: function toNativeMetrics(_ref2) {
      var x = _ref2.x,
          y = _ref2.y,
          width = _ref2.width,
          height = _ref2.height;

      // convert current in dom dimensions to sizes of the image object
      var ratio = this.getRatio();
      var delta = this.state.deltaHandler;
      return {
        width: width * ratio,
        height: height * ratio,
        x: x * ratio,
        y: y * ratio
      };
    }
  }, {
    key: 'getImageNode',
    value: function getImageNode() {
      return this.image;
    }
  }, {
    key: 'imageDomSize',
    value: function imageDomSize() {
      var imgNode = this.getImageNode();
      var cs = window.getComputedStyle(imgNode);
      var width = parseInt(cs.getPropertyValue('width').slice(0, -2), 10);
      var height = parseInt(cs.getPropertyValue('height').slice(0, -2), 10);
      return { width: width, height: height };
    }
  }, {
    key: 'render',
    value: function render() {
      var containerWidth = this.state.domWidth;
      var containerHeight = this.state.domHeight;
      return _react2.default.createElement(
        'div',
        {
          onDrag: this.onDrag,
          onMouseDown: this.onMouseDown,

          style: _extends({
            position: 'relative',
            height: 0,
            paddingBottom: containerHeight / containerWidth * 100 + '%'
          }, this.props.style)
        },
        this.props.children,
        _react2.default.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1
            } },
          _react2.default.createElement(_Rect2.default, {
            canvasWidth: containerWidth,
            canvasHeight: containerHeight,
            width: this.state.width,
            height: this.state.height,
            x: this.state.x,
            y: this.state.y,
            borderColor: this.props.borderColor,
            handlerSize: this.props.handlerSize,
            pixelRatio: this.state.pixelRatio
          })
        ),
        _react2.default.createElement('img', {
          ref: this.setImageRef,
          onLoad: this.onImageLoad,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            maxWidth: '100%'
          },
          src: this.props.src })
      );
    }
  }]);

  return Cropper;
}(_react.Component);

Cropper.propTypes = {
  src: _propTypes2.default.string.isRequired,
  minCropWidth: _propTypes2.default.number,
  maxCropWidth: _propTypes2.default.number,
  borderColor: _propTypes2.default.string,
  aspectRatio: _propTypes2.default.number,
  style: _propTypes2.default.object,
  start: _propTypes2.default.array,
  startChange: _propTypes2.default.bool,
  isLoading: _propTypes2.default.bool,
  onCrop: _propTypes2.default.func,
  onCropEnd: _propTypes2.default.func
};
Cropper.defaultProps = {
  minCropWidth: 0,
  minCropHeight: 0,
  borderColor: '#FF4136', // red
  handlerSize: 20,
  start: null,
  style: {}
};
exports.default = Cropper;