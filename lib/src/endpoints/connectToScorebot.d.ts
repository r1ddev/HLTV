import { HLTVConfig } from '../config';
declare type Side = 'CT' | 'TERRORIST' | 'SPECTATOR';
declare type LogEvent = RoundStart | RoundEnd | Restart | MatchStarted | Kill | Assist | Suicide | BombDefused | BombPlanted | PlayerJoin | PlayerQuit;
interface RoundStart {
    RoundStart: {};
}
interface MatchStarted {
    MatchStarted: {
        map: string;
    };
}
interface Restart {
    Restart: {};
}
interface PlayerJoin {
    PlayerJoin: {
        playerName: string;
        playerNick: string;
    };
}
interface PlayerQuit {
    PlayerQuit: {
        playerName: string;
        playerNick: string;
        playerSide: Side;
    };
}
interface RoundEnd {
    RoundEnd: {
        counterTerroristScore: number;
        terroristScore: number;
        winner: Side;
        winType: WinType;
    };
}
interface Kill {
    Kill: {
        killerName: string;
        killerNick: string;
        killerSide: Side;
        victimName: string;
        victimSide: Side;
        victimNick: string;
        weapon: string;
        headShot: boolean;
        eventId: number;
        victimX: number;
        victimY: number;
        killerX: number;
        killerY: number;
        killerId: number;
        victimId: number;
        flasherNick?: string;
        flasherSide?: Side;
    };
}
interface Assist {
    Assist: {
        assisterName: string;
        assisterNick: string;
        assisterSide: Side;
        victimNick: string;
        victimName: string;
        victimSide: Side;
        killEventId: number;
    };
}
interface Suicide {
    Suicide: {
        playerName: string;
        playerNick: string;
        side: Side;
        weapon: string;
    };
}
interface BombDefused {
    BombDefused: {
        playerName: string;
        playerNick: string;
    };
}
interface BombPlanted {
    BombPlanted: {
        playerName: string;
        playerNick: string;
        ctPlayers: number;
        tPlayers: number;
    };
}
export interface LogUpdate {
    log: LogEvent[];
}
export interface ScoreboardPlayer {
    steamId: string;
    dbId: number;
    name: string;
    score: number;
    deaths: number;
    assists: number;
    alive: boolean;
    money: number;
    damagePrRound: number;
    hp: number;
    primaryWeapon?: string;
    kevlar: boolean;
    helmet: boolean;
    nick: string;
    hasDefuseKit: boolean;
    advancedStats: {
        kast: number;
        entryKills: number;
        entryDeaths: number;
        multiKillRounds: number;
        oneOnXWins: number;
        flashAssists: number;
    };
}
export declare enum WinType {
    Lost = "lost",
    TerroristsWin = "Terrorists_Win",
    CTsWin = "CTs_Win",
    TargetBombed = "Target_Bombed",
    BombDefused = "Bomb_Defused"
}
interface ScoreboardRound {
    type: WinType;
    roundOrdinal: number;
    survivingPlayers: number;
}
export interface ScoreboardUpdate {
    TERRORIST: ScoreboardPlayer[];
    CT: ScoreboardPlayer[];
    ctMatchHistory: {
        firstHalf: ScoreboardRound[];
        secondHalf: ScoreboardRound[];
    };
    terroristMatchHistory: {
        firstHalf: ScoreboardRound[];
        secondHalf: ScoreboardRound[];
    };
    bombPlanted: boolean;
    mapName: string;
    terroristTeamName: string;
    ctTeamName: string;
    currentRound: number;
    counterTerroristScore: number;
    terroristScore: number;
    ctTeamId: number;
    tTeamId: number;
    frozen: boolean;
    live: boolean;
    ctTeamScore: number;
    tTeamScore: number;
    startingCt: number;
    startingT: number;
}
declare type ConnectToScorebotParams = {
    id: number;
    onScoreboardUpdate?: (data: ScoreboardUpdate, done: () => void) => any;
    onLogUpdate?: (data: LogUpdate, done: () => void) => any;
    onFullLogUpdate?: (data: unknown, done: () => void) => any;
    onConnect?: () => any;
    onDisconnect?: () => any;
};
export declare const connectToScorebot: (config: HLTVConfig) => ({ id, onScoreboardUpdate, onLogUpdate, onFullLogUpdate, onConnect, onDisconnect }: ConnectToScorebotParams) => void;
export {};
