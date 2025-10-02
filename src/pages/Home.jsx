import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainPhoto from '../assets/main.png';
import PurpleArrow from '../assets/PurpleArr.svg'
import GreenArrow from '../assets/GreenArr.svg'
import PromoCircle from '../components/PromoCircle';
import PromoModal from '../components/PromoModal';
import '../components/PromoCircle.css';
import '../components/PromoModal.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='relative bg-gray-100 min-h-screen max-w-screen overflow-x-hidden'>
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <nav className="container mx-auto max-w-screen-lg">
          <div className="flex h-24 items-center justify-between px-4 gap-6">
            <Link
              to="/ar-photo"
              className="flex-1 flex items-center justify-center gap-3 rounded-[0.75rem] bg-[#726de3] text-white font-normal py-4 px-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-[#09a9c3] hover:shadow-xl"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="text-xs uppercase tracking-wide font-black">Фото AR</span>
            </Link>
            <Link
              to="/minigames"
              className="flex-1 flex items-center justify-center gap-3 rounded-[0.75rem] bg-[#5ccf54] text-white font-semibold py-4 px-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-[#49b643] hover:shadow-xl"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
              </svg>
              <span className="text-xs uppercase tracking-wide font-black">Мини-игры</span>
            </Link>
          </div>
        </nav>
      </header>

      <img src={PurpleArrow} alt="стрелка" className="w-8 absolute top-19 left-12 opacity-55"/>
      <img src={GreenArrow} alt="стрелка" className="w-30 rotate-340 absolute top-21 left-[70vw] opacity-55 z-4"/>

      <main className="container mx-auto max-w-screen-lg px-4 pt-10 pb-20 flex flex-col gap-16">
        <section className="flex flex-col items-center text-center gap-8">
          <div className="flex flex-col items-center gap-6 max-w-2xl">
            <h2 className="font-normal text-start leading-tight text-[#726de3] bg-gray-100 z-3">
              Оживи любимых героев в дополненной реальности
            </h2>
            <h2 className="relative text-end top-14 font-normal leading-tight text-[#5ccf54] bg-gray-100 z-5">
              Поиграй в увлекательные мини-игры
            </h2>
          </div>
          <img src={MainPhoto} alt="Оживи Героя" className="w-full" />
        </section>

        <article className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 md:p-12 text-center lg:text-left flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Как это работает</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Наведите камеру на любимую скульптуру и позвольте магии AR оживить героя прямо перед глазами.
              Делайте фото, делитесь в социальных сетях и забирайте незабываемые впечатления с собой.
            </p>
          </div>
          <Link
            to="/ar-scene"
            className="inline-flex items-center justify-center rounded-2xl bg-[#726de3] text-white px-8 py-4 font-semibold shadow-md transition-all duration-200 hover:bg-[#726de3] hover:shadow-lg"
          >
            Перейти в AR
          </Link>
        </article>

        <article className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 md:p-12 text-center flex flex-col items-center gap-4">
          <h3 className="text-xl font-semibold text-[#726de3] mb-2">Получите скидку на билет!</h3>
          <p className="text-base text-gray-700">
            Сфотографируйтесь с героями в AR и сыграйте в мини-игры, чтобы получить скидку на билет в увлекательный парк <b>Союзмультпарк</b>!
            Покажите результаты на кассе и откройте для себя мир любимых мультфильмов.
          </p>
          <span className="text-xs text-gray-400 mt-2">
            <a href="https://souzmultpark.ru" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#726de3]">
              Официальный сайт Союзмультпарка
            </a>
          </span>
        </article>
      </main>

      <PromoCircle onClick={() => setIsModalOpen(true)} />
      {isModalOpen && <PromoModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;
