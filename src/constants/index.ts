export const QR_CODE_URL = 'https://zy-oss-sg.oss-ap-southeast-1.aliyuncs.com/datawhaleYearlyQrcode2025.png';
export const AUDIO_URL = 'https://zy-oss-sg.oss-ap-southeast-1.aliyuncs.com/datawhaleYearlyAudio2025.mp3';
export const USER_DATA_URL = 'https://zy-oss-sg.oss-ap-southeast-1.aliyuncs.com/datawhaleYearlyData2025.json';

export enum SLIDE_TYPE {
  CONTRIBUTE = 'CONTRIBUTE', // 贡献了几个项目，提交了多少commit，提交了多少代码
  PROJECT = 'PROJECT', // 参与的项目有多少star，今年增长了多少
  COMMIT_INFO = 'COMMIT_INFO', // 最晚的commit，提交commit最多的项目
  DATAWHALE_INFO = 'DATAWHALE_INFO', // 介绍datawhale的进展的页面
  SUMMARY = 'SUMMARY' // 总结
}

export enum PAGE_TYPE {
  WELCOME = 'WELCOME', // 欢迎页
  CONTENT = 'CONTENT' // 内容页
}

export interface ProjectData {
  name: string;
  yearGrowth: number;
  commitCount: number;
}

export interface ContentData {
  username: string;
  email: string;
  project: ProjectData[];
  commitCount: number;
  codeCount: number;
  maxCommitProject: ProjectData;
  maxCommitProjectCommitCount: number;
  lastCommitTime?: string;
  lastCommitProjectName?: string;
}

export enum TITLE_TYPE {
  CONTRIBUTE = 'CONTRIBUTE', // 参与项目star数增长超过1000
  PROJECT = 'PROJECT', // 参与的项目超过3个
  HARDWORK = 'HARDWORK', // 在较晚时间提交过代码
  CODE = 'CODE', // 提交代码超过1000行
  DEFAULT = 'DEFAULT' // 总结
}

export const titleMap = {
  [TITLE_TYPE.CONTRIBUTE]: '千星闪耀领航员',
  [TITLE_TYPE.PROJECT]: '跨项目贡献达人',
  [TITLE_TYPE.CODE]: '硬核编码贡献者',
  [TITLE_TYPE.HARDWORK]: '深夜代码奋斗者',
  [TITLE_TYPE.DEFAULT]: '开源学习同行者'
};

export interface SlideData {
  slideType: SLIDE_TYPE;
}
