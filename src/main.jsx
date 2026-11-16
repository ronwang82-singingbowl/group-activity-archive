import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const photos = {
  hero: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1900&q=85',
  picnic: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1100&q=80',
  forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1100&q=80',
  coast: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=80',
  lake: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  flowers: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80'
};

// All names, dates and event descriptions below are fictional demo content.
const events = [
  { id: 1, date: '2026.10.24', year: '2026', tag: '戶外日常', title: '在秋天，遇見慢下來的自己', summary: '走進山裡，讓風景替我們留下一段安靜的時間。', image: photos.forest, count: '24 張照片' },
  { id: 2, date: '2026.08.16', year: '2026', tag: '相聚時光', title: '午後的咖啡，剛好的我們', summary: '聊聊生活、交換近況，平凡的一天也值得好好記得。', image: photos.picnic, count: '18 張照片' },
  { id: 3, date: '2026.06.07', year: '2026', tag: '旅行紀事', title: '沿著海岸，把夏天收藏', summary: '海風、笑聲和路上的小小意外，組成獨一無二的記憶。', image: photos.coast, count: '36 張照片' }
];

function Arrow({ diagonal = false }) { return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>; }

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [year, setYear] = useState('全部');
  const filtered = year === '全部' ? events : events.filter(event => event.year === year);

  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <>
      <div className="demo-banner">展示版本｜目前活動、日期與照片皆為示範內容，尚未連接 Firebase</div>
      <header className="site-header">
        <button className="brand" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); }} aria-label="回到首頁">
          <span className="brand-mark">日</span><span className="brand-text"><strong>日子有光</strong><small>MEMORY ARCHIVE</small></span>
        </button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="主選單">
          <button onClick={() => go('story')}>關於這裡</button><button onClick={() => go('memories')}>活動紀錄</button><button onClick={() => go('gallery')}>回憶片刻</button><button onClick={() => go('closing')}>一起收藏</button>
        </nav>
        <button className="header-action" onClick={() => go('memories')}>探索回憶 <Arrow diagonal /></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? '關閉選單' : '開啟選單'}>{menuOpen ? '✕' : '☰'}</button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <img className="hero-img" src={photos.hero} alt="湖畔山巒和安靜的自然風景" />
          <div className="hero-shade"></div>
          <div className="hero-content">
            <p className="eyebrow light">THE DAYS WE SHARE · 2026</p>
            <h1 id="hero-heading">那些一起走過的日子，<br /><em>都有光。</em></h1>
            <p className="hero-sub">把相聚的溫度，收藏成可以再次翻閱的故事。<br />這裡記得每一場相遇，和每一個認真生活的我們。</p>
            <button className="hero-button" onClick={() => go('memories')}>走進我們的故事 <span>↗</span></button>
          </div>
          <div className="hero-side">A COLLECTION OF OUR MOMENTS　／　VOL. 01</div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-line"></span><span>01 / 04</span></div>
        </section>

        <section className="intro section-wrap" id="story">
          <div className="intro-side"><span className="section-index">01 — THE MEANING</span><div className="sun-symbol">✳</div></div>
          <div className="intro-main"><p className="eyebrow">A PLACE TO REMEMBER</p><h2>日子會往前，<br />故事可以<span className="accent-underline">留下來。</span></h2>
            <p>有些快樂，藏在照片裡。<br />有些感動，要過了很久才慢慢明白。</p>
            <p>我們把每次相聚的片刻收進這裡，讓那些一起笑過、走過、感受過的日子，不只留在記憶裡，也成為未來回望時的一份溫柔。</p>
            <div className="handwritten">Remember the little things.</div>
          </div>
          <div className="intro-stamp"><span>EVERY<br />MOMENT<br />MATTERS</span><span>✷</span></div>
        </section>

        <section className="memories" id="memories">
          <div className="section-wrap">
            <div className="section-heading"><div><p className="eyebrow">02 — OUR JOURNAL</p><h2>最近的<span className="italic-heading">相聚故事</span></h2><p className="heading-sub">每一次相見，都是值得收藏的篇章。</p></div>
              <div className="years" role="group" aria-label="年份篩選">{['全部','2026'].map(y => <button key={y} className={year === y ? 'active' : ''} onClick={() => setYear(y)}>{y === '全部' ? '所有年份' : y}</button>)}</div>
            </div>
            <div className="event-grid">{filtered.map((event, i) => <article className="event-card" key={event.id}>
              <button className="event-photo" onClick={() => setSelectedEvent(event)} aria-label={`查看${event.title}`}>
                <img loading="lazy" src={event.image} alt={event.title + '示範配圖'} /><span className="photo-number">0{i+1}</span><span className="photo-more"><Arrow diagonal /></span>
              </button>
              <div className="event-meta"><span>{event.date}</span><span className="meta-dot">•</span><span>{event.tag}</span></div>
              <button className="event-title" onClick={() => setSelectedEvent(event)}>{event.title}</button>
              <p className="event-summary">{event.summary}</p>
              <div className="event-footer"><span>{event.count} · 示範內容</span><button onClick={() => setSelectedEvent(event)}>閱讀故事 <Arrow /></button></div>
            </article>)}</div>
            <div className="center-footnote">— 更多真實活動，將在正式上線後陸續收藏 —</div>
          </div>
        </section>

        <section className="quote-band"><div className="section-wrap quote-inner"><span>“</span><p>多年以後，讓我們仍能記得，<br />那一天的風，和彼此的笑容。</p><div className="quote-caption">FOR EVERY MEMORY WE MADE TOGETHER</div></div></section>

        <section className="gallery section-wrap" id="gallery">
          <div className="section-heading gallery-title"><div><p className="eyebrow">03 — LITTLE MOMENTS</p><h2>那些<span className="italic-heading">剛好的瞬間</span></h2><p className="heading-sub">不需要特別的理由，日常就很值得紀念。</p></div><div className="gallery-label">PHOTO DIARY<br />2026 COLLECTION</div></div>
          <div className="gallery-grid"><figure className="gallery-main"><img loading="lazy" src={photos.lake} alt="高山湖泊示範風景照片" /><figcaption>01 / 路上的風景</figcaption></figure><figure><img loading="lazy" src={photos.flowers} alt="山巒自然示範風景照片" /><figcaption>02 / 生活的留白</figcaption></figure><figure><img loading="lazy" src={photos.picnic} alt="咖啡示範照片" /><figcaption>03 / 一起喝杯咖啡</figcaption></figure></div>
          <p className="photo-notice">※ 本頁照片為示意圖片，並非團體實際活動紀錄。</p>
        </section>

        <section className="closing" id="closing"><div className="closing-ornament">✳</div><p className="eyebrow">TO BE CONTINUED</p><h2>故事還在繼續，<br />下次也一起吧。</h2><p>每一個今天，都可能是未來最想念的那一天。</p><button onClick={() => go('memories')}>再翻翻我們的故事 <Arrow diagonal /></button><div className="closing-small">WITH LOVE, FROM ALL OF US.</div></section>
      </main>
      <footer><div className="footer-brand"><span className="brand-mark">日</span><div><strong>日子有光</strong><small>把每一段相聚，收藏成光。</small></div></div><div className="footer-right"><span>© 2026 MEMORY ARCHIVE</span><span>一個關於我們的故事收藏所</span></div></footer>

      {selectedEvent && <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}><section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="關閉">✕</button><img src={selectedEvent.image} alt={selectedEvent.title + '示意圖片'} /><div className="modal-content"><p className="eyebrow">{selectedEvent.date} · {selectedEvent.tag}</p><h2 id="modal-title">{selectedEvent.title}</h2><p>{selectedEvent.summary}</p><div className="modal-note">這是首頁互動示範。真實活動詳情、相簿、心得與影片將在下一階段加入。</div><button onClick={() => setSelectedEvent(null)}>回到首頁 <Arrow /></button></div>
      </section></div>}
    </>
  );
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
