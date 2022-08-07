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
exports.connectToMatchesScorebot = void 0;
var io = __importStar(require("socket.io-client"));
var utils_1 = require("../utils");
var connectToMatchesScorebot = function (config) { return function (_a) {
    var ids = _a.ids, onUpdate = _a.onUpdate, onConnect = _a.onConnect, onDisconnect = _a.onDisconnect;
    (0, utils_1.fetchPage)("https://www.hltv.org/", config.loadPage).then(function ($) {
        var _a, _b;
        try {
            var url = (_b = (_a = $('body')
                .attr('data-livescore-server-url')) === null || _a === void 0 ? void 0 : _a.split(',')) === null || _b === void 0 ? void 0 : _b.pop();
            if (url) {
                var socket_1 = io.connect(url, {
                    agent: !config.httpAgent,
                });
                socket_1.on("connect", function () {
                    var done = function () { return socket_1.close(); };
                    if (onConnect) {
                        onConnect(done);
                    }
                    var initObject = JSON.stringify({
                        token: '',
                        listIds: ids
                    });
                    socket_1.emit('readyForScores', initObject);
                    socket_1.on("score", function (data) {
                        if (onUpdate) {
                            onUpdate(data);
                        }
                    });
                    socket_1.on("reconnect", function () {
                        // console.log("reconnect");
                    });
                });
                socket_1.on("disconnect", function () {
                    if (onDisconnect) {
                        onDisconnect();
                    }
                });
            }
        }
        catch (error) {
            //console.log("");
        }
    });
}; };
exports.connectToMatchesScorebot = connectToMatchesScorebot;
