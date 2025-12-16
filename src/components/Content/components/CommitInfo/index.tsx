import { ContentData } from '../../../../constants';
import React from 'react';
import '../../index.css';

interface IProps {
  data: ContentData;
  show: boolean;
}

export const CommitInfo = (props: IProps) => {
  const { data, show } = props;
  return (
    <>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-700ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        在你贡献的众多项目中，
        <span className="content-text-primary">{` ${data.maxCommitProject.name} `}</span>
        是你倾注心血最多的一个。你为它提交了
        <span className="content-text-primary">{` ${data.maxCommitProjectCommitCount} `}</span>次
        Commit。这份投入，是你对这个项目最直接的热忱与坚守。
      </div>
      {data.lastCommitTime && data.lastCommitProjectName && (
        <div
          className={`content-text animate__animated ${show ? 'animate-delay-1400ms animate__zoomIn' : 'animate__fadeOut'}`}
        >
          在与学习相伴的漫长征程中，有一个时刻格外鲜明。你最晚一次提交 Commit 发生在
          <span className="content-text-primary">{` ${data.lastCommitTime} `}</span>
          ，那时多数人或许早已进入梦乡，你却依旧守在电脑前，专注推进
          <span className="content-text-primary">{` ${data.lastCommitProjectName} `}</span>
          项目。熬夜奋战虽能攻克难题，也要记得多保重身体呀～
        </div>
      )}
    </>
  );
};
