"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.GameType = exports.ContentFilter = exports.ResultsMatchType = void 0;
var querystring_1 = require("querystring");
var scraper_1 = require("../scraper");
var GameMap_1 = require("../shared/GameMap");
var utils_1 = require("../utils");
var ResultsMatchType;
(function (ResultsMatchType) {
    ResultsMatchType["LAN"] = "Lan";
    ResultsMatchType["Online"] = "Online";
})(ResultsMatchType = exports.ResultsMatchType || (exports.ResultsMatchType = {}));
var ContentFilter;
(function (ContentFilter) {
    ContentFilter["HasHighlights"] = "highlights";
    ContentFilter["HasDemo"] = "demo";
    ContentFilter["HadVOD"] = "vod";
    ContentFilter["HasStats"] = "stats";
})(ContentFilter = exports.ContentFilter || (exports.ContentFilter = {}));
var GameType;
(function (GameType) {
    GameType["CSGO"] = "CSGO";
    GameType["CS16"] = "CS16";
})(GameType = exports.GameType || (exports.GameType = {}));
var getResults = function (config) {
    return function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var query, page, results, $, _a, matchElements, _i, matchElements_1, el, href, id, stars, unixTimeMillis, date, team1, team2, event_1, scoreText, _b, score1, score2, formatText, map, format;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    query = (0, querystring_1.stringify)(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (options.startDate ? { startDate: options.startDate } : {})), (options.endDate ? { endDate: options.endDate } : {})), (options.matchType ? { matchType: options.matchType } : {})), (options.maps ? { map: options.maps.map(function (m) { return m.toLowerCase(); }) } : {})), (options.bestOfX ? { bestOfX: options.bestOfX } : {})), (options.countries ? { country: options.countries } : {})), (options.contentFilters ? { content: options.contentFilters } : {})), (options.eventIds ? { event: options.eventIds } : {})), (options.playerIds ? { player: options.playerIds } : {})), (options.teamIds ? { team: options.teamIds } : {})), (options.game ? { gameType: options.game } : {})), (options.stars ? { stars: options.stars } : {})));
                    page = 0;
                    results = [];
                    _d.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    if (page > 10)
                        return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, utils_1.sleep)((_c = options.delayBetweenPageRequests) !== null && _c !== void 0 ? _c : 0)];
                case 2:
                    _d.sent();
                    _a = scraper_1.HLTVScraper;
                    return [4 /*yield*/, (0, utils_1.fetchPage)("https://www.hltv.org/results?".concat(query, "&offset=").concat(page * 100), config.loadPage)];
                case 3:
                    $ = _a.apply(void 0, [_d.sent()]);
                    matchElements = $('.result-con').toArray();
                    // Если матчей нет - заканчиваем пагинацию
                    if (matchElements.length === 0)
                        return [3 /*break*/, 4];
                    for (_i = 0, matchElements_1 = matchElements; _i < matchElements_1.length; _i++) {
                        el = matchElements_1[_i];
                        try {
                            href = el.find('a').first().attr('href');
                            id = href ? parseInt(href.split('/')[2]) : NaN;
                            if (isNaN(id))
                                continue;
                            stars = el.find('.stars .star').length;
                            unixTimeMillis = parseInt(el.attr('data-zonedgrouping-entry-unix') || '0');
                            date = Math.floor(unixTimeMillis / 1000);
                            team1 = {
                                name: el.find('.team').first().text().trim(),
                                logo: el.find('img.team-logo').first().attr('src') || ''
                            };
                            team2 = {
                                name: el.find('.team').last().text().trim(),
                                logo: el.find('img.team-logo').last().attr('src') || ''
                            };
                            event_1 = el.find('.event-name').text().trim();
                            scoreText = el.find('.result-score').text().trim();
                            _b = scoreText.split(' - ').map(Number), score1 = _b[0], score2 = _b[1];
                            formatText = el.find('.map-text').text().trim();
                            map = void 0;
                            format = void 0;
                            if (formatText.includes('bo')) {
                                format = formatText;
                            }
                            else {
                                map = (0, GameMap_1.fromMapSlug)(formatText);
                                format = 'bo1';
                            }
                            results.push(__assign({ id: id, stars: stars, date: date, team1: team1, team2: team2, event: event_1, result: {
                                    team1: score1,
                                    team2: score2
                                }, format: format }, (map ? { map: map } : {})));
                        }
                        catch (e) {
                            console.error("Error parsing match: ".concat(e));
                        }
                    }
                    // Проверяем пагинацию
                    if (matchElements.length < 100)
                        return [3 /*break*/, 4];
                    page++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results];
            }
        });
    }); };
};
exports.getResults = getResults;
