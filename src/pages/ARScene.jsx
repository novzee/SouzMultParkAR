import React from 'react';
import { useParams } from 'react-router-dom';

const ARScene = () => {
  const { character } = useParams();

  return (
    <div className=''>
      <h2 className='text-2xl font-bold'>AR-сцена для: {character}</h2>
      {/* Здесь будет рендериться AR-компонент */}
      <p>Наведите камеру на метку, чтобы увидеть магию!</p>
    </div>
  );
};

export default ARScene;
