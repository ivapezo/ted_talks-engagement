import Image from 'next/image'

import ted from '@/public/images/ted2.png'
import React, { useState, useEffect } from "react";

import colormap from "colormap";
import { toInteger } from 'lodash';

let colors_red = colormap({
  colormap: "YIOrRd",
  nshades: 9,
  format: "rgbaString",
  alpha: 1
});

let colors_blue = colormap({
  colormap: "YIGnBu",
  nshades: 9,
  format: "rgbaString",
  alpha: 1
});

let colors_grey = colormap({
  colormap: "Greens",
  nshades: 9,
  format: "rgbaString",
  alpha: 1
});

export default function Zigzag({ fetchedData }: { fetchedData: any }) {
  const [faithfulness, setFaithfulness] = useState<number | null>(null);
  const [distinctiveness, setDistinctiveness] = useState<number | null>(null);
  const [flesch_kincaid_grade_level, setFlesch_kincaid_grade_level] = useState<number | null>(null);
  const [dale_chall_grade_level, setDale_chall_grade_level] = useState<number | null>(null);
  const [vocabulary, setVocabulary] = useState<number | null>(null);

  useEffect(() => {
    // Assuming that fetchedData contains the distinctiveness information
    if (fetchedData && fetchedData.length > 0) {
      var scaledFaithfulness = ((fetchedData[2][6]) / (10)) * 9
      scaledFaithfulness = scaledFaithfulness > 9 ? 9 : scaledFaithfulness;
      console.log("Faithfulness: ", scaledFaithfulness);
      setFaithfulness(scaledFaithfulness);
      var scaledDistinctiveness = ((fetchedData[2][7] / 100 )) * 9
      scaledDistinctiveness = scaledDistinctiveness > 9 ? 9 : scaledDistinctiveness;
      console.log("Distinctiveness: ", scaledDistinctiveness);
      setDistinctiveness(scaledDistinctiveness);
      setFlesch_kincaid_grade_level(fetchedData[2][8]);
      setDale_chall_grade_level(fetchedData[2][9]);
      var scaledVocabulary = ((fetchedData[2][10] - 680) / (850 - 680)) * (9 - 0)
      scaledVocabulary = scaledVocabulary > 9 ? 9 : scaledVocabulary;
      setVocabulary(scaledVocabulary);
      console.log("Vocabulary: ", scaledVocabulary);
    }
  }, [fetchedData]);

  // funtion to get the grade level
  let gradeLevelFunct = (() => {
    if (fetchedData && fetchedData.length > 0) {
      var grade_level = fetchedData[2][9] + fetchedData[2][8];
        if (grade_level <= 10) {
          return(
              <span>Easier readability, suitable for a broader audience. </span>
          )
        } else if (grade_level <= 17) {
          return(
              <span>Higher level of literacy but is still understandable for a general audience. </span>
          )
        } else {
          return(
              <span>More challenging readability, potentially suited for advanced readers or specific professional contexts.</span>
          )
        }
    }
  })

  let resultNote = ((result: any, color: any) => {
    if (fetchedData && fetchedData.length > 0) {
      if (result <= 3) {
        return(
          <div className="font-architects-daughter text-xl text-purple-600 mb-2" style={{color: color}}>
            ... not really
          </div>
        )
      } else if (result <= 6) {
        return(
          <div className="font-architects-daughter text-xl text-purple-600 mb-2" style={{color: color}}>
            ... moderately
          </div>
        )
      } else {
        return(
          <div className="font-architects-daughter text-xl text-purple-600 mb-2" style={{color: color}}>
            ... very
          </div>
        )
      }
    }
  })

  function getMonthName(monthNumber: number) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Ensure the monthNumber is within a valid range
    const index = Math.max(0, Math.min(monthNumber - 1, 11));
  
    return months[index];
  }


  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-gray-800">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-green-600 bg-green-200 rounded-full mb-4">Analysis done!</div>
            <h1 className="h2 mb-4">The results for the given video:</h1>
            <p className="text-xl text-gray-400">We define a set of explainable linguistic features that are hypothesized to affect popularity and engagement. These features have been drawn from different linguistic research papers, alongside own intuition.</p>
          </div>
          {/* Items */}
          <div className="grid gap-20">

            {/* 1st item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
            <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1" data-aos="fade-up">
              {colors_red.map((color: any) => (
                <span
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: 55,
                    height: 55,
                    display: "inline-block"
                  }}
                  ></span>
                  ))}
                <span style={{fontSize: "48px", color: "white", marginLeft: faithfulness ? 395 - (faithfulness * 55) : 445}}>&#x25B2;</span>
              </div>              
              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-right">
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <h3 className="h3 mb-3">Faithful to the Title? </h3>
                  <p className="text-xl text-gray-400 mb-4">Each time a viewer initiates the playing of a video on their device and watches for at least 30 seconds is counted as a view.
                    We investigate the faithfulness of the title to the talk during the first 30 seconds, to determine if has an impact on the overall number of views for that talk.</p>
                </div>
                {resultNote(faithfulness, colors_red[8-toInteger(faithfulness)])}
              </div>
            </div>
            
            {/* 2nd item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 rtl" data-aos="fade-up">
              {colors_blue.map((color: any) => (
                <span
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: 55,
                    height: 55,
                    display: "inline-block"
                  }}
                  ></span>
                  ))}
                <span style={{fontSize: "48px", color: "white", marginRight: distinctiveness ? 467.5 - (distinctiveness * 55) : 0}}>&#x25B2;</span>
              </div>
              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-left">
                <div className="md:pl-4 lg:pl-12 xl:pl-16">
                  <h3 className="h3 mb-3">Distinctive? </h3>
                  <p className="text-xl text-gray-400 mb-4">
                    Distinctiveness refers to a measure of how unique or perplexing a given text is, 
                    how well a language model predicts a given sequence of words, higher perplexity score indicting that the text is more surprising or less predictable.
                  </p>
                  {resultNote(distinctiveness, colors_blue[8-toInteger(distinctiveness)])}
                </div>
              </div>
            </div>

            {/* 3rd item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1" data-aos="fade-up">
                <ul className="text-lg text-gray-400 -mb-2">
                    <li className="flex items-center mb-2">
                      <svg className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                      <span>Flesch-Kincaid grade level: {flesch_kincaid_grade_level}</span>
                    </li>
                    <li className="flex items-center mb-2">
                      <svg className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                      <span>Dale-Chall grade level: {dale_chall_grade_level}</span>
                    </li>
                    <li className="flex items-center mb-2">
                      <svg className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                      {gradeLevelFunct()}
                    </li>
                  </ul>
              </div>
              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-right">
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <h3 className="h3 mb-3">Complex language?</h3>
                  <p className="text-xl text-gray-400 mb-4">In order to determine reading grade level, we use Flesch-Kincaid and Dale-Chall grade levels. The Flesch-Kincaid measures the number of syllables per word and the number of words per sentence, and the Dale-Chall measures word 'difficulty' using a lookup table.
                                                            Lower grade levels indicate easier readability, while higher grade levels suggest more complex language.</p>
                  
                </div>
              </div>
            </div>

            {/* 4th item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 rtl" data-aos="fade-up">
              {colors_grey.map((color: any) => (
                <span
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: 55,
                    height: 55,
                    display: "inline-block"
                  }}
                  ></span>
                  ))}
                <span style={{fontSize: "48px", color: "white", marginRight: vocabulary ? 467.5 - (vocabulary * 55) : 0}}>&#x25B2;</span>
              </div>
              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-left">
                <div className="md:pl-4 lg:pl-12 xl:pl-16">
                  <h3 className="h3 mb-3">Diverse Vocabulary?</h3>
                  <p className="text-xl text-gray-400 mb-4">We examine whether speakers of more popular talks use more diverse vocabularies, quantified by the entropy of the unigram words in the text, motivated by advice to avoid word repetition.</p>
                  {resultNote(vocabulary, colors_grey[8-toInteger(vocabulary)])}
                </div>
              </div>
            </div>

            {/* 5th item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1" data-aos="fade-up">
                <Image className="max-w-full mx-auto md:max-w-none h-auto" src={ted} width={540} height={405} alt="Features 03" />
              </div>
              {/* Content */}
              <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6" data-aos="fade-right">
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <h3 className="h3 mb-3">Metadata?</h3>
                  <p className="text-xl text-gray-400 mb-4">Besides the extracted features, we use some additional metadata from the video to enhance the predictions.</p>
                  <ul className="text-lg text-gray-400 -mb-2">
                    <li className="flex items-center mb-2">
                      <svg className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                      <span>Duration: {fetchedData ? Math.floor(fetchedData[2][0] / 60) + " min " + (fetchedData[2][0] % 60) + " sec" : "0"}</span>
                    </li>
                    <li className="flex items-center mb-2">
                      <svg className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                      <span>Available languages: {fetchedData? fetchedData[2][1]: "0"}</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 fill-current text-green-500 mr-2 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                      <span> Month and year: {fetchedData ? getMonthName(fetchedData[2][3]) + ", " + fetchedData[2][4] : "0"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
