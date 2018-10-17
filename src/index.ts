import * as rp from 'request-promise';
import { parseDocument, searchPhases, internalLinks, differenceBetweenListOfUrls } from './lib/utils';
import { parse } from 'url';
import chalk from 'chalk';

const log = console.log;
try {
  const DOMAIN = 'http://bbc.co.uk';
  const { hostname } = parse(DOMAIN);
  let allLinks = new Set([DOMAIN]);
  const options = {
    transform: (body: string) => parseDocument(body, searchPhases),
    uri: DOMAIN,
  };

  const followLinks = async (options: rp.Options): Promise<any> => {
    try {
      const links = await rp(options);
      const domainInsternalLinks = new Set(internalLinks(links, hostname));
      const difference = differenceBetweenListOfUrls(domainInsternalLinks, allLinks);
      allLinks = new Set([...allLinks, ...links]);
      if (difference.size < 1) {
        return links;
      }
      for (const link of difference) {
        const followOptions = {
          ...options,
          ...{ uri: link },
        };
        return links.concat(await followLinks(followOptions));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const userLinks = followLinks(options);
  userLinks.then((links: any) => Array.from(links).forEach((link => console.log(link))));
} catch (error) {
  log(chalk.red(error));
}
