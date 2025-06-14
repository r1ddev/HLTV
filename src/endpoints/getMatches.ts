import cheerio from 'cheerio'
import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import { fetchPage, parseNumber } from '../utils'

export enum MatchEventType {
  All = 'All',
  LAN = 'Lan',
  Online = 'Online'
}

export enum MatchFilter {
  LanOnly = 'lan_only',
  TopTier = 'top_tier'
}

export interface GetMatchesArguments {
  eventIds?: number[]
  eventType?: MatchEventType
  filter?: MatchFilter
  teamIds?: number[]
}

export interface MatchPreview {
  id: number
  team1?: Team
  team2?: Team
  date?: number
  format?: string
  event?: Event
  title?: string
  live: boolean
  stars: number
}

const getPageUrl = ({ eventIds, eventType, filter, teamIds }: GetMatchesArguments = {}) => {
  const query = stringify({
    ...(eventIds ? { event: eventIds } : {}),
    ...(eventType ? { eventType } : {}),
    ...(filter ? { predefinedFilter: filter } : {}),
    ...(teamIds ? { team: teamIds } : {})
  })
  return `https://www.hltv.org/matches?${query}`;
}

const parsePage = (html: string) => {
  const $ = cheerio.load(html);
  const matchesMap = new Map<number, MatchPreview>();
  
  // Парсинг live-матчей
  $('.liveMatches .match-wrapper').each((_, el) => {
    const $el = $(el);
    const match = parseMatch($el);
    if (match) {
      match.live = true;
      matchesMap.set(match.id, match);
    }
  });

  // Парсинг предстоящих матчей
  $('.matches-list-wrapper .match-wrapper').each((_, el) => {
    const $el = $(el);
    const match = parseMatch($el);
    if (match && !matchesMap.has(match.id)) {
      match.live = false;
      matchesMap.set(match.id, match);
    }
  });

  return Array.from(matchesMap.values());
};

const parseMatch = ($el: cheerio.Cheerio): MatchPreview | null => {
  try {
    const id = parseInt($el.attr('data-match-id') || '0');
    if (!id) return null;

    const stars = $el.find('.match-rating .fa-star:not(.faded)').length;
    const live = $el.attr('live') === 'true';
    
    // Извлечение информации о командах из атрибутов контейнера
    const team1Id = parseInt($el.attr('team1') || '0');
    const team2Id = parseInt($el.attr('team2') || '0');
    const team1Name = $el.find('.match-team:first-child .match-teamname').text().trim();
    const team2Name = $el.find('.match-team:last-child .match-teamname').text().trim();
    
    const team1 = team1Id && team1Name ? { id: team1Id, name: team1Name } : undefined;
    const team2 = team2Id && team2Name ? { id: team2Id, name: team2Name } : undefined;
    
    // Извлечение формата
    const format = $el.find('.match-meta:not(.match-meta-live)').text().trim();
    
    // Извлечение времени (в Unix timestamp)
    const date = parseInt($el.find('.match-time').attr('data-unix') || '0') || undefined;
    
    // Извлечение информации о турнире
    const eventId = parseInt($el.attr('data-event-id') || '0');
    const eventName = $el.find('.match-event').first().text().trim();
    const event = eventId && eventName ? { id: eventId, name: eventName } : undefined;

    return {
      id,
      team1,
      team2,
      date,
      format,
      event,
      stars,
      live
    };
  } catch (e) {
    console.error('Error parsing match:', e);
    return null;
  }
};

export const getMatches =
  (config: HLTVConfig) =>
  async ({ eventIds, eventType, filter, teamIds }: GetMatchesArguments = {}): Promise<MatchPreview[]> => {
    const url = getPageUrl({ eventIds, eventType, filter, teamIds });

    const $ = HLTVScraper(
      await fetchPage(url, config.loadPage)
    )

    const matches = parsePage($.html());
    return matches
  }

export const getMatchesConfig = {
  getUrl: getPageUrl,
  parser: parsePage,
}
