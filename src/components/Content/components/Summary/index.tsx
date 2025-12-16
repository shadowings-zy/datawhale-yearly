import { ContentData, titleMap, TITLE_TYPE } from '../../../../constants/index.ts';
import React from 'react';
import '../../index.css';

interface IProps {
  data: ContentData | null;
  username: string;
  show: boolean;
}

export const Summary = (props: IProps) => {
  const { data, username, show } = props;

  const getTitle = () => {
    if (data && data.maxCommitProject.yearGrowth > 1000) {
      return titleMap[TITLE_TYPE.CONTRIBUTE];
    } else if (data && data.project.length > 3) {
      return titleMap[TITLE_TYPE.PROJECT];
    } else if (data && data.lastCommitTime) {
      return titleMap[TITLE_TYPE.HARDWORK];
    } else if (data && data.codeCount > 1000) {
      return titleMap[TITLE_TYPE.CODE];
    }
    return titleMap[TITLE_TYPE.DEFAULT];
  };

  return (
    <>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-700ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        在过去这一年，我们携手在开源学习的浪潮中奋勇竞渡，每位伙伴用自己的力量为 Datawhale 的成长添薪续力。
      </div>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-1400ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        今年
        <span className="content-text-primary">{` ${username} `}</span>
        的称号是：
      </div>
      <div
        className={`content-text-summary-title animate__animated ${show ? 'animate-delay-2100ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        {`${getTitle()}`}
      </div>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-2800ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        愿大家在新的一年，以梦为舟，以勤为桨，于开源学习与 AI 的时代浪潮中勇立潮头！
      </div>
    </>
  );
};
