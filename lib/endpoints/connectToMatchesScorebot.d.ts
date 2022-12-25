/// <reference types="socket.io-client" />
import { HLTVConfig } from "../config";
declare type MatchesScorebotHalf = {
    ctScore: number;
    ctTeamDbId: number;
    tScore: number;
    tTeamDbId: number;
};
declare type MatchesScorebotTeam = {
    [teamId: string]: number;
};
declare type MatchesScorebotMap = {
    [map: string]: {
        firstHalf: MatchesScorebotHalf;
        secondHalf: MatchesScorebotHalf;
        overtime: MatchesScorebotHalf;
        mapOrdinal: number;
        scores: MatchesScorebotTeam;
        currentCtId: number;
        currentTId: number;
        defaultWin: boolean;
        map: string;
        mapOver: boolean;
    };
};
declare type MatchesScorebotScores = {
    forcedLive: boolean;
    forcedDead: boolean;
    listId: number;
    liveLog: {
        '': boolean;
        IrregularTeamKillsRequirement: boolean;
        PlayersRequirement: boolean;
        NoSuspectEventsInFirstRoundRequirement: boolean;
        NotKnifeRoundRequirement: boolean;
        BombInPlayRequirement: boolean;
        KillsInFirstRoundRequirement: boolean;
        'FiveKillsWhenEnemyElliminatedRequirement less than 5 five kills in round(s) []': boolean;
        MatchStartRequirement: boolean;
        MapNameRequirement: boolean;
        NoDrawRoundsRequirement: boolean;
        FirstRoundOverRequirement: boolean;
        RoundOneMaxEquipmentValueRequirement: boolean;
    };
    mapScores?: MatchesScorebotMap;
    wins?: MatchesScorebotTeam;
};
declare type ConnectToMatchesScorebotParams = {
    ids: number[];
    onUpdate?: (data: MatchesScorebotScores) => any;
    onConnect?: (done: () => void) => any;
    onDisconnect?: () => any;
};
declare type ConnectToMatchesScorebot = Promise<{
    sendReadyIds: (ids: number[]) => void;
    socket: SocketIOClient.Socket;
}>;
export declare const connectToMatchesScorebot: (config: HLTVConfig) => ({ ids, onUpdate, onConnect, onDisconnect }: ConnectToMatchesScorebotParams) => ConnectToMatchesScorebot;
export {};
