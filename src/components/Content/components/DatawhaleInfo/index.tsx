import React from 'react';
import '../../index.css';

interface IProps {
  show: boolean;
  noCommit?: boolean;
}

export const DatawhaleInfo = (props: IProps) => {
  const { show, noCommit = true } = props;

  const renderNoCommitContent = () => {
    return (
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-700ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        在 Datawhale
        的浩瀚宇宙中，或许此刻你还未留下自己的痕迹，但请相信，这只是旅程的序幕。开源的世界广袤无垠，每个人都有独特的节奏去探索、去融入。
      </div>
    );
  };

  return (
    <>
      {noCommit && renderNoCommitContent()}
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-1400ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        在今年，Datawhale实现了飞速的增长，伴随着AI的热潮，组织仓库的总Star数今年增长
        <span className="content-text-primary">{` 8w+ `}</span>
        ，在Github上所有知识分享类组织中排名
        <span className="content-text-primary">{` 第5 `}</span>
        ，在国内的知识分享类组织中排名
        <span className="content-text-primary">{` 第1 `}</span>。
      </div>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-2100ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        从代码分享到知识共建，Datawhale 的每一颗
        Star，都源于贡献者们的同心同行。是彼此的坚守与付出，让开源学习的旗帜愈发鲜明。
      </div>
    </>
  );
};
