const path = require('path');
const fs = require('fs');

const YEAR = '2025';
const YEARLY_DATA_OUTPUT_PATH = path.join(__dirname, `../data/datawhaleYearlyData${YEAR}.json`);

const TITLE_TYPE = {
  WAN_STAR_ADD_CONTRIBUTE: 'WAN_STAR_ADD_CONTRIBUTE', // 参与项目star数增长超过10000
  WAN_STAR_CONTRIBUTE: 'WAN_STAR_CONTRIBUTE', // 参与过超过10000star的项目
  QIAN_STAR_ADD_CONTRIBUTE: 'QIAN_STAR_ADD_CONTRIBUTE', // 参与项目star数增长超过1000
  PROJECT: 'PROJECT', // 参与的项目超过3个
  WAN_CODE: 'WAN_CODE', // 提交代码超过10000行
  QIAN_CODE: 'QIAN_CODE', // 提交代码超过1000行
  HARDWORK: 'HARDWORK', // 在较晚时间提交过代码
  DEFAULT: 'DEFAULT' // 默认
};

const chooseTitle = (data) => {
  if (data && data.codeCount > 10000) {
    return TITLE_TYPE.WAN_CODE;
  } else if (data && data.project.some((item) => item.yearGrowth > 10000)) {
    return TITLE_TYPE.WAN_STAR_ADD_CONTRIBUTE;
  } else if (data && data.project.length >= 3) {
    return TITLE_TYPE.PROJECT;
  } else if (data && data.project.some((item) => item.starCount > 10000)) {
    return TITLE_TYPE.WAN_STAR_CONTRIBUTE;
  } else if (data && data.project.some((item) => item.yearGrowth > 1000)) {
    return TITLE_TYPE.QIAN_STAR_ADD_CONTRIBUTE;
  } else if (data && data.lastCommitTime) {
    return TITLE_TYPE.HARDWORK;
  } else if (data && data.codeCount > 1000) {
    return TITLE_TYPE.QIAN_CODE;
  }
  return TITLE_TYPE.DEFAULT;
};

const main = () => {
  const yearlyData = fs.readFileSync(YEARLY_DATA_OUTPUT_PATH, 'utf-8');
  const yearlyDataJson = JSON.parse(yearlyData);
  const titleCountMap = {
    [TITLE_TYPE.WAN_STAR_ADD_CONTRIBUTE]: 0, // 参与项目star数增长超过10000
    [TITLE_TYPE.WAN_STAR_CONTRIBUTE]: 0, // 参与过超过10000star的项目
    [TITLE_TYPE.QIAN_STAR_ADD_CONTRIBUTE]: 0, // 参与项目star数增长超过1000
    [TITLE_TYPE.PROJECT]: 0, // 参与的项目超过3个
    [TITLE_TYPE.WAN_CODE]: 0, // 提交代码超过10000行
    [TITLE_TYPE.QIAN_CODE]: 0, // 提交代码超过1000行
    [TITLE_TYPE.HARDWORK]: 0, // 在较晚时间提交过代码
    [TITLE_TYPE.DEFAULT]: 0 // 默认
  };
  yearlyDataJson.forEach((item) => {
    const title = chooseTitle(item);
    titleCountMap[title]++;
  });
  console.log(titleCountMap);
};

main();
