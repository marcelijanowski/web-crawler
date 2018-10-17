import {
  parseDocument,
  searchPhases,
  internalLinks,
  differenceBetweenSets,
} from './utils';
import { readFileSync } from 'fs';

describe('Utils', () => {
  describe('Pharse document', () => {
    it('should return empty array when resource is empty', () => {
      expect(parseDocument('', searchPhases)).toEqual([]);
    });
    it('should return list of links for mock page data from bbc.html', () => {
      const html = readFileSync('./data/pages/bbc.html');
      const links = parseDocument(html.toString(), searchPhases);

      expect(links.length).toEqual(357);
      expect(links[0]).toEqual('https://www.facebook.com/bbc');
      expect(links[356]).toEqual('https://nav.files.bbci.co.uk/orbit-webmodules/0.0.1-147.6e5103e/cookie-banner//cookie-prompt/bbccookies.min.css');
    });
    it('should return list of links for mock page data from lloyds.html', () => {
      const html = readFileSync('./data/pages/lloyds.html');
      const links = parseDocument(html.toString(), searchPhases);

      expect(links.length).toEqual(71);
      expect(links[0]).toEqual('http://cem.lloydsbank.com');
      expect(links[70]).toEqual('https://www.lloydsbank.com/akam/10/pixel_1ad6c601?a=dD01NWEzZGRhMzcwMzk4NTNmMmI1MjcxMjg4ZWFhMWMzODE1MGY2NTg5JmpzPW9mZg==');
    });
    it('should return list of links for mock page data from sky.html', () => {
      const html = readFileSync('./data/pages/sky.html');
      const links = parseDocument(html.toString(), searchPhases);

      expect(links.length).toEqual(140);
      expect(links[0]).toEqual('https://dm8eklel4s62k.cloudfront.net/images/sky-logo-b90e8c9.jpg');
      expect(links[139]).toEqual('https://skyid.sky.com/signin/email');
    });
    it('should return list of links for mock page data for wipro', () => {
      const html = readFileSync('./data/pages/wiprodigital.html');
      const links = parseDocument(html.toString(), searchPhases);

      expect(links.length).toEqual(166);
      expect(links[0]).toEqual('http://ogp.me/ns#');
      expect(links[165]).toEqual('https://dc.ads.linkedin.com/collect/?pid=225025&fmt=gif');
    });
  });
  describe('localInternalLinks', () => {
    it('should return correct list of internal links for given values', () => {
      const links = [
        'https://bbc.co.uk/sports',
        'https://bbc.co.uk/news.html',
        'https://sky.com',
        'https://bbc.co.uk/style.css',
        'https://bbc.co.uk/image.js',
        'https://bbc.co.uk/image.avi',
        'https://bbc.co.uk/image.wav',
        'https://bbc.co.uk/image.mp4',
        'https://bbc.co.uk/image.png',
      ];
      const expected = [
        'https://bbc.co.uk/sports',
        'https://bbc.co.uk/news.html',
      ];

      expect(internalLinks(links, 'bbc.co.uk')).toEqual(expected);
    });
  });
  describe('differenceBetweenSets', () => {
    it('should return difference between 2 sets', () => {
      const links1 = [
        'https://bbc.co.uk',
        'https://bbc.co.uk',
        'https://bbc.co.uk/aaa',
        'https://www.bbc.co.uk/bbb',
      ];
      const links2 = [
        'https://bbc.co.uk',
        'https://bbc.co.uk',
        'https://bbc.co.uk/ccc',
      ];
      const expected = [
        'https://bbc.co.uk/ccc',
      ];

      expect(differenceBetweenSets(new Set(links2), new Set(links1))).toEqual(new Set(expected));
    });
  });
});
