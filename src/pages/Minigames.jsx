import React from 'react';
import { Link } from 'react-router-dom';

// import Game1Icon from '../assets/game-icon-1.png';
// import Game2Icon from '../assets/game-icon-2.png';
// import Game3Icon from '../assets/game-icon-3.png';

const Minigames = () => {
  const games = [
    {
      id: 'wolf-eggs-ar',
      name: 'Волк и яйца в AR',
      description: 'Классическая игра в новом формате! Ловите яйца вместе с Волком прямо в своей комнате с помощью технологии дополненной реальности. Не дайте им разбиться!',
      image: 'https://placehold.co/400x400/E2E8F0/4A5568?text=Волк+и+яйца',
      path: '/wolf-and-eggs',
    },
    {
      id: 'escape-moidodyr',
      name: 'Убеги от Мойдодыра',
      description: 'Знаменитый умывальник гонится за вами! Проявите ловкость и скорость, чтобы увернуться от мыла и мочалок в этой веселой и динамичной аркаде.',
      image: 'https://placehold.co/400x400/E2E8F0/4A5568?text=Мойдодыр',
      path: '/games/escape-moidodyr',
    },
    {
      id: 'cheburashka-birthday',
      name: 'День рождения Чебурашки',
      description: 'Помогите Гене поздравить Чебурашку! Зажгите все свечки на праздничном торте, пока не закончилось время. Простая и милая игра для всех возрастов.',
      image: 'https://placehold.co/400x400/E2E8F0/4A5568?text=Чебурашка',
      path: '/games/cheburashka-birthday',
    },
  ];

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

      <main className="container mx-auto max-w-screen-lg px-4 pt-10 pb-20">
        <section className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-normal text-[#5ccf54]">Мини-игры</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            В разработке, тут должно быть отслеживание рук пользователя.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 mt-12 flex justify-center w-screen">
          <p>В разработке</p>
        </div>
      </main>
    </div>
  );
};

export default Minigames;
