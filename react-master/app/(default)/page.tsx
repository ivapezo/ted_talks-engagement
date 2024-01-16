"use client"

import { useState } from 'react';
import Hero from '@/components/hero'
import Features from '@/components/features'
import Zigzag from '@/components/zigzag'
import Verdict from '@/components/verdict'

export default function Home() {
  const [fetchedData, setFetchedData] = useState(null);

  const updateFetchedData = (data: any) => {
    setFetchedData(data);
  };

  return (
    <>
      {fetchedData ? (
        <>
          <Hero onFetchedDataUpdate={updateFetchedData} />
          <Zigzag fetchedData={fetchedData} />
          <Verdict fetchedData={fetchedData} />
        </>
      ) : (
        <>
          <Hero onFetchedDataUpdate={updateFetchedData} />
          <Features />
        </>
      )}
    </>
  );
}
