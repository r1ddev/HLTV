/// <reference types="node" />
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';
export interface HLTVConfig {
    loadPage: (url: string) => Promise<string>;
    httpAgent: HttpsAgent | HttpAgent;
    requestMethod: 'request' | 'playwright';
}
export declare const defaultLoadPage: (httpAgent: HttpsAgent | HttpAgent | undefined, requestMethod?: HLTVConfig['requestMethod']) => (url: string) => Promise<string>;
export declare const defaultConfig: HLTVConfig;
