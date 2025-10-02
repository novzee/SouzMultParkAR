import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheburashkaPhoto from '../assets/chebu.jpg'; 
import GenaPhoto from '../assets/gena.jpg'; 
import WolfPhoto from '../assets/pogod.jpg'; 
import ShapoklyakPhoto from '../assets/shapok.jpg'; 

const ARPhoto = () => {
  const sculptures = [
    { id: 'chebu', name: 'Скульптура Чебурашка', image: CheburashkaPhoto, disabled: true },
    { id: 'gena', name: 'Скульптура Крокодил Гена', image: GenaPhoto, disabled: false },
    { id: 'nupogodi', name: 'Скульптура Волк', image: WolfPhoto, disabled: true },
    { id: 'shapka', name: 'Скульптура Шапокляк', image: ShapoklyakPhoto, disabled: false },
  ];

  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleGoClick = () => {
    if (selectedId) {
      navigate(`/${selectedId}`);
    }
  };

  return (
    <div className='relative bg-gray-100 min-h-screen max-w-screen overflow-x-hidden'>
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <nav className="container mx-auto max-w-screen-lg">
          <div className="flex h-20 items-center justify-start px-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-[#726de3] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">На главную</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto max-w-screen-lg px-4 pt-10 pb-32">
        <section className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-normal text-[#726de3]">Выберите скульптуру</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Нажмите на карточку, чтобы оживить любимого героя в дополненной реальности и сделать с ним фото.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 mt-12">
          {sculptures.map((sculpture) => (
            <div
              key={sculpture.id}
              onClick={() => !sculpture.disabled && handleSelect(sculpture.id)}
              className={`flex items-center bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out ${
                selectedId === sculpture.id
                  ? 'ring-4 ring-[#726de3] scale-105'
                  : 'ring-2 ring-transparent'
              } ${
                sculpture.disabled
                  ? 'opacity-60 grayscale cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <div className="flex-1 p-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {sculpture.name.replace('Скульптура ', '')}
                </h3>
              </div>
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  alt={sculpture.name}
                  src={sculpture.image}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Анимированная кнопка "Перейти" */}
      <div
        className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ease-in-out ${
          selectedId ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200">
          <div className="container mx-auto max-w-screen-lg">
            <button
              onClick={handleGoClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#726de3] px-6 py-4 text-lg font-bold text-white shadow-lg disabled:opacity-50"
              disabled={!selectedId}
            >
              Перейти
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARPhoto;