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

  const events = $('.event-filter-popup a')
    .toArray()
    .map((el) => {
      const $el = $(el);

      const id = parseNumber($el.attr('href')?.split('=').pop());
      const name = $el.find('.event-name').text();

      return {
        id,
        name,
      }
    })
    .concat(
      $('.events-container a')
        .toArray()
        .map((el) => {
          const $el = $(el);

          const id = parseNumber($el.attr('href')?.split('=').pop());
          const name = $el.find('.featured-event-tooltip-content').text()

          return {
            id,
            name,
          }
        })
    )

  return $('.liveMatch-container')
    .toArray()
    .concat($('.upcomingMatch').toArray())
    .map((el) => {
      const $el = $(el);

      const id = parseNumber($el.find('.a-reset').attr('href')?.split('/')[2]) ?? 0;
      const stars = 5 - $el.find('.matchRating i.faded').length
      const live = $el.find('.matchTime.matchLive').text() === 'LIVE'
      const title = $el.find('.matchInfoEmpty').text() || undefined

      const date = parseNumber($el.find('.matchTime').attr('data-unix'));

      let team1
      let team2

      if (!title) {
        team1 = {
          name:
            $el.find('.matchTeamName').first().text() ||
            $el.find('.team1 .team').text(),
          id: parseNumber($el.attr('team1')),
        }

        team2 = {
          name:
            $el.find('.matchTeamName').eq(1).text() ||
            $el.find('.team2 .team').text(),
          id: parseNumber($el.attr('team2'))
        }
      }

      const format = $el.find('.matchMeta').text()

      const eventName = $el.find('.matchEventLogo').attr('title')
      const event = events.find((x) => x.name === eventName)

      return { id, date, stars, title, team1, team2, format, event, live }
    })
}

export const getMatches =
  (config: HLTVConfig) =>
  async ({ eventIds, eventType, filter, teamIds }: GetMatchesArguments = {}): Promise<
    MatchPreview[]
  > => {
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