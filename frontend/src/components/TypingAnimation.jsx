import React from 'react';
import Typewriter from 'react-typewriter-effect';

const TypingAnimation = ({ head, sub, textArray }) => {
  return (
    // <div style={{ textAlign: 'center', color: '#fff' }}>
      <>{head && <h1>{head}</h1>}
      <Typewriter
        textStyle={{
          fontFamily: 'Arial, sans-serif',
        //   color: '#ffffff',
          fontWeight: 500,
          fontSize: '1.5em',
          textAlign: 'center',
        }}
        startDelay={100}
        cursorColor="white"
        multiText={textArray}
        multiTextDelay={2000}
        typeSpeed={100}
        deleteSpeed={50}
        loop={true}
      /></>
    // </div>
  );
};

export default TypingAnimation;
