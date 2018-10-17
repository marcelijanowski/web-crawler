import * as rp from 'request-promise';
import { differenceBetweenSets, internalLinks , parseDocument, searchPhases } from './lib/utils';
import { parse } from 'url';
import chalk from 'chalk';

const log = console.log;
try {
  const DOMAIN = 'https://wiprodigital.com/';
  const { hostname } = parse(DOMAIN);
  let allLinks = new Set([DOMAIN]);
  const options = {
    transform: (body: string) => parseDocument(body, searchPhases),
    uri: DOMAIN,
  };
  const followLinks = async (options: rp.Options, resolve: any) =>
    rp(options)
      .then((links: []) => {
        if (links.length) {
          const domainInsternalLinks = internalLinks(links, hostname);
          const difference = differenceBetweenSets(domainInsternalLinks, allLinks);
          allLinks = new Set([...allLinks, ...links]);
          if (difference.size) {
            for (const item of difference) {
              followLinks({
                ...options,
                uri: item,
              },          resolve);
            }
          } else {
            return resolve(allLinks);
          }
        }
      }).catch(() => {
        // Most of time when this try catch will be caught will be connected with 429 error which is rate limit of open connection
        // For better experience would be better to create que system with concurency connection and retry on failure with 429.
      });
  const userLinks = new Promise(resolve => followLinks(options, resolve));
  userLinks.then((links: any) => Array.from(links).forEach((link => console.log(link))));
} catch (error) {
  log(chalk.red(error));
}
