import React, { useEffect } from 'react';

function TikTok({ onTimeout, timeoutSecond }) {
  const [second, setSecond] = React.useState(parseInt(timeoutSecond, 10));
  const timer = () => setSecond(second - 1);
  useEffect(() => {
    if (second === 0) {
      onTimeout();
      return;
    }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [second]);
  return (
    <>
      {second}s
    </>
  )
}

export default TikTok
