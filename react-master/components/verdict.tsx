import React, { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';

export default function Verdict({ fetchedData }: { fetchedData: any }) {

  const [comment, setComment] = useState<number | null>(null);
  const [like, setLike] = useState<number | null>(null);
  const [popularPrediction, setPopularPrediction] = useState<Array<number> | null>(null);
  const [engagingPrediction, setEngagingPrediction] = useState<Array<number> | null>(null);

  useEffect(() => {
    // Assuming that fetchedData contains the distinctiveness information
    if (fetchedData && fetchedData.length > 0) {
      try {
        setComment(fetchedData[2][11] || 0);
        setLike(fetchedData[2][12] || 0);
        setPopularPrediction(fetchedData[0] || [0, 0]);
        setEngagingPrediction(fetchedData[1] || [0, 0]);
        console.log("Popular pred: ", popularPrediction);
      } catch (error) {
        console.error('Error processing prediction data:', error);
        setComment(0);
        setLike(0);
        setPopularPrediction([0, 0]);
        setEngagingPrediction([0, 0]);
      }
    }
  }, [fetchedData]);

  const [animationText, setAnimationText] = useState<string | null>(null);

  useEffect(() => {
    if (like !== null && comment !== null) {
      const text = popularPrediction && popularPrediction[1] > 0.4
        ? `... popular! \n... and it has ${like} likes \n... and ${comment} comments`
        : `... not popular\n ... but it has ${like} likes \n... and ${comment} comments`;

      setAnimationText(text);
    }
  }, [like, comment, popularPrediction]);

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Verdict?</h2>
            <p className="text-xl text-gray-400">The model predicted that the talk is...</p>
            {animationText && (
              <TypeAnimation
                sequence={animationText.split('\n').map(word => [word, 1000]).flat()}
                wrapper="span"
                speed={25}
                style={{ fontSize: '2em', display: 'inline-block' }}
                repeat={Infinity}
                key={fetchedData}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
