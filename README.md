# Союзмультпарк AR

Веб-приложение с дополненной реальностью для скульптур на входе в здание мультимедийного центра «Союзмультпарк».

## Контекст

Ежедневно тысячи людей фотографируются у скульптур, но не заходят внутрь. Это приложение призвано повысить конверсию, демонстрируя интерактивные возможности парка через WebAR.

## Задача

Создать веб-приложение, которое по QR-коду запускает AR-сцену в браузере. При наведении на скульптуры (Чебурашка, Шапокляк, Волк), приложение распознает их и добавляет анимированные 3D-объекты, создавая "живые" фотозоны.

## Стек технологий

*   **Фреймворк:** React
*   **Маршрутизация:** React Router
*   **3D-графика:** Three.js, @react-three/fiber, @react-three/drei
*   **WebAR:** mind-ar-js (планируется)
*   **Сборщик:** Vite

## Инструкция по запуску

1.  **Установите зависимости:**
    ```bash
    npm install
    ```
2.  **Запустите проект в режиме разработки:**
    ```bash
    npm run dev
    ```
    Приложение будет доступно по адресу `http://localhost:5173`.

## Архитектура

*   `src/main.jsx`: Точка входа, настройка React Router.
*   `src/App.jsx`: Корневой компонент с определением маршрутов.
*   `src/pages/Home.jsx`: Главная страница со ссылками на AR-сцены.
*   `src/pages/ARScene.jsx`: Компонент для отображения AR-сцены.
*   `public/`: Статические ассеты, включая 3D-модели и изображения-цели для AR.

## Известные ограничения

*   На данный момент `mind-ar-js` не установлен из-за проблем со сборкой в текущем окружении. Функционал AR будет добавлен на следующем этапе.
*   Требуется тестирование на различных мобильных устройствах для обеспечения стабильной работы.
 Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
