export const parseDocument = (resource: string, searchPhrases: RegExp []): any  => {
  return searchPhrases.reduce((list, phrase) => {
    const match = resource.match(phrase);
    return match ? list.concat(match) : list;
  },                          []);
};

export const internalLinks = (links: string [], domain: string) =>
  links.filter(link => new RegExp(domain).test(link))
       .filter(link => !/(css|js|jpg|png|wav|avi|mp4|mpg|mpeg)/.test(link));

export const searchPhases: RegExp [] = [
  /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/ig,
];

export const differenceBetweenSets = (setA: any, setB: any): any => {
  const difference = new Set(setA);
  for (const elem of setB) {
    difference.delete(elem);
  }
  return difference;
};
