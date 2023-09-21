import * as cheerio from 'cheerio';
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Team } from '../shared/Team'
import { fetchPage, parseNumber } from '../utils'

export interface TeamRanking {
  team: Team
  points: number
  place: number
  change: number
  isNew: boolean
}

export interface GetTeamArguments {
  year?: 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022
  month?:
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december'
  day?: number
  country?: string
}

export const parseTeamRankingPage = (html: string) => {
  const $ = cheerio.load(html);
  
  return $('.ranked-team')
    .toArray()
    .map((el) => {
      const $el = $(el);
      const points = Number(
        $el.find('.points').text().replace(/\(|\)/g, '').split(' ')[0]
      )
      const place = Number($el.find('.position').text().substring(1))
      
      const id = parseNumber($el.find('.moreLink').attr('href')?.split("/")[2]) ?? 0;
      const name = $el.find('.name').text();
      
      const team = {
        name,
        id,
      };

      const changeText = $el.find('.change').text()
      const isNew = changeText === 'New'
      const change = changeText === '-' || isNew ? 0 : Number(changeText)

      return { points, place, team, change, isNew }
    })
}

const getPageUrl = ({ year, month, day }: GetTeamArguments = {}) => {
  return `https://www.hltv.org/ranking/teams/${year ?? ''}/${month ?? ''}/${
    day ?? ''
  }`
}

export const getTeamRanking =
  (config: HLTVConfig) =>
  async ({ year, month, day, country }: GetTeamArguments = {}): Promise<
    TeamRanking[]
  > => {
    let $ = HLTVScraper(
      await fetchPage(
        getPageUrl({year, month, day}),
        config.loadPage
      )
    )

    if (country) {
      const redirectedLink = $('.ranking-country > a').first().attr('href')
      const countryRankingLink = redirectedLink
        .split('/')
        .slice(0, -1)
        .concat(country)
        .join('/')

      $ = HLTVScraper(
        await fetchPage(
          `https://www.hltv.org/${countryRankingLink}`,
          config.loadPage
        )
      )
    }

    const teams = parseTeamRankingPage($.html());
    return teams
  }

export const getTeamRankingConfig = {
  getUrl: getPageUrl,
  parser: parseTeamRankingPage,
}