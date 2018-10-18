import * as rp from 'request-promise';
import { parseDocument, searchPhases, internalLinks, differenceBetweenListOfUrls } from './lib/utils';
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

  const followLinks = async (options: rp.OptionsWithUri): Promise<string []> => {
    try {
      // Debug section to see what url are process. If you want to see logs
      // enable log beyond.
      // log(chalk.blue(`Processing now: ${options.uri}`));
      const links = await rp(options);
      const domainInsternalLinks = new Set(internalLinks(links, hostname));
      const difference = differenceBetweenListOfUrls(domainInsternalLinks, allLinks);
      allLinks = new Set([...allLinks, ...links]);
      if (difference.size < 1) {
        return links;
      }
      const promises = Array.from(difference).map(async (link) => {
        const followOptions = {
          ...options,
          ...{ uri: link },
        };
        return await followLinks(followOptions);
      });
      const promiseLinks = await Promise.all(promises);
      return links.concat(
        Array.from(new Set(promiseLinks.reduce((arr, item) => arr.concat(item), []))),
      );
    } catch (error) {
      // Section is disable for a moment but would be good to add here some
      // custom logger like winston, buyan and format it nicely so can be
      // process by ELK (Elastic Logstash Kibana) for monitoring.
      // console.log(error);
    }
  };
  const userLinks = followLinks(options);
  userLinks.then((links: string []) => links.forEach((link => console.log(link))))
          .catch();
} catch (error) {
  log(chalk.red(error));
}
