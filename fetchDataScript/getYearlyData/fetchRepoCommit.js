const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const PAGE_SIZE = 100;

const getRepoDataFile = (repoName) => {
  try {
    const fileData = fs.readFileSync(path.join(__dirname, `../data/repoCommitDetail/${repoName}.json`));
    const repoData = JSON.parse(fileData);
    return repoData;
  } catch (e) {
    return [];
  }
};

const getCommitDetail = async (repo, commitHash, token = '') => {
  const { data } = await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.github.com/repos/datawhalechina/${repo}/commits/${commitHash}`,
    headers: {
      accept: 'application/vnd.github.v3.star+json',
      authorization: `token ${token}`
    }
  });
  const codeAdditionsCount = data.files.map((file) => file.additions).reduce((a, b) => a + b, 0);
  const codeDeletionsCount = data.files.map((file) => file.deletions).reduce((a, b) => a + b, 0);
  const codeChangesCount = data.files.map((file) => file.changes).reduce((a, b) => a + b, 0);
  return { codeAdditionsCount, codeDeletionsCount, codeChangesCount };
};

const getGithubRepoCommit = async (repo, token = '') => {
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
          authorization: `token ${token}`
        }
      });

      for (let i = 0; i < data.length; i++) {
        const commit = data[i];
        if (output.find((item) => item.sha === commit.sha)) {
          console.log(`find same commit record ${commit.sha}, ${repo} page ${page} commit index ${i} skip!`);
          continue;
        }
        const commitDetail = await getCommitDetail(repo, commit.sha, token);
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

module.exports = {
  getGithubRepoCommit
};
