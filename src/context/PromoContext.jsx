import React, { createContext, useState, useContext } from 'react';

const PromoContext = createContext();

export const usePromo = () => {
  return useContext(PromoContext);
};

export const PromoProvider = ({ children }) => {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(true);

  const completePhotoTask = () => {
    setPhotoTaken(true);
  };

  const completeGameTask = () => {
    setGamePlayed(true);
  };

  const value = {
    photoTaken,
    gamePlayed,
    completePhotoTask,
    completeGameTask,
  };

  return (
    <PromoContext.Provider value={value}>
      {children}
    </PromoContext.Provider>
  );
};
