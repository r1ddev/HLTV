import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'
import { gotScraping } from 'got-scraping'
export interface HLTVConfig {
  loadPage: (url: string) => Promise<string>
  httpAgent: HttpsAgent | HttpAgent,
}

export const defaultLoadPage =
  (httpAgent: HttpsAgent | HttpAgent | undefined) => (url: string) =>
    new Promise<string>(async (resolve) => {
      gotScraping({ url, agent: { http: httpAgent, https: httpAgent } }).then(
        (res) => resolve(res.body)
      )
    })

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent),
}
