"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var log = function (promise) {
    return promise
        .then(function (res) { return console.dir(res, { depth: null }); })
        .catch(function (err) { return console.log(err); });
};
// HLTV.getMatch({ id: 2356133 }).then(res => {
//   console.log(res.streams);
// });
// log(HLTV.getMatches())
// log(HLTV.getEvent({ id: 5741 }))
// log(HLTV.getEvents())
// log(HLTV.getMatchMapStats({ id: 115827 }))
// log(HLTV.getMatchStats({ id: 79924 }))
// log(HLTV.getMatchesStats()
// log(HLTV.getPlayer({ id: 7998 }))
// log(HLTV.getPlayerRanking())
// log(HLTV.getPlayerStats({ id: 1122 }))
// log(HLTV.getRecentThreads())
// log(HLTV.getStreams())
// log(HLTV.getTeam({ id: 7020 }))
// log(HLTV.getTeamStats({ id: 10566 }))
// log(HLTV.getPastEvents({ startDate: '2019-3-1', endDate: '2019-3-29' }))
// log(HLTV.getTeamRanking())
// log(HLTV.getResults({ eventIds: [1617] }))
// const todayDate = "2022-04-25";
// log(HLTV.getResults({startDate: todayDate, endDate: todayDate}))
// log(HLTV.getNews())
var isEmptyObject = function (e) {
    for (var t in e)
        if (e.hasOwnProperty(t))
            return false;
    return true;
};
index_1.HLTV.connectToMatchesScorebot({
    ids: [2357678],
    onConnect: function (done) { },
    onUpdate: function (data) {
        if (data.mapScores && !isEmptyObject(data.mapScores)) {
            var score_1 = {};
            var currentMap_1 = data.mapScores[Object.keys(data.mapScores).sort().reverse()[0]].scores;
            Object.keys(currentMap_1).map(function (teamId) {
                var _a;
                score_1[teamId] = {
                    maps: (_a = data.wins) === null || _a === void 0 ? void 0 : _a[teamId],
                    current: currentMap_1[teamId],
                };
            });
            console.log(data.listId, score_1);
        }
        else {
            console.log(data.listId, "- -- -");
        }
    }
});
