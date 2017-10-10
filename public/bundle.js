/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _game = __webpack_require__(1);

var createScene = function createScene() {
  var canvas = document.getElementById("render-canvas");
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("camera1", 5, 5, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  window.addEventListener('resize', function () {
    engine.resize();
  });
  engine.runRenderLoop(function () {
    scene.render();
  });
  return scene;
};

var startGame = function startGame() {
  var scene = createScene();
  window.scene = scene;
  (0, _game.createDemoGame)(scene);
  //const tank_mesh = new sand_tank.Cube_001("tank1",scene, "");
};
document.addEventListener("DOMContentLoaded", startGame);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = exports.createDemoGame = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arena = __webpack_require__(2);

var _arena2 = _interopRequireDefault(_arena);

var _player = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createDemoGame = exports.createDemoGame = function createDemoGame(scene) {
  BABYLON.SceneLoader.ImportMesh("Cube.001", "models/tanks/sand_tank/", "sand_tank.babylon", scene, function (newMeshes) {
    var tank1 = newMeshes[0];
    var tank2 = tank1.createInstance("tank2");
    var arena = new _arena2.default(scene);
    var Player1 = new _player.LocalPlayer(tank1, arena);
    var Player2 = new _player.DemoPlayer(tank2);

    var game = new Game(scene, [Player1, Player2], arena);

    game.startGame();
  });
};

var Game = exports.Game = function () {
  function Game(scene, players, arena) {
    _classCallCheck(this, Game);

    this.players = players;
    this.currentPlayerIdx = 0;
    this.myPlayerIdx = 0;
    this.arena = arena;
    this.receiveMovePosition = this.receiveMovePosition.bind(this);
    this.receiveMoveType = this.receiveMoveType.bind(this);
    this.initialPositionTanks();
  }

  _createClass(Game, [{
    key: "initialPositionTanks",
    value: function initialPositionTanks() {
      var midX = Math.floor(this.arena.ground.cellCount / 2);
      var midZ = Math.floor(this.arena.ground.cellCount / 4);
      var globalCoordinates = this.arena.ground.cellIndicesToGlobalCoordinates([midX, midZ]);

      this.players[this.myPlayerIdx].tank.position = globalCoordinates;

      var otherPlayerIdx = this.myPlayerIdx === 0 ? 1 : 0;
      var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI);
      this.players[otherPlayerIdx].tank.position = BABYLON.Vector3.TransformCoordinates(globalCoordinates, matrix);
    }
  }, {
    key: "startGame",
    value: function startGame() {
      this.startListeningForMoveOptions();
    }
  }, {
    key: "startListeningForMoveOptions",
    value: function startListeningForMoveOptions() {
      this.players[this.currentPlayerIdx].startListeningForMoveOptions(this.receiveMoveType);
    }
  }, {
    key: "stopListeningForMoveOptions",
    value: function stopListeningForMoveOptions() {}
  }, {
    key: "startListeningForPosition",
    value: function startListeningForPosition() {
      this.players[this.currentPlayerIdx].startListeningForPosition(this.receiveMovePosition);
    }
  }, {
    key: "receiveMoveType",
    value: function receiveMoveType(type) {
      switch (type) {
        case "position":
          this.startListeningForPosition();
          break;
      }
    }
  }, {
    key: "receiveMovePosition",
    value: function receiveMovePosition(position) {
      this.players[this.currentPlayerIdx].tank.position = position;
      this.switchPlayer();
      this.startListeningForMoveOptions();
    }
  }, {
    key: "startListeningForTrajectory",
    value: function startListeningForTrajectory() {}
  }, {
    key: "stopListeningForTrajectory",
    value: function stopListeningForTrajectory() {}
  }, {
    key: "switchPlayer",
    value: function switchPlayer() {
      if (++this.currentPlayerIdx > this.players.length - 1) {
        this.currentPlayerIdx = 0;
      }
    }
  }]);

  return Game;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ground = __webpack_require__(3);

var _ground2 = _interopRequireDefault(_ground);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_WALL_THICKNESS = 1;
var DEFAULT_CELL_SIZE = 1.5;
var DEFAULT_CELL_COUNT = 8;
var DEFAULT_WALL_HEIGHT = 3;
var DEFAULT_WALL_WIDTH = 0.6;

var Arena = function Arena(scene) {
  var cellSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CELL_SIZE;
  var cellCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_CELL_COUNT;
  var wallThickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_WALL_THICKNESS;
  var wallHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : DEFAULT_WALL_HEIGHT;
  var wallWidth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : DEFAULT_WALL_WIDTH;

  _classCallCheck(this, Arena);

  this.ground = new _ground2.default(scene, cellSize, cellCount, wallThickness);
  var groundWidth = this.ground.getGroundWidth();
  this._wallMesh = new BABYLON.Mesh.CreateBox("centerWall", groundWidth, scene);
  this._wallMesh.scaling.z = wallThickness / groundWidth;
  this._wallMesh.scaling.y = wallHeight / groundWidth;
  this._wallMesh.scaling.x = wallWidth;
  this._wallMesh.position.y += wallHeight / 2;
  window.wallMesh = this._wallMesh;
};

exports.default = Arena;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cursor = __webpack_require__(4);

var _cursor2 = _interopRequireDefault(_cursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ground = function () {
  function Ground(scene, cellSize, cellCount, wallThickness) {
    _classCallCheck(this, Ground);

    this.scene = scene;
    this.cellSize = cellSize;
    this.cellCount = cellCount;
    this.wallThickness = wallThickness;
    this.mesh = this._createGroundMesh();
    this._handleConfirmPosition = this._handleConfirmPosition.bind(this);
    this._handleListeningForPosition = this._handleListeningForPosition.bind(this);
  }

  _createClass(Ground, [{
    key: "_createGroundMesh",
    value: function _createGroundMesh() {
      return BABYLON.Mesh.CreateGround("ground", this.cellSize * this.cellCount, this.cellSize * this.cellCount + this.wallThickness, 2, this.scene);
    }
  }, {
    key: "startListeningForPosition",
    value: function startListeningForPosition(onDoneCallback) {
      document.getElementById('render-canvas').addEventListener("mousemove", this._handleListeningForPosition);
      document.getElementById("render-canvas").onclick = this._handleConfirmPosition(onDoneCallback);
    }
  }, {
    key: "_getCellIndices",
    value: function _getCellIndices(globalCoordinates) {
      var xIndex = Math.floor((globalCoordinates.x + this.cellCount * this.cellSize / 2) / this.cellSize);

      var zIndex = Math.floor((globalCoordinates.z + this.wallThickness / 2) / this.cellSize * -1);
      return [xIndex, zIndex];
    }
  }, {
    key: "cellIndicesToGlobalCoordinates",
    value: function cellIndicesToGlobalCoordinates(indices) {
      var x = indices[0] * this.cellSize + this.cellSize / 2 - this.getGroundWidth() / 2;
      var z = -1 * (indices[1] * this.cellSize + this.cellSize / 2 + this.wallThickness / 2);
      return new BABYLON.Vector3(x, 0, z);
    }
  }, {
    key: "getGroundWidth",
    value: function getGroundWidth() {
      return this.cellSize * this.cellCount;
    }
  }, {
    key: "_getCellCenteredCoordinates",
    value: function _getCellCenteredCoordinates(globalCoordinates) {
      var indices = this._getCellIndices(globalCoordinates);
      return this.cellIndicesToGlobalCoordinates(indices);
    }
  }, {
    key: "_createCursor",
    value: function _createCursor() {
      this.cursor = new _cursor2.default(this.scene, this.cellSize);
    }
  }, {
    key: "_handleListeningForPosition",
    value: function _handleListeningForPosition(e) {
      var _this = this;

      if (!this.cursor) {
        this._createCursor();
      }
      var pickResult = this.scene.pick(e.clientX, e.clientY, function (mesh) {
        return _this.mesh.name === mesh.name;
      });
      if (pickResult.hit) {
        var indices = this._getCellIndices(pickResult.pickedPoint);
        if (indices[1] >= 0) {
          this.cursor.setDisplayPosition(this.cellIndicesToGlobalCoordinates(indices));
        }
      }
    }
  }, {
    key: "_handleConfirmPosition",
    value: function _handleConfirmPosition(onDoneCallback) {
      var _this2 = this;

      return function (e) {
        var pickResult = _this2.scene.pick(e.clientX, e.clientY, function (mesh) {
          return _this2.mesh.name === mesh.name;
        });
        if (pickResult.hit) {
          var indices = _this2._getCellIndices(pickResult.pickedPoint);
          if (indices[1] >= 0) {
            _this2.cursor.setDisplayPosition(_this2.cellIndicesToGlobalCoordinates(indices));
            document.getElementById('render-canvas').removeEventListener("mousemove", _this2._handleListeningForPosition);
            document.getElementById('render-canvas').onclick = null;
            var gridPosition = _this2.cursor.gridPosition();
            _this2.cursor.dispose();
            _this2.cursor = null;
            onDoneCallback(gridPosition);
          }
        }
      };
    }
  }]);

  return Ground;
}();

exports.default = Ground;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CURSOR_Y_POSITION = 0.02;

var Cursor = function () {
  function Cursor(scene, size) {
    _classCallCheck(this, Cursor);

    this._displayPosition = new BABYLON.Vector3.Zero();
    this._mesh = new BABYLON.Mesh.CreatePlane("cursor", size, scene);
    this._mesh.material = new BABYLON.StandardMaterial("mat1", scene);
    this._mesh.material.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
    this._mesh.material.alpha = 0.9;
    this._mesh.rotation.x = Math.PI / 2;
  }

  _createClass(Cursor, [{
    key: "setDisplayPosition",
    value: function setDisplayPosition(globalCoordinates) {
      this._mesh.position = globalCoordinates;
      this._mesh.position.y = CURSOR_Y_POSITION;
    }
  }, {
    key: "gridPosition",
    value: function gridPosition() {
      var gridPosition = this._mesh.position.clone();
      gridPosition.y = 0;
      return gridPosition;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this._mesh.dispose();
    }
  }]);

  return Cursor;
}();

exports.default = Cursor;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = exports.Player = function () {
  function Player(tank) {
    _classCallCheck(this, Player);

    this.tank = tank;
  }

  _createClass(Player, [{
    key: "startListeningForMoveOptions",
    value: function startListeningForMoveOptions(onDoneCallback) {
      onDoneCallback("position");
    }
  }]);

  return Player;
}();

var DemoPlayer = exports.DemoPlayer = function (_Player) {
  _inherits(DemoPlayer, _Player);

  function DemoPlayer(tank) {
    _classCallCheck(this, DemoPlayer);

    return _possibleConstructorReturn(this, (DemoPlayer.__proto__ || Object.getPrototypeOf(DemoPlayer)).call(this, tank));
  }

  _createClass(DemoPlayer, [{
    key: "startListeningForPosition",
    value: function startListeningForPosition(onDoneCallback) {
      onDoneCallback(this.tank.position);
    }
  }]);

  return DemoPlayer;
}(Player);

;

var SocketPlayer = exports.SocketPlayer = function (_Player2) {
  _inherits(SocketPlayer, _Player2);

  function SocketPlayer(tank) {
    _classCallCheck(this, SocketPlayer);

    return _possibleConstructorReturn(this, (SocketPlayer.__proto__ || Object.getPrototypeOf(SocketPlayer)).call(this, tank));
  }

  return SocketPlayer;
}(Player);

var LocalPlayer = exports.LocalPlayer = function (_Player3) {
  _inherits(LocalPlayer, _Player3);

  function LocalPlayer(tank, arena) {
    _classCallCheck(this, LocalPlayer);

    var _this3 = _possibleConstructorReturn(this, (LocalPlayer.__proto__ || Object.getPrototypeOf(LocalPlayer)).call(this, tank));

    _this3.arena = arena;
    return _this3;
  }

  _createClass(LocalPlayer, [{
    key: "startListeningForPosition",
    value: function startListeningForPosition(onDoneCallback) {
      this.arena.ground.startListeningForPosition(onDoneCallback);
    }
  }]);

  return LocalPlayer;
}(Player);

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map