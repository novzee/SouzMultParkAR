import React from 'react';
import { Link } from 'react-router-dom';

const TicketPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-['Soyuzmult_2'] p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative flex flex-col items-center pt-4">
        {/* Top part of the ticket */}
                       <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2 block">
                      &larr; На главную
                    </Link>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">БИЛЕТ</h2>
          <p className="text-center text-gray-500 mb-6">в Союзмультпарк</p>
          
          <div className="text-center my-8">
            <p className="text-5xl font-extrabold text-red-600">Скидка 10%</p>
            <p className="text-lg text-gray-700 mt-2">на посещение</p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-3 text-gray-800">Форматы посещения:</h3>
            <ul className="text-base text-gray-700 space-y-3">
              <li><span className="font-semibold">Будние дни:</span> экскурсионная программа по сеансам (группы от 2 до 30 чел).</li>
              <li><span className="font-semibold">Выходные и праздники:</span> самостоятельное посещение.</li>
              <li><span className="font-semibold">Групповые экскурсии (от 15 детей):</span> по тел. +7 (499) 495-41-34.</li>
              <li><span className="font-semibold">Индивидуальные экскурсии (до 10 чел):</span> по тел. +7 (499) 495-41-34.</li>
            </ul>
          </div>
        </div>
        
        {/* Perforation */}
        <div className="w-full relative my-4 flex items-center justify-center">
          {/* cut-out circles */}
          <div className="absolute left-0 w-6 h-6 bg-gray-100 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute right-0 w-6 h-6 bg-gray-100 rounded-full transform translate-x-1/2"></div>
          {/* dashed line */}
          <div className="w-full border-t-2 border-dashed border-gray-400"></div>
        </div>

        {/* Bottom part of the ticket */}
        <div className="bg-white p-8">
          <a href="https://souzmultpark.ru/#work-time" target="_blank" rel="noopener noreferrer" className="block w-full">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition duration-300 ease-in-out transform hover:scale-105">
              Использовать
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
