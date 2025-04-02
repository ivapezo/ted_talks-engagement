'use client'

import { useRef } from 'react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;

  videoPlaying: boolean;
  currentVideoUrl: string | undefined;
  onButtonClick: (videoUrl: string) => void;
  onFetchedDataUpdate: (data: any) => void; 
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  video,
  videoPlaying,
  currentVideoUrl,
  onButtonClick,
  onFetchedDataUpdate,
}: ModalVideoProps) {

  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to handle the button click
  async function handleButtonClick () {
    const defaultVideoUrl = "https://www.youtube.com/watch?v=L-FTI14OVrg";
    onButtonClick("https://www.youtube.com/embed/L-FTI14OVrg");

    // Play or pause the video
    if (videoRef.current) {
      videoPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
    // get the transcript
    const formData = new FormData();
    formData.append("videoUrl", defaultVideoUrl);

    await fetch('/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: defaultVideoUrl }),
    })
    .then(response => response.json())
    .then(data => {
        const prediction = data;
        // Update UI with the prediction
        console.log('Prediction:', prediction);
        prediction.forEach((element: any) => {
          console.log(element);
        });
        onFetchedDataUpdate(prediction);
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      {/* Video thumbnail */}
      <div>

      {!videoPlaying && (
        <div className="relative flex justify-center items-center" data-aos="fade-up" data-aos-delay="200">
          <Image src={thumb} width={thumbWidth} height={thumbHeight} alt={thumbAlt} />
          <button className="absolute group" onClick={handleButtonClick} aria-label="Watch the video">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 hover:opacity-75 transition duration-150 ease-in-out" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient x1="78.169%" y1="9.507%" x2="24.434%" y2="90.469%" id="a">
                  <stop stopColor="#EBF1F5" stopOpacity=".8" offset="0%" />
                  <stop stopColor="#EBF1F5" offset="100%" />
                </linearGradient>
              </defs>
              <circle fill="url(#a)" cx="44" cy="44" r="44" />
              <path className="fill-current text-purple-600" d="M52 44a.999.999 0 00-.427-.82l-10-7A1 1 0 0040 37V51a.999.999 0 001.573.82l10-7A.995.995 0 0052 44V44c0 .001 0 .001 0 0z" />
            </svg>
          </button>
        </div>
      )}

        {/* Render video based on button click */}
        {videoPlaying && (
          <div className="left-0 w-full h-full flex items-center justify-center" style={{ top: "26.5rem" }}>
            <iframe width={thumbWidth} height={thumbHeight/1.5} src={currentVideoUrl} />
          </div>
        )}  
      </div>
      {/* End: Video thumbnail */}
    </div>
  );
}
