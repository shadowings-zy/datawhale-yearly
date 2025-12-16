const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

const getYearlyGrowth = (monthlyStars, yearAndMonthKey) => {
  let yearlyGrowth = 0;
  for (const key of yearAndMonthKey) {
    if (monthlyStars[key] !== undefined) {
      yearlyGrowth += monthlyStars[key];
    }
  }
  return yearlyGrowth;
};

const getAllCommit = (repoNameList, year) => {
  const allCommit = [];
  const yearAndMonthKey = [
    `${year}-1`,
    `${year}-2`,
    `${year}-3`,
    `${year}-4`,
    `${year}-5`,
    `${year}-6`,
    `${year}-7`,
    `${year}-8`,
    `${year}-9`,
    `${year}-10`,
    `${year}-11`,
    `${year}-12`
  ];

  const starDetailStr = fs.readFileSync(path.join(__dirname, `../data/repoStarDetail.json`), 'utf-8');
  const starDetailList = JSON.parse(starDetailStr);
  for (const repoName of repoNameList) {
    const starDetail = starDetailList.find((item) => item.repoName === repoName);
    const commitDetailStr = fs.readFileSync(path.join(__dirname, `../data/repoCommitDetail/${repoName}.json`), 'utf-8');
    const commitDetailList = JSON.parse(commitDetailStr);

    commitDetailList.forEach((commit) => {
      if (commit.date.includes(year)) {
        allCommit.push({
          username: commit.author,
          email: commit.email,
          date: commit.date,
          codeAdditionsCount: commit.codeAdditionsCount,
          project: {
            name: repoName,
            yearGrowth: getYearlyGrowth(starDetail.monthlyStars, yearAndMonthKey),
            starCount: starDetail.starCount
          }
        });
      }
    });
  }

  return allCommit;
};

const unionCommitByUsername = (commitList) => {
  const commitMap = {};
  for (const commit of commitList) {
    if (commitMap[commit.username]) {
      commitMap[commit.username].push(commit);
    } else {
      commitMap[commit.username] = [commit];
    }
  }
  return commitMap;
};

const getProjectByCommitList = (commitList) => {
  const projectMap = {};
  for (const commit of commitList) {
    if (projectMap[commit.project.name]) {
      projectMap[commit.project.name].commitCount++;
    } else {
      projectMap[commit.project.name] = {
        ...commit.project,
        commitCount: 0
      };
    }
  }
  return Object.values(projectMap);
};

// 22点到次日5点的commit为深夜commit
const getLatestTimeCommit = (commitList) => {
  const earlyMorningCommit = commitList
    .filter((item) => {
      const date = dayjs(item.date, 'HH:mm:ss');
      return date.hour() <= 5;
    })
    .sort((a, b) => {
      const dateA = dayjs(a.date, 'HH:mm:ss');
      const dateB = dayjs(b.date, 'HH:mm:ss');
      const timeStampA = dateA.hour() * 3600 + dateA.minute() * 60 + dateA.second();
      const timeStampB = dateB.hour() * 3600 + dateB.minute() * 60 + dateB.second();
      return timeStampB - timeStampA;
    });
  const midnightCommit = commitList
    .filter((item) => {
      const date = dayjs(item.date, 'HH:mm:ss');
      return date.hour() >= 22;
    })
    .sort((a, b) => {
      const dateA = dayjs(a.date, 'HH:mm:ss');
      const dateB = dayjs(b.date, 'HH:mm:ss');
      const timeStampA = dateA.hour() * 3600 + dateA.minute() * 60 + dateA.second();
      const timeStampB = dateB.hour() * 3600 + dateB.minute() * 60 + dateB.second();
      return timeStampB - timeStampA;
    });
  if (earlyMorningCommit.length > 0) {
    return earlyMorningCommit[0];
  }
  return midnightCommit[0];
};

const convertCommitMapToTargetFormat = (commitMap) => {
  const targetFormat = [];
  for (const username in commitMap) {
    const commitList = commitMap[username];
    const projectInfoList = getProjectByCommitList(commitList);
    const sortedProjectInfoList = projectInfoList.sort((a, b) => b.commitCount - a.commitCount);
    const maxCommitProject = sortedProjectInfoList[0];
    const latestTimeCommitInfo = getLatestTimeCommit(commitList);
    const item = {
      username,
      email: commitList[0].email,
      project: sortedProjectInfoList,
      commitCount: commitList.length,
      codeCount: commitList.reduce((a, b) => a + b.codeAdditionsCount, 0),
      maxCommitProject,
      maxCommitProjectCommitCount: maxCommitProject.commitCount
    };
    if (latestTimeCommitInfo?.date && latestTimeCommitInfo?.project?.name) {
      item.lastCommitTime = latestTimeCommitInfo.date;
      item.lastCommitProjectName = latestTimeCommitInfo.project.name;
    }
    targetFormat.push(item);
  }
  return targetFormat;
};

const generateContributorData = (repoNameList, year) => {
  const allCommit = getAllCommit(repoNameList, year);
  const unionCommit = unionCommitByUsername(allCommit);
  const targetFormat = convertCommitMapToTargetFormat(unionCommit);
  console.log('targetFormat', targetFormat);
  return targetFormat;
};

module.exports = {
  generateContributorData
};
