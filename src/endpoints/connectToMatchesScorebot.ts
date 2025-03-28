import * as io from "socket.io-client";
import { HLTVConfig } from "../config";
import { fetchPage, generateRandomSuffix } from "../utils";

type MatchesScorebotHalf = {
	ctScore: number
	ctTeamDbId: number
	tScore: number
	tTeamDbId: number
}

type MatchesScorebotTeam = {
	[teamId: string]: number
}

type MatchesScorebotMap = {
	[map: string]: {
		firstHalf: MatchesScorebotHalf,
		secondHalf: MatchesScorebotHalf,
		overtime: MatchesScorebotHalf,
		mapOrdinal: number,
		scores: MatchesScorebotTeam,
		currentCtId: number,
		currentTId: number,
		defaultWin: boolean,
		map: string,
		mapOver: boolean
	}
}

type MatchesScorebotScores = {
	forcedLive: boolean
	forcedDead: boolean
	listId: number
	liveLog: {
		'': boolean,
		IrregularTeamKillsRequirement: boolean,
		PlayersRequirement: boolean,
		NoSuspectEventsInFirstRoundRequirement: boolean,
		NotKnifeRoundRequirement: boolean,
		BombInPlayRequirement: boolean,
		KillsInFirstRoundRequirement: boolean,
		'FiveKillsWhenEnemyElliminatedRequirement less than 5 five kills in round(s) []': boolean,
		MatchStartRequirement: boolean,
		MapNameRequirement: boolean,
		NoDrawRoundsRequirement: boolean,
		FirstRoundOverRequirement: boolean,
		RoundOneMaxEquipmentValueRequirement: boolean
	},
	mapScores?: MatchesScorebotMap,
	wins?: MatchesScorebotTeam
}

type ConnectToMatchesScorebotParams = {
	ids: number[]
	onUpdate?: (data: MatchesScorebotScores) => any
	onConnect?: (done: () => void) => any
	onDisconnect?: () => any
}

type ConnectToMatchesScorebot = Promise<{
	sendReadyIds: (ids: number[]) => void,
	socket: SocketIOClient.Socket,
}>;

export const connectToMatchesScorebot = (config: HLTVConfig) => ({
    ids,
    onUpdate,
    onConnect,
    onDisconnect
}: ConnectToMatchesScorebotParams): ConnectToMatchesScorebot => {
	return new Promise((resolve, reject) => {	
		fetchPage(`https://www.hltv.org/`, config.loadPage).then(($) => {
			try {
				const url = $('body')
					.attr('data-livescore-server-url')
					?.split(',')
					?.pop()
					
				if (url) {
					const socket = io.connect(url, {
						agent: !config.httpAgent,
					});
	
					socket.on("connect", () => {
						const done = () => socket.close();
						const sendReadyIds = (ids: number[]) => {
							const initObject = JSON.stringify({
								token: '',
								listIds: ids
							});
							socket.emit('readyForScores', initObject);
						}
	
						if (onConnect) {
							onConnect(done);
						}
				
						sendReadyIds(ids);
				
						socket.on("score", (data: MatchesScorebotScores) => {
							if (onUpdate) {
								onUpdate(data);
							}
						});
				
						socket.on("reconnect", () => {
							// console.log("reconnect");
						});
	
						resolve({
							sendReadyIds,
							socket,
						});
					});
				
					socket.on("disconnect", () => {
						if (onDisconnect) {
							onDisconnect();
						}
					});
				}
			} catch (error) {
				reject(error);
			}
		});
	});
};
