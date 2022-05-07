"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToScorebot = exports.WinType = void 0;
var io = __importStar(require("socket.io-client"));
var utils_1 = require("../utils");
var WinType;
(function (WinType) {
    WinType["Lost"] = "lost";
    WinType["TerroristsWin"] = "Terrorists_Win";
    WinType["CTsWin"] = "CTs_Win";
    WinType["TargetBombed"] = "Target_Bombed";
    WinType["BombDefused"] = "Bomb_Defused";
})(WinType = exports.WinType || (exports.WinType = {}));
var connectToScorebot = function (config) {
    return function (_a) {
        var id = _a.id, onScoreboardUpdate = _a.onScoreboardUpdate, onLogUpdate = _a.onLogUpdate, onFullLogUpdate = _a.onFullLogUpdate, onConnect = _a.onConnect, onDisconnect = _a.onDisconnect;
        (0, utils_1.fetchPage)("https://www.hltv.org/matches/".concat(id, "/").concat((0, utils_1.generateRandomSuffix)()), config.loadPage).then(function ($) {
            var _a, _b;
            try {
                var url = (_b = (_a = $('#scoreboardElement')
                    .attr('data-scorebot-url')) === null || _a === void 0 ? void 0 : _a.split(',')) === null || _b === void 0 ? void 0 : _b.pop();
                var matchId = $('#scoreboardElement').attr('data-scorebot-id');
                if (url) {
                    var socket_1 = io.connect(url, {
                        agent: !config.httpAgent
                    });
                    var initObject_1 = JSON.stringify({
                        token: '',
                        listId: matchId
                    });
                    var reconnected_1 = false;
                    socket_1.on('connect', function () {
                        var done = function () { return socket_1.close(); };
                        if (onConnect) {
                            onConnect(done);
                        }
                        if (!reconnected_1) {
                            socket_1.emit('readyForMatch', initObject_1);
                        }
                        socket_1.on('scoreboard', function (data) {
                            if (onScoreboardUpdate) {
                                onScoreboardUpdate(data, done);
                            }
                        });
                        socket_1.on('log', function (data) {
                            if (onLogUpdate) {
                                onLogUpdate(JSON.parse(data), done);
                            }
                        });
                        socket_1.on('fullLog', function (data) {
                            if (onFullLogUpdate) {
                                onFullLogUpdate(JSON.parse(data), done);
                            }
                        });
                    });
                    socket_1.on('reconnect', function () {
                        reconnected_1 = true;
                        socket_1.emit('readyForMatch', initObject_1);
                    });
                    socket_1.on('disconnect', function () {
                        if (onDisconnect) {
                            onDisconnect();
                        }
                    });
                    return {
                        socket: socket_1,
                    };
                }
            }
            catch (error) {
                //console.log("");
            }
        });
    };
};
exports.connectToScorebot = connectToScorebot;
