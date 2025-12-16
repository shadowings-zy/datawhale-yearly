import { ContentData } from '../../../../constants';
import React from 'react';
import '../../index.css';

interface IProps {
  data: ContentData;
  show: boolean;
}

export const Contribute = (props: IProps) => {
  const { data, show } = props;
  return (
    <>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-700ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        在过去一年，你的付出就像璀璨的星光，在 Datawhale 的宇宙中绽放出夺目光彩。
      </div>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-1400ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        你深度参与了
        <span className="content-text-primary">{` ${data.project.length} `}</span>
        个项目，包括
        <span className="content-text-primary">
          {` ${
            data.project.length > 3
              ? data.project
                  .sort((a, b) => b.yearGrowth - a.yearGrowth)
                  .slice(0, 3)
                  .map((item) => item.name)
                  .join('、')
              : data.project.map((item) => item.name).join('、')
          } `}
        </span>
        {data.project.length > 3 ? ' 等等' : ''}
        ，每一个项目都是挑战与机遇并存的试炼场。从最初的构思到最终的项目落地，你的智慧与汗水全程倾注，为项目的成长注入强劲动力。
      </div>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-2100ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        回顾2025年，你总计提交了
        <span className="content-text-primary">{` ${data.commitCount} `}</span>次 commit，编写了
        <span className="content-text-primary">{` ${data.codeCount} `}</span>
        行代码，每一次提交都是你推进项目的坚实足迹，它们凝聚成坚实的阶梯，托举起优质的项目，为每一位学习者输送宝贵价值。
      </div>
    </>
  );
};
