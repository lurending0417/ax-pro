var process=global.process;
module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1542594028804, function(require, module, exports) {
'use strict';

exports.__esModule = true;

var _persistReducer = require('./persistReducer');

Object.defineProperty(exports, 'persistReducer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_persistReducer).default;
  }
});

var _persistCombineReducers = require('./persistCombineReducers');

Object.defineProperty(exports, 'persistCombineReducers', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_persistCombineReducers).default;
  }
});

var _persistStore = require('./persistStore');

Object.defineProperty(exports, 'persistStore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_persistStore).default;
  }
});

var _createMigrate = require('./createMigrate');

Object.defineProperty(exports, 'createMigrate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createMigrate).default;
  }
});

var _createTransform = require('./createTransform');

Object.defineProperty(exports, 'createTransform', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createTransform).default;
  }
});

var _getStoredState = require('./getStoredState');

Object.defineProperty(exports, 'getStoredState', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getStoredState).default;
  }
});

var _createPersistoid = require('./createPersistoid');

Object.defineProperty(exports, 'createPersistoid', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createPersistoid).default;
  }
});

var _purgeStoredState = require('./purgeStoredState');

Object.defineProperty(exports, 'purgeStoredState', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_purgeStoredState).default;
  }
});

var _constants = require('./constants');

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
}, function(modId) {var map = {"./persistReducer":1542594028805,"./persistCombineReducers":1542594028811,"./persistStore":1542594028813,"./createMigrate":1542594028814,"./createTransform":1542594028815,"./getStoredState":1542594028809,"./createPersistoid":1542594028808,"./purgeStoredState":1542594028810,"./constants":1542594028806}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028805, function(require, module, exports) {
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = persistReducer;

var _constants = require('./constants');

var _autoMergeLevel = require('./stateReconciler/autoMergeLevel1');

var _autoMergeLevel2 = _interopRequireDefault(_autoMergeLevel);

var _createPersistoid = require('./createPersistoid');

var _createPersistoid2 = _interopRequireDefault(_createPersistoid);

var _getStoredState = require('./getStoredState');

var _getStoredState2 = _interopRequireDefault(_getStoredState);

var _purgeStoredState = require('./purgeStoredState');

var _purgeStoredState2 = _interopRequireDefault(_purgeStoredState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DEFAULT_TIMEOUT = 5000;
/*
  @TODO add validation / handling for:
  - persisting a reducer which has nested _persist
  - handling actions that fire before reydrate is called
*/
function persistReducer(config, baseReducer) {
  if (process.env.NODE_ENV !== 'production') {
    if (!config) throw new Error('config is required for persistReducer');
    if (!config.key) throw new Error('key is required in persistor config');
    if (!config.storage) throw new Error("redux-persist: config.storage is required. Try using one of the provided storage engines `import storage from 'redux-persist/lib/storage'`");
  }

  var version = config.version !== undefined ? config.version : _constants.DEFAULT_VERSION;
  var debug = config.debug || false;
  var stateReconciler = config.stateReconciler === undefined ? _autoMergeLevel2.default : config.stateReconciler;
  var getStoredState = config.getStoredState || _getStoredState2.default;
  var timeout = config.timeout !== undefined ? config.timeout : DEFAULT_TIMEOUT;
  var _persistoid = null;
  var _purge = false;
  var _paused = true;
  var conditionalUpdate = function conditionalUpdate(state) {
    // update the persistoid only if we are rehydrated and not paused
    state._persist.rehydrated && _persistoid && !_paused && _persistoid.update(state);
    return state;
  };

  return function (state, action) {
    var _ref = state || {},
        _persist = _ref._persist,
        rest = _objectWithoutProperties(_ref, ['_persist']);

    var restState = rest;

    if (action.type === _constants.PERSIST) {
      var _sealed = false;
      var _rehydrate = function _rehydrate(payload, err) {
        // dev warning if we are already sealed
        if (process.env.NODE_ENV !== 'production' && _sealed) console.error('redux-persist: rehydrate for "' + config.key + '" called after timeout.', payload, err);

        // only rehydrate if we are not already sealed
        if (!_sealed) {
          action.rehydrate(config.key, payload, err);
          _sealed = true;
        }
      };
      timeout && setTimeout(function () {
        !_sealed && _rehydrate(undefined, new Error('redux-persist: persist timed out for persist key "' + config.key + '"'));
      }, timeout);

      // @NOTE PERSIST resumes if paused.
      _paused = false;

      // @NOTE only ever create persistoid once, ensure we call it at least once, even if _persist has already been set
      if (!_persistoid) _persistoid = (0, _createPersistoid2.default)(config);

      // @NOTE PERSIST can be called multiple times, noop after the first
      if (_persist) return state;
      if (typeof action.rehydrate !== 'function' || typeof action.register !== 'function') throw new Error('redux-persist: either rehydrate or register is not a function on the PERSIST action. This can happen if the action is being replayed. This is an unexplored use case, please open an issue and we will figure out a resolution.');

      action.register(config.key);

      getStoredState(config).then(function (restoredState) {
        var migrate = config.migrate || function (s, v) {
          return Promise.resolve(s);
        };
        migrate(restoredState, version).then(function (migratedState) {
          _rehydrate(migratedState);
        }, function (migrateErr) {
          if (process.env.NODE_ENV !== 'production' && migrateErr) console.error('redux-persist: migration error', migrateErr);
          _rehydrate(undefined, migrateErr);
        });
      }, function (err) {
        _rehydrate(undefined, err);
      });

      return _extends({}, baseReducer(restState, action), {
        _persist: { version: version, rehydrated: false }
      });
    } else if (action.type === _constants.PURGE) {
      _purge = true;
      action.result((0, _purgeStoredState2.default)(config));
      return _extends({}, baseReducer(restState, action), {
        _persist: _persist
      });
    } else if (action.type === _constants.FLUSH) {
      action.result(_persistoid && _persistoid.flush());
      return _extends({}, baseReducer(restState, action), {
        _persist: _persist
      });
    } else if (action.type === _constants.PAUSE) {
      _paused = true;
    } else if (action.type === _constants.REHYDRATE) {
      // noop on restState if purging
      if (_purge) return _extends({}, restState, {
        _persist: _extends({}, _persist, { rehydrated: true })

        // @NOTE if key does not match, will continue to default else below
      });if (action.key === config.key) {
        var reducedState = baseReducer(restState, action);
        var inboundState = action.payload;
        // only reconcile state if stateReconciler and inboundState are both defined
        var reconciledRest = stateReconciler !== false && inboundState !== undefined ? stateReconciler(inboundState, state, reducedState, config) : reducedState;

        var _newState = _extends({}, reconciledRest, {
          _persist: _extends({}, _persist, { rehydrated: true })
        });
        return conditionalUpdate(_newState);
      }
    }

    // if we have not already handled PERSIST, straight passthrough
    if (!_persist) return baseReducer(state, action);

    // run base reducer:
    // is state modified ? return original : return updated
    var newState = baseReducer(restState, action);
    if (newState === restState) return state;else {
      newState._persist = _persist;
      return conditionalUpdate(newState);
    }
  };
}
}, function(modId) { var map = {"./constants":1542594028806,"./stateReconciler/autoMergeLevel1":1542594028807,"./createPersistoid":1542594028808,"./getStoredState":1542594028809,"./purgeStoredState":1542594028810}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028806, function(require, module, exports) {
'use strict';

exports.__esModule = true;
var KEY_PREFIX = exports.KEY_PREFIX = 'persist:';
var FLUSH = exports.FLUSH = 'persist/FLUSH';
var REHYDRATE = exports.REHYDRATE = 'persist/REHYDRATE';
var PAUSE = exports.PAUSE = 'persist/PAUSE';
var PERSIST = exports.PERSIST = 'persist/PERSIST';
var PURGE = exports.PURGE = 'persist/PURGE';
var REGISTER = exports.REGISTER = 'persist/REGISTER';
var DEFAULT_VERSION = exports.DEFAULT_VERSION = -1;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028807, function(require, module, exports) {
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = autoMergeLevel1;
function autoMergeLevel1(inboundState, originalState, reducedState, _ref) {
  var debug = _ref.debug;

  var newState = _extends({}, reducedState);
  // only rehydrate if inboundState exists and is an object
  if (inboundState && (typeof inboundState === 'undefined' ? 'undefined' : _typeof(inboundState)) === 'object') {
    Object.keys(inboundState).forEach(function (key) {
      // ignore _persist data
      if (key === '_persist') return;
      // if reducer modifies substate, skip auto rehydration
      if (originalState[key] !== reducedState[key]) {
        if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist/stateReconciler: sub state for key `%s` modified, skipping.', key);
        return;
      }
      // otherwise hard set the new value
      newState[key] = inboundState[key];
    });
  }

  if (process.env.NODE_ENV !== 'production' && debug && inboundState && (typeof inboundState === 'undefined' ? 'undefined' : _typeof(inboundState)) === 'object') console.log('redux-persist/stateReconciler: rehydrated keys \'' + Object.keys(inboundState).join(', ') + '\'');

  return newState;
}

/*
  autoMergeLevel1: 
    - merges 1 level of substate
    - skips substate if already modified
*/
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028808, function(require, module, exports) {
'use strict';

exports.__esModule = true;
exports.default = createPersistoid;

var _constants = require('./constants');

// @TODO remove once flow < 0.63 support is no longer required.

function createPersistoid(config) {
  // defaults
  var blacklist = config.blacklist || null;
  var whitelist = config.whitelist || null;
  var transforms = config.transforms || [];
  var throttle = config.throttle || 0;
  var storageKey = '' + (config.keyPrefix !== undefined ? config.keyPrefix : _constants.KEY_PREFIX) + config.key;
  var storage = config.storage;
  var serialize = config.serialize === false ? function (x) {
    return x;
  } : defaultSerialize;

  // initialize stateful values
  var lastState = {};
  var stagedState = {};
  var keysToProcess = [];
  var timeIterator = null;
  var writePromise = null;

  var update = function update(state) {
    // add any changed keys to the queue
    Object.keys(state).forEach(function (key) {
      if (!passWhitelistBlacklist(key)) return; // is keyspace ignored? noop
      if (lastState[key] === state[key]) return; // value unchanged? noop
      if (keysToProcess.indexOf(key) !== -1) return; // is key already queued? noop
      keysToProcess.push(key); // add key to queue
    });

    //if any key is missing in the new state which was present in the lastState,
    //add it for processing too
    Object.keys(lastState).forEach(function (key) {
      if (state[key] === undefined) {
        keysToProcess.push(key);
      }
    });

    // start the time iterator if not running (read: throttle)
    if (timeIterator === null) {
      timeIterator = setInterval(processNextKey, throttle);
    }

    lastState = state;
  };

  function processNextKey() {
    if (keysToProcess.length === 0) {
      if (timeIterator) clearInterval(timeIterator);
      timeIterator = null;
      return;
    }

    var key = keysToProcess.shift();
    var endState = transforms.reduce(function (subState, transformer) {
      return transformer.in(subState, key, lastState);
    }, lastState[key]);

    if (endState !== undefined) {
      try {
        stagedState[key] = serialize(endState);
      } catch (err) {
        console.error('redux-persist/createPersistoid: error serializing state', err);
      }
    } else {
      //if the endState is undefined, no need to persist the existing serialized content
      delete stagedState[key];
    }

    if (keysToProcess.length === 0) {
      writeStagedState();
    }
  }

  function writeStagedState() {
    // cleanup any removed keys just before write.
    Object.keys(stagedState).forEach(function (key) {
      if (lastState[key] === undefined) {
        delete stagedState[key];
      }
    });

    writePromise = storage.setItem(storageKey, serialize(stagedState)).catch(onWriteFail);
  }

  function passWhitelistBlacklist(key) {
    if (whitelist && whitelist.indexOf(key) === -1 && key !== '_persist') return false;
    if (blacklist && blacklist.indexOf(key) !== -1) return false;
    return true;
  }

  function onWriteFail(err) {
    // @TODO add fail handlers (typically storage full)
    if (err && process.env.NODE_ENV !== 'production') {
      console.error('Error storing data', err);
    }
  }

  var flush = function flush() {
    while (keysToProcess.length !== 0) {
      processNextKey();
    }
    return writePromise || Promise.resolve();
  };

  // return `persistoid`
  return {
    update: update,
    flush: flush
  };
}

// @NOTE in the future this may be exposed via config


function defaultSerialize(data) {
  return JSON.stringify(data);
}
}, function(modId) { var map = {"./constants":1542594028806}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028809, function(require, module, exports) {
'use strict';

exports.__esModule = true;
exports.default = getStoredState;

var _constants = require('./constants');

function getStoredState(config) {
  var transforms = config.transforms || [];
  var storageKey = '' + (config.keyPrefix !== undefined ? config.keyPrefix : _constants.KEY_PREFIX) + config.key;
  var storage = config.storage;
  var debug = config.debug;
  var deserialize = config.serialize === false ? function (x) {
    return x;
  } : defaultDeserialize;
  return storage.getItem(storageKey).then(function (serialized) {
    if (!serialized) return undefined;else {
      try {
        var state = {};
        var rawState = deserialize(serialized);
        Object.keys(rawState).forEach(function (key) {
          state[key] = transforms.reduceRight(function (subState, transformer) {
            return transformer.out(subState, key, rawState);
          }, deserialize(rawState[key]));
        });
        return state;
      } catch (err) {
        if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist/getStoredState: Error restoring data ' + serialized, err);
        throw err;
      }
    }
  });
}

function defaultDeserialize(serial) {
  return JSON.parse(serial);
}
}, function(modId) { var map = {"./constants":1542594028806}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028810, function(require, module, exports) {
'use strict';

exports.__esModule = true;
exports.default = purgeStoredState;

var _constants = require('./constants');

function purgeStoredState(config) {
  var storage = config.storage;
  var storageKey = '' + (config.keyPrefix !== undefined ? config.keyPrefix : _constants.KEY_PREFIX) + config.key;
  return storage.removeItem(storageKey, warnIfRemoveError);
}

function warnIfRemoveError(err) {
  if (err && process.env.NODE_ENV !== 'production') {
    console.error('redux-persist/purgeStoredState: Error purging data stored state', err);
  }
}
}, function(modId) { var map = {"./constants":1542594028806}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028811, function(require, module, exports) {
'use strict';

exports.__esModule = true;
exports.default = persistCombineReducers;

var _redux = require('redux');

var _persistReducer = require('./persistReducer');

var _persistReducer2 = _interopRequireDefault(_persistReducer);

var _autoMergeLevel = require('./stateReconciler/autoMergeLevel2');

var _autoMergeLevel2 = _interopRequireDefault(_autoMergeLevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// combineReducers + persistReducer with stateReconciler defaulted to autoMergeLevel2
function persistCombineReducers(config, reducers) {
  config.stateReconciler = config.stateReconciler === undefined ? _autoMergeLevel2.default : config.stateReconciler;
  return (0, _persistReducer2.default)(config, (0, _redux.combineReducers)(reducers));
}
}, function(modId) { var map = {"./persistReducer":1542594028805,"./stateReconciler/autoMergeLevel2":1542594028812}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028812, function(require, module, exports) {
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = autoMergeLevel2;
function autoMergeLevel2(inboundState, originalState, reducedState, _ref) {
  var debug = _ref.debug;

  var newState = _extends({}, reducedState);
  // only rehydrate if inboundState exists and is an object
  if (inboundState && (typeof inboundState === 'undefined' ? 'undefined' : _typeof(inboundState)) === 'object') {
    Object.keys(inboundState).forEach(function (key) {
      // ignore _persist data
      if (key === '_persist') return;
      // if reducer modifies substate, skip auto rehydration
      if (originalState[key] !== reducedState[key]) {
        if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist/stateReconciler: sub state for key `%s` modified, skipping.', key);
        return;
      }
      if (isPlainEnoughObject(reducedState[key])) {
        // if object is plain enough shallow merge the new values (hence "Level2")
        newState[key] = _extends({}, newState[key], inboundState[key]);
        return;
      }
      // otherwise hard set
      newState[key] = inboundState[key];
    });
  }

  if (process.env.NODE_ENV !== 'production' && debug && inboundState && (typeof inboundState === 'undefined' ? 'undefined' : _typeof(inboundState)) === 'object') console.log('redux-persist/stateReconciler: rehydrated keys \'' + Object.keys(inboundState).join(', ') + '\'');

  return newState;
}

/*
  autoMergeLevel2: 
    - merges 2 level of substate
    - skips substate if already modified
    - this is essentially redux-perist v4 behavior
*/

function isPlainEnoughObject(o) {
  return o !== null && !Array.isArray(o) && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028813, function(require, module, exports) {
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = persistStore;

var _redux = require('redux');

var _persistReducer = require('./persistReducer');

var _persistReducer2 = _interopRequireDefault(_persistReducer);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  registry: [],
  bootstrapped: false
};

var persistorReducer = function persistorReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _constants.REGISTER:
      return _extends({}, state, { registry: [].concat(_toConsumableArray(state.registry), [action.key]) });
    case _constants.REHYDRATE:
      var firstIndex = state.registry.indexOf(action.key);
      var registry = [].concat(_toConsumableArray(state.registry));
      registry.splice(firstIndex, 1);
      return _extends({}, state, { registry: registry, bootstrapped: registry.length === 0 });
    default:
      return state;
  }
};

function persistStore(store, options, cb) {
  // help catch incorrect usage of passing PersistConfig in as PersistorOptions
  if (process.env.NODE_ENV !== 'production') {
    var optionsToTest = options || {};
    var bannedKeys = ['blacklist', 'whitelist', 'transforms', 'storage', 'keyPrefix', 'migrate'];
    bannedKeys.forEach(function (k) {
      if (!!optionsToTest[k]) console.error('redux-persist: invalid option passed to persistStore: "' + k + '". You may be incorrectly passing persistConfig into persistStore, whereas it should be passed into persistReducer.');
    });
  }
  var boostrappedCb = cb || false;

  var _pStore = (0, _redux.createStore)(persistorReducer, initialState, options ? options.enhancer : undefined);
  var register = function register(key) {
    _pStore.dispatch({
      type: _constants.REGISTER,
      key: key
    });
  };

  var rehydrate = function rehydrate(key, payload, err) {
    var rehydrateAction = {
      type: _constants.REHYDRATE,
      payload: payload,
      err: err,
      key: key
      // dispatch to `store` to rehydrate and `persistor` to track result
    };store.dispatch(rehydrateAction);
    _pStore.dispatch(rehydrateAction);
    if (boostrappedCb && persistor.getState().bootstrapped) {
      boostrappedCb();
      boostrappedCb = false;
    }
  };

  var persistor = _extends({}, _pStore, {
    purge: function purge() {
      var results = [];
      store.dispatch({
        type: _constants.PURGE,
        result: function result(purgeResult) {
          results.push(purgeResult);
        }
      });
      return Promise.all(results);
    },
    flush: function flush() {
      var results = [];
      store.dispatch({
        type: _constants.FLUSH,
        result: function result(flushResult) {
          results.push(flushResult);
        }
      });
      return Promise.all(results);
    },
    pause: function pause() {
      store.dispatch({
        type: _constants.PAUSE
      });
    },
    persist: function persist() {
      store.dispatch({ type: _constants.PERSIST, register: register, rehydrate: rehydrate });
    }
  });

  persistor.persist();

  return persistor;
}
}, function(modId) { var map = {"./persistReducer":1542594028805,"./constants":1542594028806}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028814, function(require, module, exports) {
'use strict';

exports.__esModule = true;
exports.default = createMigrate;

var _constants = require('./constants');

function createMigrate(migrations, config) {
  var _ref = config || {},
      debug = _ref.debug;

  return function (state, currentVersion) {
    if (!state) {
      if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist: no inbound state, skipping migration');
      return Promise.resolve(undefined);
    }

    var inboundVersion = state._persist && state._persist.version !== undefined ? state._persist.version : _constants.DEFAULT_VERSION;
    if (inboundVersion === currentVersion) {
      if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist: versions match, noop migration');
      return Promise.resolve(state);
    }
    if (inboundVersion > currentVersion) {
      if (process.env.NODE_ENV !== 'production') console.error('redux-persist: downgrading version is not supported');
      return Promise.resolve(state);
    }

    var migrationKeys = Object.keys(migrations).map(function (ver) {
      return parseInt(ver);
    }).filter(function (key) {
      return currentVersion >= key && key > inboundVersion;
    }).sort(function (a, b) {
      return a - b;
    });

    if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist: migrationKeys', migrationKeys);
    try {
      var migratedState = migrationKeys.reduce(function (state, versionKey) {
        if (process.env.NODE_ENV !== 'production' && debug) console.log('redux-persist: running migration for versionKey', versionKey);
        return migrations[versionKey](state);
      }, state);
      return Promise.resolve(migratedState);
    } catch (err) {
      return Promise.reject(err);
    }
  };
}
}, function(modId) { var map = {"./constants":1542594028806}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1542594028815, function(require, module, exports) {
"use strict";

exports.__esModule = true;
exports.default = createTransform;
function createTransform(
// @NOTE inbound: transform state coming from redux on its way to being serialized and stored
inbound,
// @NOTE outbound: transform state coming from storage, on its way to be rehydrated into redux
outbound) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var whitelist = config.whitelist || null;
  var blacklist = config.blacklist || null;

  function whitelistBlacklistCheck(key) {
    if (whitelist && whitelist.indexOf(key) === -1) return true;
    if (blacklist && blacklist.indexOf(key) !== -1) return true;
    return false;
  }

  return {
    in: function _in(state, key, fullState) {
      return !whitelistBlacklistCheck(key) && inbound ? inbound(state, key, fullState) : state;
    },
    out: function out(state, key, fullState) {
      return !whitelistBlacklistCheck(key) && outbound ? outbound(state, key, fullState) : state;
    }
  };
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1542594028804);
})()
//# sourceMappingURL=index.js.map