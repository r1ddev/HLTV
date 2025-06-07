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
  year?: 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025
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
      
      // Позиция команды
      const positionText = $el.find('.position').text().trim();
      const place = parseInt(positionText.replace('#', '')) || 0;
      
      // Название команды
      const name = $el.find('.teamLine .name').text().trim();
      
      // Очки
      const pointsText = $el.find('.points').text().trim();
      const points = parseInt(pointsText.replace(/[^\d]/g, '')) || 0;
      
      // ID команды - из ссылки на профиль в блоке lineup-con
      const profileLink = $el.find('.lineup-con a.moreLink[href^="/team/"]').attr('href');
      let id = 0;
      if (profileLink) {
        const idMatch = profileLink.match(/\/team\/(\d+)/);
        if (idMatch && idMatch[1]) {
          id = parseInt(idMatch[1]);
        }
      }
      
      // Изменение позиции
      const changeText = $el.find('.change').text().trim();
      let change = 0;
      let isNew = false;
      
      if (changeText === 'New') {
        isNew = true;
      } else if (changeText !== '-') {
        change = parseInt(changeText) || 0;
      }
      
      return {
        team: { id, name },
        points,
        place,
        change,
        isNew
      };
    });
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