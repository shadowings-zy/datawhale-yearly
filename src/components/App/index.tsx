import React, { useEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/sky.css';
import './index.css';
import { Content } from '../Content/index.tsx';
import background01 from '../../assets/2025/01.png';
import background02 from '../../assets/2025/02.png';
import background03 from '../../assets/2025/03.png';
import background04 from '../../assets/2025/04.png';
import background05 from '../../assets/2025/05.png';
import { Welcome } from '../Welcome/index.tsx';
import { PAGE_TYPE, SLIDE_TYPE } from '../../constants/index.ts';
import { ContentData } from '../../constants/index.ts';
import Volume from '../Volume/index.tsx';
import { useWindowSize } from '../../utils/windowSize.ts';

const BACKGROUND_MAP = {
  [SLIDE_TYPE.DATAWHALE_INFO]: background01,
  [SLIDE_TYPE.CONTRIBUTE]: background04,
  [SLIDE_TYPE.PROJECT]: background02,
  [SLIDE_TYPE.COMMIT_INFO]: background03,
  [SLIDE_TYPE.SUMMARY]: background05
};

export const App = () => {
  const { windowWidth, windowHeight, windowInitWidth, windowInitHeight } = useWindowSize();
  const deckDivRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<Reveal.Api | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageType, setPageType] = useState(PAGE_TYPE.WELCOME);
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [slideTypeList, setSlideTypeList] = useState<SLIDE_TYPE[]>([]);
  const [username, setUsername] = useState('');
  const [muted, setMuted] = useState(true);

  const handleSubmit = (username: string, contentDataList: ContentData[]) => {
    if (!username) {
      alert('请输入用户名或邮箱');
      return;
    }
    const currentUserContentData = contentDataList.find(
      (item) => item.username === username || item.email === username
    );
    setMuted(false);
    setUsername(username);
    setPageType(PAGE_TYPE.CONTENT);
    setContentData(currentUserContentData ? currentUserContentData : null);
    if (currentUserContentData) {
      setSlideTypeList([
        SLIDE_TYPE.DATAWHALE_INFO,
        SLIDE_TYPE.CONTRIBUTE,
        SLIDE_TYPE.PROJECT,
        SLIDE_TYPE.COMMIT_INFO,
        SLIDE_TYPE.SUMMARY
      ]);
    } else {
      setSlideTypeList([SLIDE_TYPE.DATAWHALE_INFO, SLIDE_TYPE.SUMMARY]);
    }
  };

  const handleResize = () => {
    if (deckRef.current) {
      deckRef.current.configure({
        width: windowWidth,
        height: windowHeight
      });
    }
  };

  const setNavigatePosition = () => {
    const navigateUpElement = document.querySelector('.navigate-up') as HTMLElement;
    if (navigateUpElement) {
      navigateUpElement.style.bottom = `${windowHeight * 0.96 - 36}px`;
      navigateUpElement.style.right = `${windowWidth / 2 - 36}px`;
    }

    const navigateDownElement = document.querySelector('.navigate-down') as HTMLElement;
    if (navigateDownElement) {
      navigateDownElement.style.bottom = `0px`;
      navigateDownElement.style.right = `${windowWidth / 2 - 36}px`;
    }
  };

  useEffect(() => {
    if (deckRef.current || !deckDivRef.current) return;

    deckRef.current = new Reveal(deckDivRef.current, {
      controls: true,
      controlsTutorial: true,
      progress: false,
      transition: 'slide',
      width: windowWidth,
      height: windowHeight,
      controlsLayout: 'edges',
      scrollActivationWidth: 0,
      hideInactiveCursor: true,
      hideCursorTime: 0
    });

    deckRef.current.initialize({}).then(() => {
      if (deckRef.current) {
        deckRef.current.on('slidechanged', (event) => {
          setCurrentSlide(event.indexv);
        });

        setNavigatePosition();
      }
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        if (deckRef.current) {
          deckRef.current.destroy();
          deckRef.current = null;
        }
      } catch (e) {
        console.warn('Reveal.js destroy call failed.');
      }
    };
  }, [pageType]);

  if (windowInitWidth > windowInitHeight * 0.9) {
    return (
      <div className="use-mobile-container">
        <div className="use-mobile">请将手机竖屏放置后</div>
        <div className="use-mobile">刷新页面查看总结报告</div>
      </div>
    );
  }

  return (
    <div
      className="app"
      style={{
        height: windowHeight,
        backgroundImage: `url(${background01})`
      }}
    >
      <Volume muted={muted} setMuted={setMuted} />
      {pageType === PAGE_TYPE.WELCOME && <Welcome handleSubmit={handleSubmit} />}
      {pageType === PAGE_TYPE.CONTENT && (
        <div
          className="reveal"
          ref={deckDivRef}
          style={{
            display: pageType === PAGE_TYPE.CONTENT ? 'block' : 'none'
          }}
        >
          <div className="slides">
            <section>
              {slideTypeList.map((slideType, index) => (
                <section key={`content-${index}`} data-background-image={BACKGROUND_MAP[slideType]}>
                  <Content
                    currentSlide={currentSlide}
                    index={index}
                    slideType={slideType}
                    data={contentData}
                    username={username}
                  />
                </section>
              ))}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
