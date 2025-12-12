const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const TOKEN = '';
const PAGE_SIZE = 100;
const ORGANIZATION_NAME = 'datawhalechina';
const FILTERED_REPO_NAME_LIST = ['.github'];

const getRepoDataFile = (repoName) => {
  try {
    const fileData = fs.readFileSync(path.join(__dirname, `../data/repoCommitDetail/${repoName}.json`));
    const repoData = JSON.parse(fileData);
    return repoData;
  } catch (e) {
    return [];
  }
};

const getGithubRepoByOrganizationName = async (organizationName) => {
  const output = [];

  let needNextPage = true;
  let page = 1;
  let pageSize = 100;
  while (needNextPage) {
    try {
      console.log(`fetch organization: ${organizationName}, page: ${page}`);

      const { data } = await axios.request({
        method: 'get',
        url: `https://api.github.com/orgs/${organizationName}/repos?per_page=${pageSize}&page=${page}`,
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${TOKEN}`
        }
      });

      data.forEach((item) => {
        output.push({
          name: item.full_name,
          starCount: item.stargazers_count
        });
      });

      needNextPage = data.length === pageSize;
      page = page + 1;
    } catch (e) {
      console.error('fetch organization error:', organizationName, e);
      needNextPage = false;
    }
  }
  return output.sort((a, b) => b.starCount - a.starCount);
};

const getCommitDetail = async (repo, commitHash) => {
  const { data } = await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.github.com/repos/datawhalechina/${repo}/commits/${commitHash}`,
    headers: {
      accept: 'application/vnd.github.v3.star+json',
      authorization: `token ${TOKEN}`
    }
  });
  const codeAdditionsCount = data.files.map((file) => file.additions).reduce((a, b) => a + b, 0);
  const codeDeletionsCount = data.files.map((file) => file.deletions).reduce((a, b) => a + b, 0);
  const codeChangesCount = data.files.map((file) => file.changes).reduce((a, b) => a + b, 0);
  return { codeAdditionsCount, codeDeletionsCount, codeChangesCount };
};

const getGithubRepoCommit = async (repo) => {
  const repoData = getRepoDataFile(repo);
  let output = [...repoData];

  let needNextPage = true;
  let page = 1;
  while (needNextPage) {
    try {
      console.log('fetch repo commit page:', repo, page);

      const { data } = await axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.github.com/repos/datawhalechina/${repo}/commits?per_page=${PAGE_SIZE}&page=${page}`,
        headers: {
          accept: 'application/vnd.github.v3.star+json',
          authorization: `token ${TOKEN}`
        }
      });

      for (let i = 0; i < data.length; i++) {
        const commit = data[i];
        if (output.find((item) => item.sha === commit.sha)) {
          console.log(`find same commit record ${commit.sha}, ${repo} page ${page} commit index ${i} skip!`);
          continue;
        }
        const commitDetail = await getCommitDetail(repo, commit.sha);
        output.push({
          sha: commit.sha,
          author: commit.author?.login || commit.commit?.author?.name,
          email: commit.commit?.author?.email,
          date: dayjs(commit.commit.author.date).format('YYYY-MM-DD HH:mm:ss'),
          ...commitDetail
        });
        console.log(`handle ${repo} page ${page} commit index ${i} complete!`);
      }

      needNextPage = data.length === PAGE_SIZE;
      page = page + 1;
    } catch (e) {
      console.error('fetch repo error:', repo, e);
      needNextPage = false;
    }
  }
  return output;
};

const main = async () => {
  const repoList = await getGithubRepoByOrganizationName(ORGANIZATION_NAME);
  const repoNameList = repoList
    .map((item) => item.name.split('/')[1])
    .filter((item) => !FILTERED_REPO_NAME_LIST.includes(item));
  console.log('repoNameList', repoNameList);

  fs.writeFileSync(path.join(__dirname, `../data/repoList.json`), JSON.stringify(repoList));

  for (const repo of repoNameList) {
    const output = await getGithubRepoCommit(repo);
    if (output.length !== 0) {
      fs.writeFileSync(path.join(__dirname, `../data/repoCommitDetail/${repo}.json`), JSON.stringify(output));
    }
    console.log('repoDetail', output);
  }
};

main();
