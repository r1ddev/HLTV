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
  const matches: MatchPreview[] = [];

  // Обработка всех матчей
  $('.match-wrapper').each((i, el) => {
    const $el = $(el);
    const id = Number($el.attr('data-match-id'));
    const live = $el.attr('live') === 'true';
    const stars = $el.find('.match-rating .fa-star:not(.faded)').length;
    const eventId = Number($el.attr('data-event-id')) || undefined;

    // Извлечение информации о командах
    const team1Id = Number($el.attr('team1'));
    const team2Id = Number($el.attr('team2'));
    const team1Name = $el.find('.match-team:first-child .match-teamname').text().trim();
    const team2Name = $el.find('.match-team:last-child .match-teamname').text().trim();

    // Извлечение формата и времени
    const $matchInfo = $el.find('.match-info');
    let format: string | undefined;
    let date: number | undefined;

    $matchInfo.children().each((_, child) => {
      const $child = $(child);
      if ($child.hasClass('match-meta') && !$child.hasClass('match-meta-live')) {
        format = $child.text().trim();
      }
      if ($child.hasClass('match-time')) {
        date = Number($child.attr('data-unix'));
      }
    });

    // Извлечение информации о турнире
    let eventName: string | undefined;
    const eventElement = $el.find('.match-top .match-event');
    if (eventElement.length) {
      eventName = eventElement.clone().children().remove().end().text().trim();
    }

    matches.push({
      id,
      team1: team1Name ? { id: team1Id, name: team1Name } : undefined,
      team2: team2Name ? { id: team2Id, name: team2Name } : undefined,
      date,
      format,
      event: eventId && eventName ? { id: eventId, name: eventName } : undefined,
      stars,
      live
    });
  });

  return matches;
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
