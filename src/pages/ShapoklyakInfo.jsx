import React from 'react';
import { Link } from 'react-router-dom';
import photo1 from '../assets/shapinfo/photo_1_2025-10-02_20-00-37.jpg';
import photo2 from '../assets/shapinfo/photo_2_2025-10-02_20-00-37.jpg';
import photo3 from '../assets/shapinfo/photo_3_2025-10-02_20-00-37.jpg';
import photo4 from '../assets/shapinfo/photo_4_2025-10-02_20-00-37.jpg';
import photo5 from '../assets/shapinfo/photo_5_2025-10-02_20-00-37.jpg';

const ShapoklyakInfo = () => {
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
            <div className="text-center lg:text-left mb-4">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2 block">
                    &larr; На главную
                </Link>
            </div>
            <h1 className="text-3xl font-medium text-gray-800 mb-8">Старуха Шапокляк</h1>
            <p className="text-lg text-gray-600 italic mb-6">"Кто людям помогает — тот тратит время зря. Хорошими делами прославиться нельзя!"</p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Шапокляк - вредная старушка с рогаткой и крыской Лариской в ридикюле, главная злодейка и самая стильная героиня в книге и серии мультфильмов о Крокодиле Гене и Чебурашке.
            </p>
            <div className="my-8 p-4 bg-blue-50 rounded-2xl shadow-md">
                <img src={photo1} alt="Старуха Шапокляк" className="w-full h-auto rounded-lg" />
            </div>
            <blockquote className="text-lg text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
              «Самый захватывающий, таинственный и крайне нервный процесс — рождение персонажа. Приступаешь к работе — все смутно, общо. Карандаш ведет руку: сквозь ошибки, нелепости вдруг что-то проклевывается. Тогда хватаешься за соломинку, начинаешь делать шарж на знакомого человека…»
            </blockquote>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Создатель образа старухи Шапокляк, писатель Эдуард Успенский признавался, что во многом списал героиню со своей первой жены - «дамы, вредной во всех отношениях».
            </p>
            <div className="my-8 p-4 bg-purple-50 rounded-2xl shadow-md">
                <img src={photo2} alt="Старуха Шапокляк" className="w-full h-auto rounded-lg" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              А вот художнику, Леониду Шварцману, Шапокляк напоминала самого Успенского. При этом некоторые детали её гардероба Шварцман «позаимствовал» у своей тёщи, а характер, движения и жесты - у коллег на «Союзмультфильме».
            </p>
            <blockquote className="text-lg text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-4">
              «Шапокляк выпрыгнула, как чертик, из самого названия «складной цилиндр». Внутри цилиндра есть пружинка с кнопочкой. Характер по-хармсовски острый, въедливая, шкодливая, активная старушонка. Сразу возник аромат XIX века. Время, близкое мне во всех отношениях. Вспоминал своих родителей, их друзей. В двадцатые годы таких старушек еще можно было увидеть на улицах. Я же сам — мостик между веками»
            </blockquote>
            <div className="my-8 p-4 bg-green-50 rounded-2xl shadow-md">
                <img src={photo3} alt="Старуха Шапокляк" className="w-full h-auto rounded-lg" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Голос этого вредного персонажа принадлежит артисту Владимиру Раутбарту, который любил испытывать себя и пробовать новые роли, поэтому с радостью принял предложение Романа Качанова и Эдуарда Успенского принять участие в создании этой детской истории.
            </p>
            <p className="text-lg text-gray-600 italic mb-4">
              "Так, сяк, наперекосяк, едет на дрезине старуха Шапокляк!"
            </p>
            <div className="my-8 p-4 bg-yellow-50 rounded-2xl shadow-md">
                <img src={photo4} alt="Старуха Шапокляк" className="w-full h-auto rounded-lg" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              На съёмках использовались несколько идентичных кукол-дублёров старухи Шапокляк. В 2007 году подобная кукла была выставлена на распродаже - на аукционе мультипликационных кукол. Часть средств, вырученных от аукциона, была направлена на помощь пенсионерам — бывшим сотрудникам «Союзмультфильма». Через несколько лет архивные куклы Шапокляк оценивались уже в миллионы рублей и даже стали предметом споров о продаже зарубежным коллекционерам.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Для того, чтобы погрузиться в мир детства, не обязательно собирать коллекционные куклы. Ведь любимый персонаж уже ждет вас в нашем парке! <a href="https://souzmultpark.ru/" target="_blank" rel="noopener noreferrer" className="text-[#726de3] underline hover:text-[#5ccf54]">Союзмультпарк</a>
            </p>
            <div className="my-8 p-4 bg-red-50 rounded-2xl shadow-md">
                <img src={photo5} alt="Старуха Шапокляk" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ShapoklyakInfo;
