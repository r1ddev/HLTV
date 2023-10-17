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
exports.getTeamRankingConfig = exports.getTeamRanking = exports.parseTeamRankingPage = void 0;
var cheerio = __importStar(require("cheerio"));
var scraper_1 = require("../scraper");
var utils_1 = require("../utils");
var parseTeamRankingPage = function (html) {
    var $ = cheerio.load(html);
    return $('.ranked-team')
        .toArray()
        .map(function (el) {
        var _a, _b;
        var $el = $(el);
        var points = Number($el.find('.points').text().replace(/\(|\)/g, '').split(' ')[0]);
        var place = Number($el.find('.position').text().substring(1));
        var id = (_b = (0, utils_1.parseNumber)((_a = $el.find('.moreLink').attr('href')) === null || _a === void 0 ? void 0 : _a.split("/")[2])) !== null && _b !== void 0 ? _b : 0;
        var name = $el.find('.name').text();
        var team = {
            name: name,
            id: id,
        };
        var changeText = $el.find('.change').text();
        var isNew = changeText === 'New';
        var change = changeText === '-' || isNew ? 0 : Number(changeText);
        return { points: points, place: place, team: team, change: change, isNew: isNew };
    });
};
exports.parseTeamRankingPage = parseTeamRankingPage;
var getPageUrl = function (_a) {
    var _b = _a === void 0 ? {} : _a, year = _b.year, month = _b.month, day = _b.day;
    return "https://www.hltv.org/ranking/teams/".concat(year !== null && year !== void 0 ? year : '', "/").concat(month !== null && month !== void 0 ? month : '', "/").concat(day !== null && day !== void 0 ? day : '');
};
var getTeamRanking = function (config) {
    return function (_a) {
        var _b = _a === void 0 ? {} : _a, year = _b.year, month = _b.month, day = _b.day, country = _b.country;
        return __awaiter(void 0, void 0, void 0, function () {
            var $, _c, redirectedLink, countryRankingLink, _d, teams;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _c = scraper_1.HLTVScraper;
                        return [4 /*yield*/, (0, utils_1.fetchPage)(getPageUrl({ year: year, month: month, day: day }), config.loadPage)];
                    case 1:
                        $ = _c.apply(void 0, [_e.sent()]);
                        if (!country) return [3 /*break*/, 3];
                        redirectedLink = $('.ranking-country > a').first().attr('href');
                        countryRankingLink = redirectedLink
                            .split('/')
                            .slice(0, -1)
                            .concat(country)
                            .join('/');
                        _d = scraper_1.HLTVScraper;
                        return [4 /*yield*/, (0, utils_1.fetchPage)("https://www.hltv.org/".concat(countryRankingLink), config.loadPage)];
                    case 2:
                        $ = _d.apply(void 0, [_e.sent()]);
                        _e.label = 3;
                    case 3:
                        teams = (0, exports.parseTeamRankingPage)($.html());
                        return [2 /*return*/, teams];
                }
            });
        });
    };
};
exports.getTeamRanking = getTeamRanking;
exports.getTeamRankingConfig = {
    getUrl: getPageUrl,
    parser: exports.parseTeamRankingPage,
};
