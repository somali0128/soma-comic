import React from 'react';
import { Link } from 'react-router-dom';
import SomaLogo from './soma_logo.svg';

const COPY = {
  zh: {
    title: '这一格漫画还没画出来',
    body: '你要找的页面不存在，可能是链接写错了，也可能它还在草稿本里。',
    home: '回到首页',
    tools: '看看我的工具',
  },
  en: {
    title: "This panel hasn't been drawn yet",
    body: "The page you're looking for doesn't exist. The link may be off, or it's still in the sketchbook.",
    home: 'Back to home',
    tools: 'Browse my tools',
  },
};

const NotFound = ({ t }) => {
  const copy = COPY[t?.social?.locale] || COPY.en;

  return (
    <section className="stickman-paper flex min-h-[calc(100vh-64px)] items-center px-4 py-16 text-ink sm:px-6">
      <div className="sketch-card stickman-enter mx-auto w-full max-w-xl p-8 text-center sm:p-12">
        <div className="relative mx-auto w-fit">
          <img src={SomaLogo} alt="" className="stickman-float h-24 w-24" />
          <span className="absolute -right-8 -top-3 rounded-full border-[1.5px] border-ink bg-white px-2.5 py-0.5 font-display text-sm font-extrabold">
            ?!
          </span>
        </div>
        <p className="mt-6 font-display text-6xl font-extrabold text-primary-500">404</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{copy.title}</h1>
        <p className="text-balance mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">{copy.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="sketch-btn sketch-btn--primary">
            {copy.home}
          </Link>
          <Link to="/tools" className="sketch-btn">
            {copy.tools}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
