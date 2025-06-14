import { HLTVConfig } from '../config';
import { GameMap } from '../shared/GameMap';
import { Team } from '../shared/Team';
import { Event } from '../shared/Event';
import { Player } from '../shared/Player';
import { MatchFormat, MatchFormatLocation } from '../shared/MatchFormat';
export declare enum MatchStatus {
    Live = "Live",
    Postponed = "Postponed",
    Over = "Over",
    Scheduled = "Scheduled",
    Deleted = "Deleted"
}
export interface Demo {
    name: string;
    link: string;
}
export interface Highlight {
    link: string;
    title: string;
}
export interface Veto {
    team?: Team;
    map: GameMap;
    type: 'removed' | 'picked' | 'leftover';
}
export interface HeadToHeadResult {
    date: number;
    /** This property is undefined when the match resulted in a draw */
    winner?: Team;
    event: Event;
    map: GameMap;
    result: string;
}
export interface ProviderOdds {
    provider: string;
    team1: number;
    team2: number;
}
export interface MapHalfResult {
    team1Rounds: number;
    team2Rounds: number;
}
export interface MapResult {
    name: GameMap;
    result?: {
        team1TotalRounds: number;
        team2TotalRounds: number;
        halfResults: MapHalfResult[];
    };
    statsId?: number;
}
export interface Stream {
    name: string;
    link: string;
    viewers: number;
    lang?: string;
}
export interface FullMatch {
    id: number;
    statsId?: number;
    title?: string;
    date?: number;
    significance?: string;
    format?: {
        type: MatchFormat;
        location?: MatchFormatLocation;
    };
    status: MatchStatus;
    hasScorebot: boolean;
    team1?: Team;
    team2?: Team;
    winnerTeam?: Team;
    vetoes: Veto[];
    event: Event;
    odds: ProviderOdds[];
    maps: MapResult[];
    players: {
        team1: Player[];
        team2: Player[];
    };
    streams: Stream[];
    demos: Demo[];
    highlightedPlayers?: {
        team1: Player;
        team2: Player;
    };
    headToHead: HeadToHeadResult[];
    highlights: Highlight[];
    playerOfTheMatch?: Player;
}
export declare const getMatch: (config: HLTVConfig) => ({ id }: {
    id: number;
}) => Promise<FullMatch>;
export declare const getMatchConfig: {
    getUrl: ({ id }: {
        id: number;
    }) => string;
    parse: (html: string) => {
        id: number;
        statsId: number | undefined;
        significance: string | undefined;
        team1: Team | undefined;
        team2: Team | undefined;
        winnerTeam: Team | undefined;
        date: number | undefined;
        format: {
            type: MatchFormat;
            location: MatchFormatLocation;
        } | undefined;
        event: Event;
        maps: MapResult[];
        players: {
            team1: Player[];
            team2: Player[];
        };
        streams: Stream[];
        status: MatchStatus;
        title: string | undefined;
        hasScorebot: boolean;
        highlightedPlayers: {
            team1: {
                name: string;
                id: number | undefined;
            };
            team2: {
                name: string;
                id: number | undefined;
            };
        } | undefined;
        playerOfTheMatch: Player | undefined;
        headToHead: HeadToHeadResult[];
        vetoes: Veto[];
        highlights: Highlight[];
        demos: Demo[];
        odds: ProviderOdds[];
    };
};
