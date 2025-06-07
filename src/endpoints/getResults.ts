import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVPage, HLTVScraper } from '../scraper'
import { BestOfFilter } from '../shared/BestOfFilter'
import { fromMapSlug, GameMap } from '../shared/GameMap'
import { RankingFilter } from '../shared/RankingFilter'
import { fetchPage, getIdAt, notNull, sleep } from '../utils'

export enum ResultsMatchType {
  LAN = 'Lan',
  Online = 'Online'
}

export enum ContentFilter {
  HasHighlights = 'highlights',
  HasDemo = 'demo',
  HadVOD = 'vod',
  HasStats = 'stats'
}

export enum GameType {
  CSGO = 'CSGO',
  CS16 = 'CS16'
}

export interface ResultTeam {
  name: string;
  logo: string;
}

export interface FullMatchResult {
  id: number;
  date: number;
  team1: ResultTeam;
  team2: ResultTeam;
  event: string;
  stars: number;
  format: string;
  map?: GameMap;
  result: {
    team1: number;
    team2: number;
  }
}

export interface GetResultsArguments {
  startDate?: string;
  endDate?: string;
  matchType?: ResultsMatchType;
  maps?: GameMap[];
  bestOfX?: BestOfFilter;
  countries?: string[];
  contentFilters?: ContentFilter[];
  eventIds?: number[];
  playerIds?: number[];
  teamIds?: number[];
  game?: GameType;
  stars?: 1 | 2 | 3 | 4 | 5;
  delayBetweenPageRequests?: number;
}

export const getResults = 
  (config: HLTVConfig) => 
  async (options: GetResultsArguments): Promise<FullMatchResult[]> => {
    const query = stringify({
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {}),
      ...(options.matchType ? { matchType: options.matchType } : {}),
      ...(options.maps ? { map: options.maps.map(m => m.toLowerCase()) } : {}),
      ...(options.bestOfX ? { bestOfX: options.bestOfX } : {}),
      ...(options.countries ? { country: options.countries } : {}),
      ...(options.contentFilters ? { content: options.contentFilters } : {}),
      ...(options.eventIds ? { event: options.eventIds } : {}),
      ...(options.playerIds ? { player: options.playerIds } : {}),
      ...(options.teamIds ? { team: options.teamIds } : {}),
      ...(options.game ? { gameType: options.game } : {}),
      ...(options.stars ? { stars: options.stars } : {})
    })

    let page = 0
    const results: FullMatchResult[] = []

    while (true) {
      if (page > 10) break;

      await sleep(options.delayBetweenPageRequests ?? 0)

      const $ = HLTVScraper(
        await fetchPage(
          `https://www.hltv.org/results?${query}&offset=${page * 100}`,
          config.loadPage
        )
      );

      const matchElements = $('.result-con').toArray()
      
      // Если матчей нет - заканчиваем пагинацию
      if (matchElements.length === 0) break;

      for (const el of matchElements) {
        try {
          const href = el.find('a').first().attr('href');
          const id = href ? parseInt(href.split('/')[2]) : NaN;
          if (isNaN(id)) continue;

          const stars = el.find('.stars .star').length;
          const unixTimeMillis = parseInt(el.attr('data-zonedgrouping-entry-unix') || '0');
          const date = Math.floor(unixTimeMillis / 1000);

          // Извлекаем данные команд
          const team1 = {
            name: el.find('.team').first().text().trim(),
            logo: el.find('img.team-logo').first().attr('src') || ''
          };

          const team2 = {
            name: el.find('.team').last().text().trim(),
            logo: el.find('img.team-logo').last().attr('src') || ''
          };

          const event = el.find('.event-name').text().trim();

          // Парсим счет
          const scoreText = el.find('.result-score').text().trim();
          const [score1, score2] = scoreText.split(' - ').map(Number);
          
          // Определяем формат матча и карту
          const formatText = el.find('.map-text').text().trim();
          let map: GameMap | undefined;
          let format: string;

          if (formatText.includes('bo')) {
            format = formatText;
          } else {
            map = fromMapSlug(formatText);
            format = 'bo1';
          }

          results.push({
            id,
            stars,
            date,
            team1,
            team2,
            event,
            result: {
              team1: score1,
              team2: score2
            },
            format,
            ...(map ? { map } : {})
          });
        } catch (e) {
          console.error(`Error parsing match: ${e}`);
        }
      }

      // Проверяем пагинацию
      if (matchElements.length < 100) break;
      page++
    }

    return results
  };