import { ContentData } from '../../../../constants';
import React from 'react';
import '../../index.css';

interface IProps {
  data: ContentData;
  show: boolean;
}

export const Project = (props: IProps) => {
  const { data, show } = props;
  return (
    <>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-700ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        在开源的宇宙中，“Star” 是项目的价值勋章，更是努力的亮眼注脚。
      </div>
      <div
        className={`content-text animate__animated ${show ? 'animate-delay-1400ms animate__zoomIn' : 'animate__fadeOut'}`}
      >
        你所参与的项目今年收获了
        <span className="content-text-primary">
          {` ${data.project.reduce((acc, item) => acc + item.yearGrowth, 0)} `}
        </span>
        颗 Star，每一次 Star 的跳动，都是项目成长的硬核动力。在新的一年，愿这些星光继续闪耀，引领项目迈向更加广阔的天地。
      </div>
    </>
  );
};
