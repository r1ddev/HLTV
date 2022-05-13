import { HLTV } from './index'

const log = (promise: Promise<any>) =>
  promise
    .then((res) => console.dir(res, { depth: null }))
    .catch((err) => console.log(err))
    
HLTV.getMatch({ id: 2356133 }).then(res => {
  console.log(res.streams);
});
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
