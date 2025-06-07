import { HLTVConfig } from '../config';
import { Team } from '../shared/Team';
export interface TeamRanking {
    team: Team;
    points: number;
    place: number;
    change: number;
    isNew: boolean;
}
export interface GetTeamArguments {
    year?: 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025;
    month?: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';
    day?: number;
    country?: string;
}
export declare const parseTeamRankingPage: (html: string) => {
    team: {
        id: number;
        name: string;
    };
    points: number;
    place: number;
    change: number;
    isNew: boolean;
}[];
export declare const getTeamRanking: (config: HLTVConfig) => ({ year, month, day, country }?: GetTeamArguments) => Promise<TeamRanking[]>;
export declare const getTeamRankingConfig: {
    getUrl: ({ year, month, day }?: GetTeamArguments) => string;
    parser: (html: string) => {
        team: {
            id: number;
            name: string;
        };
        points: number;
        place: number;
        change: number;
        isNew: boolean;
    }[];
};
