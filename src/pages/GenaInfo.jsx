import React from 'react';
import { Link } from 'react-router-dom';

import photo1 from '../assets/genainfo/photo_1_2025-10-02_19-54-22.jpg';
import photo2 from '../assets/genainfo/photo_2_2025-10-02_19-54-22.jpg';
import photo3 from '../assets/genainfo/photo_3_2025-10-02_19-54-22.jpg';
import photo4 from '../assets/genainfo/photo_4_2025-10-02_19-54-22.jpg';
import photo5 from '../assets/genainfo/photo_5_2025-10-02_19-54-22.jpg';
import photo6 from '../assets/genainfo/photo_6_2025-10-02_19-54-22.jpg';

const GenaInfo = () => {
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875 2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
              </svg>
              <span className="text-xs uppercase tracking-wide font-black">Мини-игры</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto max-w-screen-lg px-4 pt-10 pb-20 flex flex-col gap-16">
        <article className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 md:p-12 text-center lg:text-left flex flex-col gap-6">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2 block">
              &larr; На главную
            </Link>
            <h1 className="text-3xl font-medium text-gray-800 mb-8">Крокодил Гена</h1>
            <p className="text-lg text-gray-600 italic mb-6">"Это хорошо! Хорошо, что вы зелёный и… и плоский!"</p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Добрый крокодил Гена появился на свет вместе с книгой Эдуарда Успенского "Крокодил Гена и его друзья" в 1966. Герой безграничной доброты и вежливости быстро полюбился юным читателям.
            </p>

            <div className="my-8 p-4 bg-blue-50 rounded-2xl shadow-md">
              <img src={photo1} alt="Gena 1" className="rounded-xl w-full h-auto" />
            </div>

            <p className="text-lg text-center font-bold text-gray-700 leading-relaxed mb-4">
              "КОРМИТЬ И ГЛАДИТЬ РАЗРЕШАЕТСЯ"
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Спустя 3 года его образ оформил художник Леонид Шварцман, создав джентльмена в бабочке, с трубкой и в красным пальто. Образ Гены сложился быстро, контрастируя с более сложным образом Чебурашки. Сам Успенский называл прототипом характера крокодила Гены композитора Яна Френкеля. Его стиль, походку и манеру речи писатель положил в основу персонажа и даже заявил об этом со сцены на праздновании 50-летия издательства «Детская литература»:
            </p>

            <div className="my-8 p-4 bg-green-50 rounded-2xl shadow-md">
              <img src={photo2} alt="Gena 2" className="rounded-xl w-full h-auto" />
            </div>

            <blockquote className="text-lg text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
              «Дорогие друзья, сейчас я открою вам страшную тайну, с кого был написан Крокодил Гена. Он сидит здесь, перед вами. Ян Абрамович, поднимитесь, пожалуйста».
            </blockquote>

            <div className="my-8 p-4 bg-yellow-50 rounded-2xl shadow-md">
              <img src={photo3} alt="Gena 3" className="rounded-xl w-full h-auto" />
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Голоса Гене и Чебурашке подарили Василий Ливанов и Клара Румянова, ранее вместе работавшие над «Малышом и Карлсоном». 
              Серия мультфильмов про крокодила Гену примечательна своей музыкой. Второая серия открывается знакомой всем с детства песней:
            </p>

            <div className="my-8 p-4 bg-red-50 rounded-2xl shadow-md">
              <img src={photo4} alt="Gena 4" className="rounded-xl w-full h-auto" />
            </div>

            <p className="text-lg text-gray-600 italic mb-4">
              «Пусть бегут неуклюже пешеходы по лужам», — поёт крокодил Гена, и мы готовы петь вместе с ним.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Эту композицию, как и всю музыку к серии советских мультфильмов о Гене и Чебурашке, написал Владимир Шаинский. 
              Ходит легенда: для того, чтобы Шаинский сочинил подходящую песню, режиссеру Роману Качанову приходилось заставлять его играть в шахматы. После нескольких "мудреных" мелодий, предоставленных композитором, Качанов заявил:
            </p>

            <div className="my-8 p-4 bg-purple-50 rounded-2xl shadow-md">
              <img src={photo5} alt="Gena 5" className="rounded-xl w-full h-auto" />
            </div>

            <blockquote className="text-lg text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
              «Начинать сочинять музыку надо тогда, когда рациональное начало отсутствует, когда все строится на правом полушарии». 
            </blockquote>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              И усадил Шаинского за шахматную доску. После пяти серьёзных партий Шаинский сел за пианино. Первую предложенную мелодию режиссёр назвал «чепухой», вторую — «ерундой». Затем композитор вышел из себя и, заявив, что у Качанова очень примитивное мышление, стал одним пальцем наигрывать простенькую мелодию. Которая впоследствии и стала всем известной композицией.
            </p>

            <div className="my-8 p-4 bg-indigo-50 rounded-2xl shadow-md">
              <img src={photo6} alt="Gena 6" className="rounded-xl w-full h-auto" />
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Для того, чтобы продолжить путешествие в детство, не обязательно уметь играть в шахматы или подбирать ноты на пианино - иногда для начала приключений достаточно искреннего желания! 
            </p>
            <p className="text-lg text-gray-600 italic bg-gray-200 p-4 rounded-lg mb-4">
              Молодой кракодил пятидесяти лет хочет зависти себе друзей. С предложениями обращаться по адресу:Большая Пирожная улица, дом 15, корпус Ы. Звонить три с половиной раза
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Или просто заглянуть в парк Союзмультфильма, там - все наши друзья! <a href="https://souzmultpark.ru/" target="_blank" rel="noopener noreferrer" className="text-[#726de3] underline hover:text-[#5ccf54]">Союзмультпарк</a>
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default GenaInfo;
