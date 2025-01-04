"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _react2 = require("@vercel/analytics/react");
var _DynamicBackground = _interopRequireDefault(require("./components/DynamicBackground.js"));
var _SearchParfums = _interopRequireDefault(require("./components/SearchParfums.js"));
require("./App.css");
require("./index.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Importez le nouveau composant

function App() {
  return /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "App"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Routes, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/",
    element: /*#__PURE__*/_react.default.createElement(_DynamicBackground.default, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/search",
    element: /*#__PURE__*/_react.default.createElement(_SearchParfums.default, null)
  }), " "), /*#__PURE__*/_react.default.createElement(_react2.Analytics, null)));
}
var _default = exports.default = App;
