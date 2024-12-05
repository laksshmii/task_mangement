import React from 'react';

const Background = ({ children, imageUrl }) => {
  const backgroundStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding:0,
  };

  return <div style={backgroundStyle}>{children}</div>;
};

export default Background;
