import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import logo from '../../assets/logo.png';
import background from '../../assets/2025/background.png';
import background01 from '../../assets/2025/01.png';
import background02 from '../../assets/2025/02.png';
import background03 from '../../assets/2025/03.png';
import background04 from '../../assets/2025/04.png';
import background05 from '../../assets/2025/05.png';
import { wait } from '../../utils/wait.ts';
import { AUDIO_URL, ContentData, USER_DATA_URL } from '../../constants/index.ts';
import { useWindowSize } from '../../utils/windowSize.ts';

interface IProps {
  handleSubmit: (username: string, contentDataList: ContentData[]) => void;
}

let progressTimer: any = null;
const MAX_PROGRESS = 90;
const LOADING_TIME = 2000;

export const Welcome = (props: IProps) => {
  const { handleSubmit } = props;

  const { windowHeight } = useWindowSize();
  const [loading, setLoading] = useState(true);
  const [buttonAnimation, setButtonAnimation] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const usernameRef = useRef('');
  const scrollProgressRef = useRef(0);
  const contentDataListRef = useRef<ContentData[] | null>(null);

  const preloadData = async () => {
    try {
      setLoading(true);
      startProgress();
      const image1 = new Image();
      image1.src = background01;
      const image2 = new Image();
      image2.src = background02;
      const image3 = new Image();
      image3.src = background03;
      const image4 = new Image();
      image4.src = background04;
      const image5 = new Image();
      image5.src = background05;
      const audio = new Audio();
      audio.src = AUDIO_URL;
      const userData = await fetch(USER_DATA_URL);
      const userDataJson = await userData.json();
      await wait(LOADING_TIME);
      contentDataListRef.current = userDataJson;
      setLoading(false);
      stopProgress();
    } catch (error) {
      console.error(error);
      setLoading(false);
      stopProgress();
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    usernameRef.current = e.target.value;
  };

  const onClickSubmit = () => {
    if (contentDataListRef.current) {
      setButtonAnimation(true);
      setTimeout(() => {
        handleSubmit(usernameRef.current, contentDataListRef.current);
        setButtonAnimation(false);
      }, 1000);
    }
  };

  const startProgress = () => {
    setScrollProgress(0);
    scrollProgressRef.current = 0;
    progressTimer = setInterval(() => {
      if (scrollProgressRef.current < MAX_PROGRESS) {
        scrollProgressRef.current = scrollProgressRef.current + 1;
        setScrollProgress(scrollProgressRef.current);
      }
    }, 200);
  };

  const stopProgress = () => {
    setScrollProgress(100);
    scrollProgressRef.current = 100;
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  };

  useEffect(() => {
    preloadData();
  }, []);

  return (
    <div
      className={`welcome animate__animated ${buttonAnimation ? 'animate__fadeOut' : ''}`}
      style={{
        backgroundImage: `url(${background})`,
        height: windowHeight
      }}
    >
      <div className="welcome-content-area">
        <div className="welcome-content-title-wrapper">
          <img className="welcome-logo" src={logo} alt="logo" />
          <div className="welcome-title">
            <div>Datawhale贡献者</div>
            <div>2025年度总结</div>
          </div>
        </div>
        <div className="welcome-control-wrapper">
          <div className={`welcome-scroll-wrapper animate__animated ${loading ? '' : 'animate__fadeOut'}`}>
            <div className="welcome-scroll-progress-wrapper">
              <div
                className="welcome-scroll-progress"
                style={{
                  width: `${scrollProgress}%`
                }}
              ></div>
            </div>
            <div className="welcome-scroll-text">{scrollProgress}%</div>
          </div>
          <div
            className={`welcome-input-wrapper animate__animated ${loading ? 'hidden' : ' animate__fadeIn animate-delay-500ms'}`}
          >
            <input
              className="welcome-input"
              type="text"
              placeholder="请输入你的github用户名或邮箱"
              onChange={onInputChange}
            />
            <button className="welcome-button" onClick={onClickSubmit}>
              点击开启年度总结
            </button>
          </div>
        </div>
      </div>
      <div className="welcome-footer">
        <div>由state-of-datawhale提供技术支持</div>
      </div>
    </div>
  );
};
