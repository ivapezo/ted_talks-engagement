import React, { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';

export default function Verdict({ fetchedData }: { fetchedData: any }) {

  const [comment, setComment] = useState<number | null>(null);
  const [like, setLike] = useState<number | null>(null);
  const [popularPrediction, setPopularPrediction] = useState<Array<number> | null>(null);
  const [engagingPrediction, setEngagingPrediction] = useState<Array<number> | null>(null);
  const [animationText, setAnimationText] = useState<string | null>(null);
  
  useEffect(() => {
    // Assuming that fetchedData contains the distinctiveness information
    if (fetchedData && fetchedData.length > 0) {
      setComment(fetchedData[2][11]);
      setLike(fetchedData[2][12]);
      setPopularPrediction(fetchedData[0]);
      setEngagingPrediction(fetchedData[1]);
      console.log("Popular pred: ", popularPrediction);

      setAnimationText( fetchedData[0] && fetchedData[0][1] > 0.4
        ? `... popular! \n... and it has ${fetchedData[2][12]} likes \n... and ${fetchedData[2][11]} comments`
        : `... not popular\n ... but it has ${fetchedData[2][12]} likes \n... and ${fetchedData[2][11]} comments`);
    }
  }, [fetchedData]);

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
