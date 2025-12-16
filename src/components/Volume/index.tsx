import React, { useRef, useEffect } from 'react';
import './index.css';
import { AUDIO_URL } from '../../constants';

interface IProps {
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

let timer: any = null;

export default function Volume(props: IProps) {
  const { muted, setMuted } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioVolumeRef = useRef(0);

  const defaultIcon = () => {
    return (
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 6V42C17 42 11.7985 32.8391 11.7985 32.8391H6C4.89543 32.8391 4 31.9437 4 30.8391V17.0108C4 15.9062 4.89543 15.0108 6 15.0108H11.7985C11.7985 15.0108 17 6 24 6Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M32 15L32 15C32.6232 15.5565 33.1881 16.1797 33.6841 16.8588C35.1387 18.8504 36 21.3223 36 24C36 26.6545 35.1535 29.1067 33.7218 31.0893C33.2168 31.7885 32.6391 32.4293 32 33"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.2359 41.1857C40.0836 37.6953 44 31.305 44 24C44 16.8085 40.2043 10.5035 34.507 6.97906"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const mutedIcon = () => {
    return (
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.01" x="30" y="18" width="13" height="13" fill="#FFF" />
        <mask id="icon-37f5138ce6a0e536" maskUnits="userSpaceOnUse" x="30" y="18" width="13" height="13">
          <rect x="30" y="18" width="13" height="13" fill="#FFF" />
        </mask>
        <g mask="url(#icon-37f5138ce6a0e536)">
          <path
            d="M40.7348 20.2858L32.2495 28.7711"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32.2496 20.2858L40.7349 28.7711"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M24 6V42C17 42 11.7985 32.8391 11.7985 32.8391H6C4.89543 32.8391 4 31.9437 4 30.8391V17.0108C4 15.9062 4.89543 15.0108 6 15.0108H11.7985C11.7985 15.0108 17 6 24 6Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const audioFadeIn = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioVolumeRef.current = 0;
    }
    timer = setInterval(() => {
      if (audioRef.current && audioVolumeRef.current <= 1) {
        audioVolumeRef.current = audioVolumeRef.current + 0.05;
        audioRef.current.volume = audioVolumeRef.current > 1 ? 1 : audioVolumeRef.current;
      }
    }, 100);
  };

  useEffect(() => {
    if (muted) {
      audioRef.current?.pause();
      audioVolumeRef.current = 0;
    } else {
      if (audioRef.current) {
        audioRef.current.play();
        audioFadeIn();
      }
    }
  }, [muted]);

  return (
    <>
      <div
        className="volume"
        onClick={() => {
          setMuted(!muted);
        }}
      >
        {muted ? mutedIcon() : defaultIcon()}
      </div>
      <audio ref={audioRef} src={AUDIO_URL} type="audio/mpeg" loop />
    </>
  );
}
