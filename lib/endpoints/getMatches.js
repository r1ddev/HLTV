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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesConfig = exports.getMatches = exports.MatchFilter = exports.MatchEventType = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var querystring_1 = require("querystring");
var scraper_1 = require("../scraper");
var utils_1 = require("../utils");
var MatchEventType;
(function (MatchEventType) {
    MatchEventType["All"] = "All";
    MatchEventType["LAN"] = "Lan";
    MatchEventType["Online"] = "Online";
})(MatchEventType = exports.MatchEventType || (exports.MatchEventType = {}));
var MatchFilter;
(function (MatchFilter) {
    MatchFilter["LanOnly"] = "lan_only";
    MatchFilter["TopTier"] = "top_tier";
})(MatchFilter = exports.MatchFilter || (exports.MatchFilter = {}));
var getPageUrl = function (_a) {
    var _b = _a === void 0 ? {} : _a, eventIds = _b.eventIds, eventType = _b.eventType, filter = _b.filter, teamIds = _b.teamIds;
    var query = (0, querystring_1.stringify)(__assign(__assign(__assign(__assign({}, (eventIds ? { event: eventIds } : {})), (eventType ? { eventType: eventType } : {})), (filter ? { predefinedFilter: filter } : {})), (teamIds ? { team: teamIds } : {})));
    return "https://www.hltv.org/matches?".concat(query);
};
var parsePage = function (html) {
    var $ = cheerio_1.default.load(html);
    var events = $('.event-filter-popup a')
        .toArray()
        .map(function (el) {
        var _a;
        var $el = $(el);
        var id = (0, utils_1.parseNumber)((_a = $el.attr('href')) === null || _a === void 0 ? void 0 : _a.split('=').pop());
        var name = $el.find('.event-name').text();
        return {
            id: id,
            name: name,
        };
    })
        .concat($('.events-container a')
        .toArray()
        .map(function (el) {
        var _a;
        var $el = $(el);
        var id = (0, utils_1.parseNumber)((_a = $el.attr('href')) === null || _a === void 0 ? void 0 : _a.split('=').pop());
        var name = $el.find('.featured-event-tooltip-content').text();
        return {
            id: id,
            name: name,
        };
    }));
    return $('.liveMatch-container')
        .toArray()
        .concat($('.upcomingMatch').toArray())
        .map(function (el) {
        var _a, _b;
        var $el = $(el);
        var id = (_b = (0, utils_1.parseNumber)((_a = $el.find('.a-reset').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2])) !== null && _b !== void 0 ? _b : 0;
        var stars = 5 - $el.find('.matchRating i.faded').length;
        var live = $el.find('.matchTime.matchLive').text() === 'LIVE';
        var title = $el.find('.matchInfoEmpty').text() || undefined;
        var date = (0, utils_1.parseNumber)($el.find('.matchTime').attr('data-unix'));
        var team1;
        var team2;
        if (!title) {
            team1 = {
                name: $el.find('.matchTeamName').first().text() ||
                    $el.find('.team1 .team').text(),
                id: (0, utils_1.parseNumber)($el.attr('team1')),
            };
            team2 = {
                name: $el.find('.matchTeamName').eq(1).text() ||
                    $el.find('.team2 .team').text(),
                id: (0, utils_1.parseNumber)($el.attr('team2'))
            };
        }
        var format = $el.find('.matchMeta').text();
        var eventName = $el.find('.matchEventLogo').attr('title');
        var event = events.find(function (x) { return x.name === eventName; });
        return { id: id, date: date, stars: stars, title: title, team1: team1, team2: team2, format: format, event: event, live: live };
    });
};
var getMatches = function (config) {
    return function (_a) {
        var _b = _a === void 0 ? {} : _a, eventIds = _b.eventIds, eventType = _b.eventType, filter = _b.filter, teamIds = _b.teamIds;
        return __awaiter(void 0, void 0, void 0, function () {
            var url, $, _c, matches;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = getPageUrl({ eventIds: eventIds, eventType: eventType, filter: filter, teamIds: teamIds });
                        _c = scraper_1.HLTVScraper;
                        return [4 /*yield*/, (0, utils_1.fetchPage)(url, config.loadPage)];
                    case 1:
                        $ = _c.apply(void 0, [_d.sent()]);
                        matches = parsePage($.html());
                        return [2 /*return*/, matches];
                }
            });
        });
    };
};
exports.getMatches = getMatches;
exports.getMatchesConfig = {
    getUrl: getPageUrl,
    parser: parsePage,
};
