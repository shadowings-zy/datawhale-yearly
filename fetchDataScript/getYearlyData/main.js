const path = require('path');
const fs = require('fs');

const { fetchOrganizationFromStarHistory } = require('./fetchOrganizationFromStarHistory');
const { fetchOrganizationRepoDetail, getGithubRepoByOrganizationName } = require('./fetchOrganizationRepoDetail');
const { ensureDirAndWriteFile } = require('./util');
const { getGithubRepoCommit } = require('./fetchRepoCommit');
const { generateContributorData } = require('./generateContributorData');

const YEAR = '2025';
const DATAWHALE_ORGANIZATION_NAME = 'datawhalechina';
const TOP_10_KNOWLEDGE_SHARING_ORGANIZATION = [
  'freeCodeCamp',
  'TheAlgorithms',
  'EbookFoundation',
  'ossu',
  'doocs',
  'h5bp',
  'datawhalechina',
  'dair-ai',
  'jobbole',
  'papers-we-love'
];
const ENV_JSON_PATH = path.join(__dirname, `../../env.json`);
const ALL_ORGANIZATION_PATH = path.join(__dirname, `../data/allOrganization.json`);
const TOP_10_KNOWLEDGE_SHARING_ORGANIZATION_PATH = path.join(
  __dirname,
  `../data/top10KnowledgeSharingOrganization.json`
);
const DATAWHALE_REPO_LIST_PATH = path.join(__dirname, `../data/repoList.json`);
const DATAWHALE_REPO_STAR_DETAIL_PATH = path.join(__dirname, `../data/repoStarDetail.json`);
const COMMIT_DETAIL_DIR = path.join(__dirname, `../data/repoCommitDetail`);
const YEARLY_DATA_OUTPUT_PATH = path.join(__dirname, `../data/datawhaleYearlyData${YEAR}.json`);

const main = async () => {
  const envStr = fs.readFileSync(ENV_JSON_PATH, 'utf-8');
  const envObject = JSON.parse(envStr);
  const githubToken = envObject.githubToken;

  // 从starHistory网站中获取开源组织列表
  const { organizationList, top10KnowledgeSharingOrganization } = await fetchOrganizationFromStarHistory(
    10,
    TOP_10_KNOWLEDGE_SHARING_ORGANIZATION
  );
  ensureDirAndWriteFile(ALL_ORGANIZATION_PATH, JSON.stringify(organizationList, null, 4));
  ensureDirAndWriteFile(
    TOP_10_KNOWLEDGE_SHARING_ORGANIZATION_PATH,
    JSON.stringify(top10KnowledgeSharingOrganization, null, 4)
  );

  // 获取组织仓库列表
  const repoList = await getGithubRepoByOrganizationName(DATAWHALE_ORGANIZATION_NAME, githubToken);
  console.log(`${DATAWHALE_ORGANIZATION_NAME} repoList:`, repoList);

  // 获取Datawhale的仓库列表和仓库详情
  const originRepoDetailList = fs.readFileSync(DATAWHALE_REPO_STAR_DETAIL_PATH, 'utf-8');
  const repoDetailList = await fetchOrganizationRepoDetail(
    repoList,
    DATAWHALE_ORGANIZATION_NAME,
    JSON.parse(originRepoDetailList),
    githubToken
  );
  ensureDirAndWriteFile(DATAWHALE_REPO_LIST_PATH, JSON.stringify(repoList, null, 4));
  ensureDirAndWriteFile(DATAWHALE_REPO_STAR_DETAIL_PATH, JSON.stringify(repoDetailList, null, 4));

  // // 获取Datawhale的仓库提交记录
  const repoNameList = repoList.map((item) => item.name.split('/')[1]);
  for (const repo of repoNameList) {
    const output = await getGithubRepoCommit(repo, githubToken);
    if (output.length !== 0) {
      fs.writeFileSync(path.join(__dirname, COMMIT_DETAIL_DIR, `${repo}.json`), JSON.stringify(output, null, 4));
    }
  }

  const targetFormat = generateContributorData(repoNameList, YEAR);
  fs.writeFileSync(path.join(__dirname, YEARLY_DATA_OUTPUT_PATH), JSON.stringify(targetFormat, null, 4));
};

main();
