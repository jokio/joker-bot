(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./.generated/version.ts":
/*!*******************************!*\
  !*** ./.generated/version.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
// IMPORTANT: AUTO GENERATED FILE! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
exports.VERSION = {
    "dirty": false,
    "raw": "v6.0-28-g6435d298",
    "hash": "g6435d298",
    "distance": 28,
    "tag": "v6.0",
    "semver": null,
    "suffix": "28-g6435d298",
    "semverString": ""
};


/***/ }),

/***/ "./apps/joker/server-emulator/src/app/startNatsListener.ts":
/*!*****************************************************************!*\
  !*** ./apps/joker/server-emulator/src/app/startNatsListener.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startNatsListener = void 0;
const nats_1 = __webpack_require__(/*! nats */ "nats");
async function startNatsListener(options) {
    const { name, trainingRuntime } = options;
    const natsServer = 'nats://localhost:4222';
    const sc = nats_1.StringCodec();
    const client = await nats_1.connect({ servers: [natsServer] });
    const sub1 = client.subscribe(`${name}.reset`, {
        callback: async (err, msg) => {
            if (err) {
                console.error(err);
                return;
            }
            /**
             * Command format:
             * roomId_gameMode_randomSeed_position
             */
            const dataString = sc.decode(msg.data);
            const parts = dataString.split('_');
            if (parts.length < 4) {
                const errorMessage = `
  Invalid command received: ${dataString}
  please use format: roomId_gameMode_randomSeed_position`;
                console.warn(errorMessage);
                msg.respond(sc.encode(errorMessage));
                return;
            }
            const roomId = parts[0];
            const gameMode = parts[1];
            const dring = parts[2];
            const randomSeed = parts[3] || null;
            const position = parseInt(parts[4], 10);
            const result = await trainingRuntime.reset(roomId, [gameMode, dring].join('_'), randomSeed, position);
            msg.respond(sc.encode(JSON.stringify(result)));
        },
    });
    const sub2 = client.subscribe(`${name}.action`, {
        callback: async (err, msg) => {
            if (err) {
                console.error(err);
                return;
            }
            /**
             * Command format:
             * roomId_actionId
             */
            const dataString = sc.decode(msg.data);
            const parts = dataString.split('_');
            if (parts.length < 2) {
                console.warn('Invalid command received', dataString, 'please use format: roomId_actionId');
                return;
            }
            const roomId = parts[0];
            const actionId = parseInt(parts[1], 10);
            if (!roomId) {
                console.warn('Invalid roomId');
                return;
            }
            if (actionId == null || actionId > 70 || actionId < 0) {
                console.warn('Invalid actionId', parts[1]);
                return;
            }
            const result = await trainingRuntime.selectAction(roomId, actionId);
            msg.respond(sc.encode(JSON.stringify(result)));
        },
    });
    console.log('✅ Listening nats commands at:     ', natsServer);
    console.log(`
  Registered nats routes:
  * ${name}.reset
  * ${name}.action
    `);
    return async () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
        await client.close();
    };
}
exports.startNatsListener = startNatsListener;


/***/ }),

/***/ "./apps/joker/server-emulator/src/app/startRestServer.ts":
/*!***************************************************************!*\
  !*** ./apps/joker/server-emulator/src/app/startRestServer.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startRestServer = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const express = __webpack_require__(/*! express */ "express");
const environment_1 = __webpack_require__(/*! ../environments/environment */ "./apps/joker/server-emulator/src/environments/environment.ts");
const startTcpServer_1 = __webpack_require__(/*! ./startTcpServer */ "./apps/joker/server-emulator/src/app/startTcpServer.ts");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const http = __webpack_require__(/*! http */ "http");
http.globalAgent.maxSockets = 1000;
function startRestServer(trainingRuntime, simulationRuntime) {
    const app = express();
    const startedAt = new Date();
    app.use((_, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    app.use(bodyParser.json({ limit: '50mb' }));
    app.set('json spaces', 3);
    app.get('/', (_, res) => res.json({
        name: 'Joker Server - Simulator',
        status: 'Online',
        author: 'Jok Entertainers Inc.',
        version: environment_1.environment.version,
        startedAt,
        docs: {
            process1: {
                description: 'Bot Training Environment',
                api: {
                    allActions: 'GET /game/all-actions',
                    registerBots: 'GET /game/register-bots',
                    timerData: 'GET /game/timer',
                    resetTimer: 'GET /game/reset-timer',
                    reset: 'GET /game/:refId/reset',
                    action: 'GET /game/:refId/action/:actionIndex',
                    state: 'GET /game/:refId/state',
                },
            },
            process2: {
                description: 'Games Simulation (Bot vs Bots)',
                api: {
                    url: 'GET /simulation',
                },
            },
            dataStructures: 'https://gist.github.com/playerx/4d168b5ceed28d357ec1c32b439c8c45',
            botExample: 'https://gist.github.com/playerx/e141ad0671f505ed6a6d9691c4213d7a',
            gameModes: [
                'STANDARD_200',
                'STANDARD_SPEC',
                'STANDARD_500',
                'STANDARD_1000',
                'STANDARD_200/500',
                'ONLY9_200',
                'ONLY9_SPEC',
                'ONLY9_500',
                'ONLY9_1000',
                'ONLY9_200/500',
                'QUICK_200',
                'QUICK_SPEC',
                'QUICK_500',
                'QUICK_1000',
                'QUICK_200/500',
                'LUCKY_200',
                'LUCKY_SPEC',
                'LUCKY_500',
                'LUCKY_1000',
                'LUCKY_200/500',
                'LUCKY4_200',
                'LUCKY4_SPEC',
                'LUCKY4_500',
                'LUCKY4_1000',
                'LUCKY4_200/500',
            ],
        },
    }));
    app.get('/simulation', async (req, res) => {
        const data = req.query;
        const { botApiUrls: botApiUrlsParam = [], gameMode, gamesCount: gamesCountParam, randomSeed, batchSize: batchSizeParam, } = data;
        try {
            const botApiUrls = Array.isArray(botApiUrlsParam)
                ? botApiUrlsParam
                : [botApiUrlsParam];
            let batchSize = batchSizeParam
                ? parseInt(batchSizeParam.toString(), 10)
                : undefined;
            const gamesCount = parseInt(gamesCountParam.toString(), 10);
            if (!gameMode || !gamesCount) {
                res.json({
                    status: 'Failed',
                    message: 'Please provide gameMode & gamesCount',
                });
                res.end();
                return;
            }
            // make sure there is always 4 bot configured
            const finalBotApiUrls = [
                null,
                null,
                null,
                null,
            ];
            botApiUrls.forEach((x, i) => (finalBotApiUrls[i] = x));
            const result = await simulationRuntime.run({
                botApiUrls: finalBotApiUrls,
                gameMode: gameMode,
                gamesCount,
                batchSize,
                randomSeed: randomSeed,
            });
            console.log('finished processing');
            res.json({
                config: {
                    botApiUrls: finalBotApiUrls,
                    gameMode,
                    gamesCount,
                    batchSize,
                    randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : null,
                },
                ...result,
            });
            res.end();
        }
        catch (err) {
            res.status(500).json({
                status: 'Internal Error',
                message: err.message,
            });
            res.end();
        }
    });
    app.get('/game/all-actions', async (_, res) => {
        const items = new Array(71)
            .fill(0)
            .map((_, i) => `${i} - ${types_1.JokerBotAction[i]}`);
        res.json(items);
        res.end();
    });
    app.get('/game/reset-timer', async (_, res) => {
        trainingRuntime.resetTimer();
        startTcpServer_1.tcpTimer.duration = 0;
        res.json({
            success: true,
        });
        res.end();
    });
    app.get('/game/timer', async (_, res) => {
        res.json({
            duration: trainingRuntime.getTimerDuration(),
            durationWithTcpServerOverhead: startTcpServer_1.tcpTimer.duration,
        });
        res.end();
    });
    app.get('/game/register-bots', (req, res) => {
        const data = req.query;
        const { botApiUrls: botApiUrlsParam = [], reuseBots = false, } = data;
        if (!botApiUrlsParam) {
            res.json({
                status: 'Failed',
                message: 'Please provide botApiUrls',
            });
            res.end();
            return;
        }
        const botApiUrls = Array.isArray(botApiUrlsParam)
            ? botApiUrlsParam
            : [botApiUrlsParam];
        try {
            trainingRuntime.setOpponentBots(botApiUrls, reuseBots);
            res.json({
                botApiUrls,
                reuseBots,
                success: true,
            });
            res.end();
        }
        catch (err) {
            res.json({
                err,
                success: false,
            });
            res.end();
        }
    });
    app.get('/game/:refId/reset', async (req, res) => {
        const refId = req.params.refId;
        const data = req.query;
        const { gameMode, randomSeed, position: positionParam = '1', } = data;
        if (!gameMode) {
            res.json({
                status: 'Failed',
                message: 'Please provide gameMode',
            });
            res.end();
            return;
        }
        const position = parseInt(positionParam, 10);
        if (!position || position < 1 || position > 4) {
            res.json({
                status: 'Failed',
                message: 'Please provide valid position: 1, 2, 3 or 4',
            });
            res.end();
            return;
        }
        try {
            const result = await trainingRuntime.reset(refId, gameMode, randomSeed, position);
            res.json({
                config: {
                    refId: refId !== null && refId !== void 0 ? refId : null,
                    gameMode,
                    randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : null,
                    position,
                },
                ...result,
            });
            res.end();
        }
        catch (err) {
            res.json({
                err,
                success: false,
            });
            res.end();
        }
    });
    app.get('/game/:refId/action/:actionIndex', async (req, res) => {
        const data = req.query;
        const refId = req.params.refId;
        const actionIndexParam = req.params.actionIndex;
        const actionIndex = parseInt(actionIndexParam, 10);
        if (!refId || isNaN(actionIndex) || actionIndex < 0) {
            res.json({
                status: 'Failed',
                message: 'Please provide actionIndex',
            });
            res.end();
            return;
        }
        try {
            const result = await trainingRuntime.selectAction(refId, actionIndex);
            res.json({
                config: {
                    refId: refId !== null && refId !== void 0 ? refId : null,
                    actionIndex,
                },
                ...result,
            });
            res.end();
        }
        catch (err) {
            res.json({
                err,
                success: false,
            });
            res.end();
        }
    });
    app.get('/game/:refId/state', (req, res) => {
        const refId = req.params.refId;
        if (!refId) {
            res.json({
                status: 'Failed',
                message: 'Please provide refId',
            });
            res.end();
            return;
        }
        try {
            const state = trainingRuntime.getState(refId);
            res.json({
                config: {
                    refId: refId !== null && refId !== void 0 ? refId : null,
                },
                state,
            });
            res.end();
        }
        catch (err) {
            res.json({
                err,
                success: false,
            });
            res.end();
        }
    });
    return app;
}
exports.startRestServer = startRestServer;


/***/ }),

/***/ "./apps/joker/server-emulator/src/app/startTcpServer.ts":
/*!**************************************************************!*\
  !*** ./apps/joker/server-emulator/src/app/startTcpServer.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startTcpServer = exports.tcpTimer = void 0;
const node_utils_1 = __webpack_require__(/*! @jok/shared/node-utils */ "./libs/shared/node-utils/src/index.ts");
exports.tcpTimer = {
    duration: 0,
};
function startTcpServer(trainingRuntime) {
    // server
    const server = new node_utils_1.TcpServer(cmds => Promise.all(cmds.map(x => {
        var _a;
        switch (x.type) {
            case 'RESET':
                return trainingRuntime.reset(x.refId, x.gameMode, (_a = x.randomSeed) !== null && _a !== void 0 ? _a : null, x.position);
            case 'ACTION':
                return trainingRuntime.selectAction(x.refId, x.index);
        }
    })));
    return server.init();
}
exports.startTcpServer = startTcpServer;


/***/ }),

/***/ "./apps/joker/server-emulator/src/environments/environment.ts":
/*!********************************************************************!*\
  !*** ./apps/joker/server-emulator/src/environments/environment.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const version_1 = __webpack_require__(/*! @jok/version */ "./.generated/version.ts");
let localOverrides = {};
try {
    localOverrides = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module './environment.local'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).default || {};
}
catch (_a) {
    /* Do nothing */
}
exports.environment = {
    production: false,
    HTTP_SERVER_PORT: 7000,
    TCP_SERVER_PORT: 2222,
    TF_MODE: 'CPU',
    ENCODE_STATE_FILE_PATH: 'assets/encodeState.js',
    ...localOverrides,
    version: version_1.VERSION.raw,
};


/***/ }),

/***/ "./apps/joker/server-emulator/src/main.ts":
/*!************************************************!*\
  !*** ./apps/joker/server-emulator/src/main.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = __webpack_require__(/*! @jok/joker/runtime */ "./libs/joker/runtime/src/index.ts");
const node_utils_1 = __webpack_require__(/*! @jok/shared/node-utils */ "./libs/shared/node-utils/src/index.ts");
const http_1 = __webpack_require__(/*! http */ "http");
const path_1 = __webpack_require__(/*! path */ "path");
const perf_hooks_1 = __webpack_require__(/*! perf_hooks */ "perf_hooks");
const startNatsListener_1 = __webpack_require__(/*! ./app/startNatsListener */ "./apps/joker/server-emulator/src/app/startNatsListener.ts");
const startRestServer_1 = __webpack_require__(/*! ./app/startRestServer */ "./apps/joker/server-emulator/src/app/startRestServer.ts");
const environment_1 = __webpack_require__(/*! ./environments/environment */ "./apps/joker/server-emulator/src/environments/environment.ts");
const onnx = null; // require('onnxjs-node')
const tf = null; // getTensorFlow(<any>environment.TF_MODE ?? null)
const requireFunc = node_utils_1.getRequireFunc();
const trainingRuntime = new runtime_1.TrainingRuntime({
    getTrackTime: perf_hooks_1.performance.now,
    requireFunc,
    onnx,
    pathJoin: path_1.join,
    tf,
    defaultEncodeStateFilePath: environment_1.environment.ENCODE_STATE_FILE_PATH,
    defaultQueueSize: 10,
    defaultQueueTimeout: 0,
});
const simulationRuntime = new runtime_1.SimulationRuntime({
    getTrackTime: perf_hooks_1.performance.now,
    requireFunc,
    onnx,
    pathJoin: path_1.join,
    tf,
    defaultEncodeStateFilePath: environment_1.environment.ENCODE_STATE_FILE_PATH,
    defaultQueueSize: 10,
    defaultQueueTimeout: 0,
});
const app = startRestServer_1.startRestServer(trainingRuntime, simulationRuntime);
const http = new http_1.Server(app);
http.listen({
    host: '0.0.0.0',
    port: environment_1.environment.HTTP_SERVER_PORT,
}, () => console.log('✅ Joker Server simulater started:  http://localhost:' +
    environment_1.environment.HTTP_SERVER_PORT));
// trainingTcpServer.listen(
//   environment.TCP_SERVER_PORT,
//   '127.0.0.1',
//   () => {
//     var address = <net.AddressInfo>trainingTcpServer.address()
//     console.log(
//       '✅ Joker Training TCP Server Started:',
//       `${address.family}: ${address.address}:${address.port}`,
//     )
//   },
// )
startNatsListener_1.startNatsListener({
    name: (_a = process.env.NAME) !== null && _a !== void 0 ? _a : 'server',
    trainingRuntime,
});


/***/ }),

/***/ "./libs/joker/runtime/src/index.ts":
/*!*****************************************!*\
  !*** ./libs/joker/runtime/src/index.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCommand = exports.getJokerPlayerStats = exports.DringgedPlayerLogItem = exports.GameState = exports.allJokerActions = exports.GameStoreData = exports.TrainingResult = void 0;
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./lib/domain/generateActions */ "./libs/joker/runtime/src/lib/domain/generateActions.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/domain/isGameStarted */ "./libs/joker/runtime/src/lib/domain/isGameStarted.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/domain/getGameProgress */ "./libs/joker/runtime/src/lib/domain/getGameProgress.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/runtimes/live.runtime */ "./libs/joker/runtime/src/lib/runtimes/live.runtime.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/runtimes/simulation.runtime */ "./libs/joker/runtime/src/lib/runtimes/simulation.runtime.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/runtimes/training.runtime */ "./libs/joker/runtime/src/lib/runtimes/training.runtime.ts"), exports);
var types_1 = __webpack_require__(/*! ./lib/types */ "./libs/joker/runtime/src/lib/types.ts");
Object.defineProperty(exports, "TrainingResult", { enumerable: true, get: function () { return types_1.TrainingResult; } });
Object.defineProperty(exports, "GameStoreData", { enumerable: true, get: function () { return types_1.GameStoreData; } });
var allActions_1 = __webpack_require__(/*! ./lib/bot/allActions */ "./libs/joker/runtime/src/lib/bot/allActions.ts");
Object.defineProperty(exports, "allJokerActions", { enumerable: true, get: function () { return allActions_1.allFlatActions; } });
var game_state_1 = __webpack_require__(/*! ./lib/game.state */ "./libs/joker/runtime/src/lib/game.state.ts");
Object.defineProperty(exports, "GameState", { enumerable: true, get: function () { return game_state_1.GameState; } });
Object.defineProperty(exports, "DringgedPlayerLogItem", { enumerable: true, get: function () { return game_state_1.DringgedPlayerLogItem; } });
var getJokerPlayerStats_1 = __webpack_require__(/*! ./lib/domain/getJokerPlayerStats */ "./libs/joker/runtime/src/lib/domain/getJokerPlayerStats.ts");
Object.defineProperty(exports, "getJokerPlayerStats", { enumerable: true, get: function () { return getJokerPlayerStats_1.getJokerPlayerStats; } });
var game_command_1 = __webpack_require__(/*! ./lib/game.command */ "./libs/joker/runtime/src/lib/game.command.ts");
Object.defineProperty(exports, "GameCommand", { enumerable: true, get: function () { return game_command_1.GameCommand; } });


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/allActions.ts":
/*!******************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/allActions.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardActionIndex = exports.getAllowedCardIndexes = exports.getAllowedTrumpIndexes = exports.getAllowedBidIndexes = exports.getScopedActionIndex = exports.getActionIndexes = exports.getTotalActionsCount = exports.allActions = exports.allFlatActions = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
// TODO: use this list everywhere
exports.allFlatActions = [
    ['BID', 0],
    ['BID', 1],
    ['BID', 2],
    ['BID', 3],
    ['BID', 4],
    ['BID', 5],
    ['BID', 6],
    ['BID', 7],
    ['BID', 8],
    ['BID', 9],
    ['TRUMP', types_1.CardColor.Hearts],
    ['TRUMP', types_1.CardColor.Diamonds],
    ['TRUMP', types_1.CardColor.Spades],
    ['TRUMP', types_1.CardColor.Clubs],
    ['TRUMP', types_1.CardColor.None],
    ['CARD', [[0, 1]]],
    ['CARD', [[0, 2]]],
    ['CARD', [[0, 3]]],
    ['CARD', [[0, 4]]],
    ['CARD', [[0, 5]]],
    ['CARD', [[0, 6]]],
    ['CARD', [[0, 7]]],
    ['CARD', [[0, 8]]],
    ['CARD', [[1, 1]]],
    ['CARD', [[1, 2]]],
    ['CARD', [[1, 3]]],
    ['CARD', [[1, 4]]],
    ['CARD', [[1, 5]]],
    ['CARD', [[1, 6]]],
    ['CARD', [[1, 7]]],
    ['CARD', [[1, 8]]],
    ['CARD', [[2, 1]]],
    ['CARD', [[2, 2]]],
    ['CARD', [[2, 3]]],
    ['CARD', [[2, 4]]],
    ['CARD', [[2, 5]]],
    ['CARD', [[2, 6]]],
    ['CARD', [[2, 7]]],
    ['CARD', [[2, 8]]],
    ['CARD', [[3, 1]]],
    ['CARD', [[3, 2]]],
    ['CARD', [[3, 3]]],
    ['CARD', [[3, 4]]],
    ['CARD', [[3, 5]]],
    ['CARD', [[3, 6]]],
    ['CARD', [[3, 7]]],
    ['CARD', [[3, 8]]],
    ['CARD', [[0, 0]]],
    ['CARD', [[1, 0]]],
    ['CARD', [[2, 0], { want: true, color: 0 }]],
    ['CARD', [[2, 0], { want: true, color: 1 }]],
    ['CARD', [[2, 0], { want: true, color: 2 }]],
    ['CARD', [[2, 0], { want: true, color: 3 }]],
    ['CARD', [[2, 0], { want: false, color: 0 }]],
    ['CARD', [[2, 0], { want: false, color: 1 }]],
    ['CARD', [[2, 0], { want: false, color: 2 }]],
    ['CARD', [[2, 0], { want: false, color: 3 }]],
    ['CARD', [[2, 0], { want: true, color: null }]],
    ['CARD', [[2, 0], { want: false, color: null }]],
    ['CARD', [[3, 0], { want: true, color: 0 }]],
    ['CARD', [[3, 0], { want: true, color: 1 }]],
    ['CARD', [[3, 0], { want: true, color: 2 }]],
    ['CARD', [[3, 0], { want: true, color: 3 }]],
    ['CARD', [[3, 0], { want: false, color: 0 }]],
    ['CARD', [[3, 0], { want: false, color: 1 }]],
    ['CARD', [[3, 0], { want: false, color: 2 }]],
    ['CARD', [[3, 0], { want: false, color: 3 }]],
    ['CARD', [[3, 0], { want: true, color: null }]],
    ['CARD', [[3, 0], { want: false, color: null }]],
];
exports.allActions = {
    bidActions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    trumpActions: [0, 1, 2, 3, 4],
    cardActions: [
        [[0, 1]],
        [[0, 2]],
        [[0, 3]],
        [[0, 4]],
        [[0, 5]],
        [[0, 6]],
        [[0, 7]],
        [[0, 8]],
        [[1, 1]],
        [[1, 2]],
        [[1, 3]],
        [[1, 4]],
        [[1, 5]],
        [[1, 6]],
        [[1, 7]],
        [[1, 8]],
        [[2, 1]],
        [[2, 2]],
        [[2, 3]],
        [[2, 4]],
        [[2, 5]],
        [[2, 6]],
        [[2, 7]],
        [[2, 8]],
        [[3, 1]],
        [[3, 2]],
        [[3, 3]],
        [[3, 4]],
        [[3, 5]],
        [[3, 6]],
        [[3, 7]],
        [[3, 8]],
        [[0, 0]],
        [[1, 0]],
        [[2, 0], { want: true, color: 0 }],
        [[2, 0], { want: true, color: 1 }],
        [[2, 0], { want: true, color: 2 }],
        [[2, 0], { want: true, color: 3 }],
        [[2, 0], { want: false, color: 0 }],
        [[2, 0], { want: false, color: 1 }],
        [[2, 0], { want: false, color: 2 }],
        [[2, 0], { want: false, color: 3 }],
        [[2, 0], { want: true, color: null }],
        [[2, 0], { want: false, color: null }],
        [[3, 0], { want: true, color: 0 }],
        [[3, 0], { want: true, color: 1 }],
        [[3, 0], { want: true, color: 2 }],
        [[3, 0], { want: true, color: 3 }],
        [[3, 0], { want: false, color: 0 }],
        [[3, 0], { want: false, color: 1 }],
        [[3, 0], { want: false, color: 2 }],
        [[3, 0], { want: false, color: 3 }],
        [[3, 0], { want: true, color: null }],
        [[3, 0], { want: false, color: null }],
    ],
};
const flatActions = exports.allActions.bidActions
    .concat(exports.allActions.trumpActions)
    .concat(exports.allActions.cardActions);
function getTotalActionsCount() {
    return (exports.allActions.bidActions.length +
        exports.allActions.trumpActions.length +
        exports.allActions.cardActions.length);
}
exports.getTotalActionsCount = getTotalActionsCount;
function getActionIndexes(type, actions) {
    let from = 0;
    let to = undefined;
    switch (type) {
        case 'BID':
            to = exports.allActions.bidActions.length + 1;
            return getAllowedBidIndexes(actions);
        case 'TRUMP':
            from = exports.allActions.bidActions.length;
            to = from + exports.allActions.trumpActions.length + 1;
            return getAllowedTrumpIndexes(actions);
        case 'CARD':
            from =
                exports.allActions.bidActions.length + exports.allActions.trumpActions.length;
            return getAllowedCardIndexes(actions);
        default:
            return [];
    }
}
exports.getActionIndexes = getActionIndexes;
function getScopedActionIndex(type, validActions, flatIndex) {
    const action = flatActions[flatIndex];
    switch (type) {
        case 'BID':
        case 'TRUMP':
            return validActions.indexOf(action);
        case 'CARD':
            return getCardActionIndex(validActions, action);
        default:
            throw new Error('INVALID_ACTION_FOR_SCOPED_INDEX');
    }
}
exports.getScopedActionIndex = getScopedActionIndex;
function getAllowedBidIndexes(actions) {
    return actions.map(x => exports.allActions.bidActions.indexOf(x));
}
exports.getAllowedBidIndexes = getAllowedBidIndexes;
function getAllowedTrumpIndexes(actions) {
    return actions.map(x => 10 + exports.allActions.trumpActions.indexOf(x));
}
exports.getAllowedTrumpIndexes = getAllowedTrumpIndexes;
function getAllowedCardIndexes(actions) {
    return actions.map(x => 15 + getCardActionIndex(exports.allActions.cardActions, x));
}
exports.getAllowedCardIndexes = getAllowedCardIndexes;
function getCardActionIndex(validActions, action) {
    return validActions.findIndex(x => Array.isArray(x) &&
        x.length >= 1 &&
        x[0][0] === action[0][0] &&
        x[0][1] === action[0][1] &&
        (!x[1] ||
            (action[1] &&
                x[1].want === action[1].want &&
                x[1].color === action[1].color)));
}
exports.getCardActionIndex = getCardActionIndex;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/batch.ts":
/*!*************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/batch.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchProcessing = void 0;
class BatchProcessing {
    constructor(options) {
        this.options = options;
        this.pending = [];
    }
    process(data) {
        return new Promise((resolve, reject) => {
            this.pending.push({
                data,
                callback: (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (result) {
                        resolve(result);
                    }
                },
            });
            if (this.pending.length >= this.options.minLimit) {
                this.requestProcessing();
                return;
            }
            if (this.options.timeoutInMS) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.requestProcessing(), this.options.timeoutInMS);
            }
        });
    }
    async requestProcessing() {
        clearTimeout(this.timer);
        if (this.isProcessing) {
            return;
        }
        const { maxLimit, getTrackTime } = this.options;
        this.isProcessing = true;
        while (this.pending.length) {
            const requestDatas = maxLimit
                ? this.pending.slice(0, maxLimit)
                : this.pending.slice();
            this.pending = maxLimit ? this.pending.slice(maxLimit) : [];
            if (!requestDatas.length) {
                console.log('OOPS, no items');
                return;
            }
            try {
                const startedAt = getTrackTime();
                const results = await this.doBatchOperation(requestDatas.map(x => x.data));
                let duration = getTrackTime() - startedAt;
                requestDatas.forEach((x, i) => x.callback(null, [
                    results[i],
                    duration / requestDatas.length,
                ]));
            }
            catch (err) {
                console.log('oops batch error', err);
                requestDatas.forEach(x => x.callback(err, null));
            }
        }
        this.isProcessing = false;
    }
}
exports.BatchProcessing = BatchProcessing;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/bot.user.ts":
/*!****************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/bot.user.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidBotActionError = exports.BotUser = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
class BotUser {
    constructor(bot, fallbackBot, getTrackTime) {
        this.bot = bot;
        this.fallbackBot = fallbackBot;
        this.getTrackTime = getTrackTime;
        this.timeInMS = new Map([
            ['BID', { count: 0, time: 0, apiTime: 0, callTime: 0 }],
            ['TRUMP', { count: 0, time: 0, apiTime: 0, callTime: 0 }],
            ['CARD', { count: 0, time: 0, apiTime: 0, callTime: 0 }],
            ['INTERNAL', { count: 0, time: 0, apiTime: 0, callTime: 0 }],
        ]);
    }
    async requestAction(data) {
        var _a;
        const startedAt = this.getTrackTime();
        const type = data.type;
        try {
            const [index, duration] = await this.bot.action(data);
            const callDuration = this.getTrackTime() - startedAt;
            const action = data.actions[index];
            validateResultIndex(index, data.actions);
            const timing = this.timeInMS.get(type);
            if (timing) {
                timing.apiTime += duration;
                timing.callTime += callDuration;
                timing.time += this.getTrackTime() - startedAt;
                timing.count++;
            }
            return action;
        }
        catch (err) {
            console.log('requestAction.err', type, data.actions, (_a = data === null || data === void 0 ? void 0 : data.state) === null || _a === void 0 ? void 0 : _a.refId, err);
            const [index, duration] = this.fallbackBot.action(data);
            const callDuration = this.getTrackTime() - startedAt;
            const action = data.actions[index];
            validateResultIndex(index, data.actions);
            const timing = this.timeInMS.get(type);
            if (timing) {
                timing.apiTime += duration;
                timing.callTime += callDuration;
                timing.time += this.getTrackTime() - startedAt;
                timing.count++;
            }
            return action;
        }
    }
    /**
     * Low level api to avoid encoding state
     * Used in simulation and training
     *
     * NOT USED ANYWHERE ANY MORE
     * just kept
     */
    async requestBatchProcess(item) {
        const startedAt = this.getTrackTime();
        if (!this.bot.batch) {
            throw new utils_1.AppError('BATCH_NOT_SUPPORTED');
        }
        const [index, duration] = await this.bot.batch.process(item);
        const callDuration = this.getTrackTime() - startedAt;
        const timing = this.timeInMS.get('INTERNAL');
        if (timing) {
            timing.apiTime += duration;
            timing.callTime += callDuration;
            timing.time += this.getTrackTime() - startedAt;
            timing.count++;
        }
        return [index, duration];
    }
}
exports.BotUser = BotUser;
function validateResultIndex(index, actions) {
    if (index == undefined) {
        throw new InvalidBotActionError(index);
    }
    if (index < 0 || index >= actions.length) {
        throw new InvalidBotActionError(index);
    }
}
class InvalidBotActionError extends Error {
    constructor(index) {
        super('INVALID_BOT_ACTION: ' + index);
    }
}
exports.InvalidBotActionError = InvalidBotActionError;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/createBot.ts":
/*!*****************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/createBot.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyncBot = exports.createBot = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const randomSync_bot_1 = __webpack_require__(/*! ./factories/randomSync.bot */ "./libs/joker/runtime/src/lib/bot/factories/randomSync.bot.ts");
const simpleSync_bot_1 = __webpack_require__(/*! ./factories/simpleSync.bot */ "./libs/joker/runtime/src/lib/bot/factories/simpleSync.bot.ts");
const tcp_bot_1 = __webpack_require__(/*! ./factories/tcp.bot */ "./libs/joker/runtime/src/lib/bot/factories/tcp.bot.ts");
// import { onnxBotFactory } from './factories/onnx.bot'
// import { tensorflowBotFactory } from './factories/tensorflow.bot'
// import { actionBotFactory } from './factories/action.bot'
const loadFile_1 = __webpack_require__(/*! ../utils/loadFile */ "./libs/joker/runtime/src/lib/utils/loadFile.ts");
const http_bot_1 = __webpack_require__(/*! ./factories/http.bot */ "./libs/joker/runtime/src/lib/bot/factories/http.bot.ts");
const encodeState_1 = __webpack_require__(/*! ./encodeState */ "./libs/joker/runtime/src/lib/bot/encodeState.ts");
const spoilerSync_bot_1 = __webpack_require__(/*! ./factories/spoilerSync.bot */ "./libs/joker/runtime/src/lib/bot/factories/spoilerSync.bot.ts");
function createBot(uri, options) {
    if (!uri) {
        return null;
    }
    /**
     * syntax:
     *  onnx://[modelFilePath]|[encodeFilePath]|[queueLength]|[queueTimeout]
     *
     * defaults:
     *  [encodeFilePath] - assets/encodeState.js
     *
     * example:
     *  onnx://assets/model-v1.onnx|assets/encodeState.js|10|10
     */
    // if (uri.startsWith('onnx://')) {
    //   const parts = uri.replace('onnx://', '').split('|')
    //   if (!parts.length) {
    //     throw new AppError('INVALID_ONNX_URI', {
    //       data: {
    //         uri,
    //       },
    //     })
    //   }
    //   const { getTrackTime, onnx, pathJoin, requireFunc, tf } = options
    //   const onnxModelFilePath = parts[0]
    //   const encodeStateFilePath = parts[1] || 'assets/encodeState.js'
    //   const queueLength = parts[2] ? parseInt(parts[2], 10) : 10
    //   const queueTimeout = parts[3] ? parseInt(parts[3], 10) : 10
    //   return onnxBotFactory({
    //     encodeStateFilePath,
    //     onnxModelFilePath,
    //     getTrackTime,
    //     onnx,
    //     pathJoin,
    //     requireFunc,
    //     queueLength,
    //     queueTimeout,
    //     tf,
    //   })
    // }
    /**
     * syntax:
     *  tf://[modelFilePath]|[encodeFilePath]|[queueLength]|[queueTimeout]
     *
     * defaults:
     *  [encodeFilePath] - assets/encodeState.js
     *
     * example:
     *  tf://assets/model-v1.json|assets/encodeState.js|10|10
     */
    // if (uri.startsWith('tf://')) {
    //   const parts = uri.replace('tf://', '').split('|')
    //   if (!parts.length) {
    //     throw new AppError('INVALID_ONNX_URI', {
    //       data: {
    //         uri,
    //       },
    //     })
    //   }
    //   const { getTrackTime, pathJoin, requireFunc, tf } = options
    //   const modelFilePath = parts[0]
    //   const encodeStateFilePath = parts[1] || 'assets/encodeState.js'
    //   const queueLength = parts[2] ? parseInt(parts[2], 10) : 10
    //   const queueTimeout = parts[3] ? parseInt(parts[3], 10) : 10
    //   return tensorflowBotFactory({
    //     encodeStateFilePath,
    //     modelFilePath,
    //     getTrackTime,
    //     pathJoin,
    //     requireFunc,
    //     queueLength,
    //     queueTimeout,
    //     tf,
    //   })
    // }
    if (uri.startsWith('internal://simple')) {
        const { getTrackTime } = options;
        return simpleSync_bot_1.simpleBotFactory(getTrackTime);
    }
    if (uri.startsWith('internal://spoiler')) {
        const { getTrackTime } = options;
        return spoilerSync_bot_1.spoilerBotFactory(getTrackTime);
    }
    /**
     * syntax:
     *  tcp://[modelFilePath]|[encodeFilePath]|[queueLength]|[queueTimeout]
     *
     * defaults:
     *  [encodeFilePath] - assets/encodeState.js
     *
     * example:
     *  onnx://assets/model-v1.onnx|assets/encodeState.js|10|10
     */
    if (uri.startsWith('tcp://')) {
        const parts = uri.replace('tcp://', '').split('|');
        if (!parts.length) {
            throw new utils_1.AppError('INVALID_ONNX_URI', {
                data: {
                    uri,
                },
            });
        }
        const { getTrackTime, pathJoin, requireFunc, defaultQueueSize, defaultQueueTimeout, } = options;
        const hostParts = parts[0].split(':');
        const hostname = hostParts[0];
        const port = parseInt(hostParts[1], 10);
        const encodeStateFilePath = parts[1];
        const queueLength = parts[2]
            ? parseInt(parts[2], 10)
            : defaultQueueSize;
        const queueTimeout = parts[3]
            ? parseInt(parts[3], 10)
            : defaultQueueTimeout;
        const encodeStateFn = encodeStateFilePath
            ? loadFile_1.loadFile(encodeStateFilePath, requireFunc, pathJoin).main
            : encodeState_1.encodeState;
        return tcp_bot_1.tcpBotFactory({
            hostname,
            port,
            encodeState: encodeStateFn,
            getTrackTime,
            queueLength,
            queueTimeout,
        });
    }
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
        const parts = uri.split('|');
        if (!parts.length) {
            throw new utils_1.AppError('INVALID_HTTP_URI', {
                data: {
                    uri,
                },
            });
        }
        const { getTrackTime, pathJoin, requireFunc, defaultQueueSize, defaultQueueTimeout, } = options;
        const url = parts[0];
        const encodeStateFilePath = parts[1];
        const queueLength = parts[2]
            ? parseInt(parts[2], 10)
            : defaultQueueSize;
        const queueTimeout = parts[3]
            ? parseInt(parts[3], 10)
            : defaultQueueTimeout;
        const encodeStateFn = encodeStateFilePath
            ? loadFile_1.loadFile(encodeStateFilePath, requireFunc, pathJoin).main
            : encodeState_1.encodeState;
        return http_bot_1.httpBotFactory({
            url,
            encodeState: encodeStateFn,
            getTrackTime,
            queueLength,
            queueTimeout,
        });
    }
    throw new utils_1.AppError('UNKNOWN_URI_FORMAT', { data: { uri } });
}
exports.createBot = createBot;
function createSyncBot(type, getTrackTime) {
    switch (type) {
        case 'SIMPLE':
            return simpleSync_bot_1.simpleSyncBotFactory(getTrackTime);
        case 'SPOILER':
            return spoilerSync_bot_1.spoilerSyncBotFactory(getTrackTime);
        default:
            return randomSync_bot_1.randomSyncBotFactory(getTrackTime);
    }
}
exports.createSyncBot = createSyncBot;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/encodeState.ts":
/*!*******************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/encodeState.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeState = void 0;
function encodeState(state) {
    const cards = state.currentPlayer.cards;
    const card_vis = state.currentPlayer.cardVisibilities;
    const card_permissions = state.currentPlayer.cardPermissions ||
        new Array(cards.length).fill(true);
    const cards_at_hand = cards.filter((x, i) => card_vis[i]);
    const trump = state.trump != null ? state.trump : null;
    const first_player_pos = state.stepFirstPlayerIndex != null
        ? state.stepFirstPlayerIndex
        : state.roundFirstPlayerIndex;
    const player_stats = !state.players[0].lastRoundStats
        ? state.players.map((x) => x.roundStats)
        : state.players.map((x) => x.lastRoundStats);
    const action_type = statusMap[state.status];
    const down_cards = state.downCards;
    const step = state.step;
    return encode(player_stats, first_player_pos, cards_at_hand, card_permissions, down_cards, action_type, step, trump);
}
exports.encodeState = encodeState;
function encode(player_stats, first_player_pos, cards_at_hand, allowed_cards, table_cards, expected_action_type, step, trump_card) {
    // featue 1
    const feat1 = [];
    for (const stat of player_stats) {
        if (!stat) {
            feat1.push(...one_hot_encode(0, 11), ...one_hot_encode(0, 11));
        }
        else {
            feat1.push(...one_hot_encode(stat.bid + 1, 11), ...one_hot_encode(stat.have + 1, 11));
        }
    }
    // featue 2
    const feat2 = one_hot_encode(first_player_pos, 4);
    // featues 3 + 4
    const feat3Items = [];
    const feat4Items = [];
    for (let i in cards_at_hand) {
        const [card_color, card_level] = cards_at_hand[i];
        feat3Items.push(card_color * 9 + card_level);
        if (allowed_cards[i]) {
            feat4Items.push(card_color * 9 + card_level);
        }
    }
    const feat3 = one_hot_encode(feat3Items, 36);
    const feat4 = one_hot_encode(feat4Items, 36);
    // feature 5
    const feat5Items = [];
    for (let card of table_cards) {
        if (!card) {
            continue;
        }
        // 15 is the smallest index of CARD action
        feat5Items.push(getCardActionIndex([card[0], card[1], card[2]]) - 15);
    }
    const feat5 = one_hot_encode(feat5Items, 54); // 54 is a total number of CARD actions (68 - 15 + 1)
    // feature 6
    const feat6 = one_hot_encode(expected_action_type, 3);
    // feature 7
    const feat7 = one_hot_encode(expected_action_type != ActionType.TRUMP ? step + 1 : 0, 11);
    // feature 8
    const feat8 = one_hot_encode(!trump_card ? 0 : trump_card.value + 1, 6);
    return [feat1, feat2, feat3, feat4, feat5, feat6, feat7, feat8];
}
function getCardActionIndex(action) {
    return flatActions.findIndex((x) => Array.isArray(x) &&
        x.length >= 1 &&
        x[0][0] === action[0][0] &&
        x[0][1] === action[0][1] &&
        (!x[1] ||
            (action[1] &&
                x[1].want === action[1].want &&
                x[1].color === action[1].color)));
}
function one_hot_encode(indicesParam, n) {
    const indices = Array.isArray(indicesParam)
        ? indicesParam
        : [indicesParam];
    const arr = new Array(n).fill(0);
    indices.forEach(x => (arr[x] = 1));
    return arr;
}
// data
const allActions = {
    bidActions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    trumpActions: [0, 1, 2, 3, 4],
    cardActions: [
        [[0, 1]],
        [[0, 2]],
        [[0, 3]],
        [[0, 4]],
        [[0, 5]],
        [[0, 6]],
        [[0, 7]],
        [[0, 8]],
        [[1, 1]],
        [[1, 2]],
        [[1, 3]],
        [[1, 4]],
        [[1, 5]],
        [[1, 6]],
        [[1, 7]],
        [[1, 8]],
        [[2, 1]],
        [[2, 2]],
        [[2, 3]],
        [[2, 4]],
        [[2, 5]],
        [[2, 6]],
        [[2, 7]],
        [[2, 8]],
        [[3, 1]],
        [[3, 2]],
        [[3, 3]],
        [[3, 4]],
        [[3, 5]],
        [[3, 6]],
        [[3, 7]],
        [[3, 8]],
        [[0, 0]],
        [[1, 0]],
        [[2, 0], { want: true, color: 0 }],
        [[2, 0], { want: true, color: 1 }],
        [[2, 0], { want: true, color: 2 }],
        [[2, 0], { want: true, color: 3 }],
        [[2, 0], { want: false, color: 0 }],
        [[2, 0], { want: false, color: 1 }],
        [[2, 0], { want: false, color: 2 }],
        [[2, 0], { want: false, color: 3 }],
        [[2, 0], { want: true, color: null }],
        [[2, 0], { want: false, color: null }],
        [[3, 0], { want: true, color: 0 }],
        [[3, 0], { want: true, color: 1 }],
        [[3, 0], { want: true, color: 2 }],
        [[3, 0], { want: true, color: 3 }],
        [[3, 0], { want: false, color: 0 }],
        [[3, 0], { want: false, color: 1 }],
        [[3, 0], { want: false, color: 2 }],
        [[3, 0], { want: false, color: 3 }],
        [[3, 0], { want: true, color: null }],
        [[3, 0], { want: false, color: null }],
    ],
};
const flatActions = [
    ...allActions.bidActions,
    ...allActions.trumpActions,
    ...allActions.cardActions,
];
const ActionType = {
    TRUMP: 0,
    BID: 1,
    CARD: 2,
    NIL: 3,
};
const statusMap = {
    WAITING_TRUMP: ActionType.TRUMP,
    WAITING_BID: ActionType.BID,
    WAITING_CARD: ActionType.CARD,
    FINISHED: ActionType.NIL,
};
// console.log(process.args);
// from_dict(process.args[0])
// console.log(from_dict(state1).join(""));
// console.log(from_dict(state2).join(""));
// console.log(from_dict(state3).join(""));
// console.log(from_dict(state4).join(""));


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/factories/http.bot.ts":
/*!**************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/factories/http.bot.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.httpBotFactory = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const node_fetch_1 = __webpack_require__(/*! node-fetch */ "node-fetch");
const allActions_1 = __webpack_require__(/*! ../allActions */ "./libs/joker/runtime/src/lib/bot/allActions.ts");
const batch_1 = __webpack_require__(/*! ../batch */ "./libs/joker/runtime/src/lib/bot/batch.ts");
async function httpBotFactory(options) {
    const { url, getTrackTime, encodeState, queueLength, queueTimeout, } = options;
    // create http batch
    const batch = new HttpBatchProcessing(url, {
        minLimit: queueLength,
        timeoutInMS: queueTimeout,
        getTrackTime,
    });
    // implementation
    async function httpBotAction(data) {
        const encodedState = encodeState(data.state);
        const allowedIndexes = allActions_1.getActionIndexes(data.type, data.actions);
        const [resultFlatIndex, duration] = await batch.process({
            encodedState,
            allowedIndexes,
        });
        if (!allowedIndexes.includes(resultFlatIndex)) {
            throw new utils_1.AppError('INVALID_BOT_RESULT', {
                data: { allowedIndexes, resultFlatIndex },
            });
        }
        const index = allActions_1.getScopedActionIndex(data.type, data.actions, resultFlatIndex);
        return [index, duration];
    }
    return {
        action: httpBotAction,
        batch,
    };
}
exports.httpBotFactory = httpBotFactory;
class HttpBatchProcessing extends batch_1.BatchProcessing {
    constructor(url, options) {
        super(options);
        this.url = url;
    }
    async doBatchOperation(items) {
        const result = await node_fetch_1.default(this.url, {
            method: 'POST',
            headers: [['content-type', 'application/json']],
            body: JSON.stringify(items),
            timeout: 500,
        }).then(x => x.json());
        return result;
    }
}


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/factories/randomSync.bot.ts":
/*!********************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/factories/randomSync.bot.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.randomSyncBotFactory = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
function randomSyncBotFactory(getTrackTime) {
    // implementation
    function randomSyncBotAction(data) {
        const startedAt = getTrackTime();
        const { randomSeed, actions: dataActions } = data;
        const actions = dataActions;
        const action = actions[Math.floor(utils_1.random(randomSeed) * actions.length)];
        const index = actions.indexOf(action);
        const duration = getTrackTime() - startedAt;
        return [index, duration];
    }
    return {
        action: randomSyncBotAction,
    };
}
exports.randomSyncBotFactory = randomSyncBotFactory;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/factories/simpleSync.bot.ts":
/*!********************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/factories/simpleSync.bot.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleBotFactory = exports.simpleSyncBotFactory = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
/**
 * კოზირი:  რანდომად ირჩევს
 * ცხადება: ყოველთვის იძახის პასს, თუ პასგარდა არ არის
 * კარტი:   დიდებს ინახავს ბოლოსთვის
 */
function simpleSyncBotFactory(getTrackTime) {
    // implementation
    function simpleSyncBotAction(data) {
        const startedAt = getTrackTime();
        switch (data.type) {
            case 'BID': {
                const { state: { bidLimit }, actions, } = data;
                let want = 0;
                if (want === bidLimit) {
                    want++;
                }
                const index = actions.findIndex(x => x === want);
                const duration = getTrackTime() - startedAt;
                return [index, duration];
            }
            case 'TRUMP': {
                const { actions, randomSeed } = data;
                const action = actions[Math.floor(utils_1.random(randomSeed) * actions.length)];
                const index = actions.indexOf(action);
                const duration = getTrackTime() - startedAt;
                return [index, duration];
            }
            case 'CARD': {
                const { actions, state } = data;
                const trumpColor = Array.isArray(state.trump)
                    ? state.trump[0]
                    : state.trump;
                let action;
                // თავდაპირველად ვირჩევთ არა ჯოკერ და არა კოზირ კარტის ექშენებს
                let filteredActions = actions.filter(x => !x[1] && x[0][0] !== trumpColor);
                // შემდეგ ნებისმიერ არა ჯოკერ, უკვე კოზირებსაც
                if (!filteredActions.length) {
                    filteredActions = actions.filter(x => !x[1]);
                }
                // თუ აღარ დაგვრჩა სხვა კარტი, ვირჩევთ ჯოკერის მოჯოკვრის ექშენებს
                // შესაძლოა ერთი იყოს, ან რამდენიმე თუ ჩვენი ცხადებაა
                if (!filteredActions.length) {
                    filteredActions = actions.filter(x => { var _a; return (_a = x[1]) === null || _a === void 0 ? void 0 : _a.want; });
                }
                // ვასორტირებთ ნახატების მიხედვით. თუ წაგლეჯვაა პატარებს ჩამოვდივართ ჯერ, ხოლო თუ შეტენვაა დიდებს
                action = filteredActions.sort((a, b) => (a[0][1] - b[0][1]) * (state.bidBalance < 0 ? 1 : -1))[0];
                const index = actions.indexOf(action);
                const duration = getTrackTime() - startedAt;
                return [index, duration];
            }
        }
    }
    return {
        action: simpleSyncBotAction,
    };
}
exports.simpleSyncBotFactory = simpleSyncBotFactory;
async function simpleBotFactory(getTrackTime) {
    const bot = simpleSyncBotFactory(getTrackTime);
    return {
        action: x => Promise.resolve(bot.action(x)),
        batch: bot.batch,
    };
}
exports.simpleBotFactory = simpleBotFactory;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/factories/spoilerSync.bot.ts":
/*!*********************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/factories/spoilerSync.bot.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.spoilerBotFactory = exports.spoilerSyncBotFactory = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const whoTook_1 = __webpack_require__(/*! ../../domain/whoTook */ "./libs/joker/runtime/src/lib/domain/whoTook.ts");
/**
 * კოზირი:  რანდომად ირჩევს
 * ცხადება: ყოველთვის იძახის პასს, თუ პასგარდა არ არის
 * კარტი:   დიდებს ინახავს ბოლოსთვის
 */
function spoilerSyncBotFactory(getTrackTime) {
    // implementation
    function simpleSyncBotAction(data) {
        var _a;
        const startedAt = getTrackTime();
        switch (data.type) {
            case 'BID': {
                const { state: { bidLimit }, actions, } = data;
                let want = 0;
                if (want === bidLimit) {
                    want++;
                }
                const index = actions.findIndex(x => x === want);
                const duration = getTrackTime() - startedAt;
                return [index, duration];
            }
            case 'TRUMP': {
                const { actions, randomSeed } = data;
                const action = actions[Math.floor(utils_1.random(randomSeed) * actions.length)];
                const index = actions.indexOf(action);
                const duration = getTrackTime() - startedAt;
                return [index, duration];
            }
            case 'CARD': {
                const { actions, state } = data;
                const trumpColor = Array.isArray(state.trump)
                    ? state.trump[0]
                    : state.trump;
                let action;
                // თავდაპირველად ვირჩევთ არა ჯოკერ და არა კოზირ კარტის ექშენებს
                let filteredActions = actions.filter(x => !x[1] && x[0][0] !== trumpColor);
                // შემდეგ ნებისმიერ არა ჯოკერ, უკვე კოზირებსაც
                if (!filteredActions.length) {
                    filteredActions = actions.filter(x => !x[1]);
                }
                // თუ აღარ დაგვრჩა სხვა კარტი, ვირჩევთ ჯოკერის მოჯოკვრის ექშენებს
                // შესაძლოა ერთი იყოს, ან რამდენიმე თუ ჩვენი ცხადებაა
                if (!filteredActions.length) {
                    const isFirstCard = state.stepFirstPlayerIndex === state.currentPlayer.index;
                    let jokerShouldWant;
                    if (isFirstCard) {
                        jokerShouldWant = false;
                    }
                    else {
                        const takesPlayerIndex = whoTook_1.whoTook(state.downCards, trumpColor, state.stepFirstPlayerIndex);
                        const roundStats = (_a = state.players[takesPlayerIndex]) === null || _a === void 0 ? void 0 : _a.roundStats;
                        jokerShouldWant =
                            !!roundStats && roundStats.bid - roundStats.have === 1;
                    }
                    const canAnyoneBeDringed = state.players.some(x => {
                        var _a, _b;
                        return x.roundStats &&
                            ((_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.bid) > 0 &&
                            ((_b = x.roundStats) === null || _b === void 0 ? void 0 : _b.have) === 0;
                    });
                    if (canAnyoneBeDringed) {
                        jokerShouldWant = true;
                    }
                    const jokerActions = actions.filter(x => { var _a, _b; return ((_b = (_a = x[1]) === null || _a === void 0 ? void 0 : _a.want) !== null && _b !== void 0 ? _b : null) !== null; });
                    if (jokerActions.length > 1) {
                        const wantTrumpAction = jokerShouldWant
                            ? jokerActions.find(x => {
                                var _a, _b;
                                return isFirstCard
                                    ? ((_a = x[1]) === null || _a === void 0 ? void 0 : _a.want) === true && x[1].color === trumpColor
                                    : ((_b = x[1]) === null || _b === void 0 ? void 0 : _b.want) === true;
                            })
                            : jokerActions.find(x => {
                                var _a, _b;
                                return isFirstCard
                                    ? ((_a = x[1]) === null || _a === void 0 ? void 0 : _a.want) === false &&
                                        x[1].color !== trumpColor
                                    : ((_b = x[1]) === null || _b === void 0 ? void 0 : _b.want) === false;
                            });
                        if (wantTrumpAction) {
                            filteredActions = [wantTrumpAction];
                        }
                    }
                    else {
                        filteredActions = jokerActions.filter(x => { var _a; return ((_a = x[1]) === null || _a === void 0 ? void 0 : _a.want) === jokerShouldWant; });
                    }
                }
                // ვასორტირებთ ნახატების მიხედვით. თუ წაგლეჯვაა პატარებს ჩამოვდივართ ჯერ, ხოლო თუ შეტენვაა დიდებს
                action = filteredActions.sort((a, b) => (a[0][1] - b[0][1]) * (state.bidBalance < 0 ? 1 : -1))[0];
                const index = actions.indexOf(action);
                const duration = getTrackTime() - startedAt;
                return [index, duration];
            }
        }
    }
    return {
        action: simpleSyncBotAction,
    };
}
exports.spoilerSyncBotFactory = spoilerSyncBotFactory;
async function spoilerBotFactory(getTrackTime) {
    const bot = spoilerSyncBotFactory(getTrackTime);
    return {
        action: x => Promise.resolve(bot.action(x)),
        batch: bot.batch,
    };
}
exports.spoilerBotFactory = spoilerBotFactory;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/bot/factories/tcp.bot.ts":
/*!*************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/bot/factories/tcp.bot.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.tcpBotFactory = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const allActions_1 = __webpack_require__(/*! ../allActions */ "./libs/joker/runtime/src/lib/bot/allActions.ts");
const batch_1 = __webpack_require__(/*! ../batch */ "./libs/joker/runtime/src/lib/bot/batch.ts");
const net = __webpack_require__(/*! net */ "net");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
async function tcpBotFactory(options) {
    const { hostname, port, getTrackTime, encodeState, queueLength, queueTimeout, } = options;
    // create tcp batch
    const batch = new TcpBatchProcessing({
        minLimit: queueLength,
        timeoutInMS: queueTimeout,
        getTrackTime,
    });
    await batch.init(hostname, port);
    // implementation
    async function tcpBotAction(data) {
        const encodedState = encodeState(data.state);
        const allowedIndexes = allActions_1.getActionIndexes(data.type, data.actions);
        const [resultFlatIndex, duration] = await batch.process({
            encodedState,
            allowedIndexes,
        });
        if (!allowedIndexes.includes(resultFlatIndex)) {
            throw new utils_1.AppError('INVALID_BOT_RESULT', {
                data: { allowedIndexes, resultFlatIndex },
            });
        }
        const index = allActions_1.getScopedActionIndex(data.type, data.actions, resultFlatIndex);
        return [index, duration];
    }
    return {
        action: tcpBotAction,
        batch,
    };
}
exports.tcpBotFactory = tcpBotFactory;
class TcpBatchProcessing extends batch_1.BatchProcessing {
    constructor() {
        super(...arguments);
        this.dataReceived$ = new rxjs_1.Subject();
    }
    async init(hostname, port) {
        this.tcpClient = await createTcpConnection(hostname, port);
        this.tcpClient.on('data', buff => this.dataReceived$.next([...buff]));
    }
    doBatchOperation(items) {
        return new Promise((resolve, reject) => {
            try {
                let result = [];
                let isFinished;
                // start listening results
                const subscription = this.dataReceived$.subscribe(buff => {
                    buff.forEach(x => {
                        if (isFinished) {
                            console.log('WARNING! There should not be any additional bytes after finish');
                            return;
                        }
                        if (x === 255) {
                            isFinished = true;
                            return;
                        }
                        result.push(x);
                    });
                    if (!isFinished) {
                        return;
                    }
                    const index = items.findIndex((x, i) => !x.allowedIndexes.includes(result[i]));
                    if (index !== -1) {
                        throw new utils_1.AppError('INVALID_TCP_BATCH_RESULT_RECEIVED', {
                            data: { index },
                        });
                    }
                    subscription.unsubscribe();
                    resolve(result);
                    isFinished = false;
                    result = [];
                });
                const data = items
                    .reduce((r, x) => r
                    .concat(x.encodedState)
                    .concat(x.allowedIndexes)
                    .concat([254]), // item end symbol
                [])
                    .concat([255]); // batch end symbol
                this.tcpClient.write(new Uint8Array(data));
            }
            catch (err) {
                console.log('err', items.length);
                reject(err);
            }
        });
    }
}
function createTcpConnection(hostname, port) {
    return new Promise((resolve, reject) => {
        var client = new net.Socket();
        client.on('error', err => reject(err));
        client.connect(port, hostname, () => {
            resolve(client);
        });
    });
}


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/analyzeFilledOpponents.ts":
/*!*********************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/analyzeFilledOpponents.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSoftFilledOpponents = exports.analyzeFilledOpponents = void 0;
/**
 * Analyzes and returns back positionIndexes of players which filled bid for last player
 */
function analyzeFilledOpponents(cardsCount, items) {
    const result = items.reduce((r, x) => {
        r.totalBids += x.bid;
        if (r.totalBids === cardsCount) {
            r.positionIndexes = r.positionIndexes.concat(x.positionIndex);
        }
        return r;
    }, {
        totalBids: 0,
        positionIndexes: [],
    });
    if (result.totalBids !== cardsCount) {
        return [];
    }
    return result.positionIndexes;
}
exports.analyzeFilledOpponents = analyzeFilledOpponents;
/**
 * ეს იმპლემენტაცია თვლის იმ მოთამაშეებსაც რომლებმაც აცხადეს თავიდან
 * და მიიღეს მონაწილეობა შევსებაში
 */
function analyzeSoftFilledOpponents(cardsCount, items) {
    const result = items.reduce((r, x) => {
        if (x.bid > 0 || r.totalBids === cardsCount) {
            r.positionIndexes = r.positionIndexes.concat(x.positionIndex);
            r.totalBids += x.bid;
        }
        return r;
    }, {
        totalBids: 0,
        positionIndexes: [],
    });
    if (result.totalBids !== cardsCount) {
        return [];
    }
    return result.positionIndexes;
}
exports.analyzeSoftFilledOpponents = analyzeSoftFilledOpponents;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/anticheat/getPlayerVirtualSortedCardsMap.ts":
/*!***************************************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/anticheat/getPlayerVirtualSortedCardsMap.ts ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerVirtualSortedCardsMap = void 0;
const sortCards_1 = __webpack_require__(/*! ../sortCards */ "./libs/joker/runtime/src/lib/domain/sortCards.ts");
const toVirtualCard_1 = __webpack_require__(/*! ./toVirtualCard */ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCard.ts");
function getPlayerVirtualSortedCardsMap(cards, toVirtualColorMap) {
    const virtualCards = cards.map(x => toVirtualCard_1.toVirtualCard(x, true, toVirtualColorMap));
    const sortedVirtualCards = sortCards_1.sortCards(virtualCards);
    const indexMap = sortedVirtualCards.reduce((r, x, i) => r.set(i, virtualCards.findIndex(y => x[0] === y[0] && x[1] === y[1])), new Map());
    return indexMap;
}
exports.getPlayerVirtualSortedCardsMap = getPlayerVirtualSortedCardsMap;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/anticheat/getPlayersRandomizedDeckColors.ts":
/*!***************************************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/anticheat/getPlayersRandomizedDeckColors.ts ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayersRandomizedDeckColors = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
function getPlayersRandomizedDeckColors(deckColors) {
    let randomizedDeckColors = [...deckColors];
    const player1 = utils_1.getRandomItem(randomizedDeckColors);
    randomizedDeckColors = randomizedDeckColors.filter(x => x !== player1);
    const player2 = utils_1.getRandomItem(randomizedDeckColors);
    randomizedDeckColors = randomizedDeckColors.filter(x => x !== player2);
    const player3 = utils_1.getRandomItem(randomizedDeckColors);
    randomizedDeckColors = randomizedDeckColors.filter(x => x !== player3);
    const player4 = utils_1.getRandomItem(randomizedDeckColors);
    return [player1, player2, player3, player4];
}
exports.getPlayersRandomizedDeckColors = getPlayersRandomizedDeckColors;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCard.ts":
/*!**********************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCard.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toVirtualCard = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function toVirtualCard(card, isAntiCheatEnabled, toVirtualColorMap) {
    if (!isAntiCheatEnabled || types_1.isJoker(card)) {
        return card;
    }
    return [toVirtualColorMap.get(card[0]), card[1]];
}
exports.toVirtualCard = toVirtualCard;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCardPermissions.ts":
/*!*********************************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCardPermissions.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toVirtualCardPermissions = void 0;
function toVirtualCardPermissions(virtualSortedCardsMap, originalCardPermissions) {
    return originalCardPermissions.map((_, i) => originalCardPermissions[virtualSortedCardsMap.get(i)]);
}
exports.toVirtualCardPermissions = toVirtualCardPermissions;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCardVisibilities.ts":
/*!**********************************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCardVisibilities.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toVirtualCardVisibilities = void 0;
function toVirtualCardVisibilities(virtualSortedCardsMap, originalCardVisibilities) {
    return originalCardVisibilities.map((_, i) => originalCardVisibilities[virtualSortedCardsMap.get(i)]);
}
exports.toVirtualCardVisibilities = toVirtualCardVisibilities;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualDownCard.ts":
/*!**************************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/anticheat/toVirtualDownCard.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toVirtualDownCard = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function toVirtualDownCard(card, toVirtualColorMap) {
    if (types_1.isJoker(card)) {
        const jokerAction = {
            want: card[2].want,
            color: toVirtualColorMap.get(card[2].color),
        };
        return [card[0], card[1], jokerAction];
    }
    return [toVirtualColorMap.get(card[0]), card[1]];
}
exports.toVirtualDownCard = toVirtualDownCard;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/dealCards.ts":
/*!********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/dealCards.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dealCards = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const colors = new Array(4).fill(0).map((_, i) => i);
const levels = new Array(9).fill(0).map((_, i) => i);
const levels2 = new Array(8).fill(0).map((_, i) => i + 1);
const legacyCards = colors.flatMap(c => levels.map(l => [c, l]));
const modernCards = colors
    .flatMap(c => levels2.map(l => [c, l]))
    .concat([
    [types_1.CardColor.Hearts, types_1.CardLevel._6],
    [types_1.CardColor.Diamonds, types_1.CardLevel._6],
    [types_1.CardColor.Spades, types_1.CardLevel.Joker],
    [types_1.CardColor.Clubs, types_1.CardLevel.Joker],
]);
const oldSchoolCards = colors
    .flatMap(c => levels.map(l => [c, l]))
    .concat([
    [types_1.CardColor.Spades, types_1.CardLevel.Joker],
    [types_1.CardColor.Clubs, types_1.CardLevel.Joker],
]);
function dealCards(userIds, cardsCount, deckType, randomSeed) {
    let remaningCards = [
        ...(deckType === 'MODERN' ? modernCards : oldSchoolCards),
    ];
    const playerCards = userIds.map(userId => {
        const result = getRandomCards(remaningCards, cardsCount, randomSeed);
        remaningCards = result.remaningCards;
        return {
            userId,
            cards: result.cards,
        };
    });
    const trumpCard = cardsCount === 9 && deckType === 'MODERN'
        ? null
        : utils_1.getRandomItem(remaningCards, undefined, randomSeed);
    return [playerCards, trumpCard];
}
exports.dealCards = dealCards;
function getRandomCards(remaningCards, count, randomSeed) {
    const cards = new Array(count).fill(0).map(() => {
        const randomIndex = Math.floor(utils_1.random(randomSeed) * remaningCards.length);
        const card = remaningCards[randomIndex];
        remaningCards = remaningCards.filter(x => x !== card);
        return card;
    });
    return {
        cards,
        remaningCards,
    };
}


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/findCardIndex.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/findCardIndex.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.findCardIndex = void 0;
function findCardIndex(cards, downCard) {
    return cards.findIndex(x => x[0] === downCard[0] && x[1] === downCard[1]);
}
exports.findCardIndex = findCardIndex;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/generateActions.ts":
/*!**************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/generateActions.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAllJokerSubActions = exports.generateAllCardActions = exports.generateAllTrumpActions = exports.generateAllBidActions = exports.generateAllActions = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function generateAllActions() {
    return [
        ...generateAllBidActions(),
        ...generateAllTrumpActions(),
        ...generateAllCardActions(),
    ];
}
exports.generateAllActions = generateAllActions;
function generateAllBidActions() {
    const bidActions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return bidActions;
}
exports.generateAllBidActions = generateAllBidActions;
function generateAllTrumpActions() {
    const trumpActions = [0, 1, 2, 3, 4];
    return trumpActions;
}
exports.generateAllTrumpActions = generateAllTrumpActions;
function generateAllCardActions() {
    // 6-იანები გამოტოვებულია
    const card6s = [
        [[types_1.CardColor.Hearts, types_1.CardLevel._6]],
        [[types_1.CardColor.Diamonds, types_1.CardLevel._6]],
        [[types_1.CardColor.Spades, types_1.CardLevel._6]],
        [[types_1.CardColor.Clubs, types_1.CardLevel._6]],
    ];
    // ჯოკრები
    const allJokerActions = [
        ...generateAllJokerSubActions(true),
        ...generateAllJokerSubActions(false),
    ];
    const cardJokers = [
        [types_1.CardColor.Spades, types_1.CardLevel.Joker],
        [types_1.CardColor.Clubs, types_1.CardLevel.Joker],
    ].flatMap(card => allJokerActions.map(jokerAction => [card, jokerAction]));
    const cardActions = new Array(4)
        .fill(0)
        .flatMap((_, i) => {
        const color = i;
        return new Array(8).fill(0).map((_, j) => {
            const level = j + 1;
            return [[color, level]];
        });
    })
        .concat(card6s)
        .concat(cardJokers);
    return cardActions;
}
exports.generateAllCardActions = generateAllCardActions;
function generateAllJokerSubActions(isFirstCard) {
    return isFirstCard
        ? [
            { want: true, color: types_1.CardColor.Hearts },
            { want: true, color: types_1.CardColor.Diamonds },
            { want: true, color: types_1.CardColor.Spades },
            { want: true, color: types_1.CardColor.Clubs },
            { want: false, color: types_1.CardColor.Hearts },
            { want: false, color: types_1.CardColor.Diamonds },
            { want: false, color: types_1.CardColor.Spades },
            { want: false, color: types_1.CardColor.Clubs },
        ]
        : [
            { want: true, color: null },
            { want: false, color: null },
        ];
}
exports.generateAllJokerSubActions = generateAllJokerSubActions;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/generatePlayActions.ts":
/*!******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/generatePlayActions.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCardActions = exports.hashedStats = exports.generateBidActions = exports.generateTrumpActions = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const generateActions_1 = __webpack_require__(/*! ./generateActions */ "./libs/joker/runtime/src/lib/domain/generateActions.ts");
function generateTrumpActions() {
    return [
        types_1.CardColor.Hearts,
        types_1.CardColor.Diamonds,
        types_1.CardColor.Clubs,
        types_1.CardColor.Spades,
        types_1.CardColor.None,
    ];
}
exports.generateTrumpActions = generateTrumpActions;
function generateBidActions(cardsCount, bidLimit) {
    const bidActions = new Array(cardsCount)
        .fill(0)
        .map((_, i) => i);
    bidActions.push(cardsCount);
    const allowedBidActions = bidActions.filter(x => x !== bidLimit);
    return allowedBidActions;
}
exports.generateBidActions = generateBidActions;
// CACHE
const joker1ActionsFirstCard = generateActions_1.generateAllJokerSubActions(true).map(jokerAction => [[types_1.CardColor.Clubs, types_1.CardLevel.Joker], jokerAction]);
const joker1ActionsNonFirstCard = generateActions_1.generateAllJokerSubActions(false).map(jokerAction => [[types_1.CardColor.Clubs, types_1.CardLevel.Joker], jokerAction]);
const joker2ActionsFirstCard = generateActions_1.generateAllJokerSubActions(true).map(jokerAction => [[types_1.CardColor.Spades, types_1.CardLevel.Joker], jokerAction]);
const joker2ActionsNonFirstCard = generateActions_1.generateAllJokerSubActions(false).map(jokerAction => [[types_1.CardColor.Spades, types_1.CardLevel.Joker], jokerAction]);
// CACHE
function getJoker1Actions(isFirstCard) {
    return isFirstCard
        ? joker1ActionsFirstCard
        : joker1ActionsNonFirstCard;
}
function getJoker2Actions(isFirstCard) {
    return isFirstCard
        ? joker2ActionsFirstCard
        : joker2ActionsNonFirstCard;
}
// const hashTable: { [key: number]: CardAction[] } = {}
exports.hashedStats = {
    generateCardActionsCached: 0,
    generateCardActionsUsed: 0,
};
function generateCardActions(cards, cardVisibilities, cardPermissions, isFirstCard) {
    // const cardsHash = cards.reduce(
    //   (r, x, i) =>
    //     !cardVisibilities[i] || !cardPermissions[i]
    //       ? r
    //       : (i === 0 ? 0 : r << 6) ^ getCardHash(x),
    //   0,
    // )
    // const hash = (cardsHash << 1) ^ (isFirstCard ? 1 : 0)
    // const hashedResult = hashTable[hash]
    // if (hashedResult) {
    //   hashedStats.generateCardActionsUsed++
    //   return hashedResult
    // }
    // hashedStats.generateCardActionsCached++
    const items = cards.map((x, i) => ({
        card: x,
        isAllowed: cardVisibilities[i] && cardPermissions[i],
    }));
    const cardActions = items
        .filter(x => x.isAllowed)
        .flatMap(x => types_1.isJoker(x.card)
        ? x.card[0] === types_1.CardColor.Clubs
            ? getJoker1Actions(isFirstCard)
            : getJoker2Actions(isFirstCard)
        : [[x.card]]);
    // hashTable[hash] = cardActions
    return cardActions;
}
exports.generateCardActions = generateCardActions;
// function getCardHash(card: Card) {
//   return (card[0] << 4) ^ card[1]
// }


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getBidLimit.ts":
/*!**********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getBidLimit.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getBidLimit = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
function getBidLimit(players, cardsCount) {
    const playerBids = players.filter(x => !!x.roundStats);
    // გვაინტერესებს მხოლოდ ის შემთხვევა როცა სამმა მოთამაშემ აცხადა
    // და მეოთხეს შეიძლება შეზღუდვა დაუწესდეს
    if (playerBids.length !== 3) {
        return null;
    }
    const totalBid = playerBids
        .map(x => { var _a; return (_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.bid; })
        .reduce(utils_1.sum, 0);
    const limit = cardsCount - totalBid;
    return limit >= 0 ? limit : null;
}
exports.getBidLimit = getBidLimit;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getCardPermissions.ts":
/*!*****************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getCardPermissions.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardPermissions = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const getNatarebiColor_1 = __webpack_require__(/*! ./getNatarebiColor */ "./libs/joker/runtime/src/lib/domain/getNatarebiColor.ts");
function getCardPermissions(cards, cardVisibilities, trumpColor, firstCard) {
    var _a;
    if (!firstCard) {
        return cards.map((_, i) => cardVisibilities[i]);
    }
    const firstCardColor = getNatarebiColor_1.getNatarebiColor(firstCard);
    // როდესაც ჯოკერმა აცხადა მაღლები
    const needHighestCard = (_a = firstCard[2]) === null || _a === void 0 ? void 0 : _a.want;
    const hasColor = cards.some((x, i) => cardVisibilities[i] && x[0] === firstCardColor && !types_1.isJoker(x));
    const hasTrump = cards.some((x, i) => cardVisibilities[i] && x[0] === trumpColor && !types_1.isJoker(x));
    // თუ არც ფერი აქვს და არც კოზირი, მაშინ ნებისმიერის ჩამოსვლა შეუძია
    if (!hasColor && !hasTrump) {
        return cards.map((_, i) => cardVisibilities[i]);
    }
    if (hasColor && needHighestCard) {
        const cardValues = cards.map((x, i) => !types_1.isJoker(x) && cardVisibilities[i] && x[0] === firstCardColor
            ? x[1]
            : -1);
        const maxValue = Math.max(...cardValues);
        const maxCardIndex = cardValues.indexOf(maxValue);
        return cards.map((x, i) => i === maxCardIndex || types_1.isJoker(x));
    }
    return cards.map((x, i) => cardVisibilities[i] &&
        // ჯოკერის ჩამოსვლა ყოველთვის შეუძლია
        (types_1.isJoker(x) ||
            // თუ ფერი აქვს, მხოლოდ ის ფერები
            (hasColor && x[0] === firstCardColor) ||
            // თუ ფერი არ აქვს, მხოლოდ კოზირი
            (!hasColor && x[0] === trumpColor)));
}
exports.getCardPermissions = getCardPermissions;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getCommandFromAction.ts":
/*!*******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getCommandFromAction.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandFromAction = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
function getCommandFromAction(status, action, userId, isBot) {
    switch (status) {
        case 'WAITING_TRUMP':
            return {
                type: 'TRUMP',
                userId,
                color: action,
                isBot,
            };
        case 'WAITING_BID':
            return {
                type: 'BID',
                userId,
                want: action,
                isBot,
            };
        case 'WAITING_CARD': {
            const [card, jokerAction] = action;
            return {
                type: 'CARD2',
                userId,
                card,
                jokerAction,
                isBot,
            };
        }
        default:
            throw new utils_1.AppError('UNABLE_TO_GET_GAME_COMMAND', {
                data: { status, action },
            });
    }
}
exports.getCommandFromAction = getCommandFromAction;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getDringValue.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getDringValue.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getDringValue = void 0;
function getDringValue(dring, cardsCount, section) {
    switch (dring) {
        case '200':
            return 200;
        case '500':
            return 500;
        case '1000':
            return 1000;
        case 'SPEC':
            return cardsCount * 100;
        case '200/500':
            return section % 2 === 1 ? 200 : 500;
    }
}
exports.getDringValue = getDringValue;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getGameProgress.ts":
/*!**************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getGameProgress.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameProgress = void 0;
function getGameProgress(state) {
    const { roundConfigs, sectionIndex, roundIndex } = state;
    const sections = roundConfigs;
    const sectionLengths = sections.map(x => x.length);
    const sum = (a, b) => a + b;
    const usedSize = sectionLengths.filter((_, i) => i < sectionIndex).reduce(sum, 0) +
        roundIndex;
    const totalSize = sectionLengths.reduce(sum, 0);
    const progress = Math.floor((usedSize * 100) / totalSize);
    return progress;
}
exports.getGameProgress = getGameProgress;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getGameTypeAndDring.ts":
/*!******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getGameTypeAndDring.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameTypeAndDring = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
function getGameTypeAndDring(mode) {
    if (!mode) {
        throw new utils_1.AppError('INVALID_GAME_MODE', { data: { mode } });
    }
    const parts = mode.split('_');
    if (parts.length !== 2) {
        throw new utils_1.AppError('INVALID_GAME_MODE', { data: { mode } });
    }
    const type = parts[0];
    const dring = parts[1];
    if (!types_1.isValidGameType(type) || !types_1.isValidDring(dring)) {
        throw new utils_1.AppError('INVALID_GAME_MODE', { data: { mode } });
    }
    return [type, dring];
}
exports.getGameTypeAndDring = getGameTypeAndDring;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getHighestRoundsData.ts":
/*!*******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getHighestRoundsData.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighestRoundData = void 0;
/**
 * ყველაზე მაღალი შედეგი რაც ქონდა მოთამაშეს წაღებული რიგებებში
 * null ბრუნდება როცა ყველა წაღებული score < 0 და
 * რეალურად არაფერი პოზიტიური არ მომხდარა ამ მოთამაშისთვის
 */
function getHighestRoundData(results) {
    const highestScore = Math.max(
    // ბოლო უნდა გამოვაკლოთ რადგან არ ითვლება
    ...results.slice(0, results.length - 1).map(y => y.score));
    if (highestScore <= 0) {
        return null;
    }
    const roundData = results.find(y => y.type === 'NORMAL' && y.score === highestScore);
    if (!roundData) {
        return null;
    }
    return {
        round: (roundData.type === 'NORMAL' && roundData.round),
        score: (roundData.type === 'NORMAL' && roundData.score),
    };
}
exports.getHighestRoundData = getHighestRoundData;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getJokerPlayerStats.ts":
/*!******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getJokerPlayerStats.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getJokerPlayerStats = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function getJokerPlayerStats(userId, allCommands, roundResults) {
    const sentBuzzCount = allCommands.filter(x => (x.type === 'BUZZ' && x.userId === userId) ||
        (x.type === 'SEND_INTERACTION' &&
            x.interaction.type === 'BUZZ' &&
            x.interaction.userId === userId)).length;
    const receivedBuzzCount = allCommands.filter(x => (x.type === 'BUZZ' && x.targetUserId === userId) ||
        (x.type === 'SEND_INTERACTION' &&
            x.interaction.type === 'BUZZ' &&
            x.interaction.targetUserId === userId)).length;
    const sentGiftsCount = allCommands.filter(x => (x.type === 'SEND_GIFT' && x.userId === userId) ||
        (x.type === 'SEND_INTERACTION' &&
            x.interaction.type === 'SEND_GIFT' &&
            x.interaction.userId === userId)).length;
    const receivedGiftsCount = allCommands.filter(x => (x.type === 'SEND_GIFT' && x.targetUserId === userId) ||
        (x.type === 'SEND_INTERACTION' &&
            x.interaction.type === 'SEND_GIFT' &&
            x.interaction.targetUserId === userId)).length;
    const sentRespectsCount = allCommands.filter(x => (x.type === 'RESPECT' && x.userId === userId) ||
        (x.type === 'SEND_INTERACTION' &&
            x.interaction.type === 'RESPECT' &&
            x.interaction.userId === userId)).length;
    const receivedRespectsCount = allCommands.filter(x => (x.type === 'RESPECT' && x.targetUserId === userId) ||
        (x.type === 'SEND_INTERACTION' &&
            x.interaction.type === 'RESPECT' &&
            x.interaction.targetUserId === userId)).length;
    const receivedDringsCount = roundResults.filter(x => x.type === 'NORMAL' && x.bid > 0 && x.taken === 0).length;
    const receivedBonusCount = roundResults.filter(x => x.type === 'BONUS').length;
    const goodTakesCount = roundResults.filter(x => x.type === 'NORMAL' && x.bid === x.taken).length;
    const failedTakesCount = roundResults.filter(x => x.type === 'NORMAL' && x.bid !== x.taken).length;
    /**
     * 5-და 5 სიტყვაზე
     */
    const fullTakes = roundResults
        .filter(x => x.type === 'NORMAL' &&
        x.bid === x.taken &&
        x.cardsCount === x.bid)
        .map(x => (x.type === 'NORMAL' && x.cardsCount))
        .reduce((r, x) => {
        var _a;
        r[x] = (_a = r[x]) !== null && _a !== void 0 ? _a : 0;
        r[x]++;
        return r;
    }, {});
    /**
     * get last section's score
     */
    const score = roundResults
        .filter(x => x.type === 'SUM')
        .sort((a, b) => b.section - a.section)[0].score;
    const jokerWantsCount = allCommands.filter(x => {
        var _a;
        return x.type === 'CARD2' &&
            x.userId === userId &&
            !x.isBot &&
            types_1.isJoker(x.card) && ((_a = x.jokerAction) === null || _a === void 0 ? void 0 : _a.want);
    }).length;
    const jokerDontWantsCount = allCommands.filter(x => {
        var _a;
        return x.type === 'CARD2' &&
            x.userId === userId &&
            !x.isBot &&
            types_1.isJoker(x.card) &&
            !((_a = x.jokerAction) === null || _a === void 0 ? void 0 : _a.want);
    }).length;
    let lastJoinedAt = 0;
    const timePlayedInMs = allCommands
        .filter(x => ((x.type === 'JOIN' ||
        x.type === 'LEAVE' ||
        x.type === 'CLIENT_LEAVE') &&
        x.userId === userId) ||
        x.type === 'FINISHED')
        .slice()
        .sort((a, b) => a.timestamp - b.timestamp)
        .reduce((r, x) => {
        if (x.type === 'JOIN') {
            lastJoinedAt = x.timestamp;
            return r;
        }
        if (lastJoinedAt &&
            (x.type === 'LEAVE' ||
                x.type === 'CLIENT_LEAVE' ||
                x.type === 'FINISHED')) {
            const duration = x.timestamp - lastJoinedAt;
            lastJoinedAt = 0;
            return r + duration;
        }
        return r;
    }, 0);
    const emotionsSent = allCommands
        .filter(x => x.type === 'CHAT_MESSAGE' && x.userId === userId)
        .reduce((r, x) => {
        if (x.type !== 'CHAT_MESSAGE') {
            return r;
        }
        r[x.message] = r[x.message] || 0;
        r[x.message]++;
        return r;
    }, {});
    const specialEmotionsSent = allCommands
        .filter(x => x.type === 'SEND_EMOTION' && x.fromUserId === userId)
        .reduce((r, x) => {
        if (x.type !== 'SEND_EMOTION') {
            return r;
        }
        r[x.code] = r[x.code] || 0;
        r[x.code]++;
        return r;
    }, {});
    const specialEmotionsSentToUser = allCommands
        .filter(x => x.type === 'SEND_EMOTION' && x.fromUserId === userId)
        .reduce((r, x) => {
        if (x.type !== 'SEND_EMOTION' || !x.toUserId) {
            return r;
        }
        r[x.code] = r[x.code] || 0;
        r[x.code]++;
        return r;
    }, {});
    const specialEmotionsReceived = allCommands
        .filter(x => x.type === 'SEND_EMOTION' && x.toUserId === userId)
        .reduce((r, x) => {
        if (x.type !== 'SEND_EMOTION') {
            return r;
        }
        r[x.code] = r[x.code] || 0;
        r[x.code]++;
        return r;
    }, {});
    return {
        sentBuzzCount,
        sentGiftsCount,
        sentRespectsCount,
        receivedBuzzCount,
        receivedGiftsCount,
        receivedRespectsCount,
        receivedDringsCount,
        receivedBonusCount,
        goodTakesCount,
        failedTakesCount,
        fullTakes,
        score,
        jokerWantsCount,
        jokerDontWantsCount,
        timePlayed: timePlayedInMs / (1000 * 60),
        emotions: {
            normalSent: emotionsSent,
            specialSent: specialEmotionsSent,
            specialSentToUser: specialEmotionsSentToUser,
            specialReceived: specialEmotionsReceived,
        },
    };
}
exports.getJokerPlayerStats = getJokerPlayerStats;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getNatarebiColor.ts":
/*!***************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getNatarebiColor.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getNatarebiColor = void 0;
function getNatarebiColor(firstCard) {
    return firstCard[2] ? firstCard[2].color : firstCard[0];
}
exports.getNatarebiColor = getNatarebiColor;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getNextPlayer.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getNextPlayer.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextPlayer = void 0;
function getNextPlayer(players, currPlayer) {
    const index = players.indexOf(currPlayer);
    return index + 1 < players.length ? players[index + 1] : players[0];
}
exports.getNextPlayer = getNextPlayer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getPairIndex.ts":
/*!***********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getPairIndex.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPairIndex = void 0;
function getPairIndex(index) {
    switch (index) {
        case 0:
            return 2;
        case 1:
            return 3;
        case 2:
            return 0;
        case 3:
            return 1;
        default:
            return null;
    }
}
exports.getPairIndex = getPairIndex;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getPlayAction.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getPlayAction.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayAction = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function getPlayAction(action) {
    if (action < 10) {
        return action;
    }
    if (action < 15) {
        return (action - 10);
    }
    // Card actions
    if (action < 51) {
        if (action < 24) {
            return [
                [types_1.CardColor.Hearts, (action - 15)],
            ];
        }
        if (action < 33) {
            return [
                [types_1.CardColor.Diamonds, (action - 24)],
            ];
        }
        if (action < 42) {
            return [
                [types_1.CardColor.Spades, (action - 33)],
            ];
        }
        return [[types_1.CardColor.Clubs, (action - 42)]];
    }
    // Joker card actions
    const cardColor = action < 61 ? types_1.CardColor.Spades : types_1.CardColor.Clubs;
    const i = action - (action < 61 ? 51 : 61);
    const want = i <= 5;
    const j = i < 6 ? i : i - 5;
    const color = j === 0 ? undefined : (j - 1);
    return [[cardColor, types_1.CardLevel.Joker], { want, color }];
}
exports.getPlayAction = getPlayAction;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getPlayer.ts":
/*!********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getPlayer.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayer = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
function getPlayer(state, userId) {
    const { id: refId, playersArray, userIds } = state;
    const player = playersArray.find(x => x.userId === userId);
    if (!player) {
        throw new utils_1.AppError('USER_NOT_FOUND_IN_GAME', {
            data: {
                refId,
                userId,
                userIds,
            },
        });
    }
    return player;
}
exports.getPlayer = getPlayer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getPlayerAtIndex.ts":
/*!***************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getPlayerAtIndex.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerAtIndex = void 0;
function getPlayerAtIndex(players, index) {
    return players[index % players.length];
}
exports.getPlayerAtIndex = getPlayerAtIndex;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getPositionedUserIds.ts":
/*!*******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getPositionedUserIds.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPositionedUserIds = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const next = utils_1.rotateNumber(0, 3);
function getPositionedUserIds(players, startIndex, isPairMode) {
    var _a, _b, _c, _d;
    if (isPairMode) {
        if (!players[0].position || !players[2].position) {
            const usedPositions = [
                players[0].position,
                players[2].position,
            ].filter(x => !!x);
            const pair1Positions = [
                types_1.PlayerPosition.Bottom,
                types_1.PlayerPosition.Top,
            ].filter(x => !usedPositions.includes(x));
            if (!players[0].position) {
                players[0].position = (_a = pair1Positions.pop()) !== null && _a !== void 0 ? _a : null;
            }
            if (!players[2].position) {
                players[2].position = (_b = pair1Positions.pop()) !== null && _b !== void 0 ? _b : null;
            }
        }
        if (!players[1].position || !players[3].position) {
            const usedPositions = [
                players[1].position,
                players[3].position,
            ].filter(x => !!x);
            const pair2Positions = [
                types_1.PlayerPosition.Left,
                types_1.PlayerPosition.Right,
            ].filter(x => !usedPositions.includes(x));
            if (!players[1].position) {
                players[1].position = (_c = pair2Positions.pop()) !== null && _c !== void 0 ? _c : null;
            }
            if (!players[3].position) {
                players[3].position = (_d = pair2Positions.pop()) !== null && _d !== void 0 ? _d : null;
            }
        }
        const userIds = players
            .sort((a, b) => a.position - b.position)
            .map(x => x.userId);
        return utils_1.rotateArray(userIds, startIndex);
    }
    // first fill empty spaces
    const pp = [1, 2, 3, 4];
    const playersWithoutPosition = players.filter(x => !x.position);
    const playersWithPosition = pp.map(x => {
        const player = players.find(y => y.position === x);
        return player || playersWithoutPosition.shift();
    });
    // next set positions by startIndex
    let i = startIndex;
    playersWithPosition[i].position = 1;
    i = next(i);
    playersWithPosition[i].position = 2;
    i = next(i);
    playersWithPosition[i].position = 3;
    i = next(i);
    playersWithPosition[i].position = 4;
    const userIds = players
        .sort((a, b) => a.position - b.position)
        .map(x => x.userId);
    return userIds;
}
exports.getPositionedUserIds = getPositionedUserIds;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getRandomizedDeckColors.ts":
/*!**********************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getRandomizedDeckColors.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomizedDeckColors = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const modernDeckCombinations = [
    [
        types_1.CardColor.Hearts,
        types_1.CardColor.Diamonds,
        types_1.CardColor.Spades,
        types_1.CardColor.Clubs,
    ],
    [
        types_1.CardColor.Diamonds,
        types_1.CardColor.Hearts,
        types_1.CardColor.Spades,
        types_1.CardColor.Clubs,
    ],
    [
        types_1.CardColor.Hearts,
        types_1.CardColor.Diamonds,
        types_1.CardColor.Clubs,
        types_1.CardColor.Spades,
    ],
    [
        types_1.CardColor.Diamonds,
        types_1.CardColor.Hearts,
        types_1.CardColor.Clubs,
        types_1.CardColor.Spades,
    ],
];
const colors = new Array(4).fill(0).map((_, i) => i);
const oldSchoolDeckCombinations = colors
    .flatMap(c1 => colors.flatMap(c2 => colors.flatMap(c3 => colors.map(c4 => [c1, c2, c3, c4]))))
    .filter(colors => 
// only unique values  with full length
colors.filter((x, i, self) => self.indexOf(x) === i).length ===
    4);
function getRandomizedDeckColors(deckType) {
    switch (deckType) {
        case 'OLD_SCHOOL':
            return oldSchoolDeckCombinations;
        default:
            return modernDeckCombinations;
    }
}
exports.getRandomizedDeckColors = getRandomizedDeckColors;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getRoundConfigs.ts":
/*!**************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getRoundConfigs.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoundConfigs = void 0;
const STANDARD_MODE = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 9, 9, 9],
    [8, 7, 6, 5, 4, 3, 2, 1],
    [9, 9, 9, 9],
];
const ONLY9_MODE = [
    [9, 9, 9, 9],
    [9, 9, 9, 9],
    [9, 9, 9, 9],
    [9, 9, 9, 9],
];
// prettier-ignore
const QUICK_MODE = [
    [9, 9, 9, 9],
];
const LUCKY_MODE = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
];
const LUCKY4_MODE = [
    [1, 2, 3, 4],
    [4, 3, 2, 1],
    [1, 2, 3, 4],
    [4, 3, 2, 1],
];
const JUST4_MODE = [[4, 4, 4, 4]];
const JUST5_MODE = [[5, 5, 5, 5]];
function getRoundConfigs(gameType) {
    switch (gameType) {
        case 'STANDARD':
            return STANDARD_MODE;
        case 'ONLY9':
            return ONLY9_MODE;
        case 'QUICK':
            return QUICK_MODE;
        case 'LUCKY':
            return LUCKY_MODE;
        case 'LUCKY4':
            return LUCKY4_MODE;
        case 'JUST4':
            return JUST4_MODE;
        case 'JUST5':
            return JUST5_MODE;
        default:
            return null;
    }
}
exports.getRoundConfigs = getRoundConfigs;
// function buildResult(
//   items: number[][],
// ): LinearLinkedList<LinearLinkedList<number>> {
//   return items.reduce(
//     (r1, section) =>
//       r1.append(
//         section.reduce(
//           (r2, x) => r2.append(x),
//           new LinearLinkedList<number>(),
//         ),
//       ),
//     new LinearLinkedList<LinearLinkedList<number>>(),
//   )
// }


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getScore.ts":
/*!*******************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getScore.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = void 0;
function getScore(stats, cardsCount) {
    const { bid, have } = stats;
    // ხიშტზე შემოწმება
    if (bid && !have) {
        return -1;
    }
    // როდესაც თავისი ვერ წაიღო
    if (bid !== have) {
        return have * 10;
    }
    // როდესაც იმდენი წაიღო რამდენი კარტიც იყო ნარიგები
    if (have === cardsCount) {
        return cardsCount * 100;
    }
    return have * 50 + 50;
}
exports.getScore = getScore;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getStateByPlayer.ts":
/*!***************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getStateByPlayer.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateByPlayer = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const getGameProgress_1 = __webpack_require__(/*! ./getGameProgress */ "./libs/joker/runtime/src/lib/domain/getGameProgress.ts");
const mapValidBotAction_1 = __webpack_require__(/*! ./mapValidBotAction */ "./libs/joker/runtime/src/lib/domain/mapValidBotAction.ts");
const rotateIndex = utils_1.rotateNumber(0, 3);
function getStateByPlayer(state, userId) {
    const { playersArray } = state;
    const index = playersArray.findIndex(x => x.userId === userId);
    const player = playersArray[index];
    // index-ის მიხედვით გაჭრა და ბოლონაწილზე მიერთება თავდაპირველი ნაწილის
    // რომ საჭირო მოტამაშე პირველი აღმოჩნდეს
    const players = player.playersView;
    const roundFirstPlayerIndex = state.roundFirstPlayerIndex != null
        ? rotateIndex(state.roundFirstPlayerIndex, -index)
        : null;
    const stepFirstPlayerIndex = state.stepFirstPlayerIndex != null
        ? rotateIndex(state.stepFirstPlayerIndex, -index)
        : null;
    const currentPlayerIndex = player.positionIndex !== null
        ? rotateIndex(player.positionIndex, -index)
        : null;
    return {
        refId: state.id,
        status: state.status,
        type: state.type,
        dring: state.dring,
        section: state.sectionIndex + 1,
        round: state.roundIndex + 1,
        step: state.step,
        roundFirstPlayerIndex,
        stepFirstPlayerIndex,
        trump: state.trump,
        bidLimit: state.bidLimit,
        bidBalance: state.bidBalance,
        downCards: players.map(x => x.downCard),
        validActions: state.validActions.map((x) => mapValidBotAction_1.mapValidBotAction(x, state.status)),
        // debug: {
        //   positions: players.map(x => x.position),
        //   originalDownCards: playersArray.map(x => x.downCard),
        // },
        progress: getGameProgress_1.getGameProgress(state),
        currentPlayer: {
            index: currentPlayerIndex,
            cards: state.status === 'WAITING_TRUMP'
                ? player.cards.slice(0, 3)
                : player.cards,
            cardVisibilities: state.status === 'WAITING_TRUMP'
                ? player.cardVisibilities.slice(0, 3)
                : player.cardVisibilities,
            cardPermissions: state.status === 'WAITING_CARD' ? player.cardPermissions : [],
        },
        players: players.map(x => ({
            downCard: x.downCard,
            roundStats: x.roundStats,
            lastRoundStats: x.lastRoundStats,
            results: x.results,
            usedCards: x.usedCardsInRound,
        })),
    };
}
exports.getStateByPlayer = getStateByPlayer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/getTrumpColor.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/getTrumpColor.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrumpColor = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function getTrumpColor(trump) {
    return Array.isArray(trump)
        ? types_1.isJoker(trump)
            ? types_1.CardColor.None
            : trump[0]
        : trump;
}
exports.getTrumpColor = getTrumpColor;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/isGameStarted.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/isGameStarted.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isGameStarted = void 0;
function isGameStarted(state) {
    return (state.status === 'WAITING_TRUMP' ||
        state.status === 'WAITING_BID' ||
        state.status === 'WAITING_CARD');
}
exports.isGameStarted = isGameStarted;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/mapValidBotAction.ts":
/*!****************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/mapValidBotAction.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mapValidBotAction = void 0;
/* eslint-disable no-case-declarations */
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
function mapValidBotAction(action, status) {
    switch (status) {
        case 'WAITING_BID':
            return action;
        case 'WAITING_TRUMP':
            return (10 + action);
        case 'WAITING_CARD':
            const [card, jokerAction] = action;
            if (!types_1.isJoker(card)) {
                let i = 15;
                switch (card[0]) {
                    case types_1.CardColor.Diamonds:
                        i = 24;
                        break;
                    case types_1.CardColor.Spades:
                        i = 33;
                        break;
                    case types_1.CardColor.Clubs:
                        i = 42;
                        break;
                }
                return i + card[1]; /* CardLevel */
            }
            let i = card[0] === types_1.CardColor.Spades ? 51 : 61;
            if (!(jokerAction === null || jokerAction === void 0 ? void 0 : jokerAction.want)) {
                i += 5;
            }
            if ((jokerAction === null || jokerAction === void 0 ? void 0 : jokerAction.color) != null) {
                i += jokerAction.color + 1;
            }
            return i;
        default:
            return types_1.JokerBotAction.Unknown;
    }
}
exports.mapValidBotAction = mapValidBotAction;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/sortCards.ts":
/*!********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/sortCards.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sortCards = void 0;
function sortCards(cards) {
    return cards
        .slice()
        .sort((a, b) => getCardValue(b) - getCardValue(a));
}
exports.sortCards = sortCards;
function getCardValue(c) {
    return c[0] * 20 + (10 - c[1]);
}


/***/ }),

/***/ "./libs/joker/runtime/src/lib/domain/whoTook.ts":
/*!******************************************************!*\
  !*** ./libs/joker/runtime/src/lib/domain/whoTook.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.whoTook = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const getNatarebiColor_1 = __webpack_require__(/*! ./getNatarebiColor */ "./libs/joker/runtime/src/lib/domain/getNatarebiColor.ts");
/**
 * ვინ წაიღო, უკან აბრუნდებს მოთამაშის ინდექსს
 * @param cards - ჩამოსული კარტი შესაძლოა იყოს null მხოლოდ მაშინ როდესაც პროგნოზის გაკეთება გვინდა ვის მიაქვს, თუმცა პირველი (firstCardIndex) კარტი ყოველთვის უნდა იყოს განსაზღვურლი
 * @param trumpColor - კოზირი ფერი
 * @param firstCardIndex - პირველი ჩამოსული კარტის ინდექსი
 */
function whoTook(cards, trumpColor, firstCardIndex) {
    var _a;
    const jokerValues = utils_1.rotateArray([0, 1, 2, 3], firstCardIndex);
    const firstCard = cards[firstCardIndex];
    if (!firstCard) {
        return -1;
    }
    const firstCardColor = getNatarebiColor_1.getNatarebiColor(firstCard);
    // როცა ჯოკერმა აცხადა რომ სურს კოზირისგან განსხვავებული ფერი
    const jokerWantsNonTrump = ((_a = firstCard[2]) === null || _a === void 0 ? void 0 : _a.want) && firstCard[2].color !== trumpColor;
    const jokerDontWantColor = firstCard[2] && !firstCard[2].want ? firstCard[2].color : null;
    const cardValues = cards.map((card, i) => {
        if (!card) {
            return 0;
        }
        const [color, level, jokerAction] = card;
        return jokerAction
            ? // თუ ჯოეკრია
                jokerAction.want
                    ? // თუ სურს ჯოკერს
                        (jokerWantsNonTrump && i === firstCardIndex ? 20 : 100) +
                            // ბოლო ჩამოსულ ჯოკერს მეტი უპირატესობა აქვს
                            jokerValues[i]
                    : // თუ არ სურს ჯოკერს
                        i === firstCardIndex
                            ? 1
                            : 0
            : // თუ არც ნატარები ფერია და არც კოზირი, მაშინ ვანულებთ
                i !== firstCardIndex &&
                    color !== firstCardColor &&
                    color !== trumpColor
                    ? 0
                    : level +
                        // რადგან level-ი 0-დან იწყება
                        1 +
                        // კოზირს დამატებით 20 ქულა უპირატესობის მოსაპოვებლად
                        // რადგან ფერში 9 კარტია მაქსიმუმ +20 ქულა საკმარისია
                        (color === trumpColor ? 50 : 0) +
                        // როდესაც ჯოკერმა აცხადა წაიღოსო და
                        // კარტის ფერი დაემთხვა ნაცხადებ ფერს
                        (color === jokerDontWantColor ? 20 : 0);
    });
    const max = Math.max(...cardValues);
    return cardValues.indexOf(max);
}
exports.whoTook = whoTook;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/game.command.ts":
/*!****************************************************!*\
  !*** ./libs/joker/runtime/src/lib/game.command.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/joker/runtime/src/lib/game.reducer.ts":
/*!****************************************************!*\
  !*** ./libs/joker/runtime/src/lib/game.reducer.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.gameReducer = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const backInGame_1 = __webpack_require__(/*! ./reducers/common/backInGame */ "./libs/joker/runtime/src/lib/reducers/common/backInGame.ts");
const init_1 = __webpack_require__(/*! ./reducers/common/init */ "./libs/joker/runtime/src/lib/reducers/common/init.ts");
const join_1 = __webpack_require__(/*! ./reducers/common/join */ "./libs/joker/runtime/src/lib/reducers/common/join.ts");
const leave_1 = __webpack_require__(/*! ./reducers/common/leave */ "./libs/joker/runtime/src/lib/reducers/common/leave.ts");
const sit_1 = __webpack_require__(/*! ./reducers/common/sit */ "./libs/joker/runtime/src/lib/reducers/common/sit.ts");
const bid_1 = __webpack_require__(/*! ./reducers/game/bid */ "./libs/joker/runtime/src/lib/reducers/game/bid.ts");
const card_1 = __webpack_require__(/*! ./reducers/game/card */ "./libs/joker/runtime/src/lib/reducers/game/card.ts");
const trump_1 = __webpack_require__(/*! ./reducers/game/trump */ "./libs/joker/runtime/src/lib/reducers/game/trump.ts");
const deal_1 = __webpack_require__(/*! ./reducers/internal/deal */ "./libs/joker/runtime/src/lib/reducers/internal/deal.ts");
const start_1 = __webpack_require__(/*! ./reducers/internal/start */ "./libs/joker/runtime/src/lib/reducers/internal/start.ts");
function gameReducer(state, x) {
    switch (x.type) {
        // common
        case 'CREATE':
            return init_1.initReducer(state, x.gameMode, x.roomRefId, x.userIds, x.collectDebugData, x.randomSeed, x.deckType, x.isAntiCheatEnabled, x.isPairMode);
        case 'JOIN':
            return join_1.joinReducer(state, x.userId, x.socketId);
        case 'LEAVE':
        case 'CLIENT_LEAVE':
            return leave_1.leaveReducer(state, x.userId, x.socketId, x.type === 'CLIENT_LEAVE');
        case 'BACK_IN_GAME':
            return backInGame_1.backInGameReducer(state, x.userId);
        case 'SIT':
            return sit_1.sitReducer(state, x.userId, x.position);
        case 'START':
            return start_1.startReducer(state, x.userIds);
        // DEPRECATED. in favor of DEAL2
        case 'DEAL':
            return deal_1.dealReducer(state, x.trumpCard ? [x.trumpCard[1], x.trumpCard[0]] : null, x.playerCards.map(x => ({
                userId: x.userId,
                cards: x.cards.map(([level, color]) => [color, level]),
            })));
        case 'DEAL2':
            return deal_1.dealReducer(state, x.trumpCard, x.playerCards);
        // სანახავია იქნებ არ არის საჭირო
        case 'DO_NEXT':
            return [state, [], true];
        // in game
        case 'BID':
            return bid_1.bidReducer(state, x.userId, x.want);
        // DEPRECATED. in favor of CARD2
        case 'CARD': {
            const jokerSubAction = types_1.isJoker([x.cardColor, x.cardLevel])
                ? {
                    want: x.isActivated,
                    color: x.specialColor === -1 ? null : x.specialColor,
                }
                : null;
            return card_1.cardReducer(state, x.userId, [
                x.cardColor,
                x.cardLevel,
                jokerSubAction,
            ]);
        }
        case 'CARD2': {
            return card_1.cardReducer(state, x.userId, [
                ...x.card,
                x.jokerAction,
            ]);
        }
        case 'TRUMP':
            return trump_1.trumpReducer(state, x.userId, x.color);
        default:
            return [state, [], false];
    }
}
exports.gameReducer = gameReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/game.state.ts":
/*!**************************************************!*\
  !*** ./libs/joker/runtime/src/lib/game.state.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/finishGame.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/finishGame.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.finishGame = void 0;
function finishGame(state, output) {
    const { id: roomId, sectionIndex, playersArray } = state;
    const lastSection = sectionIndex + 1;
    const playerScores = playersArray.map(x => {
        var _a;
        return ({
            userId: x.userId,
            score: (_a = x.results.find(x => x.type === 'SUM' && x.section === lastSection)) === null || _a === void 0 ? void 0 : _a.score,
        });
    });
    state.status = 'FINISHED';
    output.push({
        type: 'GAME_FINISHED',
        roomId,
        playerScores,
    });
    return [state, output, true];
}
exports.finishGame = finishGame;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/finishRound.ts":
/*!*************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/finishRound.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.finishRound = void 0;
const getDringValue_1 = __webpack_require__(/*! ../domain/getDringValue */ "./libs/joker/runtime/src/lib/domain/getDringValue.ts");
const getScore_1 = __webpack_require__(/*! ../domain/getScore */ "./libs/joker/runtime/src/lib/domain/getScore.ts");
const finishSection_1 = __webpack_require__(/*! ./finishSection */ "./libs/joker/runtime/src/lib/lifecycle/finishSection.ts");
const startRound_1 = __webpack_require__(/*! ./startRound */ "./libs/joker/runtime/src/lib/lifecycle/startRound.ts");
function finishRound(state, output) {
    const { roundConfigs, sectionIndex, roundIndex, playersArray, } = state;
    // განვსაზღვროთ მოთამაშეები ვინც ერთი მაინც წაიღეს
    // გამოგვადგება თუ ვინმე გაიხიშტა იმ შემთხვევაში
    const takerUserIds = playersArray
        .filter(x => { var _a; return !!((_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.have); })
        .map(x => x.userId);
    // გახიშტული მოთამაშეების userId-ები
    const dringgedUserIds = [];
    // Round-ს რეზულტატების განახლება
    state.playersArray.forEach(x => {
        // creating new reference
        x.lastRoundStats = x.roundStats ? { ...x.roundStats } : null;
        const score = getScore_1.getScore(x.roundStats, state.cardsCount);
        const section = state.sectionIndex + 1;
        x.results.push({
            type: 'NORMAL',
            section,
            round: state.roundIndex + 1,
            bid: x.roundStats.bid,
            taken: x.roundStats.have,
            score,
            cardsCount: roundConfigs[sectionIndex][roundIndex],
        });
        const sumItem = x.results.find(y => y.type === 'SUM' && y.section === section);
        sumItem.score +=
            score === -1
                ? -getDringValue_1.getDringValue(state.dring, state.cardsCount, section)
                : score;
        if (score === -1) {
            x.dringsCount++;
            dringgedUserIds.push(x.userId);
            state.dringgedPlayersLog = state.dringgedPlayersLog.concat({
                userId: x.userId,
                byUserIds: takerUserIds,
                section,
                round: roundIndex + 1,
                cardsCount: roundConfigs[sectionIndex][roundIndex],
            });
        }
        x.roundStats = null;
    });
    if (dringgedUserIds.length) {
        output.push({
            type: 'PLAYERS_DRINGGED',
            dringgerUserIds: takerUserIds,
            dringgedUserIds,
        });
    }
    output.push({
        type: 'ROUND_FINISHED',
        roundIndex,
        sectionIndex,
    });
    // ყოველი Round-ს მორჩენის შემდეგ საჭიროა გაიზარდოს globalIndex
    state.globalIndex++;
    state.bidBalance = null;
    // 4. start next round
    const nextCardsCount = roundConfigs[sectionIndex][roundIndex + 1];
    if (nextCardsCount) {
        state.roundIndex++;
        state.cardsCount = nextCardsCount;
        return startRound_1.startRound(state, output);
    }
    return finishSection_1.finishSection(state, output);
}
exports.finishRound = finishRound;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/finishSection.ts":
/*!***************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/finishSection.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.finishSection = void 0;
const getHighestRoundsData_1 = __webpack_require__(/*! ../domain/getHighestRoundsData */ "./libs/joker/runtime/src/lib/domain/getHighestRoundsData.ts");
const getPairIndex_1 = __webpack_require__(/*! ../domain/getPairIndex */ "./libs/joker/runtime/src/lib/domain/getPairIndex.ts");
const finishGame_1 = __webpack_require__(/*! ./finishGame */ "./libs/joker/runtime/src/lib/lifecycle/finishGame.ts");
const startSection_1 = __webpack_require__(/*! ./startSection */ "./libs/joker/runtime/src/lib/lifecycle/startSection.ts");
function finishSection(state, output) {
    const { playersArray, roundConfigs, sectionIndex, settings: { isPairMode }, } = state;
    const section = sectionIndex + 1;
    // პრემიაზე შემოწმება
    const bonusPlayers = state.playersArray.filter(x => {
        const isBonus = x.results
            .filter(y => y.section === section && y.type === 'NORMAL')
            .every(y => y.type === 'NORMAL' && y.bid === y.taken);
        return isBonus;
    });
    // თუ მხოლოდ 1 მოთამაშე გავიდა პრემიაზე, მას უორმაგდება და სხვებს ეშლებათ
    // ამ ეტაპზე ყველა ეშლება რათა ტესტი გაიაროს, შემდგომ მხოლოდ წაღებულები წაეშლებათ
    if (bonusPlayers.length === 1) {
        const bonusPlayer = bonusPlayers[0];
        const playersNormalResults = playersArray.map(x => x.results.filter(y => y.section === section && y.type === 'NORMAL'));
        const highestRoundsData = playersNormalResults.map(x => getHighestRoundsData_1.getHighestRoundData(x));
        playersArray.forEach((x, i) => {
            let bonusScore = 0;
            if (x === bonusPlayer) {
                const bonusRound = highestRoundsData[i];
                if (bonusRound) {
                    x.results.push({
                        type: 'BONUS',
                        section,
                        round: bonusRound.round,
                        score: bonusRound.score,
                    });
                    bonusScore = bonusRound.score;
                }
            }
            else {
                let hasMinusBonus = true;
                if (isPairMode) {
                    const bonusPlayerPairIndex = getPairIndex_1.getPairIndex(bonusPlayer.positionIndex);
                    if (x.positionIndex === bonusPlayerPairIndex) {
                        /**
                         * მეწყვილეს არ ვუშლით
                         */
                        hasMinusBonus = false;
                    }
                    else {
                        const pairIndex = getPairIndex_1.getPairIndex(i);
                        /**
                         * ხოლო მოწინააღმდეგე პარიდან რომელსაც უფრო დიდი ჰყავს
                         * იმას ეშლება მხოლოდ
                         */
                        if (i < 2 &&
                            highestRoundsData[pairIndex].score >
                                highestRoundsData[i].score) {
                            hasMinusBonus = false;
                        }
                        /**
                         * თუ ორივე მოწინააღმდეგეს ერთნაირი ქულა ჰქონდა,
                         * შემოწმება, მეორესაც რომ არ წაეშალოს
                         */
                        if (i >= 2 &&
                            highestRoundsData[pairIndex].score >=
                                highestRoundsData[i].score) {
                            hasMinusBonus = false;
                        }
                    }
                }
                if (hasMinusBonus) {
                    const removeBonusRound = highestRoundsData[i];
                    if (removeBonusRound) {
                        x.results.push({
                            type: 'REMOVED_BY_BONUS',
                            section,
                            round: removeBonusRound.round,
                            score: removeBonusRound.score,
                        });
                        bonusScore = -removeBonusRound.score;
                    }
                }
            }
            const sum = x.results.find(x => x.section === section && x.type === 'SUM');
            // update section sum with bonus score
            sum.score += bonusScore;
        });
    }
    // თუ რამდენიმე გავიდა პრემიაზე, მხოლოდ უორმაგდებათ
    if (bonusPlayers.length > 1) {
        let isSamePair = false;
        /**
         * გარკვევა ერთიდაიგივე პარის წევრები არიან თუ არა
         * პრემიაზე გასული მოთამაშეები
         */
        if (isPairMode && bonusPlayers.length === 2) {
            isSamePair =
                getPairIndex_1.getPairIndex(bonusPlayers[0].positionIndex) ===
                    bonusPlayers[1].positionIndex;
        }
        bonusPlayers.forEach(x => {
            const sectionNormalResults = x.results.filter(y => y.section === section && y.type === 'NORMAL');
            const highestRoundData = getHighestRoundsData_1.getHighestRoundData(sectionNormalResults);
            if (highestRoundData) {
                x.results.push({
                    type: 'BONUS',
                    section,
                    round: highestRoundData.round,
                    score: highestRoundData.score,
                });
                const sum = x.results.find(x => x.section === section && x.type === 'SUM');
                // update section sum with bonus score
                sum.score += highestRoundData.score;
            }
        });
        /**
         * თუ ორი მოთამაშე გავიდა პრემიაზე და ორივე ერთი პარის წევრია
         * მაშინ მოწინააღმდეგეებს ორივეს ყველაზე დიდი წაღებული ეშლებათ
         */
        if (isPairMode && isSamePair) {
            playersArray
                .filter(x => !bonusPlayers.includes(x))
                .forEach(x => {
                const sectionNormalResults = x.results.filter(y => y.section === section && y.type === 'NORMAL');
                const highestRoundData = getHighestRoundsData_1.getHighestRoundData(sectionNormalResults);
                const removeBonusRound = highestRoundData;
                if (removeBonusRound) {
                    x.results.push({
                        type: 'REMOVED_BY_BONUS',
                        section,
                        round: removeBonusRound.round,
                        score: removeBonusRound.score,
                    });
                    const sum = x.results.find(x => x.section === section && x.type === 'SUM');
                    sum.score += -removeBonusRound.score;
                }
            });
        }
        /**
         * თუ სხვადასხვა პარიდან გავიდა ორი მოთამაშე პრემიაზე,
         * არავის არაფერი არ ეშლება, მხოლოდ უორმაგდებათ
         */
    }
    output.push({
        type: 'SECTION_FINISHED',
        sectionIndex: state.sectionIndex,
    });
    // 5. start next round
    const nextSection = roundConfigs[sectionIndex + 1];
    if (nextSection) {
        state.sectionIndex++;
        return startSection_1.startSection(state, output);
    }
    // 6. finishgame
    return finishGame_1.finishGame(state, output);
}
exports.finishSection = finishSection;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/finishStep.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/finishStep.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.finishStep = void 0;
const getTrumpColor_1 = __webpack_require__(/*! ../domain/getTrumpColor */ "./libs/joker/runtime/src/lib/domain/getTrumpColor.ts");
const whoTook_1 = __webpack_require__(/*! ../domain/whoTook */ "./libs/joker/runtime/src/lib/domain/whoTook.ts");
const finishRound_1 = __webpack_require__(/*! ./finishRound */ "./libs/joker/runtime/src/lib/lifecycle/finishRound.ts");
const startStep_1 = __webpack_require__(/*! ./startStep */ "./libs/joker/runtime/src/lib/lifecycle/startStep.ts");
function finishStep(state, output) {
    const { trump, playersArray, stepFirstPlayerIndex } = state;
    // გავიგოთ ვინ წაიღო
    const downCards = playersArray.map(x => x.downCard);
    const trumpColor = getTrumpColor_1.getTrumpColor(trump);
    const stepWinnerPlayerIndex = whoTook_1.whoTook(downCards, trumpColor, stepFirstPlayerIndex);
    if (state.debug) {
        state.debug.whoTookCalls.push({
            section: state.sectionIndex + 1,
            round: state.roundIndex + 1,
            step: state.step,
            downCards,
            trumpColor,
            stepFirstPlayerIndex,
            stepWinnerPlayerIndex,
        });
    }
    // update round stats
    const stepWinnerPlayer = playersArray[stepWinnerPlayerIndex];
    stepWinnerPlayer.roundStats.have++;
    // reset step level data
    state.stepFirstPlayerIndex = null;
    playersArray.forEach(x => {
        x.usedCardsInRound.push(x.downCard);
        x.downCard = null;
    });
    output.push({
        type: 'STEP_FINISHED',
        step: state.step,
        stepWinnerPlayer,
        winnerPlayerBid: stepWinnerPlayer.roundStats.bid,
        winnerPlayerHave: stepWinnerPlayer.roundStats.have,
    });
    // 3. შევამოწმოთ ხომ არ მორჩენილა რიგება
    if (state.step < state.cardsCount) {
        state.activePlayer = stepWinnerPlayer;
        return startStep_1.startStep(state, output);
    }
    return finishRound_1.finishRound(state, output);
}
exports.finishStep = finishStep;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/sendBidRequest.ts":
/*!****************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/sendBidRequest.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBidRequest = void 0;
const generatePlayActions_1 = __webpack_require__(/*! ../domain/generatePlayActions */ "./libs/joker/runtime/src/lib/domain/generatePlayActions.ts");
const getBidLimit_1 = __webpack_require__(/*! ../domain/getBidLimit */ "./libs/joker/runtime/src/lib/domain/getBidLimit.ts");
function sendBidRequest(state, output) {
    const { playersArray, cardsCount, activePlayer } = state;
    // სტატუსის დაყენება
    state.status = 'WAITING_BID';
    // შეზღუდვა, რამდენს გარდაა, null თუ ყველაფერი დაშვებულია
    state.bidLimit = getBidLimit_1.getBidLimit(playersArray, cardsCount);
    // დაშვებული action-ების განახლება
    state.validActions = generatePlayActions_1.generateBidActions(cardsCount, state.bidLimit);
    output.push({
        type: 'REQUEST_BID',
        userId: activePlayer.userId,
        bidLimit: state.bidLimit,
    });
    return [state, output, true];
}
exports.sendBidRequest = sendBidRequest;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/sendCardRequest.ts":
/*!*****************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/sendCardRequest.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCardRequest = void 0;
const generatePlayActions_1 = __webpack_require__(/*! ../domain/generatePlayActions */ "./libs/joker/runtime/src/lib/domain/generatePlayActions.ts");
const getCardPermissions_1 = __webpack_require__(/*! ../domain/getCardPermissions */ "./libs/joker/runtime/src/lib/domain/getCardPermissions.ts");
const getTrumpColor_1 = __webpack_require__(/*! ../domain/getTrumpColor */ "./libs/joker/runtime/src/lib/domain/getTrumpColor.ts");
function sendCardRequest(state, output) {
    var _a;
    const { trump, playersArray, stepFirstPlayerIndex } = state;
    // აქტიური მოთამაშე, რომელსაც ეგზავნება კარტის მოთხოვნა
    const activePlayer = state.activePlayer;
    // კოზირი ფერის განსაზღვრა
    const trumpColor = getTrumpColor_1.getTrumpColor(trump);
    // ნატარები კარტის განსაზღვრა
    const firstCard = (_a = playersArray[stepFirstPlayerIndex].downCard) !== null && _a !== void 0 ? _a : null;
    // სტატუსის დაყენება
    state.status = 'WAITING_CARD';
    // permission-ების განახლება, თუ რისი ჩამოსვლა შეუძლია
    activePlayer.cardPermissions = getCardPermissions_1.getCardPermissions(activePlayer.cards, activePlayer.cardVisibilities, trumpColor, firstCard);
    if (state.debug) {
        state.debug.cardPermissionCalls.push({
            cards: JSON.parse(JSON.stringify(activePlayer.cards)),
            cardVisibilities: JSON.parse(JSON.stringify(activePlayer.cardVisibilities)),
            trumpColor,
            firstCard,
            cardPermissions: JSON.parse(JSON.stringify(activePlayer.cardPermissions)),
            userId: activePlayer.userId,
            playerIndex: activePlayer.positionIndex,
        });
    }
    // დაშვებული action-ების განახლება
    state.validActions = generatePlayActions_1.generateCardActions(activePlayer.cards, activePlayer.cardVisibilities, activePlayer.cardPermissions, activePlayer.positionIndex === state.stepFirstPlayerIndex);
    // if (settings.isAntiCheatEnabled) {
    //   const virtualCards = activePlayer.cards.map(x =>
    //     toVirtualCard(x, true, activePlayer.toVirtualColorMap!),
    //   )
    //   const sortedVirtualCards = sortCards(virtualCards)
    //   const indexMap = sortedVirtualCards.reduce(
    //     (r, x, i) =>
    //       r.set(
    //         i,
    //         virtualCards.findIndex(y => x[0] === y[0] && x[1] === y[1]),
    //       ),
    //     new Map<number, number>(),
    //   )
    //   activePlayer.virtualCardVisibilities = activePlayer.cardVisibilities.map(
    //     (_, i) => activePlayer.cardVisibilities[indexMap.get(i)!],
    //   )
    //   activePlayer.virtualCardPermissions = activePlayer.cardPermissions.map(
    //     (_, i) => activePlayer.cardPermissions[indexMap.get(i)!],
    //   )
    // }
    output.push({
        type: 'REQUEST_CARD',
        userId: activePlayer.userId,
        cards: activePlayer.cards,
        cardVisibilities: activePlayer.cardVisibilities,
        cardPermissions: activePlayer.cardPermissions,
        isFirstCard: !firstCard,
    });
    return [state, output, true];
}
exports.sendCardRequest = sendCardRequest;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/sendTrumpRequest.ts":
/*!******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/sendTrumpRequest.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTrumpRequest = void 0;
const generatePlayActions_1 = __webpack_require__(/*! ../domain/generatePlayActions */ "./libs/joker/runtime/src/lib/domain/generatePlayActions.ts");
function sendTrumpRequest(state, output) {
    const { activePlayer } = state;
    // სტატუსის დაყენება
    state.status = 'WAITING_TRUMP';
    // დაშვებული action-ების განახლება
    state.validActions = generatePlayActions_1.generateTrumpActions();
    output.push({
        type: 'REQUEST_TRUMP',
        userId: activePlayer === null || activePlayer === void 0 ? void 0 : activePlayer.userId,
    });
    return [state, output, true];
}
exports.sendTrumpRequest = sendTrumpRequest;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/startGame.ts":
/*!***********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/startGame.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = void 0;
const startSection_1 = __webpack_require__(/*! ./startSection */ "./libs/joker/runtime/src/lib/lifecycle/startSection.ts");
function startGame(state, output) {
    const { cardsCount, userIds, roundConfigs } = state;
    state.status = 'WAITING_TRUMP';
    // create sum items in the results for all players, all sections
    // next we will just inc the score
    state.playersArray.forEach(x => {
        const sumItems = roundConfigs.map((_, i) => ({
            type: 'SUM',
            section: i + 1,
            score: 0,
        }));
        x.results.push(...sumItems);
    });
    state.sectionIndex = 0;
    state.globalIndex = 0;
    return startSection_1.startSection(state, output);
}
exports.startGame = startGame;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/startRound.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/startRound.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startRound = void 0;
const getPlayerAtIndex_1 = __webpack_require__(/*! ../domain/getPlayerAtIndex */ "./libs/joker/runtime/src/lib/domain/getPlayerAtIndex.ts");
function startRound(state, output) {
    const { userIds, playersArray, roundConfigs, sectionIndex, roundIndex, } = state;
    // რიგების დაწყებისას ყოველთვის ხდება აქტიური მოთამაშის განსაზღვრა
    // globalIndex-ს დახმარებით
    state.activePlayer = getPlayerAtIndex_1.getPlayerAtIndex(playersArray, state.globalIndex);
    state.roundFirstPlayerIndex = playersArray.indexOf(state.activePlayer);
    state.stepFirstPlayerIndex = state.roundFirstPlayerIndex;
    state.cardsCount = roundConfigs[sectionIndex][roundIndex];
    // Step იქნება 0 სანამ კარტი დარიგდება, მოთამაშეები აცხადებენ კოზირს და bid-ს
    // და გახდება 1 როცა უკვე გადავალთ პირველი კარტის ჩამოსვლის მოთხოვნაზე
    state.step = 0;
    output.push({
        type: 'DEAL_REQUEST',
        cardsCount: state.cardsCount,
        userIds,
    });
    return [state, output, true];
}
exports.startRound = startRound;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/startSection.ts":
/*!**************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/startSection.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startSection = void 0;
const startRound_1 = __webpack_require__(/*! ./startRound */ "./libs/joker/runtime/src/lib/lifecycle/startRound.ts");
function startSection(state, output) {
    const { sectionIndex, playersArray } = state;
    // ვიწყებთ პირველი Round-ით
    state.roundIndex = 0;
    const lastSection = sectionIndex;
    const newSection = sectionIndex + 1;
    if (sectionIndex > 0)
        playersArray.forEach(x => {
            const lastSumItem = x.results.find(x => x.type === 'SUM' && x.section === lastSection);
            const sumItem = x.results.find(x => x.type === 'SUM' && x.section === newSection);
            // როდესაც ახალი Section იწყება, ვიღებთ საწყის მნიშვნელობად წინა Section-ს score-ს
            sumItem.score = lastSumItem.score;
        });
    return startRound_1.startRound(state, output);
}
exports.startSection = startSection;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/lifecycle/startStep.ts":
/*!***********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/lifecycle/startStep.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startStep = void 0;
const sendCardRequest_1 = __webpack_require__(/*! ./sendCardRequest */ "./libs/joker/runtime/src/lib/lifecycle/sendCardRequest.ts");
function startStep(state, output) {
    const { activePlayer } = state;
    // გავზარდეთ Step ერთით, თავდაპირველად ცხადების შემდგომ იქნებოდა 0 და გახდება 1
    state.step++;
    // განსაზღვრა ვინ დაიწყო ჩამოსვლა, ვინ ატარა კარტი
    state.stepFirstPlayerIndex = state.playersArray.indexOf(activePlayer);
    return sendCardRequest_1.sendCardRequest(state, output);
}
exports.startStep = startStep;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/common/backInGame.ts":
/*!******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/common/backInGame.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.backInGameReducer = void 0;
const getPlayer_1 = __webpack_require__(/*! ../../domain/getPlayer */ "./libs/joker/runtime/src/lib/domain/getPlayer.ts");
function backInGameReducer(state, userId) {
    const player = getPlayer_1.getPlayer(state, userId);
    // player.status = 'ONLINE'
    const output = [];
    return [state, output, true];
}
exports.backInGameReducer = backInGameReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/common/init.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/common/init.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.initReducer = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const getGameTypeAndDring_1 = __webpack_require__(/*! ../../domain/getGameTypeAndDring */ "./libs/joker/runtime/src/lib/domain/getGameTypeAndDring.ts");
const getRoundConfigs_1 = __webpack_require__(/*! ../../domain/getRoundConfigs */ "./libs/joker/runtime/src/lib/domain/getRoundConfigs.ts");
function initReducer(_, mode, roomId, userIds, collectDebugData, randomSeed, deckType = 'MODERN', isAntiCheatEnabled = false, isPairMode = false) {
    if (userIds.length !== 4) {
        throw new utils_1.AppError('CREATE_NEEDS_4_PLAYERS', {
            errorMessage: 'Need 4 players to create joker state',
            data: {
                roomRefId: roomId,
                userIds,
            },
        });
    }
    const [type, dring] = getGameTypeAndDring_1.getGameTypeAndDring(mode);
    const roundConfigs = getRoundConfigs_1.getRoundConfigs(type);
    if (!roundConfigs) {
        throw new utils_1.AppError('INVALID_GAME_MODE', {
            data: { gameMode: mode },
            errorMessage: 'CREATE action failed, did not find roundConfigs by Game Mode ',
        });
    }
    const cardsCount = roundConfigs[0][0];
    const playersArray = userIds.map(x => ({
        userId: x,
        positionIndex: null,
        status: 'OFFLINE',
        cards: [],
        cardVisibilities: [],
        cardPermissions: [],
        usedCardsInRound: [],
        results: [],
        roundStats: null,
        lastRoundStats: null,
        downCard: null,
        dringsCount: 0,
        playersView: [],
        finishInfo: null,
        socketId: null,
        toVirtualColorMap: null,
        fromVirtualColorMap: null,
        virtualCardPermissions: null,
        virtualCardVisibilities: null,
        fillOpponentsCount: 0,
        softFillOpponentsCount: 0,
    }));
    const state = {
        id: roomId,
        type,
        dring,
        deckType,
        status: 'WAITING_START',
        userIds,
        playersArray,
        settings: {
            randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : null,
            isAntiCheatEnabled,
            isPairMode,
        },
        bidLimit: null,
        bidBalance: null,
        step: 0,
        trump: null,
        roundConfigs,
        sectionIndex: 0,
        roundIndex: 0,
        globalIndex: 0,
        roundFirstPlayerIndex: 0,
        stepFirstPlayerIndex: null,
        cardsCount,
        activePlayer: null,
        validActions: [],
        dringgedPlayersLog: [],
        debug: collectDebugData
            ? { whoTookCalls: [], cardPermissionCalls: [] }
            : null,
    };
    const output = [
        {
            type: 'REQUEST_START_GAME',
            roomId: state.id,
            userIds: state.userIds,
        },
    ];
    return [state, output, true];
}
exports.initReducer = initReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/common/join.ts":
/*!************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/common/join.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.joinReducer = void 0;
const getPlayer_1 = __webpack_require__(/*! ../../domain/getPlayer */ "./libs/joker/runtime/src/lib/domain/getPlayer.ts");
function joinReducer(state, userId, socketId) {
    const player = getPlayer_1.getPlayer(state, userId);
    player.status = 'ONLINE';
    player.socketId = socketId;
    return [state, [], true];
}
exports.joinReducer = joinReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/common/leave.ts":
/*!*************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/common/leave.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveReducer = void 0;
const getPlayer_1 = __webpack_require__(/*! ../../domain/getPlayer */ "./libs/joker/runtime/src/lib/domain/getPlayer.ts");
function leaveReducer(state, userId, socketId, isClientLeave) {
    const player = getPlayer_1.getPlayer(state, userId);
    const output = [];
    if (player.socketId !== socketId) {
        return [state, output, false, true];
    }
    player.status = 'OFFLINE';
    // check if all players are offline
    if (state.playersArray.every(x => x.status === 'OFFLINE')) {
        output.push({
            type: 'ALL_PLAYERS_OFFLINE',
            isLastClientLeave: isClientLeave,
        });
    }
    return [state, output, true];
}
exports.leaveReducer = leaveReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/common/sit.ts":
/*!***********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/common/sit.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sitReducer = void 0;
const getPlayer_1 = __webpack_require__(/*! ../../domain/getPlayer */ "./libs/joker/runtime/src/lib/domain/getPlayer.ts");
function sitReducer(state, userId, position) {
    if (state.status !== 'WAITING_START') {
        return [state, [], false, true];
    }
    const player = getPlayer_1.getPlayer(state, userId);
    const positionIndex = position - 1;
    const isSeatAvailable = !state.playersArray.some(x => x.positionIndex === positionIndex);
    player.positionIndex = isSeatAvailable ? positionIndex : null;
    return [state, [], true];
}
exports.sitReducer = sitReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/game/bid.ts":
/*!*********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/game/bid.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.bidReducer = void 0;
const getNextPlayer_1 = __webpack_require__(/*! ../../domain/getNextPlayer */ "./libs/joker/runtime/src/lib/domain/getNextPlayer.ts");
const sendBidRequest_1 = __webpack_require__(/*! ../../lifecycle/sendBidRequest */ "./libs/joker/runtime/src/lib/lifecycle/sendBidRequest.ts");
const startStep_1 = __webpack_require__(/*! ../../lifecycle/startStep */ "./libs/joker/runtime/src/lib/lifecycle/startStep.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const analyzeFilledOpponents_1 = __webpack_require__(/*! ../../domain/analyzeFilledOpponents */ "./libs/joker/runtime/src/lib/domain/analyzeFilledOpponents.ts");
function bidReducer(state, userId, bid) {
    const { status, activePlayer, playersArray, cardsCount, bidLimit, } = state;
    // check
    if ((activePlayer === null || activePlayer === void 0 ? void 0 : activePlayer.userId) !== userId || status !== 'WAITING_BID') {
        return [state, [], false, true];
    }
    const output = [];
    activePlayer.roundStats = { bid, have: 0 };
    // ვნახულობთ მომდევნო მოთამაშემ აცხადა თუ არა
    const nextPlayer = getNextPlayer_1.getNextPlayer(playersArray, activePlayer);
    if (!nextPlayer.roundStats) {
        state.activePlayer = nextPlayer;
        return sendBidRequest_1.sendBidRequest(state, output);
    }
    const bidBalance = cardsCount -
        playersArray.map(x => { var _a, _b; return (_b = (_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.bid) !== null && _b !== void 0 ? _b : 0; }).reduce(utils_1.sum, 0);
    // თუ შეუვსეს მოთამაშეს ვნახულობთ რომელმა მოთამაშეებმა შეუვსეს
    if (bidLimit === 0) {
        const items = playersArray[state.roundFirstPlayerIndex].playersView
            .slice(0, 3)
            .map(x => {
            var _a;
            return ({
                positionIndex: x.positionIndex,
                bid: (_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.bid,
            });
        });
        const fillerIndexes = analyzeFilledOpponents_1.analyzeFilledOpponents(cardsCount, items);
        fillerIndexes.forEach(index => playersArray[index].fillOpponentsCount++);
        const softFillerIndexes = analyzeFilledOpponents_1.analyzeSoftFilledOpponents(cardsCount, items);
        softFillerIndexes.forEach(index => playersArray[index].softFillOpponentsCount++);
    }
    output.push({
        type: 'BIDDING_FINISHED',
        bidBalance,
    });
    state.bidBalance = bidBalance;
    state.activePlayer = nextPlayer;
    return startStep_1.startStep(state, output);
}
exports.bidReducer = bidReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/game/card.ts":
/*!**********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/game/card.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cardReducer = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const findCardIndex_1 = __webpack_require__(/*! ../../domain/findCardIndex */ "./libs/joker/runtime/src/lib/domain/findCardIndex.ts");
const getNextPlayer_1 = __webpack_require__(/*! ../../domain/getNextPlayer */ "./libs/joker/runtime/src/lib/domain/getNextPlayer.ts");
const finishStep_1 = __webpack_require__(/*! ../../lifecycle/finishStep */ "./libs/joker/runtime/src/lib/lifecycle/finishStep.ts");
const sendCardRequest_1 = __webpack_require__(/*! ../../lifecycle/sendCardRequest */ "./libs/joker/runtime/src/lib/lifecycle/sendCardRequest.ts");
function cardReducer(state, userId, downCardParam) {
    const { status, activePlayer, playersArray } = state;
    const output = [];
    // check
    if ((activePlayer === null || activePlayer === void 0 ? void 0 : activePlayer.userId) !== userId || status !== 'WAITING_CARD') {
        return [state, [], false, true];
    }
    // ჩამოსული კარტის შემოწმება
    const downCardIndex = findCardIndex_1.findCardIndex(activePlayer.cards, downCardParam);
    if (downCardIndex === -1) {
        throw new utils_1.AppError('INVALID_DOWN_CARD', {
            errorMessage: 'Card not found',
            data: {
                downCardParam,
                cards: activePlayer.cards,
            },
        });
    }
    if (!activePlayer.cardVisibilities[downCardIndex]) {
        throw new utils_1.AppError('INVALID_DOWN_CARD', {
            errorMessage: 'Card already used in the Round',
            data: {
                downCardParam,
                cards: activePlayer.cards,
                cardVisibilities: activePlayer.cardVisibilities,
            },
        });
    }
    if (!activePlayer.cardPermissions[downCardIndex]) {
        throw new utils_1.AppError('INVALID_DOWN_CARD', {
            errorMessage: 'Card not allowed to use',
            data: {
                downCardParam,
                cards: activePlayer.cards,
                cardPermissions: activePlayer.cardPermissions,
            },
        });
    }
    // make sure only joker will have thrird element
    const downCard = types_1.isJoker(downCardParam)
        ? downCardParam
        : [downCardParam[0], downCardParam[1]];
    // ჩამოსული კარტის დაფიქსირება
    activePlayer.downCard = downCard;
    // ხელში რომ აღარ გამოუჩნდეს ეს კარტი
    activePlayer.cardVisibilities[downCardIndex] = false;
    output.push({
        type: 'GAME_CARD',
        downCard,
        userId: activePlayer.userId,
        playerPosition: activePlayer.positionIndex + 1,
        isFirstPlayer: activePlayer.positionIndex === state.stepFirstPlayerIndex,
    });
    // თუ ყველა მოთამაშე არ ჩამოსულა, გავუგზავნოთ კარტის მოთხოვნა შემდეგს
    if (playersArray.some(x => !x.downCard)) {
        state.activePlayer = getNextPlayer_1.getNextPlayer(playersArray, activePlayer);
        return sendCardRequest_1.sendCardRequest(state, output);
    }
    // როდესაც ოთხივე მოთამაშე ჩამოვიდა, დავასრულოდ Step
    return finishStep_1.finishStep(state, output);
}
exports.cardReducer = cardReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/game/trump.ts":
/*!***********************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/game/trump.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.trumpReducer = void 0;
const sendBidRequest_1 = __webpack_require__(/*! ../../lifecycle/sendBidRequest */ "./libs/joker/runtime/src/lib/lifecycle/sendBidRequest.ts");
const sortCards_1 = __webpack_require__(/*! ../../domain/sortCards */ "./libs/joker/runtime/src/lib/domain/sortCards.ts");
function trumpReducer(state, userId, color) {
    const { status, activePlayer, playersArray } = state;
    // check
    if ((activePlayer === null || activePlayer === void 0 ? void 0 : activePlayer.userId) !== userId || status !== 'WAITING_TRUMP') {
        return [state, [], false, true];
    }
    playersArray.forEach(x => (x.cards = sortCards_1.sortCards(x.cards)));
    const output = [];
    output.push({
        type: 'TRUMP_COLOR_SELECTED',
        userId,
        color,
    });
    state.trump = color;
    return sendBidRequest_1.sendBidRequest(state, output);
}
exports.trumpReducer = trumpReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/internal/deal.ts":
/*!**************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/internal/deal.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dealReducer = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const sendBidRequest_1 = __webpack_require__(/*! ../../lifecycle/sendBidRequest */ "./libs/joker/runtime/src/lib/lifecycle/sendBidRequest.ts");
const sendTrumpRequest_1 = __webpack_require__(/*! ../../lifecycle/sendTrumpRequest */ "./libs/joker/runtime/src/lib/lifecycle/sendTrumpRequest.ts");
const sortCards_1 = __webpack_require__(/*! ../../domain/sortCards */ "./libs/joker/runtime/src/lib/domain/sortCards.ts");
function dealReducer(state, trumpCard, playerCards) {
    const { id: refId, playersArray, cardsCount, deckType } = state;
    const output = [];
    const playerCardsMap = playerCards.reduce((r, x) => r.set(x.userId, x.cards), new Map());
    playersArray.forEach(x => {
        let cards = playerCardsMap.get(x.userId);
        if (!cards) {
            throw new utils_1.AppError('PLAYER_CARDS_NOT_FOUND', {
                data: {
                    refId,
                    userId: x.userId,
                    playerCards,
                },
            });
        }
        /**
         * როდესაც 38 კარტით ვთამაშობთ საჭიროა ყოველთვის დავასორტიროთ
         * რადგან ფერის ცხადება არ ხდება ამ დროს
         */
        if (cardsCount !== 9 || deckType === 'OLD_SCHOOL') {
            cards = sortCards_1.sortCards(cards);
        }
        x.cards = cards;
        x.cardVisibilities = cards.map(() => true);
    });
    output.push({
        type: 'DEAL_COMPLETED',
        deckType,
        userIds: playersArray.map(x => x.userId),
        userCards: playersArray.map(x => x.cards),
    });
    state.trump = trumpCard;
    return cardsCount === 9 && deckType === 'MODERN'
        ? sendTrumpRequest_1.sendTrumpRequest(state, output)
        : sendBidRequest_1.sendBidRequest(state, output);
}
exports.dealReducer = dealReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/reducers/internal/start.ts":
/*!***************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/reducers/internal/start.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startReducer = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const startGame_1 = __webpack_require__(/*! ../../lifecycle/startGame */ "./libs/joker/runtime/src/lib/lifecycle/startGame.ts");
function startReducer(state, userIds) {
    const { id: refId, playersArray: prevPlayersArray, userIds: prevUserIds, } = state;
    // make sure userIds are the same
    if (userIds.some(x => !prevUserIds.includes(x))) {
        throw new utils_1.AppError('INVALID_START_USERIDS', {
            data: {
                refId,
                prevUserIds,
                userIds,
            },
        });
    }
    // sort players by selected position
    // head should be the first player
    const playerArray = prevPlayersArray;
    const sortedPlayers = userIds.map((userId, i) => {
        const player = playerArray.find(y => y.userId === userId);
        player.positionIndex = i;
        return player;
    });
    sortedPlayers.forEach((x, i) => (x.playersView = utils_1.rotateArray(sortedPlayers, -i)));
    state.userIds = userIds; // set rotated & sorted userIds to match playerIds order
    state.playersArray = sortedPlayers;
    return startGame_1.startGame(state, []);
}
exports.startReducer = startReducer;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/runtimes/live.runtime.ts":
/*!*************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/runtimes/live.runtime.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveRuntime = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const D = __webpack_require__(/*! date-fns */ "date-fns");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const bot_user_1 = __webpack_require__(/*! ../bot/bot.user */ "./libs/joker/runtime/src/lib/bot/bot.user.ts");
const createBot_1 = __webpack_require__(/*! ../bot/createBot */ "./libs/joker/runtime/src/lib/bot/createBot.ts");
const getPlayersRandomizedDeckColors_1 = __webpack_require__(/*! ../domain/anticheat/getPlayersRandomizedDeckColors */ "./libs/joker/runtime/src/lib/domain/anticheat/getPlayersRandomizedDeckColors.ts");
const getPlayerVirtualSortedCardsMap_1 = __webpack_require__(/*! ../domain/anticheat/getPlayerVirtualSortedCardsMap */ "./libs/joker/runtime/src/lib/domain/anticheat/getPlayerVirtualSortedCardsMap.ts");
const toVirtualCard_1 = __webpack_require__(/*! ../domain/anticheat/toVirtualCard */ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCard.ts");
const toVirtualCardPermissions_1 = __webpack_require__(/*! ../domain/anticheat/toVirtualCardPermissions */ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCardPermissions.ts");
const toVirtualCardVisibilities_1 = __webpack_require__(/*! ../domain/anticheat/toVirtualCardVisibilities */ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualCardVisibilities.ts");
const toVirtualDownCard_1 = __webpack_require__(/*! ../domain/anticheat/toVirtualDownCard */ "./libs/joker/runtime/src/lib/domain/anticheat/toVirtualDownCard.ts");
const dealCards_1 = __webpack_require__(/*! ../domain/dealCards */ "./libs/joker/runtime/src/lib/domain/dealCards.ts");
const getGameProgress_1 = __webpack_require__(/*! ../domain/getGameProgress */ "./libs/joker/runtime/src/lib/domain/getGameProgress.ts");
const getPositionedUserIds_1 = __webpack_require__(/*! ../domain/getPositionedUserIds */ "./libs/joker/runtime/src/lib/domain/getPositionedUserIds.ts");
const getRandomizedDeckColors_1 = __webpack_require__(/*! ../domain/getRandomizedDeckColors */ "./libs/joker/runtime/src/lib/domain/getRandomizedDeckColors.ts");
const getStateByPlayer_1 = __webpack_require__(/*! ../domain/getStateByPlayer */ "./libs/joker/runtime/src/lib/domain/getStateByPlayer.ts");
const sortCards_1 = __webpack_require__(/*! ../domain/sortCards */ "./libs/joker/runtime/src/lib/domain/sortCards.ts");
const game_reducer_1 = __webpack_require__(/*! ../game.reducer */ "./libs/joker/runtime/src/lib/game.reducer.ts");
const LINE_SEPARATOR = '\n';
const RatingStars = [2, 1, -1, -2];
class LiveRuntime {
    constructor(options) {
        this.options = options;
        this.games = new Map();
        // private userGameIdMap = new Map<string, string>()
        this.gameMetadatas = new Map();
        this.userSockets = new Map();
        this.registeredBots = [];
        // persist commands
        this.commandsLog = [];
    }
    async configureBots(botApiUrlsParam) {
        const { getTrackTime } = this.options.createBotOptions;
        const botUrls = [null, null, null, null];
        botApiUrlsParam.forEach((x, i) => (botUrls[i] = x));
        const simpleBot = createBot_1.createSyncBot('SIMPLE', getTrackTime);
        const syncBot = createBot_1.createSyncBot('RANDOM', getTrackTime);
        const tasks = botUrls.map(async (url) => {
            var _a;
            return new bot_user_1.BotUser(url
                ? (_a = (await createBot_1.createBot(url, this.options.createBotOptions))) !== null && _a !== void 0 ? _a : simpleBot : syncBot, syncBot, getTrackTime);
        });
        this.registeredBots = await Promise.all(tasks);
    }
    // create / remove
    createRoom(gameMode, refId, userIds, tournamentId, createdAt, isAntiCheatEnabled, deckType, isPairMode, isRanked, isStripMode, themeCode, userAvatarLayers, stripUserAvatarLayers = []) {
        // null - temp state, will be initialized after CREATE action
        this.games.set(refId, { id: refId });
        const playerStats = new Map();
        userIds.forEach(x => {
            playerStats.set(x, {
                disconnectsCount: 0,
            });
            // this.userGameIdMap.set(x, refId)
        });
        const metadata = {
            tournamentId,
            gameStartTimeInSec: this.options.timeouts.gameStartTimeout / 1000,
            createdAt,
            interactions: [],
            emotionsSent: [],
            playerStats,
            originalUserIds: userIds,
            afkUserIds: new Set(),
            startTimer: null,
            timer: null,
            finishTimer: null,
            userColors: new Map(),
            isPairMode: isPairMode !== null && isPairMode !== void 0 ? isPairMode : false,
            userLastAntiAfkActivityDateMap: new Map(),
            playAgainUserIds: new Set(),
            isRanked: isRanked !== null && isRanked !== void 0 ? isRanked : false,
            isStripMode: isStripMode !== null && isStripMode !== void 0 ? isStripMode : false,
            themeCode,
            userAvatarLayers,
            gameMode,
            stripUserAvatarLayers,
        };
        this.gameMetadatas.set(refId, metadata);
        this.applyCommand(refId, {
            type: 'CREATE',
            userIds,
            gameMode,
            roomRefId: refId,
            deckType,
            isAntiCheatEnabled,
            isPairMode,
        });
        metadata.startTimer = setTimeout(() => {
            const state = this.games.get(refId);
            if (!state) {
                return;
            }
            if (state.playersArray.every(x => x.status === 'OFFLINE')) {
                this.finishIncompleteGame(state);
                return;
            }
            const startIndex = utils_1.getRandomInt(4, this.options.randomSeed);
            const positionedUserIds = getPositionedUserIds_1.getPositionedUserIds(state.userIds
                .map(userId => state.playersArray.find(x => x.userId === userId))
                .map(x => ({
                userId: x.userId,
                position: x.positionIndex !== null ? x.positionIndex + 1 : null,
            })), startIndex, metadata.isPairMode);
            this.applyCommand(refId, {
                type: 'START',
                userIds: positionedUserIds,
            });
        }, this.options.timeouts.gameStartTimeout);
        return true;
    }
    getEarliestRoomCreateDate() {
        var _a;
        return ((_a = [...this.gameMetadatas.values()]
            .map(x => x.createdAt)
            .sort()[0]) !== null && _a !== void 0 ? _a : null);
    }
    removeRoom(roomId) {
        if (this.games.has(roomId)) {
            this.games.delete(roomId);
        }
        if (this.gameMetadatas.has(roomId)) {
            this.gameMetadatas.delete(roomId);
        }
    }
    hasRoom(roomId) {
        return this.games.has(roomId);
    }
    getUserGameId(userId) {
        var _a;
        const rooms = [...this.games.values()].filter(x => x.userIds.includes(userId));
        let room = rooms.find(x => x.status !== 'FINISHED');
        if (!room) {
            room = rooms[0];
        }
        return (_a = room === null || room === void 0 ? void 0 : room.id) !== null && _a !== void 0 ? _a : null;
    }
    getRooms() {
        return [...this.games.values()];
    }
    // getRoomIdByUserId(userId: string) {
    // const rooms = [...this.games.values()].filter(x =>
    //   x.userIds.includes(userId),
    // )
    // return rooms[0]?.id ?? null
    // }
    getRoomCommands(roomId) {
        return this.getPersistedCommands(roomId);
    }
    // apply action
    applyCommand(roomId, cmdParam) {
        const item = this.games.get(roomId);
        if (!item) {
            return;
        }
        const metadata = this.gameMetadatas.get(item.id);
        if (!metadata) {
            throw new utils_1.AppError('GAME_METADATA_NOT_FOUND', {
                data: {
                    isAntiCheatEnabled: item.settings.isAntiCheatEnabled,
                    roomId: item.id,
                    cmd: cmdParam,
                },
            });
        }
        try {
            let cmd = cmdParam;
            if (cmd.type !== 'CREATE') {
                // ANTI-CHEAT
                if (item.settings.isAntiCheatEnabled) {
                    // transform virtual color to real one
                    cmd = fromLiveRuntimeGameCommand(cmdParam, item.id, metadata);
                }
                // ANTI-CHEAT
            }
            // PAIR-MODE
            if (metadata.isPairMode && cmd.type === 'SIT') {
                // limit sit selection
                const userIndex = metadata.originalUserIds.indexOf(cmd.userId);
                const allowedSitPositions = [0, 2].includes(userIndex)
                    ? [types_1.PlayerPosition.Bottom, types_1.PlayerPosition.Top]
                    : [types_1.PlayerPosition.Left, types_1.PlayerPosition.Right];
                if (!allowedSitPositions.includes(cmd.position)) {
                    return;
                }
            }
            // PAIR-MODE
            const [reducedState, events, isStateChanged, isInvalidCommand,] = game_reducer_1.gameReducer(item, cmd);
            if (isInvalidCommand) {
                return;
            }
            // update states cache
            this.games.set(roomId, reducedState);
            // ANTI-CHEAT
            const liveGameEvents = events.map(e => toLiveRuntimeGameEvent(e, reducedState, metadata));
            // ANTI-CHEAT
            // persist action
            this.persistCommands(roomId, cmd, !isStateChanged);
            // send callbacks
            this.processCommand(cmd, reducedState);
            // side effects
            liveGameEvents.forEach(e => this.processEvent(e, reducedState));
        }
        catch (err) {
            // თუ მოხდა ისეთი კარტის ჩამოსვლა რისი უფლებაც არ ქონდა
            // ვუგზავნით სრულ სტეიტს თავიდან
            if (err.message === 'INVALID_DOWN_CARD') {
                const state = this.games.get(roomId);
                const metadata = this.gameMetadatas.get(roomId);
                if (state &&
                    metadata &&
                    (cmdParam.type === 'CARD' || cmdParam.type === 'CARD2')) {
                    this.sendCurrentState(cmdParam.userId, state, metadata);
                }
                return;
            }
            throw err;
        }
    }
    async processCommand(cmd, state) {
        var _a, _b;
        const metadata = this.gameMetadatas.get(state.id);
        if (!metadata) {
            return;
        }
        switch (cmd.type) {
            case 'JOIN':
                {
                    const { userId, socketId } = cmd;
                    this.userSockets.set(userId, socketId);
                    clearTimeout(metadata.finishTimer);
                    // callbacks
                    this.sendToRoom(state.id, {
                        type: 'Joker.PlayerSocketId',
                        userId,
                        socketId,
                    });
                    metadata.userLastAntiAfkActivityDateMap.set(userId, new Date());
                    switch (state.status) {
                        case 'WAITING_START':
                            {
                                this.sendToUser(userId, {
                                    type: 'Joker.CurrentTable',
                                    channel: state.id,
                                    info: getLegacyRoomState(state, metadata),
                                    stripUserAvatarLayers: metadata.stripUserAvatarLayers,
                                });
                                const timePassed = D.differenceInSeconds(this.options.getCurrentTime(), metadata.createdAt);
                                this.sendToUser(userId, {
                                    type: 'Joker.GameWillStart',
                                    seconds: timePassed > metadata.gameStartTimeInSec
                                        ? 0
                                        : metadata.gameStartTimeInSec - timePassed,
                                });
                                this.sendToRoom(state.id, {
                                    type: 'Joker.CurrentTableUsers',
                                    players: state.playersArray.map(x => getLegacyPlayerState(x)),
                                });
                            }
                            break;
                        case 'WAITING_TRUMP':
                        case 'WAITING_BID':
                        case 'WAITING_CARD':
                            {
                                const player = state.playersArray.find(x => x.userId === userId);
                                if (!player) {
                                    return;
                                }
                                const positionIndex = player.positionIndex;
                                if (metadata.afkUserIds.has(userId)) {
                                    metadata.afkUserIds.delete(userId);
                                }
                                this.sendToRoom(state.id, {
                                    type: 'Joker.GamePlayerIsBack',
                                    playerPosition: positionIndex + 1,
                                }, [userId]);
                                setTimeout(() => this.sendCurrentState(userId, state, metadata), 10);
                            }
                            break;
                        case 'FINISHED':
                            {
                                if (metadata.stripData) {
                                    this.sendToUser(userId, {
                                        type: 'Joker.ShowStripModeView',
                                        activeUserId: metadata.stripData
                                            .nextWinnerUserId,
                                        selectedUserId: null,
                                        timeLeft: null,
                                        winnerUserIds: metadata.stripData.winnerUserIds,
                                        looserUserIds: metadata.stripData.looserUserIds,
                                        userAvatarLayers: metadata.userAvatarLayers,
                                        stripEntries: metadata.stripData.stripEntries.map(x => ({
                                            userId: x.userId,
                                            itemId: x.avatarLayerId,
                                            strippedUserId: x.strippedUserId,
                                            takeItem: x.takeItem,
                                            respectCount: x.respectCount,
                                        })),
                                    });
                                }
                            }
                            break;
                    }
                }
                break;
            case 'CLIENT_LEAVE':
            case 'LEAVE':
                {
                    const { userId } = cmd;
                    if (this.userSockets.has(userId)) {
                        this.userSockets.delete(userId);
                    }
                    if (cmd.type === 'LEAVE') {
                        // ვითვლით მხოლოდ იმ შემთხვევაში როდესაც კავშირი გაწყდა
                        const playerMetadata = metadata.playerStats.get(userId);
                        if (playerMetadata) {
                            playerMetadata.disconnectsCount++;
                        }
                    }
                    if (state.status === 'FINISHED') {
                        if (state.playersArray.every(x => x.status === 'OFFLINE')) {
                            /**
                             * Remove finished room here
                             * we need to keep it for PlayAgain actions
                             */
                            this.removeRoom(state.id);
                            this.deletePersistedCommands(state.id);
                            return;
                        }
                        this.sendToRoom(state.id, {
                            type: 'Joker.PlayAgainListUpdated',
                            readyUserIds: [...metadata.playAgainUserIds.values()],
                            offlineUserIds: state.playersArray
                                .filter(x => x.status === 'OFFLINE')
                                .map(x => x.userId),
                        }, []);
                    }
                    // when all players are offline
                    if (state.playersArray.every(x => x.status === 'OFFLINE')) {
                        if (cmd.type === 'CLIENT_LEAVE') {
                            clearTimeout(metadata.timer);
                            this.finishIncompleteGame(state);
                        }
                        // start game finish timer
                        else {
                            metadata.finishTimer = setTimeout(() => {
                                const latestState = this.games.get(state.id);
                                if (!latestState) {
                                    return;
                                }
                                clearTimeout(metadata === null || metadata === void 0 ? void 0 : metadata.timer);
                                this.finishIncompleteGame(latestState);
                            }, this.options.timeouts.gameFinishAllOfflineTimeout);
                        }
                        return;
                    }
                    // callbacks
                    this.sendToRoom(state.id, {
                        type: 'Joker.PlayerSocketId',
                        userId,
                        socketId: null,
                    });
                    switch (state.status) {
                        case 'WAITING_START':
                            {
                                this.sendToRoom(state.id, {
                                    type: 'Joker.CurrentTableUsers',
                                    players: state.playersArray.map(x => getLegacyPlayerState(x)),
                                });
                            }
                            break;
                        case 'WAITING_TRUMP':
                        case 'WAITING_BID':
                        case 'WAITING_CARD':
                            {
                                const positionIndex = state.playersArray.find(x => x.userId === userId).positionIndex;
                                this.sendToRoom(state.id, {
                                    type: 'Joker.GamePlayerLeft',
                                    playerPosition: positionIndex + 1,
                                    isDisconnect: true,
                                    messasge: '',
                                });
                            }
                            break;
                        case 'FINISHED':
                            {
                                const positionIndex = state.playersArray.find(x => x.userId === userId).positionIndex;
                                this.sendToRoom(state.id, {
                                    type: 'Joker.GamePlayerLeft',
                                    playerPosition: positionIndex + 1,
                                    isDisconnect: true,
                                    messasge: '',
                                });
                            }
                            break;
                    }
                }
                break;
            case 'SIT':
                {
                    this.sendToRoom(state.id, {
                        type: 'Joker.CurrentTableUsers',
                        players: state.playersArray.map(x => getLegacyPlayerState(x, undefined, true)),
                    });
                }
                break;
            case 'START':
                {
                    this.sendToRoom(state.id, {
                        type: 'Joker.CurrentTable',
                        channel: state.id,
                        info: getLegacyRoomState(state, metadata, true, metadata.originalUserIds),
                        stripUserAvatarLayers: metadata.stripUserAvatarLayers,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.GameStarting',
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.CurrentTableUsers',
                        players: state.playersArray.map(x => getLegacyPlayerState(x, undefined, true)),
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.TableReset',
                    });
                }
                break;
            case 'BACK_IN_GAME':
                {
                    const player = state.playersArray.find(x => x.userId === cmd.userId);
                    metadata.afkUserIds.delete(player.userId);
                    metadata.userLastAntiAfkActivityDateMap.set(player.userId, new Date());
                    if (((_a = state.activePlayer) === null || _a === void 0 ? void 0 : _a.userId) === cmd.userId) {
                        clearTimeout(metadata.timer);
                        const { timeouts } = this.options;
                        switch (state.status) {
                            case 'WAITING_BID':
                                metadata.timer = setTimeout(index => this.bidTimeoutLogic(state.id, cmd.userId, index), timeouts.default.bidTimeout, state.globalIndex);
                                break;
                            case 'WAITING_TRUMP':
                                metadata.timer = setTimeout(index => this.trumpTimeoutLogic(state.id, cmd.userId, index), timeouts.default.trumpTimeout, state.globalIndex);
                                break;
                            case 'WAITING_CARD':
                                metadata.timer = setTimeout(index => this.cardTimeoutLogic(state.id, cmd.userId, index), timeouts.default.cardTimeout, state.globalIndex);
                                break;
                        }
                    }
                    this.sendToRoom(state.id, {
                        type: 'Joker.GamePlayerIsBack',
                        playerPosition: player.positionIndex + 1,
                    });
                }
                break;
            case 'CHAT_MESSAGE':
                {
                    const { userId } = cmd;
                    // TODO: validate and send only emotions
                    const message = ((cmd.type === 'CHAT_MESSAGE' && cmd.message));
                    metadata.emotionsSent.push({
                        code: message,
                        isSpecial: false,
                        fromUserId: userId,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.ChatMessage',
                        userId,
                        message,
                    }, [userId]);
                }
                break;
            case 'FOLLOW_USER':
                {
                    const { userId, targetUserId } = cmd;
                    this.sendToRoom(state.id, {
                        type: 'Joker.StartedFollowingUser',
                        userId,
                        targetUserId,
                    }, [userId]);
                }
                break;
            case 'DEAL':
                {
                    this.sendToRoom(state.id, {
                        type: 'Joker.TableReset',
                    });
                    state.playersArray.forEach(x => {
                        this.sendToUser(x.userId, {
                            type: 'Joker.CurrentCards',
                            cards: x.cards,
                            isNewDeck: true,
                        });
                    });
                    const dealerIndex = utils_1.rotateNumber(0, 3)(state.roundFirstPlayerIndex, -1);
                    const cardCount = state.cardsCount;
                    const is9 = cardCount === 9;
                    if (is9 && state.deckType === 'MODERN') {
                        this.sendToRoom(state.id, {
                            type: 'Joker.GameVisualDeal',
                            cardCount: 0,
                            mode: types_1.VisualDealMode.First,
                            dealerUserId: state.playersArray[dealerIndex].userId,
                        });
                    }
                    else {
                        this.sendToRoom(state.id, {
                            type: 'Joker.GameVisualDeal',
                            cardCount,
                            mode: types_1.VisualDealMode.Normal,
                            dealerUserId: state.playersArray[dealerIndex].userId,
                        });
                        const trumpCard = state.trump;
                        const isJokerTrump = types_1.isJoker(trumpCard);
                        state.playersArray.forEach(x => {
                            this.sendToUser(x.userId, {
                                type: 'Joker.GameSetKozir',
                                card: isJokerTrump
                                    ? [types_1.CardColor.None, trumpCard[1]]
                                    : trumpCard,
                                color: isJokerTrump ? types_1.CardColor.None : trumpCard[0],
                                mode: 'CARD',
                                isNewDeck: true,
                            });
                        });
                    }
                }
                break;
            case 'DEAL2':
                {
                }
                break;
            case 'TRUMP':
                {
                    clearTimeout(metadata.timer);
                    const player = state.playersArray.find(x => x.userId === cmd.userId);
                    if (!cmd.isBot && metadata.afkUserIds.has(cmd.userId)) {
                        metadata.afkUserIds.delete(cmd.userId);
                        this.sendToRoom(state.id, {
                            type: 'Joker.GamePlayerIsBack',
                            playerPosition: player.positionIndex + 1,
                        });
                    }
                }
                break;
            case 'BID':
                {
                    clearTimeout(metadata.timer);
                    const player = state.playersArray.find(x => x.userId === cmd.userId);
                    if (!cmd.isBot && metadata.afkUserIds.has(cmd.userId)) {
                        metadata.afkUserIds.delete(cmd.userId);
                        this.sendToRoom(state.id, {
                            type: 'Joker.GamePlayerIsBack',
                            playerPosition: player.positionIndex + 1,
                        });
                    }
                    const positionIndex = player.positionIndex;
                    this.sendToRoom(state.id, {
                        type: 'Joker.ResultsPlayerWant',
                        section: state.sectionIndex + 1,
                        line: state.roundIndex + 1,
                        playerPosition: positionIndex + 1,
                        want: cmd.want,
                    });
                }
                break;
            case 'CARD':
                {
                    clearTimeout(metadata.timer);
                    const player = state.playersArray.find(x => x.userId === cmd.userId);
                    if (!cmd.isBot && metadata.afkUserIds.has(cmd.userId)) {
                        metadata.afkUserIds.delete(cmd.userId);
                        this.sendToRoom(state.id, {
                            type: 'Joker.GamePlayerIsBack',
                            playerPosition: player.positionIndex + 1,
                        });
                    }
                    // remove card from current player
                    this.sendToUser(cmd.userId, {
                        type: 'Joker.GameSetCardsVisible',
                        cardsVisibleString: player.cardVisibilities
                            .map(x => (x ? '1' : '0'))
                            .join(''),
                        playerPosition: player.positionIndex + 1,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.GameDescCardCount',
                        playerPosition: player.positionIndex + 1,
                    }, [player.userId]);
                }
                break;
            case 'CARD2':
                {
                    clearTimeout(metadata.timer);
                    const player = state.playersArray.find(x => x.userId === cmd.userId);
                    if (cmd.isBot && player.status === 'ONLINE') {
                        // Not allow playing cards any more on this turn
                        // when bot played first
                        this.sendToUser(cmd.userId, {
                            type: 'Joker.GameSetCardsPermission',
                            permissionString: player.cardPermissions
                                .map(_ => '0')
                                .join(''),
                        });
                    }
                    if (!cmd.isBot && metadata.afkUserIds.has(cmd.userId)) {
                        metadata.afkUserIds.delete(cmd.userId);
                        this.sendToRoom(state.id, {
                            type: 'Joker.GamePlayerIsBack',
                            playerPosition: player.positionIndex + 1,
                        });
                    }
                }
                break;
            case 'SEND_GIFT':
                {
                    metadata.interactions.push(cmd);
                    this.sendToRoom(state.id, {
                        ...cmd,
                        type: 'Joker.SendGift',
                    }, [cmd.userId]);
                }
                break;
            case 'RESPECT':
                {
                    metadata.interactions.push(cmd);
                    this.sendToRoom(state.id, {
                        ...cmd,
                        type: 'Joker.Respect',
                    }, [cmd.userId]);
                }
                break;
            case 'BUZZ':
                {
                    metadata.interactions.push(cmd);
                    this.sendToRoom(state.id, {
                        ...cmd,
                        type: 'Joker.Buzz',
                    }, [cmd.userId]);
                }
                break;
            case 'SEND_INTERACTION':
                {
                    const { interaction } = cmd;
                    metadata.interactions.push(interaction);
                    // broadcast back to the room, except sender
                    this.sendToRoom(state.id, {
                        type: 'Joker.NewInteraction',
                        interaction,
                    }, [interaction.userId]);
                    // for backward compatability only, remove in version 5.0 release
                    switch (interaction.type) {
                        case 'BUZZ':
                            this.sendToRoom(state.id, {
                                ...interaction,
                                type: 'Joker.Buzz',
                            }, [interaction.userId]);
                            break;
                        case 'RESPECT':
                            this.sendToRoom(state.id, {
                                ...interaction,
                                type: 'Joker.Respect',
                            }, [interaction.userId]);
                            break;
                        case 'SEND_GIFT':
                            this.sendToRoom(state.id, {
                                ...interaction,
                                type: 'Joker.SendGift',
                            }, [interaction.userId]);
                            break;
                    }
                }
                break;
            case 'SEND_EMOTION':
                {
                    metadata.emotionsSent.push({
                        ...cmd,
                        isSpecial: true,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.EmotionSent',
                        code: cmd.code,
                        fromUserId: cmd.fromUserId,
                        toUserId: cmd.toUserId,
                    }, [cmd.fromUserId]);
                }
                break;
            case 'PLAY_AGAIN':
                {
                    let createRoom = false;
                    if (state.userIds.includes(cmd.userId)) {
                        const beforeSize = metadata.playAgainUserIds.size;
                        metadata.playAgainUserIds.add(cmd.userId);
                        const afterSize = metadata.playAgainUserIds.size;
                        if (afterSize === 4 && beforeSize === 3) {
                            createRoom = true;
                        }
                    }
                    this.sendToRoom(state.id, {
                        type: 'Joker.PlayAgainListUpdated',
                        readyUserIds: [...metadata.playAgainUserIds.values()],
                        offlineUserIds: state.playersArray
                            .filter(x => x.status === 'OFFLINE')
                            .map(x => x.userId),
                    }, []);
                    if (createRoom) {
                        // remove old room
                        this.removeRoom(state.id);
                        this.deletePersistedCommands(state.id);
                        // API Call
                        const { roomId, serverUrl, } = await this.options.rootApi.execute.Command.Server.createNewJokerRoom({
                            referrerRoomId: state.id,
                            userIds: [...metadata.playAgainUserIds.values()],
                            deckType: state.deckType,
                            gameMode: metadata.gameMode,
                            isAntiCheatEnabled: state.settings.isAntiCheatEnabled,
                            isPairMode: state.settings.isPairMode,
                            isRanked: metadata.isRanked,
                            isStripMode: metadata.isStripMode,
                            themeCode: (_b = metadata.themeCode) !== null && _b !== void 0 ? _b : null,
                            stripUserAvatarLayers: metadata.stripUserAvatarLayers,
                        });
                        this.sendToRoom(roomId, {
                            type: 'Joker.JoinNewGame',
                            roomId,
                            serverUrl,
                            gameMode: metadata.gameMode,
                            isPairMode: state.settings.isPairMode,
                            isRanked: metadata.isRanked,
                            isStripMode: metadata.isStripMode,
                            themeCode: metadata.themeCode,
                        }, []);
                    }
                }
                break;
            case 'STRIP_SELECTION':
                {
                    if (!metadata.stripData) {
                        return;
                    }
                    if (metadata.stripData.nextWinnerUserId !== cmd.userId) {
                        return;
                    }
                    // just to broadcast the progress - selected player to strip
                    this.sendToRoom(state.id, {
                        type: 'Joker.ShowStripModeView',
                        activeUserId: metadata.stripData.nextWinnerUserId,
                        selectedUserId: cmd.stripUserId,
                        timeLeft: null,
                        winnerUserIds: metadata.stripData.winnerUserIds,
                        looserUserIds: metadata.stripData.looserUserIds,
                        userAvatarLayers: metadata.userAvatarLayers,
                        stripEntries: metadata.stripData.stripEntries.map(x => ({
                            userId: x.userId,
                            itemId: x.avatarLayerId,
                            strippedUserId: x.strippedUserId,
                            takeItem: x.takeItem,
                            respectCount: x.respectCount,
                        })),
                    }, [cmd.userId]);
                }
                break;
            case 'STRIP_ITEM':
                {
                    if (!metadata.stripData) {
                        return;
                    }
                    if (metadata.stripData.nextWinnerUserId !== cmd.userId) {
                        return;
                    }
                    const entries = metadata.stripData.stripEntries;
                    if (entries.find(x => x.userId === cmd.userId)) {
                        return;
                    }
                    if (entries.find(x => x.strippedUserId === cmd.stripUserId)) {
                        return;
                    }
                    metadata.stripData.stripEntries.push({
                        userId: cmd.userId,
                        strippedUserId: cmd.stripUserId,
                        avatarLayerId: cmd.avatarLayerId,
                        takeItem: cmd.takeItem,
                        respectCount: !cmd.takeItem ? 2 : 0,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.ShowStripModeView',
                        activeUserId: '',
                        selectedUserId: null,
                        timeLeft: null,
                        winnerUserIds: metadata.stripData.winnerUserIds,
                        looserUserIds: metadata.stripData.looserUserIds,
                        userAvatarLayers: metadata.userAvatarLayers,
                        stripEntries: metadata.stripData.stripEntries.map(x => ({
                            userId: x.userId,
                            itemId: x.avatarLayerId,
                            strippedUserId: x.strippedUserId,
                            takeItem: x.takeItem,
                            respectCount: x.respectCount,
                        })),
                    });
                    this.sendStripRequest(state, metadata);
                }
                break;
        }
    }
    processEvent(e, state) {
        var _a, _b, _c;
        switch (e.type) {
            case 'DEAL_REQUEST':
                {
                    const { userIds, cardsCount } = e;
                    // პირველ რიგებაზე არ გვჭირდება delay
                    const timeout = state.sectionIndex === 0 && state.roundIndex === 0
                        ? 0
                        : this.options.timeouts.dealCardsTimeout;
                    setTimeout(() => {
                        const [playerCards, trumpCard] = dealCards_1.dealCards(userIds, cardsCount, state.deckType, this.options.randomSeed);
                        this.applyCommand(state.id, {
                            type: 'DEAL2',
                            trumpCard,
                            playerCards,
                        });
                    }, timeout);
                }
                break;
            case 'GAME_CARD_PER_PLAYER':
                {
                    state.playersArray.forEach(x => {
                        var _a;
                        const downCard = e.downCardMap.get(x.userId);
                        this.sendToUser(x.userId, {
                            type: 'Joker.GameCard',
                            card: [downCard[0], downCard[1]],
                            isFirstPlayer: e.isFirstPlayer,
                            jokerAction: downCard[2]
                                ? {
                                    want: downCard[2].want,
                                    color: (_a = downCard[2].color) !== null && _a !== void 0 ? _a : -1,
                                }
                                : null,
                            playerPosition: e.originalPlayerPosition,
                            isNewDeck: true,
                        });
                    });
                    // remove card from current player
                    this.sendToUser(e.originalUserId, {
                        type: 'Joker.GameSetCardsVisible',
                        cardsVisibleString: e.playerCardVisibilities
                            .get(e.originalUserId)
                            .map(x => (x ? '1' : '0'))
                            .join(''),
                        playerPosition: e.originalPlayerPosition,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.GameDescCardCount',
                        playerPosition: e.originalPlayerPosition,
                    }, [e.originalUserId]);
                }
                break;
            case 'PLAYERS_DRINGGED':
                {
                    this.sendToRoom(state.id, {
                        type: 'Joker.PlayersDringged',
                        dringgerUserIds: e.dringgerUserIds,
                        dringgedUserIds: e.dringgedUserIds,
                    });
                }
                break;
            case 'DEAL_COMPLETED_PER_PLAYER':
                {
                    this.sendToRoom(state.id, {
                        type: 'Joker.TableReset',
                    });
                    state.playersArray.forEach(x => {
                        this.sendToUser(x.userId, {
                            type: 'Joker.CurrentCards',
                            cards: e.playerCardsMap.get(x.userId),
                            isNewDeck: true,
                        });
                    });
                    const dealerIndex = utils_1.rotateNumber(0, 3)(state.roundFirstPlayerIndex, -1);
                    const cardCount = state.cardsCount;
                    const is9 = cardCount === 9;
                    if (is9 && state.deckType === 'MODERN') {
                        this.sendToRoom(state.id, {
                            type: 'Joker.GameVisualDeal',
                            cardCount: 0,
                            mode: types_1.VisualDealMode.First,
                            dealerUserId: state.playersArray[dealerIndex].userId,
                        });
                    }
                    else {
                        this.sendToRoom(state.id, {
                            type: 'Joker.GameVisualDeal',
                            cardCount,
                            mode: types_1.VisualDealMode.Normal,
                            dealerUserId: state.playersArray[dealerIndex].userId,
                        });
                        const trumpCard = state.trump;
                        const isJokerTrump = types_1.isJoker(trumpCard);
                        state.playersArray.forEach(x => {
                            var _a;
                            const virtualCard = (_a = e.trumpCardMap) === null || _a === void 0 ? void 0 : _a.get(x.userId);
                            this.sendToUser(x.userId, {
                                type: 'Joker.GameSetKozir',
                                card: isJokerTrump
                                    ? [types_1.CardColor.None, virtualCard[1]]
                                    : virtualCard,
                                color: isJokerTrump ? types_1.CardColor.None : virtualCard[0],
                                mode: 'CARD',
                                isNewDeck: true,
                            });
                        });
                    }
                }
                break;
            case 'REQUEST_CARD':
                {
                    const { userId, cardPermissions, cardVisibilities, isFirstCard, } = e;
                    this.sendCardRequest(state.id, userId, (_a = state.activePlayer) === null || _a === void 0 ? void 0 : _a.positionIndex, (_b = state.activePlayer) === null || _b === void 0 ? void 0 : _b.status, isFirstCard, cardPermissions, cardVisibilities, state.globalIndex);
                }
                break;
            case 'REQUEST_BID':
                {
                    const { bidLimit } = e;
                    this.sendBidRequest(state, bidLimit);
                }
                break;
            case 'REQUEST_TRUMP':
                {
                    this.sendTrumpRequest(state, state.globalIndex, false);
                }
                break;
            case 'TRUMP_COLOR_SELECTED_PER_PLAYER':
                {
                    const dealerIndex = utils_1.rotateNumber(0, 3)(state.roundFirstPlayerIndex, -1);
                    state.playersArray.forEach(x => {
                        var _a;
                        this.sendToUser(x.userId, {
                            type: 'Joker.CurrentCards',
                            cards: e.playerCardsMap.get(x.userId),
                            isNewDeck: true,
                        });
                        const virtualColor = (_a = e.trumpColorMap.get(x.userId)) !== null && _a !== void 0 ? _a : types_1.CardColor.None;
                        this.sendToUser(x.userId, {
                            type: 'Joker.GameSetKozir',
                            card: [virtualColor, 0],
                            color: virtualColor,
                            mode: 'COLOR',
                            isNewDeck: true,
                        });
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.GameVisualDeal',
                        cardCount: 0,
                        mode: types_1.VisualDealMode.Last,
                        dealerUserId: state.playersArray[dealerIndex].userId,
                    });
                }
                break;
            case 'BIDDING_FINISHED':
                {
                    const { bidBalance } = e;
                    this.sendToRoom(state.id, {
                        type: 'Joker.GameStatsInfo',
                        status: bidBalance > 0 ? 1 : -1,
                        count: Math.abs(bidBalance),
                        message: '',
                    });
                }
                break;
            case 'STEP_FINISHED':
                {
                    const stepWinnerPlayerIndex = e.stepWinnerPlayer
                        .positionIndex;
                    this.sendToRoom(state.id, {
                        type: 'Joker.TableResetDownCards',
                        playerPosition: stepWinnerPlayerIndex + 1,
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.ResultsUpdatePlayerTaken',
                        playerPosition: stepWinnerPlayerIndex + 1,
                        want: e.winnerPlayerBid,
                        have: e.winnerPlayerHave,
                    });
                }
                break;
            case 'ROUND_FINISHED':
                {
                    const section = e.sectionIndex + 1;
                    const round = e.roundIndex + 1;
                    state.playersArray.forEach(player => {
                        const results = [];
                        const lineResult = player.results.find(x => x.type === 'NORMAL' &&
                            x.section === section &&
                            x.round === round);
                        if (lineResult) {
                            results.push(lineResult);
                        }
                        let sumResult = player.results.find(x => x.type === 'SUM' && x.section === section);
                        if (sumResult) {
                            // LEGACY: need to be improved after UI components rebuild
                            const bonusResult = player.results.find(x => x.type === 'BONUS' && x.section === section);
                            const removedByBonusResult = player.results.find(x => x.type === 'REMOVED_BY_BONUS' &&
                                x.section === section);
                            if (bonusResult) {
                                sumResult = {
                                    ...sumResult,
                                    score: sumResult.score - bonusResult.score,
                                };
                            }
                            if (removedByBonusResult) {
                                sumResult = {
                                    ...sumResult,
                                    score: sumResult.score + removedByBonusResult.score,
                                };
                            }
                            // LEGACY: need to be improved after UI components rebuild
                            results.push(sumResult);
                        }
                        this.sendToRoom(state.id, {
                            type: 'Joker.ResultsPlayer',
                            playerPosition: player.positionIndex + 1,
                            results: results.map(x => getLegacyResults(x, player.positionIndex)),
                        });
                    });
                    this.sendToRoom(state.id, {
                        type: 'Joker.RoundFinished',
                    });
                    const metadata = this.gameMetadatas.get(state.id);
                    const task = this.options.rootApi.publish.Event.Game.gameProgressUpdate({
                        game: this.options.game,
                        items: [
                            {
                                id: state.id,
                                progress: state.status === 'FINISHED'
                                    ? 100
                                    : getGameProgress_1.getGameProgress(state),
                                tournamentId: (_c = metadata === null || metadata === void 0 ? void 0 : metadata.tournamentId) !== null && _c !== void 0 ? _c : undefined,
                            },
                        ],
                    });
                    task.catch(console.log);
                }
                break;
            case 'SECTION_FINISHED':
                {
                    const section = e.sectionIndex + 1;
                    state.playersArray.forEach(player => {
                        const bonusResult = player.results.find(x => (x.type === 'BONUS' ||
                            x.type === 'REMOVED_BY_BONUS') &&
                            x.section === section);
                        if (bonusResult) {
                            const results = [bonusResult];
                            this.sendToRoom(state.id, {
                                type: 'Joker.ResultsPlayer',
                                playerPosition: player.positionIndex + 1,
                                results: results.map(x => getLegacyResults(x, player.positionIndex)),
                            });
                        }
                    });
                }
                break;
            case 'GAME_FINISHED':
                {
                    // რომ ვაცადოთ ანიმაცია კარტი ვინ წაიღო
                    setTimeout(() => {
                        const metadata = this.gameMetadatas.get(state.id);
                        if (metadata === null || metadata === void 0 ? void 0 : metadata.isStripMode) {
                            // get final scores
                            const userFinalScores = state.playersArray
                                .map(x => ({
                                userId: x.userId,
                                score: x.results
                                    .filter(x => x.type === 'SUM')
                                    .sort((a, b) => b.section - a.section)[0].score,
                            }))
                                .reduce((r, x) => r.set(x.userId, x.score), new Map());
                            const userPlaces = [
                                ...getPlayerPlaces(state.playersArray.map(x => ({
                                    userId: x.userId,
                                    score: userFinalScores.get(x.userId),
                                })), metadata.isPairMode).entries(),
                            ].map(([userId, place]) => ({
                                userId,
                                place,
                                score: userFinalScores.get(userId),
                            }));
                            const winnerUserIds = this.getWinnerUserIdsForStripMode(userPlaces);
                            const looserUserIds = state.userIds.filter(x => !winnerUserIds.includes(x));
                            metadata.stripData = {
                                winnerUserIds,
                                looserUserIds,
                                nextWinnerUserId: null,
                                stripEntries: [],
                            };
                            // collect information about stripping players and finish next
                            this.sendStripRequest(state, metadata);
                        }
                        else {
                            this.finishGame(state);
                        }
                    }, this.options.timeouts.dealCardsTimeout);
                }
                break;
        }
    }
    sendStripRequest(state, metadata) {
        var _a;
        const { winnerUserIds, looserUserIds, stripEntries, } = metadata.stripData;
        if (looserUserIds.length === stripEntries.length ||
            winnerUserIds.length === stripEntries.length) {
            const reduceFn = (r, x) => {
                var _a;
                return r.set(x.userId, ((_a = r.get(x.userId)) !== null && _a !== void 0 ? _a : []).concat(x.avatarLayerIds));
            };
            const newStripEntries = metadata.stripData
                ? metadata.stripData.stripEntries.reduce((r, x) => reduceFn(r, {
                    userId: x.strippedUserId,
                    avatarLayerIds: [x.avatarLayerId],
                }), new Map())
                : new Map();
            metadata.stripUserAvatarLayers.reduce((r, x) => reduceFn(r, {
                userId: x.userId,
                avatarLayerIds: x.avatarLayerIds,
            }), newStripEntries);
            metadata.stripUserAvatarLayers = [
                ...newStripEntries.entries(),
            ].map(([userId, avatarLayerIds]) => ({
                userId,
                avatarLayerIds: avatarLayerIds
                    .filter(utils_1.onlyUnique)
                    .filter(x => !!x),
            }));
            // all of them are stripped and need to finish
            setTimeout(() => {
                // timeout to let the last player to see the results
                this.finishGame(state);
            }, 3000);
            return;
        }
        if (!metadata.stripData) {
            console.error('oops, metadata.stripData not found');
            return;
        }
        const nextWinnerUserId = winnerUserIds.find(userId => !stripEntries.find(x => x.userId === userId));
        metadata.stripData.nextWinnerUserId = nextWinnerUserId !== null && nextWinnerUserId !== void 0 ? nextWinnerUserId : null;
        const isOnline = ((_a = state.playersArray.find(x => x.userId === nextWinnerUserId)) === null || _a === void 0 ? void 0 : _a.status) === 'ONLINE';
        const timeout = isOnline
            ? this.options.timeouts.default.stripRequestTimeout
            : this.options.timeouts.offline.stripRequestTimeout;
        const finalStripEntries = stripEntries
            .map(x => ({
            userId: x.userId,
            itemId: x.avatarLayerId,
            strippedUserId: x.strippedUserId,
            takeItem: x.takeItem,
            respectCount: x.respectCount,
        }))
            .filter(x => !metadata.stripUserAvatarLayers.find(y => y.userId === x.userId &&
            y.avatarLayerIds.includes(x.itemId)));
        this.sendToRoom(state.id, {
            type: 'Joker.ShowStripModeView',
            activeUserId: nextWinnerUserId,
            selectedUserId: null,
            winnerUserIds,
            looserUserIds,
            timeLeft: timeout,
            userAvatarLayers: metadata.userAvatarLayers,
            stripEntries: finalStripEntries,
        });
        metadata.timer = setTimeout(index => this.stripTimeoutLogic(state.id, nextWinnerUserId, index), timeout, state.globalIndex);
    }
    async stripTimeoutLogic(roomId, activeUserId, globalIndex) {
        var _a, _b, _c;
        const state = this.games.get(roomId);
        if (!state) {
            return;
        }
        const metadata = this.gameMetadatas.get(roomId);
        if (!metadata) {
            return;
        }
        if (state.globalIndex !== globalIndex) {
            return;
        }
        if (!metadata.stripData) {
            return;
        }
        const strippedUserIds = metadata.stripData.stripEntries.map(x => x.strippedUserId);
        const stripUserId = metadata.stripData.looserUserIds.find(x => !strippedUserIds.includes(x));
        if (!stripUserId) {
            console.log('no more users left to strip');
            return;
        }
        const stripLayerIds = (_c = (_b = (_a = metadata.userAvatarLayers) === null || _a === void 0 ? void 0 : _a.find(x => x.userId === stripUserId)) === null || _b === void 0 ? void 0 : _b.avatarLayers) === null || _c === void 0 ? void 0 : _c.map(x => x.layerId);
        this.applyCommand(state.id, {
            type: 'STRIP_ITEM',
            isBot: true,
            userId: activeUserId,
            stripUserId,
            takeItem: false,
            avatarLayerId: utils_1.getRandomItem(stripLayerIds),
        });
    }
    getWinnerUserIdsForStripMode(userPlaces) {
        const sortedUserPlaces = userPlaces.sort((a, b) => b.score - a.score);
        const firstPlaceUserIds = sortedUserPlaces
            .filter(x => x.place === 1)
            .map(x => x.userId);
        if (firstPlaceUserIds.length > 1) {
            return firstPlaceUserIds;
        }
        const secondPlaceUserIds = sortedUserPlaces
            .filter(x => x.place === 2)
            .map(x => x.userId);
        if (secondPlaceUserIds.length === 3) {
            return firstPlaceUserIds;
        }
        return firstPlaceUserIds.concat(secondPlaceUserIds);
    }
    sendBidRequest(state, bidLimit, skipTimerLogic = false) {
        var _a, _b;
        const metadata = this.gameMetadatas.get(state.id);
        if (!metadata) {
            return;
        }
        const totalBid = state.playersArray
            .map(x => { var _a, _b; return (_b = (_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.bid) !== null && _b !== void 0 ? _b : 0; })
            .reduce(utils_1.sum, 0);
        const bidsCount = state.playersArray.filter(x => { var _a, _b; return ((_b = (_a = x.roundStats) === null || _a === void 0 ? void 0 : _a.bid) !== null && _b !== void 0 ? _b : null) !== null; }).length;
        let fillRequired = -1;
        // მხოლოდ ბოლოს წინა მოთამაშე როცა აცხადებს
        if (bidsCount === 2) {
            fillRequired = state.cardsCount - totalBid;
            if (fillRequired < 0) {
                fillRequired = -1;
            }
        }
        const wantLimit = (_a = bidLimit !== null && bidLimit !== void 0 ? bidLimit : state.bidLimit) !== null && _a !== void 0 ? _a : -1;
        let autoSelect = fillRequired;
        if (autoSelect < 0) {
            autoSelect = 0;
        }
        if (autoSelect === wantLimit) {
            autoSelect++;
        }
        this.sendToUser(state.activePlayer.userId, {
            type: 'Joker.GameWantRequest',
            cardCount: state.cardsCount,
            wantLimit,
            fillRequired,
            autoSelect,
        });
        this.sendToRoom(state.id, {
            type: 'Joker.GameActivetePlayer',
            playerPosition: state.activePlayer.positionIndex + 1,
        });
        if (skipTimerLogic) {
            return;
        }
        const activeUserId = state.activePlayer.userId;
        const { timeouts, randomSeed } = this.options;
        let timeout = ((_b = state.activePlayer) === null || _b === void 0 ? void 0 : _b.status) === 'ONLINE'
            ? metadata.afkUserIds.has(activeUserId)
                ? timeouts.afk.bidTimeout
                : timeouts.default.bidTimeout
            : timeouts.offline.bidTimeout;
        // add bot action time
        timeout +=
            timeouts.botActionStaticTime +
                utils_1.random(randomSeed) * timeouts.botActionRandomizeTime;
        metadata.timer = setTimeout(index => this.bidTimeoutLogic(state.id, activeUserId, index), timeout, state.globalIndex);
    }
    async bidTimeoutLogic(roomId, activeUserId, globalIndex) {
        var _a;
        const state = this.games.get(roomId);
        if (!state) {
            return;
        }
        const metadata = this.gameMetadatas.get(roomId);
        if (!metadata) {
            return;
        }
        if (state.globalIndex !== globalIndex) {
            return;
        }
        const index = state.activePlayer.positionIndex;
        const botUser = (_a = this.registeredBots[index]) !== null && _a !== void 0 ? _a : this.registeredBots[0];
        const result = await botUser.requestAction({
            type: 'BID',
            state: getStateByPlayer_1.getStateByPlayer(state, activeUserId),
            randomSeed: this.options.randomSeed,
            actions: state.validActions,
        });
        const antiAfkActivityDate = metadata.userLastAntiAfkActivityDateMap.get(activeUserId);
        if (antiAfkActivityDate &&
            D.differenceInSeconds(new Date(), antiAfkActivityDate) > 30) {
            metadata.afkUserIds.add(activeUserId);
            this.sendToRoom(state.id, {
                type: 'Joker.GamePlayerIsAFK',
                userId: activeUserId,
                playerPosition: index + 1,
            });
        }
        this.applyCommand(state.id, {
            type: 'BID',
            isBot: true,
            userId: activeUserId,
            want: result,
        });
    }
    sendTrumpRequest(state, globalIndex, skipTimerLogic) {
        var _a, _b, _c;
        const metadata = this.gameMetadatas.get(state.id);
        if (!metadata) {
            return;
        }
        this.sendToUser((_a = state.activePlayer) === null || _a === void 0 ? void 0 : _a.userId, {
            type: 'Joker.GameKozirRequest',
        });
        this.sendToRoom(state.id, {
            type: 'Joker.GameActivetePlayer',
            playerPosition: ((_b = state.activePlayer) === null || _b === void 0 ? void 0 : _b.positionIndex) + 1,
        });
        if (skipTimerLogic) {
            return;
        }
        const activeUserId = state.activePlayer.userId;
        const { timeouts, randomSeed } = this.options;
        let timeout = ((_c = state.activePlayer) === null || _c === void 0 ? void 0 : _c.status) === 'ONLINE'
            ? metadata.afkUserIds.has(activeUserId)
                ? timeouts.afk.trumpTimeout
                : timeouts.default.trumpTimeout
            : timeouts.offline.trumpTimeout;
        // add bot action time
        timeout +=
            timeouts.botActionStaticTime +
                utils_1.random(randomSeed) * timeouts.botActionRandomizeTime;
        metadata.timer = setTimeout(index => this.trumpTimeoutLogic(state.id, activeUserId, index), timeout, globalIndex);
    }
    async trumpTimeoutLogic(roomId, activeUserId, globalIndex) {
        var _a;
        const state = this.games.get(roomId);
        if (!state) {
            return;
        }
        const metadata = this.gameMetadatas.get(roomId);
        if (!metadata) {
            return;
        }
        if (state.globalIndex !== globalIndex) {
            return;
        }
        const index = state.activePlayer.positionIndex;
        const botUser = (_a = this.registeredBots[index]) !== null && _a !== void 0 ? _a : this.registeredBots[0];
        const result = await botUser.requestAction({
            type: 'TRUMP',
            state: getStateByPlayer_1.getStateByPlayer(state, activeUserId),
            randomSeed: this.options.randomSeed,
            actions: state.validActions,
        });
        const antiAfkActivityDate = metadata.userLastAntiAfkActivityDateMap.get(activeUserId);
        if (antiAfkActivityDate &&
            D.differenceInSeconds(new Date(), antiAfkActivityDate) > 30) {
            metadata.afkUserIds.add(activeUserId);
            this.sendToRoom(state.id, {
                type: 'Joker.GamePlayerIsAFK',
                userId: activeUserId,
                playerPosition: index + 1,
            });
        }
        this.applyCommand(state.id, {
            type: 'TRUMP',
            isBot: true,
            userId: activeUserId,
            color: result,
        });
    }
    sendCardRequest(roomId, userId, userPositionIndex, activePlayerStatus, isFirstCard, cardPermissions, cardVisibilities, globalIndex) {
        const metadata = this.gameMetadatas.get(roomId);
        if (!metadata) {
            return;
        }
        this.sendToUser(userId, {
            type: 'Joker.GameSetCardsVisible',
            cardsVisibleString: cardVisibilities
                .map(x => (x ? '1' : '0'))
                .join(''),
            playerPosition: userPositionIndex + 1,
        });
        this.sendToUser(userId, {
            type: 'Joker.GameSetCardsPermission',
            permissionString: cardPermissions
                .map(x => (x ? '1' : '0'))
                .join(''),
        });
        this.sendToUser(userId, {
            type: 'Joker.GameCardRequest',
            isFirstCard,
        });
        this.sendToRoom(roomId, {
            type: 'Joker.GameActivetePlayer',
            playerPosition: userPositionIndex + 1,
        });
        // timer logic
        const activeUserId = userId;
        const { timeouts, randomSeed } = this.options;
        let timeout = activePlayerStatus === 'ONLINE'
            ? metadata.afkUserIds.has(activeUserId)
                ? timeouts.afk.cardTimeout
                : timeouts.default.cardTimeout
            : timeouts.offline.cardTimeout;
        // add bot action time
        timeout +=
            timeouts.botActionStaticTime +
                utils_1.random(randomSeed) * timeouts.botActionRandomizeTime;
        clearTimeout(metadata.timer);
        metadata.timer = setTimeout(index => this.cardTimeoutLogic(roomId, activeUserId, index), timeout, globalIndex);
    }
    async cardTimeoutLogic(roomId, activeUserId, globalIndex) {
        var _a;
        const state = this.games.get(roomId);
        if (!state) {
            return;
        }
        const metadata = this.gameMetadatas.get(roomId);
        if (!metadata) {
            return;
        }
        if (state.globalIndex !== globalIndex) {
            return;
        }
        const index = state.activePlayer.positionIndex;
        const botUser = (_a = this.registeredBots[index]) !== null && _a !== void 0 ? _a : this.registeredBots[0];
        const result = (await botUser.requestAction({
            type: 'CARD',
            state: getStateByPlayer_1.getStateByPlayer(state, activeUserId),
            randomSeed: this.options.randomSeed,
            actions: state.validActions,
        }));
        const antiAfkActivityDate = metadata.userLastAntiAfkActivityDateMap.get(activeUserId);
        if (antiAfkActivityDate &&
            D.differenceInSeconds(new Date(), antiAfkActivityDate) > 30) {
            metadata.afkUserIds.add(activeUserId);
            this.sendToRoom(state.id, {
                type: 'Joker.GamePlayerIsAFK',
                userId: activeUserId,
                playerPosition: index + 1,
            });
        }
        this.applyCommand(state.id, {
            type: 'CARD2',
            isBot: true,
            userId: activeUserId,
            card: result[0],
            jokerAction: result[1],
        });
    }
    sendCurrentState(userId, state, metadata) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        this.sendToUser(userId, {
            type: 'Joker.PlayerInteractions',
            interactions: metadata.interactions,
        });
        const player = state.playersArray.find(x => x.userId === userId);
        const positionIndex = (_a = player === null || player === void 0 ? void 0 : player.positionIndex) !== null && _a !== void 0 ? _a : null;
        if (!player || positionIndex === null) {
            return;
        }
        const { isAntiCheatEnabled } = state.settings;
        const toVirtualColorMap = (_b = metadata.userColors.get(player.userId)) === null || _b === void 0 ? void 0 : _b.toVirtualColorMap;
        const playerPosition = positionIndex + 1;
        this.sendToUser(userId, {
            type: 'Joker.CurrentTable',
            channel: state.id,
            info: getLegacyRoomState(state, metadata, true),
            stripUserAvatarLayers: metadata.stripUserAvatarLayers,
        });
        this.sendToUser(userId, { type: 'Joker.GameStarting' });
        // send all players results
        state.playersArray.forEach(x => {
            this.sendToUser(userId, {
                type: 'Joker.ResultsPlayer',
                playerPosition,
                results: x.results.map(y => getLegacyResults(y, x.positionIndex)),
            });
        });
        if (metadata.stripData) {
            this.sendToUser(userId, {
                type: 'Joker.ShowStripModeView',
                activeUserId: metadata.stripData.nextWinnerUserId,
                selectedUserId: null,
                timeLeft: null,
                winnerUserIds: metadata.stripData.winnerUserIds,
                looserUserIds: metadata.stripData.looserUserIds,
                userAvatarLayers: metadata.userAvatarLayers,
                stripEntries: metadata.stripData.stripEntries.map(x => ({
                    userId: x.userId,
                    itemId: x.avatarLayerId,
                    strippedUserId: x.strippedUserId,
                    takeItem: x.takeItem,
                    respectCount: x.respectCount,
                })),
            });
        }
        switch (state.status) {
            case 'WAITING_BID':
                {
                    // კარტის დარიგება
                    this.sendToUser(userId, {
                        type: 'Joker.CurrentCards',
                        cards: isAntiCheatEnabled
                            ? sortCards_1.sortCards(player.cards.map(c => toVirtualCard_1.toVirtualCard(c, true, toVirtualColorMap)))
                            : player.cards,
                        isNewDeck: true,
                    });
                    const dealerIndex = utils_1.rotateNumber(0, 3)(state.roundFirstPlayerIndex, -1);
                    const dealerUserId = (_c = state.playersArray[dealerIndex]) === null || _c === void 0 ? void 0 : _c.userId;
                    // ვიზუალურად გამოჩენა კარტის და კოზირის
                    if (state.cardsCount !== 9 ||
                        state.deckType === 'OLD_SCHOOL') {
                        this.sendToUser(userId, {
                            type: 'Joker.GameVisualDeal',
                            mode: types_1.VisualDealMode.Normal,
                            cardCount: state.cardsCount,
                            dealerUserId,
                        });
                        const trumpCard = state.trump;
                        const isJokerTrump = types_1.isJoker(trumpCard);
                        const virtualCard = toVirtualCard_1.toVirtualCard(trumpCard, isAntiCheatEnabled, toVirtualColorMap);
                        this.sendToUser(userId, {
                            type: 'Joker.GameSetKozir',
                            card: isJokerTrump
                                ? [types_1.CardColor.None, virtualCard[1]]
                                : virtualCard,
                            color: isJokerTrump ? types_1.CardColor.None : virtualCard[0],
                            mode: 'CARD',
                            isNewDeck: true,
                        });
                    }
                    else {
                        this.sendToUser(userId, {
                            type: 'Joker.GameVisualDeal',
                            mode: types_1.VisualDealMode.First,
                            cardCount: 0,
                            dealerUserId,
                        });
                        // any - for backward compatability
                        this.sendToUser(userId, {
                            type: 'Joker.GameVisualDeal',
                            mode: types_1.VisualDealMode.Last,
                            cardCount: 0,
                        });
                        const trumpColor = state.trump;
                        const virtualColor = isAntiCheatEnabled
                            ? (_d = toVirtualColorMap.get(trumpColor)) !== null && _d !== void 0 ? _d : types_1.CardColor.None : trumpColor;
                        this.sendToUser(userId, {
                            type: 'Joker.GameSetKozir',
                            card: [virtualColor, 0],
                            color: virtualColor,
                            mode: 'COLOR',
                            isNewDeck: true,
                        });
                    }
                    // ვინ რამდენი თქვა და წაიღო
                    state.playersArray.forEach(x => {
                        if (!x.roundStats) {
                            // ვისაც ჯერ არ უცხადებია არ გვაინტერესებს
                            return;
                        }
                        this.sendToUser(userId, {
                            type: 'Joker.ResultsPlayerWant',
                            playerPosition: x.positionIndex + 1,
                            section: state.sectionIndex + 1,
                            line: state.roundIndex + 1,
                            want: x.roundStats.bid,
                        });
                    });
                    // ვისი ცხადებაა
                    if (((_e = state.activePlayer) === null || _e === void 0 ? void 0 : _e.userId) === userId) {
                        this.sendBidRequest(state, null, true);
                    }
                    this.sendToUser(userId, {
                        type: 'Joker.GameActivetePlayer',
                        playerPosition: ((_f = state.activePlayer) === null || _f === void 0 ? void 0 : _f.positionIndex) + 1,
                    });
                }
                break;
            case 'WAITING_TRUMP':
                {
                    // კარტის დარიგება
                    this.sendToUser(userId, {
                        type: 'Joker.CurrentCards',
                        cards: (isAntiCheatEnabled
                            ? player.cards.map(c => toVirtualCard_1.toVirtualCard(c, true, toVirtualColorMap))
                            : player.cards).slice(0, 3),
                        isNewDeck: true,
                    });
                    const dealerIndex = utils_1.rotateNumber(0, 3)(state.roundFirstPlayerIndex, -1);
                    const dealerUserId = (_g = state.playersArray[dealerIndex]) === null || _g === void 0 ? void 0 : _g.userId;
                    this.sendToUser(userId, {
                        type: 'Joker.GameVisualDeal',
                        mode: types_1.VisualDealMode.First,
                        cardCount: 0,
                        dealerUserId,
                    });
                    if (((_h = state.activePlayer) === null || _h === void 0 ? void 0 : _h.userId) === userId) {
                        this.sendTrumpRequest(state, state.globalIndex, true);
                    }
                    this.sendToUser(userId, {
                        type: 'Joker.GameActivetePlayer',
                        playerPosition: ((_j = state.activePlayer) === null || _j === void 0 ? void 0 : _j.positionIndex) + 1,
                    });
                }
                break;
            case 'WAITING_CARD':
                {
                    // კარტის დარიგება
                    this.sendToUser(userId, {
                        type: 'Joker.CurrentCards',
                        cards: isAntiCheatEnabled
                            ? sortCards_1.sortCards(player.cards.map(c => toVirtualCard_1.toVirtualCard(c, true, toVirtualColorMap)))
                            : player.cards,
                        isNewDeck: true,
                    });
                    // mapping of indexes, need for virtualCardVisibilities and virtualCardPermissions
                    const playerVirtualSortedCardMapping = state.settings
                        .isAntiCheatEnabled
                        ? getPlayerVirtualSortedCardsMap_1.getPlayerVirtualSortedCardsMap(player.cards, toVirtualColorMap)
                        : new Map();
                    // show / hide cards for the players
                    this.sendToUser(userId, {
                        type: 'Joker.GameSetCardsVisible',
                        playerPosition: 0,
                        cardsVisibleString: (isAntiCheatEnabled
                            ? toVirtualCardVisibilities_1.toVirtualCardVisibilities(playerVirtualSortedCardMapping, player.cardVisibilities)
                            : player.cardVisibilities)
                            .map(x => (x ? '1' : '0'))
                            .join(''),
                    });
                    state.playersArray.forEach(x => {
                        if (x.userId === userId) {
                            return;
                        }
                        this.sendToUser(userId, {
                            type: 'Joker.GameSetCardsVisible',
                            playerPosition: x.positionIndex + 1,
                            cardsVisibleString: x.cardVisibilities
                                .slice()
                                .sort()
                                .map(x => (x ? '1' : '0'))
                                .join(''),
                        });
                    });
                    const dealerIndex = utils_1.rotateNumber(0, 3)(state.roundFirstPlayerIndex, -1);
                    const dealerUserId = (_k = state.playersArray[dealerIndex]) === null || _k === void 0 ? void 0 : _k.userId;
                    this.sendToUser(userId, {
                        type: 'Joker.GameVisualDeal',
                        mode: types_1.VisualDealMode.Special,
                        cardCount: state.cardsCount,
                        dealerUserId,
                    });
                    // კოზირის გაგზავნა
                    if (state.cardsCount !== 9 ||
                        state.deckType === 'OLD_SCHOOL') {
                        const trumpCard = state.trump;
                        const isJokerTrump = types_1.isJoker(trumpCard);
                        const virtualCard = toVirtualCard_1.toVirtualCard(trumpCard, isAntiCheatEnabled, toVirtualColorMap);
                        this.sendToUser(userId, {
                            type: 'Joker.GameSetKozir',
                            card: isJokerTrump
                                ? [types_1.CardColor.None, virtualCard[1]]
                                : virtualCard,
                            color: isJokerTrump ? types_1.CardColor.None : virtualCard[0],
                            mode: 'CARD',
                            isNewDeck: true,
                        });
                    }
                    else {
                        const trumpColor = state.trump;
                        const virtualColor = isAntiCheatEnabled
                            ? (_m = (_l = metadata.userColors
                                .get(player.userId)) === null || _l === void 0 ? void 0 : _l.toVirtualColorMap.get(trumpColor)) !== null && _m !== void 0 ? _m : types_1.CardColor.None : trumpColor;
                        this.sendToUser(userId, {
                            type: 'Joker.GameSetKozir',
                            card: [virtualColor, 0],
                            color: virtualColor,
                            mode: 'COLOR',
                            isNewDeck: true,
                        });
                    }
                    // შეტენვაა თუ წაგლეჯვა
                    if (state.bidBalance !== null) {
                        this.sendToUser(userId, {
                            type: 'Joker.GameStatsInfo',
                            status: state.bidBalance > 0 ? 1 : -1,
                            count: Math.abs(state.bidBalance),
                            message: '',
                        });
                    }
                    // ვინ რამდენი თქვა და წაიღო
                    state.playersArray.forEach(x => {
                        if (!x.roundStats) {
                            // ვისაც ჯერ არ უცხადებია არ გვაინტერესებს
                            return;
                        }
                        this.sendToUser(userId, {
                            type: 'Joker.ResultsPlayerWant',
                            playerPosition: x.positionIndex + 1,
                            section: state.sectionIndex + 1,
                            line: state.roundIndex + 1,
                            want: x.roundStats.bid,
                        });
                        if (x.roundStats.have) {
                            this.sendToUser(userId, {
                                type: 'Joker.ResultsUpdatePlayerTaken',
                                playerPosition: x.positionIndex + 1,
                                want: x.roundStats.bid,
                                have: x.roundStats.have,
                            });
                        }
                    });
                    // რა კარტებია ჩამოსული
                    state.playersArray.forEach(x => {
                        var _a;
                        if (!x.downCard) {
                            return;
                        }
                        this.sendToUser(userId, {
                            type: 'Joker.GameCard',
                            card: [
                                isAntiCheatEnabled
                                    ? toVirtualColorMap.get(x.downCard[0])
                                    : x.downCard[0],
                                x.downCard[1],
                            ],
                            isFirstPlayer: state.stepFirstPlayerIndex === x.positionIndex,
                            jokerAction: (_a = x.downCard[2]) !== null && _a !== void 0 ? _a : null,
                            playerPosition: x.positionIndex + 1,
                            isNewDeck: true,
                        });
                        this.sendToUser(userId, {
                            type: 'Joker.GameDescCardCount',
                            playerPosition: x.positionIndex + 1,
                        });
                    });
                    // თუ მიმდინარე მოთამაშის ჩამოსვლაა დავრთოთ ნება
                    if (((_o = state.activePlayer) === null || _o === void 0 ? void 0 : _o.userId) === userId) {
                        this.sendToUser(state.activePlayer.userId, {
                            type: 'Joker.GameSetCardsPermission',
                            permissionString: (isAntiCheatEnabled
                                ? toVirtualCardVisibilities_1.toVirtualCardVisibilities(playerVirtualSortedCardMapping, state.activePlayer.cardPermissions)
                                : state.activePlayer.cardPermissions)
                                .map(x => (x ? '1' : '0'))
                                .join(''),
                        });
                        this.sendToUser(state.activePlayer.userId, {
                            type: 'Joker.GameCardRequest',
                            isFirstCard: state.stepFirstPlayerIndex === ((_p = state.activePlayer) === null || _p === void 0 ? void 0 : _p.positionIndex),
                        });
                    }
                    this.sendToUser(userId, {
                        type: 'Joker.GameActivetePlayer',
                        playerPosition: ((_q = state.activePlayer) === null || _q === void 0 ? void 0 : _q.positionIndex) + 1,
                    });
                }
                break;
        }
    }
    async finishGame(state) {
        var _a, _b, _c;
        const metadata = this.gameMetadatas.get(state.id);
        if (!metadata) {
            console.warn('game metadata not found in finishGame', state.id);
            return;
        }
        clearTimeout(metadata.timer);
        clearTimeout(metadata.finishTimer);
        // state.userIds.forEach(x => {
        //   if (this.userGameIdMap.has(x)) {
        //     this.userGameIdMap.delete(x)
        //   }
        // })
        const finishCommand = {
            type: 'FINISHED',
            isFullGame: true,
            roomRefId: state.id,
            timestamp: Date.now(),
        };
        const commands = this.getPersistedCommands(state.id).concat(finishCommand);
        // get final scores
        const userFinalScores = state.playersArray
            .map(x => ({
            userId: x.userId,
            score: x.results
                .filter(x => x.type === 'SUM')
                .sort((a, b) => b.section - a.section)[0].score,
        }))
            .reduce((r, x) => r.set(x.userId, x.score), new Map());
        // get places based on the scores
        const userPlaces = getPlayerPlaces(state.playersArray.map(x => ({
            userId: x.userId,
            score: userFinalScores.get(x.userId),
        })), metadata.isPairMode);
        // get final stats
        const playersFinishStats = state.playersArray
            .map(x => getPlayerFinishStats(state.type, x, userFinalScores.get(x.userId), userPlaces.get(x.userId), commands, metadata.isPairMode))
            .reduce((r, x) => r.set(x.userId, x), new Map());
        const isSomeoneFullyStripped = metadata.stripUserAvatarLayers.some(x => {
            var _a, _b, _c;
            const originalLayerIds = (_c = (_b = (_a = metadata.userAvatarLayers) === null || _a === void 0 ? void 0 : _a.filter(y => y.userId === x.userId)) === null || _b === void 0 ? void 0 : _b.flatMap(x => x.avatarLayers.map(z => z.layerId))) !== null && _c !== void 0 ? _c : [];
            const strippedLayerIds = x.avatarLayerIds;
            const leftLayersIds = originalLayerIds
                .filter(y => !strippedLayerIds.includes(y))
                .filter(x => !!x);
            console.log('isSomeoneFullyStripped check', x.userId, originalLayerIds, strippedLayerIds);
            return leftLayersIds.length === 0;
        });
        this.sendToRoom(state.id, {
            type: 'Joker.GameFinished',
            showPlayAgain: !metadata.isRanked &&
                !isSomeoneFullyStripped &&
                !metadata.tournamentId &&
                state.playersArray.every(x => x.status === 'ONLINE'),
            stripUserAvatarLayers: metadata.stripUserAvatarLayers,
        });
        let sortedUserIds = metadata.originalUserIds;
        // POST Game
        try {
            console.log('sending strip entries', (_a = metadata.stripData) === null || _a === void 0 ? void 0 : _a.stripEntries);
            const result = await this.options.rootApi.execute.Command.Server.finishGame({
                game: this.options.game,
                gameServerVersion: this.options.gameServerVersion,
                id: state.id,
                commands,
                isFullGame: state.status === 'FINISHED',
                stripEntries: metadata.isStripMode
                    ? (_c = (_b = metadata.stripData) === null || _b === void 0 ? void 0 : _b.stripEntries) !== null && _c !== void 0 ? _c : [] : [],
                playerInteractions: metadata.interactions,
                playerSentEmotions: metadata.emotionsSent,
                players: state.playersArray.map(x => {
                    const playerStats = metadata.playerStats.get(x.userId);
                    const finishStats = playersFinishStats.get(x.userId);
                    return {
                        userId: x.userId,
                        place: finishStats.place,
                        score: finishStats.score,
                        addRating: finishStats.addRating,
                        afkRate: finishStats.afkRate,
                        disconnectsCount: playerStats.disconnectsCount,
                        data: {
                            place: finishStats.place,
                            taken9Count: finishStats.taken9Count,
                            afkRate: finishStats.afkRate,
                            afkRateType: finishStats.afkRateType,
                            isPairMode: metadata.isPairMode,
                            deckType: state.deckType,
                            fillOpponentsCount: x.fillOpponentsCount,
                            softFillOpponentsCount: x.softFillOpponentsCount,
                            bonusCount: finishStats.bonusCount,
                            bonus8Count: finishStats.bonus8Count,
                            bonus9Count: finishStats.bonus9Count,
                        },
                        speedRate: null,
                    };
                }),
                data: {
                    version: 3,
                    playerResults: state.playersArray.map(x => ({
                        userId: x.userId,
                        results: x.results,
                    })),
                    dringgedPlayersLog: state.dringgedPlayersLog,
                },
            });
            // this.options.gameServerApi.postGame({
            //   commands,
            //   isFullGame: state.status === 'FINISHED',
            //   playerInteractions: metadata.interactions,
            //   playerSentEmotions: metadata.emotionsSent,
            //   players: state.playersArray.map(x => {
            //     const playerStats = metadata.playerStats.get(x.userId)!
            //     const finishStats = playersFinishStats.get(x.userId)!
            //     return {
            //       userId: x.userId,
            //       place: finishStats.place,
            //       score: finishStats.score,
            //       addRating: finishStats.addRating,
            //       afkRate: finishStats.afkRate,
            //       disconnectsCount: playerStats.disconnectsCount,
            //       data: {
            //         place: finishStats.place,
            //         bonusCount: finishStats.bonusCount,
            //         taken9Count: finishStats.taken9Count,
            //         afkRate: finishStats.afkRate,
            //         afkRateType: finishStats.afkRateType,
            //         isPairMode: metadata.isPairMode,
            //         deckType: state.deckType,
            //       },
            //       speedRate: null,
            //     }
            //   }),
            //   roomRefId: state.id,
            //   roomData: <GameStoreData>{
            //     version: 2,
            //     results: state.playersArray.map(x => ({
            //       userId: x.userId,
            //       roundResults: x.results,
            //     })),
            //   },
            // })
            if (result) {
                const sortedPlayers = state.userIds
                    .map(userId => ({ userId, place: userPlaces.get(userId) }))
                    .sort((a, b) => a.place - b.place)
                    .map(x => state.playersArray.find(y => y.userId === x.userId));
                sortedUserIds = sortedPlayers.map(x => x.userId);
                const serverResults = result.players.reduce((r, x) => r.set(x.userId, x), new Map());
                const playerAfkRates = sortedPlayers.map((x, i) => {
                    var _a;
                    return ({
                        userId: x.userId,
                        index: i,
                        afkRate: (_a = playersFinishStats.get(x.userId)) === null || _a === void 0 ? void 0 : _a.afkRate,
                    });
                });
                sortedPlayers.forEach(player => {
                    const finishStats = playersFinishStats.get(player.userId);
                    const serverStats = serverResults.get(player.userId);
                    const PairRatingStars = [RatingStars[0], RatingStars[3]];
                    this.sendToUser(player.userId, {
                        type: 'Joker.ShowRatingResult',
                        isRatingsEnabled: result.isRanked,
                        result: {
                            IsIgnored: false,
                            IsLowLevelPlayersGame: false,
                            LowLevelToLoseStars: false,
                            AddedStars: finishStats.addRating,
                            Place: finishStats.place,
                            Stars: serverStats.rating,
                            PlaceStars: !serverStats.skipMinusPlaceRating
                                ? metadata.isPairMode
                                    ? PairRatingStars[finishStats.place - 1]
                                    : RatingStars[finishStats.place - 1]
                                : 0,
                            UserID: player.userId,
                            Achievements: {
                                Total9TakesCount: finishStats.taken9Count,
                                BonusCount: finishStats.bonusCount,
                                TotalTakesCount: 0,
                            },
                            afkMinusStars: finishStats.afkMinusStars,
                            playerAfkRates,
                            tokensCount: serverStats.tokensCount,
                        },
                    });
                });
            }
        }
        catch (err) {
            console.log('failed to send finished game SOS!', err);
        }
        if (state.playersArray.some(x => x.status !== 'ONLINE')) {
            this.removeRoom(state.id);
            this.deletePersistedCommands(state.id);
        }
        const roomInfo = getLegacyRoomState(state, metadata, true, sortedUserIds, true, playersFinishStats);
        this.sendToRoom(state.id, {
            type: 'Joker.CurrentTable',
            channel: state.id,
            info: roomInfo,
            stripUserAvatarLayers: metadata.stripUserAvatarLayers,
        });
    }
    async finishIncompleteGame(state) {
        const metadata = this.gameMetadatas.get(state.id);
        if (!metadata) {
            // console.warn('game metadata not found in finishGame', state.id)
            return;
        }
        clearTimeout(metadata.startTimer);
        clearTimeout(metadata.timer);
        clearTimeout(metadata.finishTimer);
        // state.userIds.forEach(x => {
        //   if (this.userGameIdMap.has(x)) {
        //     this.userGameIdMap.delete(x)
        //   }
        // })
        const finishCommand = {
            type: 'FINISHED',
            isFullGame: false,
            roomRefId: state.id,
            timestamp: Date.now(),
        };
        const commands = this.getPersistedCommands(state.id).concat(finishCommand);
        try {
            await this.options.rootApi.publish.Command.Server.finishGame({
                commands,
                isFullGame: false,
                playerInteractions: metadata.interactions,
                players: [],
                playerSentEmotions: [],
                stripEntries: [],
                // state.playersArray.map(x => {
                //   const playerStats = metadata.playerStats.get(x.userId)!
                //   // const finishStats = playersFinishStats.get(x.userId)!
                //   return {
                //     userId: x.userId,
                //     place: finishStats.place,
                //     score: finishStats.score,
                //     addRating: finishStats.addRating,
                //     afkRate:
                //       playerStats.botActionsCount /
                //       (playerStats.botActionsCount +
                //         playerStats.humanActionsCount),
                //     disconnectsCount: playerStats.botActionsCount,
                //     data: {},
                //     speedRate: null,
                //   }
                // }),
                id: state.id,
                game: this.options.game,
                gameServerVersion: this.options.gameServerVersion,
                data: {
                    version: 3,
                    playerResults: state.playersArray.map(x => ({
                        userId: x.userId,
                        results: x.results,
                    })),
                    dringgedPlayersLog: state.dringgedPlayersLog,
                },
            });
        }
        catch (err) {
            console.log('failed to send finished game SOS!', err);
        }
        this.removeRoom(state.id);
        this.deletePersistedCommands(state.id);
        this.sendToRoom(state.id, {
            type: 'Joker.GameFinished',
            showPlayAgain: false,
            stripUserAvatarLayers: metadata.stripUserAvatarLayers,
        });
        this.sendToRoom(state.id, {
            type: 'Joker.CurrentTable',
            channel: state.id,
            info: getLegacyRoomState(state, metadata, true, state.userIds),
            stripUserAvatarLayers: metadata.stripUserAvatarLayers,
        });
    }
    async ensureGameIsFinished(id) {
        try {
            await this.options.rootApi.publish.Command.Server.finishGame({
                isFullGame: false,
                id,
                data: null,
                stripEntries: [],
                players: [],
                commands: [],
                playerInteractions: [],
                playerSentEmotions: [],
                game: this.options.game,
                gameServerVersion: this.options.gameServerVersion,
            });
        }
        catch (err) { }
    }
    // helper
    sendToRoom(roomId, event, excludeUserIds = []) {
        var _a, _b;
        const userIds = ((_b = (_a = this.games.get(roomId)) === null || _a === void 0 ? void 0 : _a.playersArray) !== null && _b !== void 0 ? _b : [])
            .map(x => x.userId)
            .filter(x => !excludeUserIds.includes(x));
        userIds.forEach(x => this.sendToUser(x, event));
    }
    sendToUser(userId, event) {
        var _a;
        const socketId = this.userSockets.get(userId);
        if (!socketId) {
            return;
        }
        this.options.pusherEvents.publish({
            type: 'SEND_TO_SOCKET',
            socketId: (_a = socketId) !== null && _a !== void 0 ? _a : null,
            event,
        });
    }
    persistCommands(refId, action, shouldSkip) {
        const { storagePath } = this.options;
        if (!storagePath) {
            return;
        }
        const skipPart = shouldSkip ? { skip: true } : null;
        const cmd = {
            ...action,
            timestamp: this.options.getCurrentTime(),
            ...skipPart,
        };
        if (storagePath === 'MEMORY') {
            this.commandsLog.push(cmd);
            return;
        }
        const filePath = path.join(storagePath, `${refId}.txt`);
        try {
            fs.appendFileSync(filePath, JSON.stringify(cmd) + LINE_SEPARATOR);
        }
        catch (err) {
            console.warn('GameTable.PersistCommand Failed', err.message);
        }
    }
    deletePersistedCommands(refId) {
        const { storagePath } = this.options;
        if (!storagePath) {
            return;
        }
        if (storagePath === 'MEMORY') {
            this.commandsLog = [];
            return;
        }
        const filePath = path.join(storagePath, `${refId}.txt`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getPersistedCommands(refId) {
        const { storagePath } = this.options;
        if (!storagePath) {
            return [];
        }
        if (storagePath === 'MEMORY') {
            return this.commandsLog;
        }
        const filePath = path.join(storagePath, `${refId}.txt`);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const fileData = fs.readFileSync(filePath);
        try {
            return fileData
                .toString()
                .split('\n')
                .filter(x => x)
                .map(x => JSON.parse(x));
        }
        catch (err) {
            console.warn('GameTableManager.getPersistedCommands failed', err.message);
        }
        return [];
    }
}
exports.LiveRuntime = LiveRuntime;
function fromLiveRuntimeGameCommand(cmd, roomId, metadata) {
    var _a;
    switch (cmd.type) {
        case 'CARD2': {
            const userColorsMetadata = metadata.userColors.get(cmd.userId);
            if (!userColorsMetadata) {
                throw new utils_1.AppError('USER_COLORS_METADATA_NOT_FOUND', {
                    data: {
                        isAntiCheatEnabled: true,
                        roomId,
                        cmd: cmd,
                        userColorsKeys: metadata.userColors.keys(),
                        userId: cmd.userId,
                    },
                });
            }
            return cmd.isBot
                ? cmd
                : {
                    ...cmd,
                    type: 'CARD2',
                    card: types_1.isJoker(cmd.card)
                        ? cmd.card
                        : [
                            userColorsMetadata.fromVirtualColorMap.get(cmd.card[0]),
                            cmd.card[1],
                        ],
                    jokerAction: cmd.jokerAction
                        ? {
                            want: cmd.jokerAction.want,
                            color: ((_a = cmd.jokerAction.color) !== null && _a !== void 0 ? _a : null) === null
                                ? cmd.jokerAction.color
                                : userColorsMetadata.fromVirtualColorMap.get(cmd.jokerAction.color),
                        }
                        : cmd.jokerAction,
                };
        }
        case 'TRUMP': {
            const userColorsMetadata = metadata.userColors.get(cmd.userId);
            if (!userColorsMetadata) {
                throw new utils_1.AppError('USER_COLORS_METADATA_NOT_FOUND', {
                    data: {
                        isAntiCheatEnabled: true,
                        roomId,
                        cmd: cmd,
                        userColorsKeys: metadata.userColors.keys(),
                        userId: cmd.userId,
                    },
                });
            }
            return cmd.isBot
                ? cmd
                : {
                    ...cmd,
                    type: 'TRUMP',
                    color: userColorsMetadata.fromVirtualColorMap.get(cmd.color),
                };
        }
        default:
            return cmd;
    }
}
/**
 * sometimes input is one event and output multiple, for example:
 * TRUMP selected, each player should send individual events so 1 event -> 4 events
 */
function toLiveRuntimeGameEvent(e, state, metadata) {
    var _a;
    const { isAntiCheatEnabled } = state.settings;
    switch (e.type) {
        case 'DEAL_COMPLETED': {
            if (isAntiCheatEnabled) {
                // just generating color mapping in metadata cache
                const deckColors = getRandomizedDeckColors_1.getRandomizedDeckColors(e.deckType);
                const playersDeckColors = getPlayersRandomizedDeckColors_1.getPlayersRandomizedDeckColors(deckColors);
                e.userIds.forEach((userId, i) => {
                    const playerDeckColors = playersDeckColors[i];
                    const { toVirtual, fromVirtual } = playerDeckColors.reduce((r, virtualColor, realColor) => {
                        r.toVirtual.set(realColor, virtualColor);
                        r.fromVirtual.set(virtualColor, realColor);
                        return r;
                    }, {
                        toVirtual: new Map(),
                        fromVirtual: new Map(),
                    });
                    // keep mapping
                    metadata.userColors.set(userId, {
                        toVirtualColorMap: toVirtual,
                        fromVirtualColorMap: fromVirtual,
                    });
                });
            }
            const trumpCard = state.trump;
            return {
                type: 'DEAL_COMPLETED_PER_PLAYER',
                deckType: e.deckType,
                userIds: e.userIds,
                trumpCardMap: trumpCard == null
                    ? null
                    : e.userIds
                        .map(userId => {
                        var _a;
                        return ({
                            userId,
                            trump: toVirtualCard_1.toVirtualCard(trumpCard, isAntiCheatEnabled, (_a = metadata.userColors.get(userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap),
                        });
                    })
                        .reduce((r, x) => r.set(x.userId, x.trump), new Map()),
                playerCardsMap: e.userIds
                    .map((userId, i) => {
                    let cards = isAntiCheatEnabled
                        ? e.userCards[i].map(card => {
                            var _a;
                            return toVirtualCard_1.toVirtualCard(card, true, (_a = metadata.userColors.get(userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap);
                        })
                        : e.userCards[i];
                    if (cards.length === 9 && state.deckType === 'MODERN') {
                        cards = cards.slice(0, 3);
                    }
                    else {
                        cards = sortCards_1.sortCards(cards);
                    }
                    return {
                        userId,
                        cards,
                    };
                })
                    .reduce((r, x) => r.set(x.userId, x.cards), new Map()),
            };
        }
        case 'GAME_CARD': {
            return {
                type: 'GAME_CARD_PER_PLAYER',
                isFirstPlayer: e.isFirstPlayer,
                originalUserId: e.userId,
                originalPlayerPosition: e.playerPosition,
                originalDownCard: e.downCard,
                downCardMap: state.userIds
                    .map(userId => {
                    var _a;
                    return ({
                        userId,
                        downCard: isAntiCheatEnabled
                            ? toVirtualDownCard_1.toVirtualDownCard(e.downCard, (_a = metadata.userColors.get(userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap)
                            : e.downCard,
                    });
                })
                    .reduce((r, x) => r.set(x.userId, x.downCard), new Map()),
                playerCardVisibilities: state.playersArray
                    .map(x => {
                    var _a;
                    return ({
                        userId: x.userId,
                        cardVisibilities: isAntiCheatEnabled
                            ? toVirtualCardVisibilities_1.toVirtualCardVisibilities(getPlayerVirtualSortedCardsMap_1.getPlayerVirtualSortedCardsMap(x.cards, (_a = metadata.userColors.get(x.userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap), x.cardVisibilities)
                            : x.cardVisibilities,
                    });
                })
                    .reduce((r, x) => r.set(x.userId, x.cardVisibilities), new Map()),
            };
        }
        case 'TRUMP_COLOR_SELECTED': {
            const playerCardsMap = state.playersArray
                .map(x => ({
                userId: x.userId,
                cards: isAntiCheatEnabled
                    ? sortCards_1.sortCards(x.cards.map(card => {
                        var _a;
                        return toVirtualCard_1.toVirtualCard(card, true, (_a = metadata.userColors.get(x.userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap);
                    }))
                    : x.cards,
            }))
                .reduce((r, x) => r.set(x.userId, x.cards), new Map());
            return {
                type: 'TRUMP_COLOR_SELECTED_PER_PLAYER',
                selectedByUserId: e.userId,
                originalColor: e.color,
                playerCardsMap,
                trumpColorMap: state.userIds
                    .map(userId => {
                    var _a;
                    return ({
                        userId,
                        color: isAntiCheatEnabled
                            ? (_a = metadata.userColors
                                .get(userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap.get(e.color)
                            : e.color,
                    });
                })
                    .reduce((r, x) => r.set(x.userId, x.color), new Map()),
            };
        }
        case 'REQUEST_CARD': {
            // get map for indexes real -> virtual cards
            const indexMap = isAntiCheatEnabled
                ? getPlayerVirtualSortedCardsMap_1.getPlayerVirtualSortedCardsMap(e.cards, (_a = metadata.userColors.get(e.userId)) === null || _a === void 0 ? void 0 : _a.toVirtualColorMap)
                : new Map();
            return {
                ...e,
                type: 'REQUEST_CARD',
                cardVisibilities: isAntiCheatEnabled
                    ? toVirtualCardVisibilities_1.toVirtualCardVisibilities(indexMap, e.cardVisibilities)
                    : e.cardVisibilities,
                cardPermissions: isAntiCheatEnabled
                    ? toVirtualCardPermissions_1.toVirtualCardPermissions(indexMap, e.cardPermissions)
                    : e.cardPermissions,
            };
        }
        default:
            return e;
    }
}
function getLegacyRoomState(state, metadata, showPlayerReady = false, userIds = null, includeFinishResultKey = false, finishStatsMap = undefined) {
    let Status = 1;
    switch (state.status) {
        case 'WAITING_START':
            Status = 1; /* New */
            break;
        case 'WAITING_TRUMP':
        case 'WAITING_BID':
        case 'WAITING_CARD':
            Status = 2; /* Started */
            break;
        case 'FINISHED':
            Status = 4; /* Finished */
            break;
    }
    let Type = 0;
    switch (state.type) {
        case 'STANDARD':
            Type = 0;
            break;
        case 'ONLY9':
            Type = 1;
            break;
        case 'QUICK':
            Type = 2;
            break;
        case 'LUCKY':
            Type = 3;
            break;
        case 'LUCKY4':
            Type = 4;
            break;
    }
    let Xishti = 200;
    switch (state.dring) {
        case '200':
            Xishti = 200;
            break;
        case '500':
            Xishti = 500;
            break;
        case '1000':
            Xishti = 1000;
            break;
        case 'SPEC':
            Xishti = 'SPEC';
            break;
        case '200/500':
            Xishti = '200/500';
            break;
    }
    const players = userIds !== null
        ? userIds.map(userId => {
            var _a;
            const player = state.playersArray.find(x => x.userId === userId);
            if (!player) {
                return null;
            }
            return getLegacyPlayerState(player, (_a = finishStatsMap === null || finishStatsMap === void 0 ? void 0 : finishStatsMap.get(player.userId)) !== null && _a !== void 0 ? _a : undefined, showPlayerReady, includeFinishResultKey);
        })
        : state.playersArray.map(x => {
            var _a;
            return getLegacyPlayerState(x, (_a = finishStatsMap === null || finishStatsMap === void 0 ? void 0 : finishStatsMap.get(x.userId)) !== null && _a !== void 0 ? _a : undefined, showPlayerReady, includeFinishResultKey);
        });
    return {
        Status,
        Type,
        Xishti,
        ActivePlayer: null,
        Channel: state.id,
        CreateDate: metadata.createdAt.getTime(),
        ID: state.id,
        Mode: `${state.type}_${Xishti}`.toUpperCase(),
        Players: players,
        ...(includeFinishResultKey
            ? { FinishResultKey: state.id }
            : null),
    };
}
function getLegacyPlayerState(player, finishStats, showPlayerReady = false, includeAllFields = false) {
    var _a, _b, _c, _d;
    return {
        UserID: player.userId,
        IsOnline: player.status === 'ONLINE',
        IsVIP: false,
        IsVIPMember: false,
        Nick: player.userId,
        Sex: 1,
        AddedPoints: (_a = finishStats === null || finishStats === void 0 ? void 0 : finishStats.points) !== null && _a !== void 0 ? _a : 0,
        ...(includeAllFields ||
            (showPlayerReady && player.positionIndex !== null)
            ? {
                IsReady: true,
            }
            : null),
        ...(player.positionIndex !== null
            ? {
                Position: player.positionIndex + 1,
            }
            : null),
        ...(includeAllFields
            ? {
                Place: (_b = finishStats === null || finishStats === void 0 ? void 0 : finishStats.place) !== null && _b !== void 0 ? _b : 0,
                AddedRating: (_c = finishStats === null || finishStats === void 0 ? void 0 : finishStats.addRating) !== null && _c !== void 0 ? _c : 0,
                Score: (_d = finishStats === null || finishStats === void 0 ? void 0 : finishStats.score) !== null && _d !== void 0 ? _d : 0,
            }
            : null),
    };
}
function getPlayerPlaces(playerScores, isPairMode) {
    if (isPairMode) {
        const leftPairScore = playerScores[0].score + playerScores[2].score;
        const rightPairScore = playerScores[1].score + playerScores[3].score;
        playerScores[0].score = playerScores[2].score = leftPairScore;
        playerScores[1].score = playerScores[3].score = rightPairScore;
        return utils_1.getRanks(playerScores, x => x.userId, x => x.score);
    }
    return utils_1.getRanks(playerScores, x => x.userId, x => x.score);
}
function getLegacyResults(x, positionIndex) {
    switch (x.type) {
        case 'NORMAL':
            return {
                ResultType: 0 /* Result */,
                SectionNo: x.section,
                LineNo: x.round,
                PlayerScore: x.score,
                Position: positionIndex,
                PlayerWant: x.bid,
                PlayerTook: x.taken,
            };
        case 'SUM':
            return {
                ResultType: 1 /* SectionResult */,
                SectionNo: x.section,
                LineNo: 0,
                PlayerScore: x.score,
                Position: positionIndex,
            };
        case 'BONUS':
            return {
                ResultType: 2 /* Bonus */,
                SectionNo: x.section,
                PlayerScore: x.score,
                Position: positionIndex,
                LineNo: x.round,
            };
        case 'REMOVED_BY_BONUS':
            return {
                ResultType: 2 /* Bonus */,
                SectionNo: x.section,
                PlayerScore: -x.score,
                Position: positionIndex,
                LineNo: x.round,
            };
    }
}
function getPlayerFinishStats(gameType, player, finalScore, place, allCommands, isPairMode) {
    const { userId, results } = player;
    let rating = RatingStars[place - 1];
    // PairMode-ში მეორე ადგილი ნიშნავს ბოლო ადგილს
    if (isPairMode && place === 2) {
        rating = RatingStars[3];
    }
    // standard
    // switch (place) {
    //   case 1:
    //     rating = RatingStars[0]
    //     break
    //   case 2:
    //     rating = RatingStars[1]
    //     break
    //   case 3:
    //     rating = RatingStars[2]
    //     break
    //   case 4:
    //     rating = RatingStars[3]
    //     break
    //   default:
    //     break
    // }
    // bonuses
    const taken9Count = results.filter(x => x.type === 'NORMAL' && x.bid === 9 && x.taken === 9).length;
    const bonusCount = results.filter(x => x.type === 'BONUS').length;
    let sectionCardsMap = new Map();
    switch (gameType) {
        case 'STANDARD':
            sectionCardsMap = new Map([
                [1, 8],
                [2, 9],
                [3, 8],
                [4, 9],
            ]);
            break;
        case 'ONLY9':
            sectionCardsMap = new Map([
                [1, 9],
                [2, 9],
                [3, 9],
                [4, 9],
            ]);
            break;
        case 'QUICK':
            sectionCardsMap = new Map([[1, 9]]);
            break;
    }
    const bonusSections = results
        .filter(x => x.type === 'BONUS')
        .map(x => (x.type === 'BONUS' && x.section))
        .map(x => sectionCardsMap.get(x))
        .filter(x => x);
    const bonus8Count = bonusSections.filter(x => x === 8).length;
    const bonus9Count = bonusSections.filter(x => x === 9).length;
    rating += taken9Count * 2 + bonusCount;
    // check offline
    const userActionCommands = allCommands
        .filter(x => (x.type === 'CARD' ||
        x.type === 'CARD2' ||
        x.type === 'BID' ||
        x.type === 'TRUMP') &&
        x.userId === userId)
        .map(x => (x.type === 'CARD' ||
        x.type === 'CARD2' ||
        x.type === 'BID' ||
        x.type === 'TRUMP') &&
        x.isBot);
    const botPlaysCount = userActionCommands.filter(x => x).length;
    const afkRate = Math.round((botPlaysCount * 100) / userActionCommands.length);
    let points = finalScore * 10;
    // if player is offline
    let afkMinusStars = 0;
    let afkRateType = 'GOOD';
    if (afkRate > 5) {
        afkRateType = 'WARNING';
    }
    if (afkRate > 30) {
        afkMinusStars = -1;
        afkRateType = 'CRITICAL';
        points = 0;
    }
    if (afkRate > 80) {
        afkMinusStars = -3;
        afkRateType = 'CRITICAL';
        points = 0;
    }
    // afkMinusStars has higher priority
    if (afkMinusStars !== 0) {
        // keep only minus points and aad additional minus ones
        rating = (rating < 0 ? rating : 0) + afkMinusStars;
    }
    // get last section score
    return {
        userId,
        place,
        points,
        addRating: rating,
        afkMinusStars,
        score: finalScore,
        taken9Count,
        bonusCount,
        bonus8Count,
        bonus9Count,
        afkRate,
        afkRateType,
    };
}


/***/ }),

/***/ "./libs/joker/runtime/src/lib/runtimes/simulation.runtime.ts":
/*!*******************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/runtimes/simulation.runtime.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationRuntime = void 0;
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const bot_user_1 = __webpack_require__(/*! ../bot/bot.user */ "./libs/joker/runtime/src/lib/bot/bot.user.ts");
const createBot_1 = __webpack_require__(/*! ../bot/createBot */ "./libs/joker/runtime/src/lib/bot/createBot.ts");
const dealCards_1 = __webpack_require__(/*! ../domain/dealCards */ "./libs/joker/runtime/src/lib/domain/dealCards.ts");
const getCommandFromAction_1 = __webpack_require__(/*! ../domain/getCommandFromAction */ "./libs/joker/runtime/src/lib/domain/getCommandFromAction.ts");
const getStateByPlayer_1 = __webpack_require__(/*! ../domain/getStateByPlayer */ "./libs/joker/runtime/src/lib/domain/getStateByPlayer.ts");
const game_reducer_1 = __webpack_require__(/*! ../game.reducer */ "./libs/joker/runtime/src/lib/game.reducer.ts");
const USER_IDS = ['1', '2', '3', '4'];
class SimulationRuntime {
    constructor(options) {
        this.options = options;
    }
    async run(props) {
        const { getTrackTime } = this.options;
        const { gamesCount, botApiUrls: botApiUrlsParam, gameMode, randomSeed, batchSize, } = props;
        // make sure there is always 4 bot configured
        const botApiUrls = [null, null, null, null];
        botApiUrlsParam.forEach((x, i) => (botApiUrls[i] = x));
        const syncBot = createBot_1.createSyncBot('RANDOM', getTrackTime);
        const botUsers = await Promise.all(botApiUrls.map(async (url) => {
            var _a;
            return new bot_user_1.BotUser(url
                ? (_a = (await createBot_1.createBot(url, this.options))) !== null && _a !== void 0 ? _a : syncBot : syncBot, syncBot, getTrackTime);
        }));
        const playerBots = botUsers.reduce((r, x, i) => r.set(USER_IDS[i], x), new Map());
        const defaultBot = new bot_user_1.BotUser(syncBot, syncBot, getTrackTime);
        const playProps = {
            refId: '',
            gameMode,
            playerBots,
            defaultBot,
            userIds: USER_IDS,
            randomSeed,
        };
        // next start playing
        const startedAt = getTrackTime();
        const results = await runBatchOperations(gamesCount, batchSize !== null && batchSize !== void 0 ? batchSize : gamesCount, playProps, progress => console.log('Progress:', progress));
        const duration = getTrackTime() - startedAt;
        const playerPlaces = results.map(getPlayerPlaces).flat();
        const playerStats = calculatePlayerStatistics(playerPlaces, gamesCount);
        const botTimings = botUsers.map(x => Object.fromEntries([
            [
                'TOTAL',
                [...x.timeInMS.values()].reduce((r, x) => {
                    r.count += x.count;
                    r.time += x.time;
                    r.apiTime += x.apiTime;
                    r.callTime += x.callTime;
                    return r;
                }, { time: 0, count: 0, apiTime: 0, callTime: 0 }),
            ],
        ]));
        const botTimingDetails = botUsers.map(x => Object.fromEntries([...x.timeInMS.entries()]));
        return {
            duration,
            playerStats,
            botTimings,
            botTimingDetails,
        };
    }
}
exports.SimulationRuntime = SimulationRuntime;
async function runBatchOperations(totalCount, batchSize, playProps, progressEvent) {
    const results = [];
    const batchCount = Math.ceil(totalCount / batchSize);
    let processedCount = 0;
    for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
        const iterationBatchSize = totalCount - processedCount >= batchSize
            ? batchSize
            : totalCount - processedCount;
        processedCount += iterationBatchSize;
        const tasks = new Array(iterationBatchSize).fill(0).map((_, i) => playOneGame({
            ...playProps,
            refId: (processedCount + i).toString(),
        }));
        const iterationResults = await Promise.all(tasks);
        if (progressEvent) {
            progressEvent(processedCount / totalCount);
        }
        results.push(...iterationResults);
    }
    return results;
}
async function playOneGame(playProps) {
    var _a, _b;
    const { refId, gameMode, playerBots, defaultBot, userIds, randomSeed, } = playProps;
    let tmpCommand = {
        type: 'CREATE',
        gameMode,
        roomRefId: refId,
        userIds,
        randomSeed,
    };
    let tempState = null;
    let playerScores = [];
    while (true) {
        const [reducedState, events] = game_reducer_1.gameReducer(tempState, tmpCommand);
        tempState = reducedState;
        const analyzeResult = analyzeEvents(events, randomSeed);
        if (analyzeResult.isGameFinished) {
            playerScores = analyzeResult.playerScores;
            break;
        }
        if (analyzeResult.nextCommand) {
            tmpCommand = analyzeResult.nextCommand;
            continue;
        }
        const botUserId = (_a = reducedState === null || reducedState === void 0 ? void 0 : reducedState.activePlayer) === null || _a === void 0 ? void 0 : _a.userId;
        const botUser = (_b = (botUserId ? playerBots.get(botUserId) : null)) !== null && _b !== void 0 ? _b : defaultBot;
        tmpCommand = await getBotActionCommand(botUser, reducedState, randomSeed);
    }
    return playerScores;
}
function getPlayerPlaces(playerScores) {
    return playerScores
        .sort((a, b) => b.score - a.score)
        .map((x, i) => ({ userId: x.userId, place: i + 1 }));
}
function calculatePlayerStatistics(playerPlaces, gamesCount) {
    const initial = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    const stats = playerPlaces
        .reduce((r, x) => {
        r[+x.userId - 1][x.place - 1]++;
        return r;
    }, initial)
        .map(x => x.map(y => y));
    return stats;
}
function getBotActionCommand(botUser, state, randomSeed) {
    switch (state.status) {
        case 'WAITING_BID':
            return botUser
                .requestAction({
                type: 'BID',
                actions: state.validActions,
                state: getStateByPlayer_1.getStateByPlayer(state, state.activePlayer.userId),
                randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : null,
            })
                .then(x => getCommandFromAction_1.getCommandFromAction(state.status, x, state.activePlayer.userId, true));
        case 'WAITING_TRUMP':
            return botUser
                .requestAction({
                type: 'TRUMP',
                actions: state.validActions,
                state: getStateByPlayer_1.getStateByPlayer(state, state.activePlayer.userId),
                randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : null,
            })
                .then(x => getCommandFromAction_1.getCommandFromAction(state.status, x, state.activePlayer.userId, true));
        case 'WAITING_CARD':
            return botUser
                .requestAction({
                type: 'CARD',
                actions: state.validActions,
                state: getStateByPlayer_1.getStateByPlayer(state, state.activePlayer.userId),
                randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : null,
            })
                .then(x => getCommandFromAction_1.getCommandFromAction(state.status, x, state.activePlayer.userId, true));
        default:
            throw new utils_1.AppError('INVALID_PROCESS_STATE', {
                data: {
                    fn: 'getBotActionCommand',
                    stateStatus: state.status,
                },
            });
    }
}
function analyzeEvents(events, randomSeed) {
    let nextCommand = null;
    // GAME_FINISHED
    const gameFinishedEvent = events.find(x => x.type === 'GAME_FINISHED');
    // REQUEST_START_GAME
    const waitingStartEvent = events.find(x => x.type === 'REQUEST_START_GAME');
    if (waitingStartEvent &&
        waitingStartEvent.type === 'REQUEST_START_GAME') {
        nextCommand = {
            type: 'START',
            userIds: waitingStartEvent.userIds,
        };
    }
    // DEAL_CARDS
    const dealEvent = events.find(x => x.type === 'DEAL_REQUEST');
    if (dealEvent && dealEvent.type === 'DEAL_REQUEST') {
        const { userIds, cardsCount } = dealEvent;
        const [playerCards, trumpCard] = dealCards_1.dealCards(userIds, cardsCount, 'MODERN', randomSeed !== null && randomSeed !== void 0 ? randomSeed : null);
        nextCommand = {
            type: 'DEAL2',
            trumpCard,
            playerCards,
        };
    }
    return {
        isGameFinished: !!gameFinishedEvent,
        nextCommand,
        playerScores: (gameFinishedEvent === null || gameFinishedEvent === void 0 ? void 0 : gameFinishedEvent.type) === 'GAME_FINISHED'
            ? gameFinishedEvent.playerScores
            : [],
    };
}


/***/ }),

/***/ "./libs/joker/runtime/src/lib/runtimes/training.runtime.ts":
/*!*****************************************************************!*\
  !*** ./libs/joker/runtime/src/lib/runtimes/training.runtime.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingRuntime = void 0;
const types_1 = __webpack_require__(/*! @jok/joker/types */ "./libs/joker/types/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/utils */ "./libs/utils/src/index.ts");
const bot_user_1 = __webpack_require__(/*! ../bot/bot.user */ "./libs/joker/runtime/src/lib/bot/bot.user.ts");
const createBot_1 = __webpack_require__(/*! ../bot/createBot */ "./libs/joker/runtime/src/lib/bot/createBot.ts");
const dealCards_1 = __webpack_require__(/*! ../domain/dealCards */ "./libs/joker/runtime/src/lib/domain/dealCards.ts");
const getCommandFromAction_1 = __webpack_require__(/*! ../domain/getCommandFromAction */ "./libs/joker/runtime/src/lib/domain/getCommandFromAction.ts");
const getPlayAction_1 = __webpack_require__(/*! ../domain/getPlayAction */ "./libs/joker/runtime/src/lib/domain/getPlayAction.ts");
const getStateByPlayer_1 = __webpack_require__(/*! ../domain/getStateByPlayer */ "./libs/joker/runtime/src/lib/domain/getStateByPlayer.ts");
const game_reducer_1 = __webpack_require__(/*! ../game.reducer */ "./libs/joker/runtime/src/lib/game.reducer.ts");
const loadFile_1 = __webpack_require__(/*! ../utils/loadFile */ "./libs/joker/runtime/src/lib/utils/loadFile.ts");
const MANUAL_BOT = 'BOT_MANUAL';
const BOT2 = 'BOT_2';
const BOT3 = 'BOT_3';
const BOT4 = 'BOT_4';
class TrainingRuntime {
    constructor(options) {
        this.options = options;
        this.games = new Map();
        this.gameMetadata = new Map();
        this.registeredBots = [];
        this.defaultBot = this.getDefaultBot();
        this.totalDuration = 0;
        /**
         * User bot mapping, each player will have it's own bot assigned
         * userId -> BotUser
         */
        this.playerBots = new Map();
        const { defaultEncodeStateFilePath: encodeStateFilePath, requireFunc, pathJoin, } = this.options;
        this.encodeState = encodeStateFilePath
            ? loadFile_1.loadFile(encodeStateFilePath, requireFunc, pathJoin).main
            : null;
    }
    // public api
    async setOpponentBots(apiUrls, reuseSameBots) {
        var _a;
        const { getTrackTime } = this.options;
        const syncBot = createBot_1.createSyncBot('RANDOM', getTrackTime);
        // build the Map for bots
        const botsMap = new Map();
        for (const uri of apiUrls.filter(x => !!x)) {
            if (!uri) {
                continue;
            }
            // dont re-create if reuseSameBots is set to true
            if (reuseSameBots && botsMap.has(uri)) {
                continue;
            }
            const bot = new bot_user_1.BotUser((_a = (await createBot_1.createBot(uri, this.options))) !== null && _a !== void 0 ? _a : syncBot, syncBot, getTrackTime);
            botsMap.set(uri, bot);
        }
        // use the Map to get bots
        this.registeredBots = apiUrls
            .filter(x => x)
            .map(x => botsMap.get(x));
    }
    resetTimer() {
        this.totalDuration = 0;
    }
    getTimerDuration() {
        return this.totalDuration;
    }
    async reset(refId, mode, randomSeed, position = types_1.PlayerPosition.Bottom) {
        const startedAt = this.options.getTrackTime();
        try {
            if (this.games.has(refId)) {
                this.games.delete(refId);
            }
            if (this.gameMetadata.has(refId)) {
                this.gameMetadata.delete(refId);
            }
            const rotateIndex = position - 1;
            const userIds = utils_1.rotateArray([MANUAL_BOT, BOT2, BOT3, BOT4], rotateIndex);
            const [reducedState, analyzeResult] = await this.startCommands(null, {
                type: 'CREATE',
                userIds,
                gameMode: mode,
                roomRefId: refId,
                randomSeed: randomSeed !== null && randomSeed !== void 0 ? randomSeed : undefined,
            });
            this.games.set(refId, reducedState);
            if (randomSeed) {
                this.gameMetadata.set(refId, { randomSeed });
            }
            if (this.registeredBots.length > 0) {
                // assign bots to the players (in case they need it)
                // same bot should be assigned to the player during the whole game
                const bots = this.registeredBots;
                userIds.forEach((x, i) => {
                    this.playerBots.set(x, bots[i % bots.length]);
                });
            }
            const playerState = getStateByPlayer_1.getStateByPlayer(reducedState, MANUAL_BOT);
            const encodedState = this.encodeState
                ? this.encodeState(playerState)
                : null;
            return {
                state: playerState,
                encodedState,
                ...analyzeResult,
            };
        }
        finally {
            this.totalDuration += this.options.getTrackTime() - startedAt;
        }
    }
    async selectAction(refId, actionId) {
        const startedAt = this.options.getTrackTime();
        try {
            const state = this.getValidatedState(refId);
            if (actionId == null) {
                throw new utils_1.AppError('INVALID_ACTION_INDEX', {
                    data: {
                        actionId,
                        validActions: state.validActions,
                    },
                });
            }
            const action = getPlayAction_1.getPlayAction(actionId);
            const command = getCommandFromAction_1.getCommandFromAction(state.status, action, MANUAL_BOT, true);
            const [reducedState, analyzeResult] = await this.startCommands(state, command);
            if (analyzeResult.isGameFinished) {
                this.games.delete(refId);
            }
            else {
                this.games.set(refId, reducedState);
            }
            const playerState = getStateByPlayer_1.getStateByPlayer(reducedState, MANUAL_BOT);
            const encodedState = this.encodeState
                ? this.encodeState(playerState)
                : null;
            return {
                state: playerState,
                encodedState,
                isRoundFinished: analyzeResult.isRoundFinished,
                isSectionFinished: analyzeResult.isSectionFinished,
                isGameFinished: analyzeResult.isGameFinished,
            };
        }
        finally {
            this.totalDuration += this.options.getTrackTime() - startedAt;
        }
    }
    getState(refId) {
        const state = this.getValidatedState(refId);
        return getStateByPlayer_1.getStateByPlayer(state, MANUAL_BOT);
    }
    // helper methods
    async startCommands(state, cmd) {
        var _a, _b;
        let tmpCommand = cmd;
        let tmpState = state;
        let allEvents = [];
        while (true) {
            const [reducedState, events] = game_reducer_1.gameReducer(tmpState, tmpCommand);
            tmpState = reducedState;
            allEvents = allEvents.concat(events);
            const analyzeResult = this.analyzeEvents(allEvents, (_a = reducedState.settings.randomSeed) !== null && _a !== void 0 ? _a : undefined);
            if (analyzeResult.nextCommand) {
                allEvents = allEvents.filter(x => x.type !== 'REQUEST_START_GAME' &&
                    x.type !== 'DEAL_REQUEST');
                tmpCommand = analyzeResult.nextCommand;
                continue;
            }
            if (analyzeResult.isManualBotTurn ||
                analyzeResult.isGameFinished) {
                allEvents = [];
                return [reducedState, analyzeResult];
            }
            const { activePlayer } = reducedState;
            if (!activePlayer) {
                throw new utils_1.AppError('INVALID_PROCESS_STATE', {
                    data: { analyzeResult },
                    errorMessage: "ActivePlayer not set when game isn't finished",
                });
            }
            if (reducedState.status === 'FINISHED') {
                throw new utils_1.AppError('INVALID_PROCESS_STATE', {
                    data: { reducedStateStatus: reducedState.status },
                    errorMessage: 'State was finished',
                });
            }
            const botUser = (_b = this.playerBots.get(activePlayer.userId)) !== null && _b !== void 0 ? _b : this.defaultBot;
            tmpCommand = await this.getBotActionCommand(botUser, reducedState);
        }
    }
    getBotActionCommand(botUser, state) {
        var _a, _b, _c, _d, _e, _f;
        switch (state.status) {
            case 'WAITING_BID':
                return botUser
                    .requestAction({
                    type: 'BID',
                    actions: state.validActions,
                    state: getStateByPlayer_1.getStateByPlayer(state, state.activePlayer.userId),
                    randomSeed: (_b = (_a = this.gameMetadata.get(state.id)) === null || _a === void 0 ? void 0 : _a.randomSeed) !== null && _b !== void 0 ? _b : null,
                })
                    .then(x => getCommandFromAction_1.getCommandFromAction(state.status, x, state.activePlayer.userId, true));
            case 'WAITING_TRUMP':
                return botUser
                    .requestAction({
                    type: 'TRUMP',
                    actions: state.validActions,
                    state: getStateByPlayer_1.getStateByPlayer(state, state.activePlayer.userId),
                    randomSeed: (_d = (_c = this.gameMetadata.get(state.id)) === null || _c === void 0 ? void 0 : _c.randomSeed) !== null && _d !== void 0 ? _d : null,
                })
                    .then(x => getCommandFromAction_1.getCommandFromAction(state.status, x, state.activePlayer.userId, true));
            case 'WAITING_CARD':
                return botUser
                    .requestAction({
                    type: 'CARD',
                    actions: state.validActions,
                    state: getStateByPlayer_1.getStateByPlayer(state, state.activePlayer.userId),
                    randomSeed: (_f = (_e = this.gameMetadata.get(state.id)) === null || _e === void 0 ? void 0 : _e.randomSeed) !== null && _f !== void 0 ? _f : null,
                })
                    .then(x => getCommandFromAction_1.getCommandFromAction(state.status, x, state.activePlayer.userId, true));
            default:
                throw new utils_1.AppError('INVALID_PROCESS_STATE', {
                    data: {
                        fn: 'getBotActionCommand',
                        stateStatus: state.status,
                    },
                });
        }
    }
    analyzeEvents(events, randomSeed) {
        const isRoundFinished = events.some(x => x.type === 'ROUND_FINISHED');
        const isGameFinished = events.some(x => x.type === 'GAME_FINISHED');
        const isSectionFinished = events.some(x => x.type === 'SECTION_FINISHED');
        const isManualBotTurn = events.some(x => (x.type === 'REQUEST_BID' ||
            x.type === 'REQUEST_TRUMP' ||
            x.type === 'REQUEST_CARD') &&
            x.userId === MANUAL_BOT);
        let nextCommand = null;
        // REQUEST_START_GAME
        const waitingStartEvent = events.find(x => x.type === 'REQUEST_START_GAME');
        if (waitingStartEvent &&
            waitingStartEvent.type === 'REQUEST_START_GAME') {
            nextCommand = {
                type: 'START',
                userIds: waitingStartEvent.userIds,
            };
        }
        // DEAL_CARDS
        const dealEvent = events.find(x => x.type === 'DEAL_REQUEST');
        if (dealEvent && dealEvent.type === 'DEAL_REQUEST') {
            const { userIds, cardsCount } = dealEvent;
            const [playerCards, trumpCard] = dealCards_1.dealCards(userIds, cardsCount, 'MODERN', randomSeed !== null && randomSeed !== void 0 ? randomSeed : null);
            nextCommand = {
                type: 'DEAL2',
                trumpCard,
                playerCards,
            };
        }
        return {
            isManualBotTurn,
            isRoundFinished,
            isSectionFinished,
            isGameFinished,
            nextCommand,
        };
    }
    getValidatedState(refId) {
        const state = this.games.get(refId);
        if (!state) {
            throw new utils_1.AppError('GAME_NOT_FOUND', { data: { refId } });
        }
        return state;
    }
    getDefaultBot() {
        const { getTrackTime } = this.options;
        const syncBot = createBot_1.createSyncBot('RANDOM', getTrackTime);
        return new bot_user_1.BotUser(syncBot, syncBot, getTrackTime);
    }
}
exports.TrainingRuntime = TrainingRuntime;


/***/ }),

/***/ "./libs/joker/runtime/src/lib/types.ts":
/*!*********************************************!*\
  !*** ./libs/joker/runtime/src/lib/types.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/joker/runtime/src/lib/utils/loadFile.ts":
/*!******************************************************!*\
  !*** ./libs/joker/runtime/src/lib/utils/loadFile.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFile = void 0;
function loadFile(filePath, requireFunc, pathJoin) {
    const fullFilePath = pathJoin(__dirname, filePath);
    return requireFunc(fullFilePath);
}
exports.loadFile = loadFile;


/***/ }),

/***/ "./libs/joker/types/src/index.ts":
/*!***************************************!*\
  !*** ./libs/joker/types/src/index.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/client-to-server-event */ "./libs/joker/types/src/lib/events/client-to-server-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/server-to-client-event */ "./libs/joker/types/src/lib/events/server-to-client-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/eventStores */ "./libs/joker/types/src/lib/eventStores.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/game.types */ "./libs/joker/types/src/lib/game.types.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/isJoker */ "./libs/joker/types/src/lib/isJoker.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/joker.stats */ "./libs/joker/types/src/lib/joker.stats.ts"), exports);


/***/ }),

/***/ "./libs/joker/types/src/lib/eventStores.ts":
/*!*************************************************!*\
  !*** ./libs/joker/types/src/lib/eventStores.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/joker/types/src/lib/events/client-to-server-event.ts":
/*!*******************************************************************!*\
  !*** ./libs/joker/types/src/lib/events/client-to-server-event.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/joker/types/src/lib/events/server-to-client-event.ts":
/*!*******************************************************************!*\
  !*** ./libs/joker/types/src/lib/events/server-to-client-event.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/joker/types/src/lib/game.types.ts":
/*!************************************************!*\
  !*** ./libs/joker/types/src/lib/game.types.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPosition = exports.VisualDealMode = exports.isValidDring = exports.isValidGameType = exports.GameMode = exports.JokerBotAction = exports.CardLevel = exports.CardColor = void 0;
var CardColor;
(function (CardColor) {
    CardColor[CardColor["Hearts"] = 0] = "Hearts";
    CardColor[CardColor["Diamonds"] = 1] = "Diamonds";
    CardColor[CardColor["Spades"] = 2] = "Spades";
    CardColor[CardColor["Clubs"] = 3] = "Clubs";
    CardColor[CardColor["None"] = 4] = "None";
})(CardColor = exports.CardColor || (exports.CardColor = {}));
var CardLevel;
(function (CardLevel) {
    CardLevel[CardLevel["_6"] = 0] = "_6";
    CardLevel[CardLevel["_7"] = 1] = "_7";
    CardLevel[CardLevel["_8"] = 2] = "_8";
    CardLevel[CardLevel["_9"] = 3] = "_9";
    CardLevel[CardLevel["_10"] = 4] = "_10";
    CardLevel[CardLevel["Jack"] = 5] = "Jack";
    CardLevel[CardLevel["Queen"] = 6] = "Queen";
    CardLevel[CardLevel["King"] = 7] = "King";
    CardLevel[CardLevel["Ace"] = 8] = "Ace";
    CardLevel[CardLevel["Joker"] = 9] = "Joker";
})(CardLevel = exports.CardLevel || (exports.CardLevel = {}));
// Player Actions
var JokerBotAction;
(function (JokerBotAction) {
    // Bid actions
    JokerBotAction[JokerBotAction["BID_0"] = 0] = "BID_0";
    JokerBotAction[JokerBotAction["BID_1"] = 1] = "BID_1";
    JokerBotAction[JokerBotAction["BID_2"] = 2] = "BID_2";
    JokerBotAction[JokerBotAction["BID_3"] = 3] = "BID_3";
    JokerBotAction[JokerBotAction["BID_4"] = 4] = "BID_4";
    JokerBotAction[JokerBotAction["BID_5"] = 5] = "BID_5";
    JokerBotAction[JokerBotAction["BID_6"] = 6] = "BID_6";
    JokerBotAction[JokerBotAction["BID_7"] = 7] = "BID_7";
    JokerBotAction[JokerBotAction["BID_8"] = 8] = "BID_8";
    JokerBotAction[JokerBotAction["BID_9"] = 9] = "BID_9";
    // Trump actions
    JokerBotAction[JokerBotAction["TRUMP_Hearts"] = 10] = "TRUMP_Hearts";
    JokerBotAction[JokerBotAction["TRUMP_Diamonds"] = 11] = "TRUMP_Diamonds";
    JokerBotAction[JokerBotAction["TRUMP_Spades"] = 12] = "TRUMP_Spades";
    JokerBotAction[JokerBotAction["TRUMP_Clubs"] = 13] = "TRUMP_Clubs";
    JokerBotAction[JokerBotAction["TRUMP_None"] = 14] = "TRUMP_None";
    // Card actions
    JokerBotAction[JokerBotAction["CARD_Hearts_6"] = 15] = "CARD_Hearts_6";
    JokerBotAction[JokerBotAction["CARD_Hearts_7"] = 16] = "CARD_Hearts_7";
    JokerBotAction[JokerBotAction["CARD_Hearts_8"] = 17] = "CARD_Hearts_8";
    JokerBotAction[JokerBotAction["CARD_Hearts_9"] = 18] = "CARD_Hearts_9";
    JokerBotAction[JokerBotAction["CARD_Hearts_10"] = 19] = "CARD_Hearts_10";
    JokerBotAction[JokerBotAction["CARD_Hearts_Jack"] = 20] = "CARD_Hearts_Jack";
    JokerBotAction[JokerBotAction["CARD_Hearts_Queen"] = 21] = "CARD_Hearts_Queen";
    JokerBotAction[JokerBotAction["CARD_Hearts_King"] = 22] = "CARD_Hearts_King";
    JokerBotAction[JokerBotAction["CARD_Hearts_Ace"] = 23] = "CARD_Hearts_Ace";
    JokerBotAction[JokerBotAction["CARD_Diamonds_6"] = 24] = "CARD_Diamonds_6";
    JokerBotAction[JokerBotAction["CARD_Diamonds_7"] = 25] = "CARD_Diamonds_7";
    JokerBotAction[JokerBotAction["CARD_Diamonds_8"] = 26] = "CARD_Diamonds_8";
    JokerBotAction[JokerBotAction["CARD_Diamonds_9"] = 27] = "CARD_Diamonds_9";
    JokerBotAction[JokerBotAction["CARD_Diamonds_10"] = 28] = "CARD_Diamonds_10";
    JokerBotAction[JokerBotAction["CARD_Diamonds_Jack"] = 29] = "CARD_Diamonds_Jack";
    JokerBotAction[JokerBotAction["CARD_Diamonds_Queen"] = 30] = "CARD_Diamonds_Queen";
    JokerBotAction[JokerBotAction["CARD_Diamonds_King"] = 31] = "CARD_Diamonds_King";
    JokerBotAction[JokerBotAction["CARD_Diamonds_Ace"] = 32] = "CARD_Diamonds_Ace";
    JokerBotAction[JokerBotAction["CARD_Spades_6"] = 33] = "CARD_Spades_6";
    JokerBotAction[JokerBotAction["CARD_Spades_7"] = 34] = "CARD_Spades_7";
    JokerBotAction[JokerBotAction["CARD_Spades_8"] = 35] = "CARD_Spades_8";
    JokerBotAction[JokerBotAction["CARD_Spades_9"] = 36] = "CARD_Spades_9";
    JokerBotAction[JokerBotAction["CARD_Spades_10"] = 37] = "CARD_Spades_10";
    JokerBotAction[JokerBotAction["CARD_Spades_Jack"] = 38] = "CARD_Spades_Jack";
    JokerBotAction[JokerBotAction["CARD_Spades_Queen"] = 39] = "CARD_Spades_Queen";
    JokerBotAction[JokerBotAction["CARD_Spades_King"] = 40] = "CARD_Spades_King";
    JokerBotAction[JokerBotAction["CARD_Spades_Ace"] = 41] = "CARD_Spades_Ace";
    JokerBotAction[JokerBotAction["CARD_Clubs_6"] = 42] = "CARD_Clubs_6";
    JokerBotAction[JokerBotAction["CARD_Clubs_7"] = 43] = "CARD_Clubs_7";
    JokerBotAction[JokerBotAction["CARD_Clubs_8"] = 44] = "CARD_Clubs_8";
    JokerBotAction[JokerBotAction["CARD_Clubs_9"] = 45] = "CARD_Clubs_9";
    JokerBotAction[JokerBotAction["CARD_Clubs_10"] = 46] = "CARD_Clubs_10";
    JokerBotAction[JokerBotAction["CARD_Clubs_Jack"] = 47] = "CARD_Clubs_Jack";
    JokerBotAction[JokerBotAction["CARD_Clubs_Queen"] = 48] = "CARD_Clubs_Queen";
    JokerBotAction[JokerBotAction["CARD_Clubs_King"] = 49] = "CARD_Clubs_King";
    JokerBotAction[JokerBotAction["CARD_Clubs_Ace"] = 50] = "CARD_Clubs_Ace";
    // Joker card actions
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Want"] = 51] = "CARD_Spades_Joker_Want";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Want_Hearts"] = 52] = "CARD_Spades_Joker_Want_Hearts";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Want_Diamonds"] = 53] = "CARD_Spades_Joker_Want_Diamonds";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Want_Spades"] = 54] = "CARD_Spades_Joker_Want_Spades";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Want_Clubs"] = 55] = "CARD_Spades_Joker_Want_Clubs";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Take"] = 56] = "CARD_Spades_Joker_Take";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Takes_Hearts"] = 57] = "CARD_Spades_Joker_Takes_Hearts";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Takes_Diamonds"] = 58] = "CARD_Spades_Joker_Takes_Diamonds";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Takes_Spades"] = 59] = "CARD_Spades_Joker_Takes_Spades";
    JokerBotAction[JokerBotAction["CARD_Spades_Joker_Takes_Clubs"] = 60] = "CARD_Spades_Joker_Takes_Clubs";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Want"] = 61] = "CARD_Clubs_Joker_Want";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Want_Hearts"] = 62] = "CARD_Clubs_Joker_Want_Hearts";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Want_Diamonds"] = 63] = "CARD_Clubs_Joker_Want_Diamonds";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Want_Spades"] = 64] = "CARD_Clubs_Joker_Want_Spades";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Want_Clubs"] = 65] = "CARD_Clubs_Joker_Want_Clubs";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Take"] = 66] = "CARD_Clubs_Joker_Take";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Takes_Hearts"] = 67] = "CARD_Clubs_Joker_Takes_Hearts";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Takes_Diamonds"] = 68] = "CARD_Clubs_Joker_Takes_Diamonds";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Takes_Spades"] = 69] = "CARD_Clubs_Joker_Takes_Spades";
    JokerBotAction[JokerBotAction["CARD_Clubs_Joker_Takes_Clubs"] = 70] = "CARD_Clubs_Joker_Takes_Clubs";
    JokerBotAction[JokerBotAction["Unknown"] = -1] = "Unknown";
})(JokerBotAction = exports.JokerBotAction || (exports.JokerBotAction = {}));
var GameMode;
(function (GameMode) {
    GameMode["Normal_200"] = "STANDARD_200";
    GameMode["Normal_Spec"] = "STANDARD_SPEC";
    GameMode["Normal_500"] = "STANDARD_500";
    GameMode["Normal_1000"] = "STANDARD_1000";
    GameMode["Normal_200_500"] = "STANDARD_200/500";
    GameMode["Only9_200"] = "ONLY9_200";
    GameMode["Only9_Spec"] = "ONLY9_SPEC";
    GameMode["Only9_500"] = "ONLY9_500";
    GameMode["Only9_1000"] = "ONLY9_1000";
    GameMode["Only9_200_500"] = "ONLY9_200/500";
    GameMode["Quick_200"] = "QUICK_200";
    GameMode["Quick_Spec"] = "QUICK_SPEC";
    GameMode["Quick_500"] = "QUICK_500";
    GameMode["Quick_1000"] = "QUICK_1000";
    GameMode["Quick_200_500"] = "QUICK_200/500";
    GameMode["Lucky_200"] = "LUCKY_200";
    GameMode["Lucky_Spec"] = "LUCKY_SPEC";
    GameMode["Lucky_500"] = "LUCKY_500";
    GameMode["Lucky_1000"] = "LUCKY_1000";
    GameMode["Lucky_200_500"] = "LUCKY_200/500";
    GameMode["Lucky4_200"] = "LUCKY4_200";
    GameMode["Lucky4_Spec"] = "LUCKY4_SPEC";
    GameMode["Lucky4_500"] = "LUCKY4_500";
    GameMode["Lucky4_1000"] = "LUCKY4_1000";
    GameMode["Lucky4_200_500"] = "LUCKY4_200/500";
    GameMode["Just4_200"] = "JUST4_200";
    GameMode["Just5_200"] = "JUST5_200";
})(GameMode = exports.GameMode || (exports.GameMode = {}));
function isValidGameType(type) {
    return [
        'STANDARD',
        'ONLY9',
        'QUICK',
        'LUCKY',
        'LUCKY4',
        'JUST4',
        'JUST5',
    ].includes(type);
}
exports.isValidGameType = isValidGameType;
function isValidDring(type) {
    return ['200', '500', '1000', 'SPEC', '200/500'].includes(type);
}
exports.isValidDring = isValidDring;
var VisualDealMode;
(function (VisualDealMode) {
    VisualDealMode[VisualDealMode["Normal"] = 0] = "Normal";
    VisualDealMode[VisualDealMode["First"] = 1] = "First";
    VisualDealMode[VisualDealMode["Last"] = 2] = "Last";
    VisualDealMode[VisualDealMode["Special"] = 3] = "Special";
})(VisualDealMode = exports.VisualDealMode || (exports.VisualDealMode = {}));
var PlayerPosition;
(function (PlayerPosition) {
    PlayerPosition[PlayerPosition["Bottom"] = 1] = "Bottom";
    PlayerPosition[PlayerPosition["Left"] = 2] = "Left";
    PlayerPosition[PlayerPosition["Top"] = 3] = "Top";
    PlayerPosition[PlayerPosition["Right"] = 4] = "Right";
})(PlayerPosition = exports.PlayerPosition || (exports.PlayerPosition = {}));


/***/ }),

/***/ "./libs/joker/types/src/lib/isJoker.ts":
/*!*********************************************!*\
  !*** ./libs/joker/types/src/lib/isJoker.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isJoker = void 0;
const game_types_1 = __webpack_require__(/*! ./game.types */ "./libs/joker/types/src/lib/game.types.ts");
/**
 * Joker Cards:
 *   Spades _6
 *   Clubs  _6
 */
function isJoker(card) {
    return card[1] === game_types_1.CardLevel.Joker;
    // return (
    //   (card[0] === CardColor.Clubs || card[0] === CardColor.Spades) &&
    //   card[1] === CardLevel._6
    // )
}
exports.isJoker = isJoker;


/***/ }),

/***/ "./libs/joker/types/src/lib/joker.stats.ts":
/*!*************************************************!*\
  !*** ./libs/joker/types/src/lib/joker.stats.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/shared/node-utils/src/index.ts":
/*!*********************************************!*\
  !*** ./libs/shared/node-utils/src/index.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./lib/auth/getUserByJwtToken */ "./libs/shared/node-utils/src/lib/auth/getUserByJwtToken.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/createMicro */ "./libs/shared/node-utils/src/lib/createMicro.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/dbContextBase */ "./libs/shared/node-utils/src/lib/dbContextBase.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getMockDb */ "./libs/shared/node-utils/src/lib/getMockDb.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getNatsTransport */ "./libs/shared/node-utils/src/lib/getNatsTransport.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getRequireFunc */ "./libs/shared/node-utils/src/lib/getRequireFunc.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getTensorFlow */ "./libs/shared/node-utils/src/lib/getTensorFlow.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getTransport */ "./libs/shared/node-utils/src/lib/getTransport.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/graphql-server */ "./libs/shared/node-utils/src/lib/graphql-server/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/jws */ "./libs/shared/node-utils/src/lib/jws.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/mapChangeStreamToObservable */ "./libs/shared/node-utils/src/lib/mapChangeStreamToObservable.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/newId */ "./libs/shared/node-utils/src/lib/newId.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/runMicros */ "./libs/shared/node-utils/src/lib/runMicros.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/tcp/tcp.client */ "./libs/shared/node-utils/src/lib/tcp/tcp.client.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/tcp/tcp.server */ "./libs/shared/node-utils/src/lib/tcp/tcp.server.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/threadPool */ "./libs/shared/node-utils/src/lib/threadPool.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/unzipData */ "./libs/shared/node-utils/src/lib/unzipData.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/zipData */ "./libs/shared/node-utils/src/lib/zipData.ts"), exports);


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/auth/getUserByJwtToken.ts":
/*!******************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/auth/getUserByJwtToken.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpToken = exports.getUserByJwtToken = void 0;
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
function getUserByJwtToken(token, config) {
    try {
        const { tokenSecret: secret, tokenIssuer: issuer } = config;
        const options = { issuer };
        const decoded = jwt.verify(token, secret, options);
        if (!decoded || !decoded['user']) {
            return null;
        }
        return {
            viewerId: decoded['user']['id'],
            viewerRoles: decoded['user']['roles'] || [],
            token,
        };
    }
    catch (err) {
        return {
            token,
            tokenError: err,
        };
    }
}
exports.getUserByJwtToken = getUserByJwtToken;
function getHttpToken(request, tokenName) {
    const authorization = request.headers['authorization'];
    if (authorization) {
        const parts = authorization.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            return parts[1];
        }
    }
    return getDefaultHttpToken(request, tokenName);
}
exports.getHttpToken = getHttpToken;
function getDefaultHttpToken(request, tokenName) {
    if (request.query && request.query.token) {
        return request.query.token;
    }
    const cookie = request.headers.cookie;
    if (!cookie) {
        return null;
    }
    const cookieMap = cookie
        .split(';')
        .map((x) => {
        if (!x) {
            return null;
        }
        const subItems = x.split('=');
        if (!subItems || subItems.length !== 2) {
            return null;
        }
        return {
            key: subItems[0].trim(),
            value: subItems[1].trim(),
        };
    })
        .filter((x) => !!x)
        .reduce((r, x) => {
        r[x.key] = x.value;
        return r;
    }, {});
    return cookieMap[tokenName];
}


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/createMicro.ts":
/*!*******************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/createMicro.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createMicro = void 0;
const transport_1 = __webpack_require__(/*! @jok/shared/transport */ "./libs/shared/transport/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/shared/utils */ "./libs/shared/utils/src/index.ts");
function createMicro(props) {
    return async (options) => {
        const { name, handlers = [], Command, Query, commandPattern = 'command.{{NAME}}', queryPattern = 'query.{{NAME}}', } = props;
        const { transport, contextObject } = options;
        const ctx = {
            api: transport_1.createTransportApi(transport),
            ...contextObject,
        };
        const queueGroup = name.toLowerCase();
        // const lowerCammelCaseName =
        //   name.slice(0, 1).toLowerCase() + name.slice(1)
        const unsubscribeClassHandlers = [];
        // register class handlers
        if (Command) {
            unsubscribeClassHandlers.push(transport_1.createTransportClassHandlers(commandPattern.replace('{{NAME}}', name), new Command(ctx), transport));
        }
        if (Query) {
            unsubscribeClassHandlers.push(transport_1.createTransportClassHandlers(queryPattern.replace('{{NAME}}', name), new Query(ctx), transport));
        }
        const unsubscribes = handlers.map(x => transport_1.createTransportHandlerMap(transport, ctx, x, queueGroup));
        utils_1.logger.info(`🟢 ${name} - micro loaded`);
        return async () => {
            unsubscribeClassHandlers.forEach(x => x());
            await Promise.all(unsubscribes.map(x => x()));
        };
    };
}
exports.createMicro = createMicro;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/dbContextBase.ts":
/*!*********************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/dbContextBase.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DbContextBase = void 0;
const defaultOptions = {
    update: { returnUpdatedByDefault: true },
    delete: { enableSoftDeleteByDefault: false },
};
class DbContextBase {
    constructor(db, client) {
        this.db = db;
        this.client = client;
    }
    async runTransaction(action, options) {
        if (!this.client) {
            throw new Error('DB_CLIENT_NOT_DEFINED');
        }
        // const session = this.client.startSession(
        //   options && options.sessionOptions,
        // )
        // session.startTransaction(options && options.transactionOptions)
        try {
            // const ctor = <any>DbContextBase
            // const transactionalDb = new ctor(this.db, session)
            const result = await action(this);
            // finish transaction
            // await session.commitTransaction()
            // session.endSession()
            return result;
        }
        catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            // await session.abortTransaction()
            // session.endSession()
            throw error; // Rethrow so calling function sees error
        }
    }
    getDefaultOptions() {
        return {
            ...defaultOptions,
        };
    }
}
exports.DbContextBase = DbContextBase;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/getMockDb.ts":
/*!*****************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/getMockDb.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockDb = void 0;
const jok_mango_1 = __webpack_require__(/*! jok-mango */ "jok-mango");
const newId_1 = __webpack_require__(/*! ./newId */ "./libs/shared/node-utils/src/lib/newId.ts");
async function getMockDb() {
    // @ts-ignore
    const connectionString = global['__MONGO_URI__'];
    // @ts-ignore
    const dbName = global['__MONGO_DB_NAME__'] + '_' + newId_1.newId();
    return jok_mango_1.getClient(connectionString).then(x => ({
        db: x.db(dbName),
        close: () => x.close(),
    }));
}
exports.getMockDb = getMockDb;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/getNatsTransport.ts":
/*!************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/getNatsTransport.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getNatsTransport = void 0;
const transport_1 = __webpack_require__(/*! @cheep/transport */ "@cheep/transport");
const transport_2 = __webpack_require__(/*! @jok/shared/transport */ "./libs/shared/transport/src/index.ts");
const utils_1 = __webpack_require__(/*! @jok/shared/utils */ "./libs/shared/utils/src/index.ts");
const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const nats_1 = __webpack_require__(/*! nats */ "nats");
const nkeys = __webpack_require__(/*! nkeys.js */ "nkeys.js");
const newId_1 = __webpack_require__(/*! ./newId */ "./libs/shared/node-utils/src/lib/newId.ts");
function getNatsTransport(props) {
    const { moduleName, connectionString, microJwt, microSeed } = props;
    return new transport_2.NatsTransport({
        connect: nats_1.connect,
        StringCodec: nats_1.StringCodec,
        defaultRpcTimeout: 3000,
        noEcho: false,
        authentication: {
            type: 'NKEYS',
            authenticator: nats_1.jwtAuthenticator(microJwt, nats_1.StringCodec().encode(microSeed)),
        },
        connectionName: moduleName,
        natsServerUrls: [connectionString],
        metadataReducers: [
            transport_1.createdAtReducer(Date.now),
            transport_1.transactionReducer(newId_1.newId, Date.now),
            transport_1.callStackReducer(),
        ],
        metadataReducersAfterReceive: [accessTokenReducer()],
        metadataValidator: [transport_1.callStackValidator('all')],
    }, {
        jsonDecode: JSON.parse,
        jsonEncode: JSON.stringify,
        newId: newId_1.newId,
    });
}
exports.getNatsTransport = getNatsTransport;
const accessTokenReducer = () => {
    const sc = nats_1.StringCodec();
    return (x) => {
        var _a;
        if (!((_a = x.currentMetadata) === null || _a === void 0 ? void 0 : _a.accessToken)) {
            return {};
        }
        const jwt = jsonwebtoken_1.decode(x.currentMetadata.accessToken, {
            complete: true,
            json: true,
        });
        if (!jwt) {
            throw new Error('Invalid JWT token format');
        }
        const issuerKp = nkeys.fromPublic(jwt.payload.iss);
        const isValid = issuerKp.verify(sc.encode(utils_1.toBase64Url(jwt.payload, 'utf8')), utils_1.fromBase64(jwt.signature));
        if (!isValid) {
            throw new Error('Invalid JWT token');
        }
        return {
            userId: jwt.payload.name,
            sessionId: jwt.payload.sub,
        };
    };
};


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/getRequireFunc.ts":
/*!**********************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/getRequireFunc.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequireFunc = void 0;
function getRequireFunc() {
    return  true
        ? require
        : undefined;
}
exports.getRequireFunc = getRequireFunc;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/getTensorFlow.ts":
/*!*********************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/getTensorFlow.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTensorFlow = void 0;
function getTensorFlow(TF_MODE) {
    switch (TF_MODE) {
        case 'CPU':
        // return require('@tensorflow/tfjs-node')
        case 'GPU':
        // return require('@tensorflow/tfjs-node-gpu')
        default:
        // return require('@tensorflow/tfjs')
    }
}
exports.getTensorFlow = getTensorFlow;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/getTransport.ts":
/*!********************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/getTransport.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransport = void 0;
const transport_1 = __webpack_require__(/*! @cheep/transport */ "@cheep/transport");
const transport_rabbitmq_1 = __webpack_require__(/*! @cheep/transport-rabbitmq */ "@cheep/transport-rabbitmq");
const newId_1 = __webpack_require__(/*! ./newId */ "./libs/shared/node-utils/src/lib/newId.ts");
function getTransport(props) {
    const { exchangeName, moduleName, amqpConnectionString, failedMessagesQueueName, } = props;
    return new transport_rabbitmq_1.RabbitMQTransport({
        amqpConnectionString,
        publishExchangeName: exchangeName,
        moduleName,
        defaultRpcTimeout: 3000,
        failedMessagesQueueName,
        metadataReducers: [
            transport_1.createdAtReducer(Date.now),
            transport_1.transactionReducer(newId_1.newId, Date.now),
            transport_1.callStackReducer(),
        ],
        metadataValidator: [transport_1.callStackValidator('all')],
    }, {
        jsonDecode: JSON.parse,
        jsonEncode: JSON.stringify,
        newId: newId_1.newId,
    });
    // return new SnsSqsTransport<any>(
    //   {
    //     defaultRpcTimeout: 5000,
    //     queueMaxNumberOfMessages: 5,
    //     queueWaitTimeInSeconds: 0.2,
    //     responseQueueMaxNumberOfMessages: 1,
    //     responseQueueWaitTimeInSeconds: 1,
    //     config: {
    //       type: 'AUTO',
    //       publishTopicName: exchangeName,
    //       moduleName,
    //     },
    //     metadataReducers: [
    //       createdAtReducer(Date.now),
    //       transactionReducer(newId, Date.now),
    //       callStackReducer(),
    //     ],
    //     metadataValidator: [callStackValidator('all')],
    //   },
    //   {
    //     jsonDecode: JSON.parse,
    //     jsonEncode: JSON.stringify,
    //     newId,
    //     getSns: () => new SNS({ region: awsRegion }),
    //     getSqs: () => new SQS({ region: awsRegion }),
    //     getMessageGroup: route =>
    //       route.split('.').slice(0, 2).join('.'),
    //   },
    // )
}
exports.getTransport = getTransport;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/buildSchema.ts":
/*!**********************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/buildSchema.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSchema = void 0;
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const graphql_middleware_1 = __webpack_require__(/*! graphql-middleware */ "graphql-middleware");
const reduceSchemaFragments_1 = __webpack_require__(/*! ./reduceSchemaFragments */ "./libs/shared/node-utils/src/lib/graphql-server/reduceSchemaFragments.ts");
function buildSchema(schemaFragments) {
    const reduceSchema = reduceSchemaFragments_1.reduceSchemaFragments(schemaFragments);
    const schema = apollo_server_express_1.makeExecutableSchema({
        typeDefs: reduceSchema.typeDefs,
        resolvers: reduceSchema.resolvers,
    });
    const securedSchema = graphql_middleware_1.applyMiddleware(schema, reduceSchema.permissions || {});
    return securedSchema;
}
exports.buildSchema = buildSchema;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/helpers/graphql.context.ts":
/*!**********************************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/helpers/graphql.context.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/helpers/permissions.ts":
/*!******************************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/helpers/permissions.ts ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isWorker = exports.isAdmin = exports.isAuthorized = void 0;
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
function isAuthorized(resolve, _, __, { viewerId, tokenError }) {
    if (!viewerId) {
        if (tokenError && tokenError.name === 'TokenExpiredError') {
            throw new Error('TOKEN_EXPIRED');
        }
        if (tokenError && tokenError.name === 'JsonWebTokenError') {
            throw new Error('TOKEN_EXPIRED');
        }
        throw new apollo_server_express_1.AuthenticationError(`NOT_AUTHORIZED`);
    }
    return resolve();
}
exports.isAuthorized = isAuthorized;
function isAdmin(resolve, _, __, { viewerId, viewerRoles, tokenError }) {
    if (!viewerId) {
        if (tokenError && tokenError.name === 'TokenExpiredError') {
            throw new Error('TOKEN_EXPIRED');
        }
        throw new apollo_server_express_1.AuthenticationError(`NOT_AUTHORIZED`);
    }
    if (!viewerRoles || !viewerRoles.includes('ADMIN')) {
        throw new apollo_server_express_1.ApolloError('Not Administrator', `NOT_ADMIN`);
    }
    return resolve();
}
exports.isAdmin = isAdmin;
exports.isWorker = (resolve, _, __, { viewerId, viewerRoles, tokenError }) => {
    if (!viewerId) {
        if (tokenError && tokenError.name === 'TokenExpiredError') {
            throw new Error('TOKEN_EXPIRED');
        }
        throw new apollo_server_express_1.AuthenticationError(`NOT_AUTHORIZED`);
    }
    if (!viewerRoles || !viewerRoles.includes('WORKER')) {
        throw new apollo_server_express_1.ApolloError('Not worker process', `NOT_WORKER`);
    }
    return resolve();
};


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/helpers/schemaWithResolver.ts":
/*!*************************************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/helpers/schemaWithResolver.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/index.ts":
/*!****************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/index.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./buildSchema */ "./libs/shared/node-utils/src/lib/graphql-server/buildSchema.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./helpers/graphql.context */ "./libs/shared/node-utils/src/lib/graphql-server/helpers/graphql.context.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./helpers/permissions */ "./libs/shared/node-utils/src/lib/graphql-server/helpers/permissions.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./helpers/schemaWithResolver */ "./libs/shared/node-utils/src/lib/graphql-server/helpers/schemaWithResolver.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./reduceSchemaFragments */ "./libs/shared/node-utils/src/lib/graphql-server/reduceSchemaFragments.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./startGraphqlServer */ "./libs/shared/node-utils/src/lib/graphql-server/startGraphqlServer.ts"), exports);


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/reduceSchemaFragments.ts":
/*!********************************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/reduceSchemaFragments.ts ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceSchemaFragments = void 0;
const ramda_1 = __webpack_require__(/*! ramda */ "ramda");
function reduceSchemaFragments(schemas) {
    const typeDefs = schemas
        .flatMap(x => x.typeDefs)
        .filter(x => !!x);
    const resolvers = schemas
        .map(x => x.resolvers || {})
        .reduce(ramda_1.mergeDeepRight, {});
    const permissions = schemas
        .filter(x => Reflect.has(x, 'permissions'))
        .map(x => { var _a; return (_a = x === null || x === void 0 ? void 0 : x['permissions']) !== null && _a !== void 0 ? _a : {}; })
        .reduce(ramda_1.mergeDeepRight, {});
    return {
        typeDefs,
        resolvers,
        permissions,
    };
}
exports.reduceSchemaFragments = reduceSchemaFragments;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/graphql-server/startGraphqlServer.ts":
/*!*****************************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/graphql-server/startGraphqlServer.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startGraphqlServer = void 0;
function startGraphqlServer() { }
exports.startGraphqlServer = startGraphqlServer;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/jws.ts":
/*!***********************************************!*\
  !*** ./libs/shared/node-utils/src/lib/jws.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.jwsVerify = exports.jwsSign = void 0;
const utils_1 = __webpack_require__(/*! @jok/shared/utils */ "./libs/shared/utils/src/index.ts");
const nats_1 = __webpack_require__(/*! nats */ "nats");
function jwsSign(kp, payload) {
    const sc = nats_1.StringCodec();
    const header = {
        typ: 'jwt',
        alg: 'ed25519',
    };
    const encodedHeader = utils_1.toBase64Url(header, 'binary');
    const encodedPayload = utils_1.toBase64Url(payload, 'utf8');
    const signature = kp.sign(sc.encode(encodedPayload));
    return [encodedHeader, encodedPayload, utils_1.toBase64(signature)].join('.');
}
exports.jwsSign = jwsSign;
function jwsVerify(kp, jwt) {
    const sc = nats_1.StringCodec();
    const jwtParts = jwt.split('.');
    const encodedSignature = utils_1.fromBase64(jwtParts[2]);
    if (!kp.verify(sc.encode(jwtParts[1]), encodedSignature)) {
        return null;
    }
    const payloadString = new TextDecoder().decode(utils_1.fromBase64(jwtParts[1]));
    const payload = JSON.parse(payloadString);
    if (!payload.jok) {
        return null;
    }
    return payload;
}
exports.jwsVerify = jwsVerify;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/mapChangeStreamToObservable.ts":
/*!***********************************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/mapChangeStreamToObservable.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mapChangeStreamToObservable = void 0;
const mapObject_1 = __webpack_require__(/*! jok-mango/dist/common/mapObject */ "jok-mango/dist/common/mapObject");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
function mapChangeStreamToObservable(stream) {
    const result = new rxjs_1.Subject();
    stream.on('change', data => result.next(mapObject_1.default(data['fullDocument'])));
    stream.on('close', () => result.complete());
    stream.on('end', () => result.complete());
    stream.on('error', err => result.error(err));
    result.pipe(operators_1.finalize(() => stream.close()));
    return result;
}
exports.mapChangeStreamToObservable = mapChangeStreamToObservable;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/newId.ts":
/*!*************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/newId.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.newId = void 0;
const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");
function newId() {
    return new mongodb_1.ObjectId().toHexString();
}
exports.newId = newId;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/runMicros.ts":
/*!*****************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/runMicros.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.runMicros = void 0;
const utils_1 = __webpack_require__(/*! @jok/shared/utils */ "./libs/shared/utils/src/index.ts");
async function runMicros(micros) {
    utils_1.logger.info('--------------------------------------------');
    const stopMicroFns = await Promise.all(micros);
    utils_1.logger.info('--------------------------------------------');
    return async () => {
        await Promise.all(stopMicroFns.map(fn => fn()));
    };
}
exports.runMicros = runMicros;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/tcp/_utils.ts":
/*!******************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/tcp/_utils.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.encode = exports.decode = exports.SEPARATOR = void 0;
exports.SEPARATOR = '±';
function decode(buffer) {
    return buffer.toString();
}
exports.decode = decode;
function encode(json) {
    return Buffer.from(JSON.stringify(json) + exports.SEPARATOR, 'utf8');
}
exports.encode = encode;
function getMessages(messagePart) {
    let messages = [];
    let lastIndex = 0;
    let index = messagePart.indexOf(exports.SEPARATOR);
    while (index > -1) {
        messages.push(messagePart.slice(lastIndex, index));
        lastIndex = index + 1;
        index = messagePart.indexOf(exports.SEPARATOR, lastIndex + 1);
    }
    if (!lastIndex) {
        return {
            messages: [],
            messagePart,
        };
    }
    messagePart = messagePart.slice(lastIndex + 1);
    try {
        return {
            messages: messages
                .filter(x => x) // skip empty strings
                .map(x => JSON.parse(x))
                .flat(),
            messagePart,
        };
    }
    catch (err) {
        return {
            messages: [],
            messagePart,
        };
    }
}
exports.getMessages = getMessages;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/tcp/tcp.client.ts":
/*!**********************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/tcp/tcp.client.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpClient = void 0;
const net = __webpack_require__(/*! net */ "net");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
class TcpClient {
    constructor() {
        this.messagesReceived = new rxjs_1.Subject();
    }
    async init(url) {
        this.socket = await connect(url);
        let messagePart = '';
        this.socket.on('data', data => {
            messagePart += decode(data);
            const result = getMessages(messagePart);
            messagePart = result.messagePart;
            if (result.messages.length) {
                ;
                this.messagesReceived.next(result.messages);
            }
        });
        this.socket.on('end', () => {
            console.log('disconnected from server');
        });
    }
    send(cmds) {
        this.socket.write(encode(cmds));
    }
    close() {
        this.socket.end();
    }
}
exports.TcpClient = TcpClient;
function connect(url) {
    const parts = url.replace('tcp://', '').split(':');
    if (parts.length !== 2) {
        throw new Error('INVALID_TCP_CONNECTION_STRING');
    }
    const host = parts[0];
    const port = +parts[1];
    console.log(host, port);
    return new Promise((resolve, reject) => {
        const socket = net.connect({ host, port });
        function onError(err) {
            socket.removeListener('connect', onConnect);
            console.log(err);
            reject(err);
        }
        function onConnect() {
            socket.removeListener('error', onError);
            resolve(socket);
        }
        socket.once('connect', onConnect);
        socket.once('error', onError);
    });
}
function getMessages(messagePart) {
    let messages = [];
    let lastIndex = 0;
    let index = messagePart.indexOf(SEPARATOR);
    while (index > -1) {
        messages.push(messagePart.slice(lastIndex, index));
        lastIndex = index + 1;
        index = messagePart.indexOf(SEPARATOR, lastIndex + 1);
    }
    const updatedMessagePart = messagePart.slice(lastIndex);
    if (!lastIndex) {
        return {
            messages: [],
            messagePart,
        };
    }
    try {
        return {
            messages: messages
                .filter(x => x) // skip empty strings
                .map(x => JSON.parse(x))
                .flat(),
            messagePart: updatedMessagePart,
        };
    }
    catch (err) {
        // console.log(messagePart)
        console.log(err);
        return {
            messages: [],
            messagePart: '',
        };
    }
}
function decode(buffer) {
    return buffer.toString();
}
function encode(json) {
    return Buffer.from(JSON.stringify(json) + SEPARATOR, 'utf8');
}
const SEPARATOR = '±';


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/tcp/tcp.server.ts":
/*!**********************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/tcp/tcp.server.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpServer = exports.tcpTimer = void 0;
const net = __webpack_require__(/*! net */ "net");
const perf_hooks_1 = __webpack_require__(/*! perf_hooks */ "perf_hooks");
const _utils_1 = __webpack_require__(/*! ./_utils */ "./libs/shared/node-utils/src/lib/tcp/_utils.ts");
exports.tcpTimer = {
    duration: 0,
};
class TcpServer {
    constructor(processMessages) {
        this.processMessages = processMessages;
    }
    init() {
        this.server = net.createServer();
        this.server.on('close', () => {
            console.log('Server closed !');
        });
        this.server.on('connection', socket => {
            //this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
            //Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().
            console.log('Buffer size : ' + socket.bufferSize);
            console.log('---------server details -----------------');
            var address = this.server.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log('Server is listening at port: ' + port);
            console.log('Server ip :' + ipaddr);
            console.log('Server is IP4/IP6 : ' + family);
            var lport = socket.localPort;
            var laddr = socket.localAddress;
            console.log('Server is listening at LOCAL port: ' + lport);
            console.log('Server LOCAL ip :' + laddr);
            console.log('------------remote client info --------------');
            var rport = socket.remotePort;
            var raddr = socket.remoteAddress;
            var rfamily = socket.remoteFamily;
            console.log('REMOTE Socket is listening at port: ' + rport);
            console.log('REMOTE Socket ip :' + raddr);
            console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);
            console.log('--------------------------------------------');
            //var no_of_connections =  server.getConnections(); // sychronous version
            this.server.getConnections((error, count) => {
                console.log('Number of concurrent connections to the server : ' + count);
            });
            // socket.setEncoding('utf8')
            // socket.setTimeout(20000, () => {
            //   // called after timeout -> same as socket.on('timeout')
            //   // it just tells that soket timed out => its ur job to end or destroy the socket.
            //   // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
            //   // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
            //   console.log('Socket timed out')
            //   socket.end()
            // })
            let messagePart = '';
            socket.on('data', async (data) => {
                try {
                    // var bread = socket.bytesRead
                    // var bwrite = socket.bytesWritten
                    // console.log('Bytes read : ' + bread)
                    // console.log('Bytes written : ' + bwrite)
                    // console.log('Data sent to server : ' + data)
                    const startedAt = perf_hooks_1.performance.now();
                    messagePart += _utils_1.decode(data);
                    const result = _utils_1.getMessages(messagePart);
                    messagePart = result.messagePart;
                    if (!result.messages.length) {
                        return;
                    }
                    // console.log(data)
                    // const commands = decode(data)
                    const results = await this.processMessages(result.messages);
                    //echo data
                    const sendData = _utils_1.encode(results);
                    var is_kernel_buffer_full = socket.write(sendData);
                    if (is_kernel_buffer_full) {
                        // console.log(
                        //   'Data was flushed successfully from kernel buffer i.e written successfully!',
                        // )
                    }
                    else {
                        console.log('WARNING! is_kernel_buffer_full!');
                        socket.pause();
                    }
                    exports.tcpTimer.duration += perf_hooks_1.performance.now() - startedAt;
                }
                catch (err) {
                    console.log(err);
                    throw err;
                }
            });
            socket.on('drain', () => {
                console.log('write buffer is empty now .. u can resume the writable stream');
                socket.resume();
            });
            socket.on('error', error => {
                console.log('Error : ' + error);
            });
            socket.on('timeout', () => {
                console.log('Socket timed out !');
                socket.end('Timed out!');
                // can call socket.destroy() here too.
                socket.destroy();
            });
            socket.on('end', () => {
                console.log('Socket ended from other end!');
                // console.log('End data : ' + data)
            });
            socket.on('close', error => {
                var bread = socket.bytesRead;
                var bwrite = socket.bytesWritten;
                console.log('Bytes read : ' + bread);
                console.log('Bytes written : ' + bwrite);
                console.log('Socket closed!');
                if (error) {
                    console.log('Socket was closed coz of transmission error');
                    console.log(error ? error['message'] : null, error);
                }
            });
        });
        return {
            listen: this.server.listen.bind(this.server),
            address: this.server.address.bind(this.server),
        };
    }
}
exports.TcpServer = TcpServer;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/threadPool.ts":
/*!******************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/threadPool.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadPool = void 0;
const cluster = __webpack_require__(/*! cluster */ "cluster");
class ThreadPool {
    constructor(threadsCount) {
        this.workers = new Array(threadsCount)
            .fill(0)
            .map(() => cluster.fork());
    }
    process(commands) {
        return new Promise(resolve => {
            const results = [];
            const disposeItems = [];
            const onResponse = (msg) => {
                results.push(msg);
                if (results.length === commands.length) {
                    resolve(results);
                    disposeItems.forEach(dispose => dispose());
                }
            };
            for (let i = 0; i < commands.length; i++) {
                const worker = this.workers[i % this.workers.length];
                // subscribe only once
                if (i < this.workers.length) {
                    worker.on('message', onResponse);
                    disposeItems.push(() => worker.off('message', onResponse));
                }
                worker.send(commands[i]);
            }
        });
    }
}
exports.ThreadPool = ThreadPool;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/unzipData.ts":
/*!*****************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/unzipData.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.unzipData = void 0;
const zlib = __webpack_require__(/*! zlib */ "zlib");
function unzipData(data) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(data, (err, buff) => {
            if (err) {
                reject(err);
                return;
            }
            const result = buff.toString('utf8');
            resolve(result);
        });
    });
}
exports.unzipData = unzipData;


/***/ }),

/***/ "./libs/shared/node-utils/src/lib/zipData.ts":
/*!***************************************************!*\
  !*** ./libs/shared/node-utils/src/lib/zipData.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.zipData = void 0;
const zlib = __webpack_require__(/*! zlib */ "zlib");
function zipData(data) {
    return new Promise((resolve, reject) => {
        zlib.gzip(data, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}
exports.zipData = zipData;


/***/ }),

/***/ "./libs/shared/transport/src/index.ts":
/*!********************************************!*\
  !*** ./libs/shared/transport/src/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./lib/createTransportApi */ "./libs/shared/transport/src/lib/createTransportApi.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/createTransportClassHandlers */ "./libs/shared/transport/src/lib/createTransportClassHandlers.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/createTransportHandlerMap */ "./libs/shared/transport/src/lib/createTransportHandlerMap.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/nats.transport */ "./libs/shared/transport/src/lib/nats.transport.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/types */ "./libs/shared/transport/src/lib/types.ts"), exports);


/***/ }),

/***/ "./libs/shared/transport/src/lib/createTransportApi.ts":
/*!*************************************************************!*\
  !*** ./libs/shared/transport/src/lib/createTransportApi.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransportApi = void 0;
const recursiveApiCaller_1 = __webpack_require__(/*! ./recursiveApiCaller */ "./libs/shared/transport/src/lib/recursiveApiCaller.ts");
function createTransportApi(transport, options, referrer) {
    const { joinSymbol = '.', metadata } = options !== null && options !== void 0 ? options : {};
    return {
        execute: transportApi(transport, {
            mode: 'EXECUTE',
            joinSymbol,
            metadata,
            referrer,
        }),
        publish: transportApi(transport, {
            mode: 'PUBLISH',
            joinSymbol,
            metadata,
            referrer,
        }),
        config: (c) => ({
            execute: transportApi(transport, {
                mode: 'EXECUTE',
                joinSymbol,
                metadata,
                referrer,
                rpcTimeout: c.rpcTimeout,
            }),
            publish: transportApi(transport, {
                mode: 'PUBLISH',
                joinSymbol,
                metadata,
                referrer,
            }),
        }),
    };
}
exports.createTransportApi = createTransportApi;
function transportApi(transport, options) {
    const { joinSymbol = '.' } = options !== null && options !== void 0 ? options : {};
    return recursiveApiCaller_1.recursiveApiCaller(transport, {
        ...options,
        joinSymbol,
    });
}


/***/ }),

/***/ "./libs/shared/transport/src/lib/createTransportClassHandlers.ts":
/*!***********************************************************************!*\
  !*** ./libs/shared/transport/src/lib/createTransportClassHandlers.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransportClassHandlers = void 0;
const transport_1 = __webpack_require__(/*! @cheep/transport */ "@cheep/transport");
function createTransportClassHandlers(prefix, obj, transport) {
    const keys = Reflect.ownKeys(obj.constructor.prototype).filter(x => x !== 'constructor');
    if (!keys.length) {
        return () => { };
    }
    const unsubscribes = keys
        .filter(x => typeof x === 'string')
        .map(key => {
        const route = `${prefix}.${key}`;
        return transport.on(route, x => obj[key].bind(obj)(
        /**
         * First argument is always context
         */
        {
            ...obj['ctx'],
            // override `metadata` and `api` in ctx with new one
            metadata: x.metadata,
            api: transport_1.createTransportApi(transport, {
                metadata: x.metadata,
            }),
        }, ...x.payload));
    });
    return () => {
        unsubscribes.forEach(x => x());
    };
}
exports.createTransportClassHandlers = createTransportClassHandlers;


/***/ }),

/***/ "./libs/shared/transport/src/lib/createTransportHandlerMap.ts":
/*!********************************************************************!*\
  !*** ./libs/shared/transport/src/lib/createTransportHandlerMap.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransportHandlerMap = void 0;
const createTransportApi_1 = __webpack_require__(/*! ./createTransportApi */ "./libs/shared/transport/src/lib/createTransportApi.ts");
const propertiesListWithLeafs_1 = __webpack_require__(/*! ./domain/propertiesListWithLeafs */ "./libs/shared/transport/src/lib/domain/propertiesListWithLeafs.ts");
function createTransportHandlerMap(transport, ctx, handlerMap, queueGroup) {
    const { rawMessages, ...mapTree } = handlerMap;
    const registeredRoutes = propertiesListWithLeafs_1.propertiesListWithLeafs(mapTree, ['_']);
    const unsubscribes = registeredRoutes
        .filter(([_, fn]) => typeof fn === 'function')
        .map(([route, fn]) => transport.on(route, (x) => {
        const api = createTransportApi_1.createTransportApi(transport, {
            metadata: x.metadata,
        });
        const innerCtx = {
            ...ctx,
            api,
            metadata: x.metadata,
        };
        const args = Array.isArray(x.payload)
            ? x.payload
            : [x.payload];
        return fn(innerCtx, ...args);
    }, { queueGroup }));
    const rawHandlerUnsubscribes = rawMessages
        ? Object.entries(rawMessages).map(([route, handler]) => {
            // to listen nats system level messages
            const natsTransport = transport;
            return natsTransport.on(route, (x) => {
                var _a;
                const innerCtx = {
                    ...ctx,
                    api: (_a = ctx['api']) !== null && _a !== void 0 ? _a : createTransportApi_1.createTransportApi(transport),
                    metadata: {},
                };
                handler(innerCtx, x);
            }, { readRawMessage: true });
        })
        : [];
    return () => {
        unsubscribes.forEach(x => x());
        rawHandlerUnsubscribes.forEach(x => x());
    };
}
exports.createTransportHandlerMap = createTransportHandlerMap;


/***/ }),

/***/ "./libs/shared/transport/src/lib/domain/propertiesListWithLeafs.ts":
/*!*************************************************************************!*\
  !*** ./libs/shared/transport/src/lib/domain/propertiesListWithLeafs.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesListWithLeafs = void 0;
function propertiesListWithLeafs(obj, skipParts = []) {
    const isObject = (val) => typeof val === 'object' && !Array.isArray(val);
    const addDelimiter = (a, b) => (a ? `${a}.${b}` : b);
    const paths = (obj = {}, head = '', level = 0) => obj && typeof obj === 'object'
        ? Object.entries(obj).reduce((r, [key, value]) => {
            const fullPath = skipParts.includes(key)
                ? head
                : addDelimiter(head, key);
            if (isObject(value)) {
                // limit depth only to 20 levels
                if (level > 20) {
                    return r;
                }
                const innerResult = paths(value, fullPath, level + 1);
                return [...r, ...innerResult];
            }
            return typeof value === 'function'
                ? [...r, [fullPath, obj ? value.bind(obj) : value]]
                : r;
        }, [])
        : [];
    return paths(obj);
}
exports.propertiesListWithLeafs = propertiesListWithLeafs;


/***/ }),

/***/ "./libs/shared/transport/src/lib/nats.transport.ts":
/*!*********************************************************!*\
  !*** ./libs/shared/transport/src/lib/nats.transport.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsTransport = void 0;
const transport_1 = __webpack_require__(/*! @cheep/transport */ "@cheep/transport");
const utils_1 = __webpack_require__(/*! @jok/shared/utils */ "./libs/shared/utils/src/index.ts");
/**
 * Features:
 * - on should be done after starting the transport
 * - on can have the route pattern
 * - no need to `init` & `destroy`, just `start` and `stop`
 * - support reading raw messages
 * - retry on 503 (No Responder) error, after timeout/2
 */
class NatsTransport {
    constructor(options, utils = {
        newId: () => Date.now().toString() + (this.i++).toString(),
        jsonDecode: JSON.parse,
        jsonEncode: JSON.stringify,
    }) {
        this.options = options;
        this.utils = utils;
        this.nc = null;
        this.routeSubscriptions = new Map();
        this.i = 0;
        this.onEveryActions = [];
        this.routePostfix = '';
        this.sc = this.options.StringCodec();
    }
    get state() {
        return this.nc ? transport_1.TransportState.STARTED : transport_1.TransportState.STOPPED;
    }
    async init(routePostfix) {
        if (routePostfix) {
            this.routePostfix = routePostfix;
        }
    }
    async start(props = {}) {
        var _a, _b, _c, _d;
        if ((_a = props.metadataReducers) === null || _a === void 0 ? void 0 : _a.length) {
            this.options.metadataReducers = ((_b = this.options.metadataReducers) !== null && _b !== void 0 ? _b : []).concat(props.metadataReducers);
        }
        const { connect, authentication = { type: 'NONE' }, onConnectionStatusChange, natsServerUrls = [], } = {
            ...this.options,
            ...props,
        };
        this.nc = await connect({
            servers: natsServerUrls,
            name: this.options.connectionName,
            maxPingOut: (_c = this.options.maxPingOut) !== null && _c !== void 0 ? _c : 5,
            // we want to receive our own events, just in case
            noEcho: (_d = this.options.noEcho) !== null && _d !== void 0 ? _d : false,
            reconnect: true,
            verbose: true,
            waitOnFirstConnect: true,
            maxReconnectAttempts: -1,
            authenticator: authentication.type === 'NKEYS'
                ? authentication.authenticator
                : undefined,
            user: authentication.type === 'CREDENTIALS'
                ? authentication.username
                : undefined,
            pass: authentication.type === 'CREDENTIALS'
                ? authentication.password
                : undefined,
            token: authentication.type === 'TOKEN'
                ? authentication.token
                : undefined,
        });
        (async () => {
            if (!this.nc) {
                return;
            }
            utils_1.logger.info(`connected ${this.nc.getServer()}`);
            if (onConnectionStatusChange) {
                onConnectionStatusChange('CONNECTED');
            }
            for await (const s of this.nc.status()) {
                utils_1.logger.info(`${s.type}: ${JSON.stringify(s.data)}`);
                if (!onConnectionStatusChange) {
                    continue;
                }
                switch (s.type) {
                    case 'reconnect':
                        onConnectionStatusChange('RECONNECTED');
                        break;
                    case 'disconnect':
                        onConnectionStatusChange('DISCONNECTED');
                        break;
                    case 'reconnecting':
                        onConnectionStatusChange('RECONNECTING');
                        break;
                }
            }
        })().then();
    }
    async stop() {
        if (!this.nc) {
            throw new Error('NATS_NOT_STARTED');
        }
        await this.nc.flush();
        await this.nc.drain();
        await this.nc.close();
    }
    on(route, action, options) {
        var _a;
        if (!this.nc) {
            throw new Error('NATS_NOT_STARTED');
        }
        const finalRoute = route.endsWith('.>') ||
            !this.routePostfix ||
            route.startsWith('$SYS')
            ? route
            : `${route}.>`;
        const subscription = this.nc.subscribe(finalRoute, {
            queue: options === null || options === void 0 ? void 0 : options.queueGroup,
            callback: async (err, msg) => {
                var _a, _b;
                utils_1.logger.verbose('nats.transport -> on call', {
                    route,
                });
                if (err) {
                    utils_1.logger.warn('error', { error: err.toString() });
                    return;
                }
                let metadata = {};
                let payload = {};
                let subject;
                try {
                    const dataString = this.sc.decode(msg.data);
                    const data = this.utils.jsonDecode(dataString);
                    const connectionData = (_b = (_a = msg.publisher) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.authenticator();
                    if (options === null || options === void 0 ? void 0 : options.readRawMessage) {
                        await action(data);
                        utils_1.logger.verbose('nats.transport -> readRawMessage completed successfully', { route, data });
                        return;
                    }
                    const subjectParts = msg.subject.split('.');
                    subject = subjectParts
                        .slice(0, subjectParts.length - 2)
                        .join('.');
                    metadata = data.metadata;
                    payload = data.payload;
                    const senderUserId = subjectParts[subjectParts.length - 2];
                    const senderSessionId = subjectParts[subjectParts.length - 1];
                    const metadataWithConnectionId = {
                        ...metadata,
                        userId: senderUserId,
                        sessionId: senderSessionId,
                        connectionId: msg.sid,
                    };
                    const finalMetadata = this.options
                        .metadataReducersAfterReceive
                        ? this.mergeMetadata({
                            metadataReducers: this.options
                                .metadataReducersAfterReceive,
                            currentRoute: route,
                            currentPayload: payload,
                            currentMetadata: metadataWithConnectionId,
                            referrer: null,
                            connectionData,
                        })
                        : metadataWithConnectionId;
                    const result = await action({
                        route: subject,
                        metadata: finalMetadata,
                        payload,
                        // for failedMessages listener only
                        ...(subject.startsWith('failed')
                            ? { errorData: data.errorData }
                            : null),
                    });
                    utils_1.logger.verbose('nats.transport -> action completed successfully', action, { route, data });
                    if (msg.reply) {
                        msg.respond(this.sc.encode(this.utils.jsonEncode({
                            metadata: {},
                            payload: result,
                        })));
                    }
                    // fire and forget
                    this.fireOnEvery(subject, payload, finalMetadata);
                }
                catch (err) {
                    utils_1.logger.debug('error on message', {
                        error: err.toString(),
                    });
                    const errorData = transport_1.normalizeError(err);
                    this.nc.publish(`failed.${msg.subject}`, this.sc.encode(this.utils.jsonEncode({
                        metadata,
                        payload,
                        errorData,
                    })));
                    if (msg.reply) {
                        msg.respond(this.sc.encode(this.utils.jsonEncode({
                            errorData,
                            metadata: {},
                            payload: {},
                        })));
                    }
                }
            },
        });
        // keep subscription in Map
        const currentSubscriptions = (_a = this.routeSubscriptions.get(route)) !== null && _a !== void 0 ? _a : [];
        this.routeSubscriptions.set(route, currentSubscriptions.concat(subscription));
        return () => {
            subscription.unsubscribe();
        };
    }
    off(route) {
        const subs = this.routeSubscriptions.get(route);
        if (subs === null || subs === void 0 ? void 0 : subs.length) {
            subs.forEach(x => x.unsubscribe());
        }
    }
    async publish(props) {
        var _a;
        if (!this.nc) {
            throw new Error('NATS_NOT_STARTED');
        }
        const { route, payload, metadata = {}, referrer } = props;
        const finalRoute = !this.routePostfix
            ? route
            : `${route}.${this.routePostfix}`;
        const finalMetadata = ((_a = this.options.metadataReducers) === null || _a === void 0 ? void 0 : _a.length) ? this.mergeMetadata({
            metadataReducers: this.options.metadataReducers,
            currentRoute: finalRoute,
            currentPayload: payload,
            currentMetadata: metadata,
            referrer,
        })
            : metadata;
        this.nc.publish(finalRoute, this.sc.encode(this.utils.jsonEncode({
            payload,
            metadata: finalMetadata,
        })));
    }
    async execute(props) {
        var _a, _b;
        if (!this.nc) {
            throw new Error('NATS_NOT_STARTED');
        }
        const { route, payload, metadata = {}, referrer, rpcTimeout, } = props;
        const timeout = (_a = rpcTimeout !== null && rpcTimeout !== void 0 ? rpcTimeout : this.options.defaultRpcTimeout) !== null && _a !== void 0 ? _a : 1000;
        const finalRoute = !this.routePostfix
            ? route
            : `${route}.${this.routePostfix}`;
        const finalMetadata = ((_b = this.options.metadataReducers) === null || _b === void 0 ? void 0 : _b.length) ? this.mergeMetadata({
            metadataReducers: this.options.metadataReducers,
            currentRoute: finalRoute,
            currentPayload: payload,
            currentMetadata: metadata,
            referrer,
        })
            : metadata;
        let response;
        try {
            response = await this.nc.request(finalRoute, this.sc.encode(this.utils.jsonEncode({
                payload,
                metadata: finalMetadata,
            })), { timeout });
        }
        catch (err) {
            switch (err.code) {
                case '503':
                    {
                        await utils_1.delay(timeout / 2);
                        response = await this.nc.request(finalRoute, this.sc.encode(this.utils.jsonEncode({
                            payload,
                            metadata: finalMetadata,
                        })), { timeout });
                    }
                    break;
                default:
                    throw err;
            }
        }
        const result = this.utils.jsonDecode(this.sc.decode(response.data));
        if (result.errorData) {
            const error = new Error(result.errorData.errorMessage);
            error.stack = result.errorData.errorCallStack;
            error.name = result.errorData.errorClassName;
            throw error;
        }
        return result.payload;
    }
    async subscribeFailedMessages(action) {
        if (!this.nc) {
            throw new Error('NATS_NOT_STARTED');
        }
        const unsubscribe = this.on('failed.>', x => action({
            route: x.route.replace('failed.', ''),
            message: {
                payload: x.payload,
                metadata: x.metadata,
                handlingErrorData: x['errorData'],
            },
        }));
        return unsubscribe;
    }
    // helper functions
    mergeMetadata(context) {
        const { referrer, currentMetadata, currentRoute, currentPayload, connectionData, metadataReducers, } = context;
        const merged = metadataReducers.reduce((meta, fn) => {
            const x = fn({
                currentRoute,
                currentPayload,
                currentMetadata: meta,
                referrer: referrer,
                ...{ connectionData },
            });
            return {
                ...meta,
                ...x,
            };
        }, currentMetadata);
        return merged;
    }
    fireOnEvery(route, payload, metadata) {
        const tasks = this.onEveryActions
            .filter(x => x.prefixes.some(y => route.startsWith(y)))
            .map(x => x.action({ route, metadata, payload }));
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.allSettled(tasks);
    }
    // #region deprecated
    async dispose() {
        if (this.state !== transport_1.TransportState.STARTED) {
            return;
        }
        await this.stop();
    }
    onEvery(prefixes, action, isRawHandler) {
        this.onEveryActions.push({
            prefixes,
            action,
            isRawHandler,
        });
        const unsubscribe = () => {
            this.onEveryActions = this.onEveryActions.filter(x => x.action !== action);
        };
        return unsubscribe;
    }
}
exports.NatsTransport = NatsTransport;


/***/ }),

/***/ "./libs/shared/transport/src/lib/recursiveApiCaller.ts":
/*!*************************************************************!*\
  !*** ./libs/shared/transport/src/lib/recursiveApiCaller.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.recursiveApiCaller = exports.RouteVariableOperator = exports.MetadataOperator = void 0;
exports.MetadataOperator = '$';
exports.RouteVariableOperator = '_';
function recursiveApiCaller(transport, options, 
/** only needed internally, **DO NOT SET** */
path = [], routeMetadata = {}) {
    // make array safe
    return new Proxy(() => undefined, {
        get: (_, propertyName) => {
            return recursiveApiCaller(transport, options, path.concat([String(propertyName)]), routeMetadata);
        },
        apply: (_, __, args) => {
            switch (path[path.length - 1]) {
                // handle operators first, api call is default case
                // merge metadata operator
                case exports.MetadataOperator: {
                    const mergedMetadata = args.reduce((meta, arg) => ({
                        ...meta,
                        ...(typeof arg === 'object' && !Array.isArray(arg)
                            ? arg
                            : {}),
                    }), routeMetadata);
                    return recursiveApiCaller(transport, options, 
                    // don't forget to remove the operator!
                    path.slice(0, -1), mergedMetadata);
                }
                // path variable operator
                case exports.RouteVariableOperator: {
                    const route = args.reduce((route, arg) => typeof arg === 'string' ? route.concat([arg]) : route, path.slice(0, -1));
                    return recursiveApiCaller(transport, options, route, routeMetadata);
                }
                // actually calling the api
                default: {
                    if (!path.length) {
                        return;
                    }
                    const { joinSymbol, metadata: appendMetadata, referrer: providedReferrer, mode, } = options;
                    const route = path.join(joinSymbol);
                    const isExecutable = mode === 'EXECUTE';
                    // optionally process the args to extract the referrer
                    const { payload, referrer } = options.argsProcessor
                        ? options.argsProcessor(args)
                        : { payload: args, referrer: providedReferrer };
                    if (isExecutable) {
                        return transport.execute({
                            route,
                            payload,
                            metadata: { ...appendMetadata, ...routeMetadata },
                            referrer,
                            rpcTimeout: options.rpcTimeout,
                        });
                    }
                    return transport.publish({
                        route,
                        payload,
                        metadata: { ...appendMetadata, ...routeMetadata },
                        referrer,
                    });
                }
            }
        },
    });
}
exports.recursiveApiCaller = recursiveApiCaller;


/***/ }),

/***/ "./libs/shared/transport/src/lib/types.ts":
/*!************************************************!*\
  !*** ./libs/shared/transport/src/lib/types.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/shared/utils/src/index.ts":
/*!****************************************!*\
  !*** ./libs/shared/utils/src/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./lib/base64 */ "./libs/shared/utils/src/lib/base64.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/delay */ "./libs/shared/utils/src/lib/delay.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/logger */ "./libs/shared/utils/src/lib/logger.ts"), exports);


/***/ }),

/***/ "./libs/shared/utils/src/lib/base64.ts":
/*!*********************************************!*\
  !*** ./libs/shared/utils/src/lib/base64.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase64Url = exports.fromBase64Decode = exports.fromBase64 = exports.toBase64Encode = exports.toBase64 = void 0;
function toBase64(x) {
    return toBase64Encode(Buffer.from(x).toString('base64'));
}
exports.toBase64 = toBase64;
function toBase64Encode(base64) {
    return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
exports.toBase64Encode = toBase64Encode;
function fromBase64(x) {
    return Uint8Array.from(Buffer.from(fromBase64Decode(x), 'base64'));
}
exports.fromBase64 = fromBase64;
function fromBase64Decode(base64) {
    return base64.replace(/-/g, '+').replace(/_/g, '/');
}
exports.fromBase64Decode = fromBase64Decode;
//
function toBase64Url(x, encoding) {
    return toBase64Encode(Buffer.from(toString(x), encoding).toString('base64'));
}
exports.toBase64Url = toBase64Url;
function toString(obj) {
    if (typeof obj === 'string')
        return obj;
    if (typeof obj === 'number' || Buffer.isBuffer(obj)) {
        return obj.toString();
    }
    return JSON.stringify(obj);
}


/***/ }),

/***/ "./libs/shared/utils/src/lib/delay.ts":
/*!********************************************!*\
  !*** ./libs/shared/utils/src/lib/delay.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
function delay(timeInMS) {
    return new Promise(resolve => setTimeout(() => resolve(true), timeInMS));
}
exports.delay = delay;


/***/ }),

/***/ "./libs/shared/utils/src/lib/logger.ts":
/*!*********************************************!*\
  !*** ./libs/shared/utils/src/lib/logger.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const console_logger_1 = __webpack_require__(/*! ./logger/console.logger */ "./libs/shared/utils/src/lib/logger/console.logger.ts");
const types_1 = __webpack_require__(/*! ./logger/types */ "./libs/shared/utils/src/lib/logger/types.ts");
class Logger {
    constructor(loggerFn, activeLevel) {
        this.loggerFn = loggerFn;
        this.activeLevel = activeLevel;
    }
    setLevel(level) {
        this.activeLevel = level;
    }
    setLogger(loggerFn) {
        this.loggerFn = loggerFn;
    }
    error(message, ...metadata) {
        this.log({
            level: types_1.LogLevel.Error,
            message,
            metadata,
        });
    }
    warn(message, ...metadata) {
        this.log({
            level: types_1.LogLevel.Warn,
            message,
            metadata,
        });
    }
    info(message, ...metadata) {
        this.log({
            level: types_1.LogLevel.Info,
            message,
            metadata,
        });
    }
    debug(message, ...metadata) {
        this.log({
            level: types_1.LogLevel.Debug,
            message,
            metadata,
        });
    }
    verbose(message, ...metadata) {
        this.log({
            level: types_1.LogLevel.Verbose,
            message,
            metadata,
        });
    }
    log(item) {
        if (this.activeLevel > item.level) {
            return;
        }
        this.loggerFn(item);
    }
}
exports.logger = new Logger(console_logger_1.consoleLogger, types_1.LogLevel.Info);


/***/ }),

/***/ "./libs/shared/utils/src/lib/logger/console.logger.ts":
/*!************************************************************!*\
  !*** ./libs/shared/utils/src/lib/logger/console.logger.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLogger = void 0;
const types_1 = __webpack_require__(/*! ./types */ "./libs/shared/utils/src/lib/logger/types.ts");
exports.consoleLogger = ({ level, message, metadata, }) => {
    switch (level) {
        case types_1.LogLevel.Error:
            console.error(`🛑: ${message}`, ...metadata);
            break;
        case types_1.LogLevel.Warn:
            console.warn(`⚠️: ${message}`, ...metadata);
            break;
        case types_1.LogLevel.Info:
            console.log(message, ...metadata);
            break;
        case types_1.LogLevel.Debug:
            console.debug(`🐞: ${message}`, ...metadata);
            break;
        case types_1.LogLevel.Verbose:
            console.log(`🗣: ${message}`, ...metadata);
            break;
    }
};


/***/ }),

/***/ "./libs/shared/utils/src/lib/logger/types.ts":
/*!***************************************************!*\
  !*** ./libs/shared/utils/src/lib/logger/types.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));


/***/ }),

/***/ "./libs/utils/src/index.ts":
/*!*********************************!*\
  !*** ./libs/utils/src/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
tslib_1.__exportStar(__webpack_require__(/*! ./lib/adjustColor */ "./libs/utils/src/lib/adjustColor.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/app.error */ "./libs/utils/src/lib/app.error.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/avg */ "./libs/utils/src/lib/avg.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/createTheme */ "./libs/utils/src/lib/createTheme.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/delay */ "./libs/utils/src/lib/delay.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/portal/client-to-server-event */ "./libs/utils/src/lib/events/portal/client-to-server-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/portal/eventStores */ "./libs/utils/src/lib/events/portal/eventStores.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/portal/server-to-client-event */ "./libs/utils/src/lib/events/portal/server-to-client-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/pusher/client-listen-event */ "./libs/utils/src/lib/events/pusher/client-listen-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/pusher/client-publish-event */ "./libs/utils/src/lib/events/pusher/client-publish-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/pusher/eventStores */ "./libs/utils/src/lib/events/pusher/eventStores.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/pusher/server-listen-event */ "./libs/utils/src/lib/events/pusher/server-listen-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/events/pusher/server-publish-event */ "./libs/utils/src/lib/events/pusher/server-publish-event.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/first */ "./libs/utils/src/lib/first.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/fromBase64 */ "./libs/utils/src/lib/fromBase64.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getMoonPhase */ "./libs/utils/src/lib/getMoonPhase.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getRandom */ "./libs/utils/src/lib/getRandom.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getRandomItem */ "./libs/utils/src/lib/getRandomItem.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/getRanks */ "./libs/utils/src/lib/getRanks.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/onlyUnique */ "./libs/utils/src/lib/onlyUnique.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/pluckValues */ "./libs/utils/src/lib/pluckValues.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/random */ "./libs/utils/src/lib/random.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/rotateArray */ "./libs/utils/src/lib/rotateArray.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/rotateNumber */ "./libs/utils/src/lib/rotateNumber.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/stripHtml */ "./libs/utils/src/lib/stripHtml.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/sum */ "./libs/utils/src/lib/sum.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/time */ "./libs/utils/src/lib/time.ts"), exports);
tslib_1.__exportStar(__webpack_require__(/*! ./lib/upperCammelCase */ "./libs/utils/src/lib/upperCammelCase.ts"), exports);


/***/ }),

/***/ "./libs/utils/src/lib/adjustColor.ts":
/*!*******************************************!*\
  !*** ./libs/utils/src/lib/adjustColor.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustColor3 = exports.adjustColor2 = exports.adjustColor = void 0;
function adjustColor(color, amount) {
    var usePound = false;
    if (color[0] == '#') {
        color = color.slice(1);
        usePound = true;
    }
    var num = parseInt(color, 16);
    var r = (num >> 16) + amount;
    if (r > 255)
        r = 255;
    else if (r < 0)
        r = 0;
    var b = ((num >> 8) & 0x00ff) + amount;
    if (b > 255)
        b = 255;
    else if (b < 0)
        b = 0;
    var g = (num & 0x0000ff) + amount;
    if (g > 255)
        g = 255;
    else if (g < 0)
        g = 0;
    return ((usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16));
}
exports.adjustColor = adjustColor;
function adjustColor2(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);
    R = (R * (100 + percent)) / 100;
    G = (G * (100 + percent)) / 100;
    B = (B * (100 + percent)) / 100;
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);
    return '#' + RR + GG + BB;
}
exports.adjustColor2 = adjustColor2;
function adjustColor3(col, amt) {
    col = col.replace(/^#/, '');
    if (col.length === 3)
        col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
    let [r, g, b] = col.match(/.{2}/g);
    [r, g, b] = [
        parseInt(r, 16) + amt,
        parseInt(g, 16) + amt,
        parseInt(b, 16) + amt,
    ];
    r = Math.max(Math.min(255, r), 0).toString(16);
    g = Math.max(Math.min(255, g), 0).toString(16);
    b = Math.max(Math.min(255, b), 0).toString(16);
    const rr = (r.length < 2 ? '0' : '') + r;
    const gg = (g.length < 2 ? '0' : '') + g;
    const bb = (b.length < 2 ? '0' : '') + b;
    return `#${rr}${gg}${bb}`;
}
exports.adjustColor3 = adjustColor3;


/***/ }),

/***/ "./libs/utils/src/lib/app.error.ts":
/*!*****************************************!*\
  !*** ./libs/utils/src/lib/app.error.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NeverAppError = exports.AppError = void 0;
class AppError extends Error {
    constructor(errorCode, options) {
        super(errorCode);
        this.code = errorCode;
        this.errorMessage = (options === null || options === void 0 ? void 0 : options.errorMessage) || '';
        this.innerError = options === null || options === void 0 ? void 0 : options.innerError;
        this.data = options === null || options === void 0 ? void 0 : options.data;
    }
}
exports.AppError = AppError;
// This type of error should never be fired in runtime
class NeverAppError extends AppError {
    constructor() {
        super('NEVER');
    }
}
exports.NeverAppError = NeverAppError;


/***/ }),

/***/ "./libs/utils/src/lib/avg.ts":
/*!***********************************!*\
  !*** ./libs/utils/src/lib/avg.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.avg = void 0;
function avg(items) {
    return items.reduce((a, b) => a + b, 0) / items.length;
}
exports.avg = avg;


/***/ }),

/***/ "./libs/utils/src/lib/createTheme.ts":
/*!*******************************************!*\
  !*** ./libs/utils/src/lib/createTheme.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCssString = exports.defineColorShades = exports.createTheme = void 0;
const adjustColor_1 = __webpack_require__(/*! ./adjustColor */ "./libs/utils/src/lib/adjustColor.ts");
function createTheme(props) {
    const { prefix, primaryColor, primaryContrastColor, secondaryColor, secondaryContrastColor, accentColor, accentContrastColor, } = props;
    const theme = {
        primary: defineColorShades('primary', primaryColor),
        secondary: defineColorShades('secondary', secondaryColor),
        accent: defineColorShades('accent', accentColor),
    };
    const cssString = getCssString(prefix, {
        ...theme.primary,
        ...theme.accent,
    });
    return {
        theme,
        cssString,
    };
}
exports.createTheme = createTheme;
function defineColorShades(name, color, reverse = false) {
    const coef = reverse ? -1 : 1;
    return {
        // [`color-${name}`]: color,
        // [`color-${name}-contrast`]: contrastColor,
        [`color-${name}-light1`]: adjustColor_1.adjustColor3(color, coef * 5),
        [`color-${name}-light2`]: adjustColor_1.adjustColor3(color, coef * 10),
        [`color-${name}-light3`]: adjustColor_1.adjustColor3(color, coef * 20),
        [`color-${name}-light4`]: adjustColor_1.adjustColor3(color, coef * 30),
        [`color-${name}-light5`]: adjustColor_1.adjustColor3(color, coef * 35),
        [`color-${name}-dark1`]: adjustColor_1.adjustColor3(color, coef * -5),
        [`color-${name}-dark2`]: adjustColor_1.adjustColor3(color, coef * -10),
        [`color-${name}-dark3`]: adjustColor_1.adjustColor3(color, coef * -20),
        [`color-${name}-dark4`]: adjustColor_1.adjustColor3(color, coef * -30),
        [`color-${name}-dark5`]: adjustColor_1.adjustColor3(color, coef * -35),
    };
}
exports.defineColorShades = defineColorShades;
function getCssString(prefix, obj) {
    const cssString = Object.entries(obj)
        .map(([key, value]) => `--${prefix}-${key}: ${value}`)
        .join(';');
    return cssString;
}
exports.getCssString = getCssString;


/***/ }),

/***/ "./libs/utils/src/lib/delay.ts":
/*!*************************************!*\
  !*** ./libs/utils/src/lib/delay.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
function delay(timeInMS) {
    return new Promise(resolve => setTimeout(() => resolve(true), timeInMS));
}
exports.delay = delay;


/***/ }),

/***/ "./libs/utils/src/lib/events/portal/client-to-server-event.ts":
/*!********************************************************************!*\
  !*** ./libs/utils/src/lib/events/portal/client-to-server-event.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/events/portal/eventStores.ts":
/*!*********************************************************!*\
  !*** ./libs/utils/src/lib/events/portal/eventStores.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/events/portal/server-to-client-event.ts":
/*!********************************************************************!*\
  !*** ./libs/utils/src/lib/events/portal/server-to-client-event.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/events/pusher/client-listen-event.ts":
/*!*****************************************************************!*\
  !*** ./libs/utils/src/lib/events/pusher/client-listen-event.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// | {
//     /**
//      * Fires only on reconnect error
//      */
//     type: 'RECONNECT_ERROR'
//     error: Error
//   }


/***/ }),

/***/ "./libs/utils/src/lib/events/pusher/client-publish-event.ts":
/*!******************************************************************!*\
  !*** ./libs/utils/src/lib/events/pusher/client-publish-event.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/events/pusher/eventStores.ts":
/*!*********************************************************!*\
  !*** ./libs/utils/src/lib/events/pusher/eventStores.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/events/pusher/server-listen-event.ts":
/*!*****************************************************************!*\
  !*** ./libs/utils/src/lib/events/pusher/server-listen-event.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/events/pusher/server-publish-event.ts":
/*!******************************************************************!*\
  !*** ./libs/utils/src/lib/events/pusher/server-publish-event.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./libs/utils/src/lib/first.ts":
/*!*************************************!*\
  !*** ./libs/utils/src/lib/first.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
function first(items) {
    var _a;
    return (_a = items[0]) !== null && _a !== void 0 ? _a : null;
}
exports.first = first;


/***/ }),

/***/ "./libs/utils/src/lib/fromBase64.ts":
/*!******************************************!*\
  !*** ./libs/utils/src/lib/fromBase64.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromBase64 = void 0;
function fromBase64(str) {
    return Buffer.from(str, 'base64').toString('binary');
}
exports.fromBase64 = fromBase64;


/***/ }),

/***/ "./libs/utils/src/lib/getMoonPhase.ts":
/*!********************************************!*\
  !*** ./libs/utils/src/lib/getMoonPhase.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MoonPhase = exports.getMoonPhase = void 0;
function getMoonPhase(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let c = 0, e = 0, jd = 0, b = 0;
    if (month < 3) {
        year--;
        month += 12;
    }
    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09; //jd is total days elapsed
    jd /= 29.5305882; //divide by the moon cycle
    b = parseInt(jd); //int(jd) -> b, take integer part of jd
    jd -= b; //subtract integer part to leave fractional part of original jd
    b = Math.round(jd * 8); //scale fraction from 0-8 and round
    if (b >= 8) {
        b = 0; //0 and 8 are the same so turn 8 into 0
    }
    // 0 => New Moon
    // 1 => Waxing Crescent Moon
    // 2 => Quarter Moon
    // 3 => Waxing Gibbous Moon
    // 4 => Full Moon
    // 5 => Waning Gibbous Moon
    // 6 => Last Quarter Moon
    // 7 => Waning Crescent Moon
    return b;
}
exports.getMoonPhase = getMoonPhase;
var MoonPhase;
(function (MoonPhase) {
    MoonPhase[MoonPhase["NewMoon"] = 0] = "NewMoon";
    MoonPhase[MoonPhase["WaxingCrescentMoon"] = 1] = "WaxingCrescentMoon";
    MoonPhase[MoonPhase["QuarterMoon"] = 2] = "QuarterMoon";
    MoonPhase[MoonPhase["WaxingGibbousMoon"] = 3] = "WaxingGibbousMoon";
    MoonPhase[MoonPhase["FullMoon"] = 4] = "FullMoon";
    MoonPhase[MoonPhase["WaningGibbousMoon"] = 5] = "WaningGibbousMoon";
    MoonPhase[MoonPhase["LastQuarterMoon"] = 6] = "LastQuarterMoon";
    MoonPhase[MoonPhase["WaningCrescentMoon"] = 7] = "WaningCrescentMoon";
})(MoonPhase = exports.MoonPhase || (exports.MoonPhase = {}));


/***/ }),

/***/ "./libs/utils/src/lib/getRandom.ts":
/*!*****************************************!*\
  !*** ./libs/utils/src/lib/getRandom.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = void 0;
const seedrandom_1 = __webpack_require__(/*! seedrandom */ "seedrandom");
function getRandomInt(max, randomSeed) {
    if (!max) {
        return 0;
    }
    const result = !randomSeed
        ? Math.random()
        : seedrandom_1.alea(randomSeed).quick();
    return Math.floor(result * max);
}
exports.getRandomInt = getRandomInt;


/***/ }),

/***/ "./libs/utils/src/lib/getRandomItem.ts":
/*!*********************************************!*\
  !*** ./libs/utils/src/lib/getRandomItem.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomItem = void 0;
const random_1 = __webpack_require__(/*! ./random */ "./libs/utils/src/lib/random.ts");
function getRandomItem(items, getChance = () => 1, randomSeed = null) {
    if (!items.length) {
        return null;
    }
    if (items.length === 1) {
        return items[0];
    }
    const totalChance = items
        .map(x => getChance(x))
        .reduce((a, b) => a + b);
    let randomChance = Math.floor(random_1.random(randomSeed) * totalChance);
    for (const item of items) {
        randomChance -= getChance(item);
        if (randomChance < 0) {
            return item;
        }
    }
    return null;
}
exports.getRandomItem = getRandomItem;


/***/ }),

/***/ "./libs/utils/src/lib/getRanks.ts":
/*!****************************************!*\
  !*** ./libs/utils/src/lib/getRanks.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRanks = void 0;
function getRanks(items, getId, getScore) {
    const itemScoresMap = items.reduce((r, x) => r.set(getId(x), getScore(x)), new Map());
    const uniqueScores = new Set(itemScoresMap.values());
    const orderedScores = Array.from(uniqueScores).sort((a, b) => b - a);
    return items
        .map(x => {
        const id = getId(x);
        const score = itemScoresMap.get(id);
        return {
            id,
            rank: orderedScores.indexOf(score) + 1,
        };
    })
        .reduce((r, x) => r.set(x.id, x.rank), new Map());
}
exports.getRanks = getRanks;


/***/ }),

/***/ "./libs/utils/src/lib/onlyUnique.ts":
/*!******************************************!*\
  !*** ./libs/utils/src/lib/onlyUnique.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyUnique = void 0;
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
exports.onlyUnique = onlyUnique;


/***/ }),

/***/ "./libs/utils/src/lib/pluckValues.ts":
/*!*******************************************!*\
  !*** ./libs/utils/src/lib/pluckValues.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.pluckValues = void 0;
function pluckValues(obj) {
    return Object.entries(obj).map(x => x[1]);
}
exports.pluckValues = pluckValues;


/***/ }),

/***/ "./libs/utils/src/lib/random.ts":
/*!**************************************!*\
  !*** ./libs/utils/src/lib/random.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const seedrandom_1 = __webpack_require__(/*! seedrandom */ "seedrandom");
function random(seed) {
    return seed ? seedrandom_1.alea(seed).quick() : Math.random();
}
exports.random = random;


/***/ }),

/***/ "./libs/utils/src/lib/rotateArray.ts":
/*!*******************************************!*\
  !*** ./libs/utils/src/lib/rotateArray.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateArray = void 0;
function rotateArray(array, by) {
    const index = Math.abs(by % array.length);
    if (by === 0) {
        return array;
    }
    switch (by) {
        case 0:
            return array;
        case -3:
        case 1:
            return [array[3], array[0], array[1], array[2]];
        case -2:
        case 2:
            return [array[2], array[3], array[0], array[1]];
        case -1:
        case 3:
            return [array[1], array[2], array[3], array[0]];
        default: {
            if (by > 0) {
                return array
                    .slice(array.length - index, array.length)
                    .concat(array.slice(0, array.length - index));
            }
            return array
                .slice(index, array.length)
                .concat(array.slice(0, index));
        }
    }
}
exports.rotateArray = rotateArray;
// export function rotateArray<T>(array: T[], by: number): T[] {
//   const index = Math.abs(by % array.length)
//   if (by === 0) {
//     return array
//   }
//   if (by > 0) {
//     return array
//       .slice(array.length - index, array.length)
//       .concat(array.slice(0, array.length - index))
//   }
//   return array
//     .slice(index, array.length)
//     .concat(array.slice(0, index))
// }


/***/ }),

/***/ "./libs/utils/src/lib/rotateNumber.ts":
/*!********************************************!*\
  !*** ./libs/utils/src/lib/rotateNumber.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateNumber = void 0;
function rotateNumber(min, max) {
    return function rotateNumberInRange(value, by = 1) {
        if (by === 0) {
            return value;
        }
        const length = max - min + 1;
        const index = by % length;
        const newValue = value + index;
        if (by < 0) {
            return newValue >= min ? newValue : max + 1 - (min - newValue);
        }
        return newValue <= max ? newValue : min - 1 + (newValue - max);
    };
}
exports.rotateNumber = rotateNumber;


/***/ }),

/***/ "./libs/utils/src/lib/stripHtml.ts":
/*!*****************************************!*\
  !*** ./libs/utils/src/lib/stripHtml.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.stripHtml = void 0;
function stripHtml(s) {
    return s.replace(/<.*?>/g, '');
}
exports.stripHtml = stripHtml;


/***/ }),

/***/ "./libs/utils/src/lib/sum.ts":
/*!***********************************!*\
  !*** ./libs/utils/src/lib/sum.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = void 0;
function sum(a, b) {
    return a + b;
}
exports.sum = sum;


/***/ }),

/***/ "./libs/utils/src/lib/time.ts":
/*!************************************!*\
  !*** ./libs/utils/src/lib/time.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.days = exports.hours = exports.minutes = exports.seconds = void 0;
exports.seconds = (x) => x * 1000;
exports.minutes = (x) => x * exports.seconds(60);
exports.hours = (x) => x * exports.minutes(60);
exports.days = (x) => x * exports.hours(24);


/***/ }),

/***/ "./libs/utils/src/lib/upperCammelCase.ts":
/*!***********************************************!*\
  !*** ./libs/utils/src/lib/upperCammelCase.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.upperCammelCase = void 0;
function upperCammelCase(s) {
    let result = s.toLowerCase();
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
}
exports.upperCammelCase = upperCammelCase;


/***/ }),

/***/ 0:
/*!******************************************************!*\
  !*** multi ./apps/joker/server-emulator/src/main.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/ez/Github/joker/apps/joker/server-emulator/src/main.ts */"./apps/joker/server-emulator/src/main.ts");


/***/ }),

/***/ "@cheep/transport":
/*!***********************************!*\
  !*** external "@cheep/transport" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@cheep/transport");

/***/ }),

/***/ "@cheep/transport-rabbitmq":
/*!********************************************!*\
  !*** external "@cheep/transport-rabbitmq" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@cheep/transport-rabbitmq");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "date-fns":
/*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("date-fns");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "graphql-middleware":
/*!*************************************!*\
  !*** external "graphql-middleware" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-middleware");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jok-mango":
/*!****************************!*\
  !*** external "jok-mango" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jok-mango");

/***/ }),

/***/ "jok-mango/dist/common/mapObject":
/*!**************************************************!*\
  !*** external "jok-mango/dist/common/mapObject" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jok-mango/dist/common/mapObject");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongodb");

/***/ }),

/***/ "nats":
/*!***********************!*\
  !*** external "nats" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nats");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "nkeys.js":
/*!***************************!*\
  !*** external "nkeys.js" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nkeys.js");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "perf_hooks":
/*!*****************************!*\
  !*** external "perf_hooks" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("perf_hooks");

/***/ }),

/***/ "ramda":
/*!************************!*\
  !*** external "ramda" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ramda");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "seedrandom":
/*!*****************************!*\
  !*** external "seedrandom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("seedrandom");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ })));
//# sourceMappingURL=main.js.map