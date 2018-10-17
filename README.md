# Page crawler
Project is a crawler for given url setup in src/index.ts file.
Project is using node **8.x.x** and **Typescript** and write results into standard output.
## Prerequest

1. [Install yarn and node on you local machine](#install-yarn-and-node-on-you-local-machine)

### Install yarn and node on you local machine
#### MacOS

You can install Yarn through the Homebrew package manager. This will also install Node.js if it is not already installed.
```
brew install yarn
```
#### MacPorts

You can install Yarn through MacPorts. This will also install Node.js if it is not already installed.
```
sudo port install yarn
```
For other system installation follow instruction on [Yarn official page](https://yarnpkg.com/en/docs/install#windows-stable)

## Getting started 

Clone the repo and install Node dependencies
```
git clone https://github.com/marcelijanowski/web-crawler.git
yarn install
```

### Running project locally
To run project on local machine run command:
```
yarn start
```

## Project Structure

```
└── src                         # app source code
    └── index.ts                # app entry module with routing config

```

# Running unit test

Test are written in mocha and chai. To run type in command line :

* Run `yarn jest`

# Running linting

To test is written code is following standard we use tslint and rules are in `tslint.json` file
To run linter :

* Run `yarn lint`

# Tradeoffs/ Assumptions
### Solution is slow and taking around 50 seconds for https://wiprodigital.com/ but suggestion at bottom .

1. Solution taking into consideration that many supages have same link so we need to keep track of already visited page
This is done in line *19* & *20* inside *index.ts* file
```
const domainInsternalLinks = new Set(internalLinks(links, hostname));
const difference = differenceBetweenListOfUrls(domainInsternalLinks, allLinks);
```
2. Also at moment solution not taking into consideration links that are relative but this might be sorted with adding addional RegExp

3. This isn't like idea solution which need more work as using recursive function without looking on limitation of webpage open request.
Ideal solution would be creating a queing system which will process link in concurent connections and react on **429** error code and retry to get data.

4. .If we talking about cloud solution would be nice to use **AWS Lambda** or ***GCP functions** to process link by link and save it into **S3 bucket** or **GCP Storage**

5. Also would be good to Dockerize solution and run e2e on docker - unfortunatly lack of time for now.
