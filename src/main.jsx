import React, { useState, useEffect } from 'react';
import { loadPublishedEvents } from './archiveData';
import { createRoot } from 'react-dom/client';
import defaultEventCover from './assets/default-event-cover.svg';
import originalBrandMark from './assets/complete-life-original-mark.png';
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
const demoEvents = [
  { id: 1, date: '2026.10.24', year: '2026', tag: '戶外日常', title: '在秋天，遇見慢下來的自己', summary: '走進山裡，讓風景替我們留下一段安靜的時間。', image: photos.forest, count: '24 張照片' },
  { id: 2, date: '2026.08.16', year: '2026', tag: '相聚時光', title: '午後的咖啡，剛好的我們', summary: '聊聊生活、交換近況，平凡的一天也值得好好記得。', image: photos.picnic, count: '18 張照片' },
  { id: 3, date: '2026.06.07', year: '2026', tag: '旅行紀事', title: '沿著海岸，把夏天收藏', summary: '海風、笑聲和路上的小小意外，組成獨一無二的記憶。', image: photos.coast, count: '36 張照片' }
];

function Arrow({ diagonal = false }) { return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>; }

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><img src={originalBrandMark} alt="" /><svg className="brand-light" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="5" fill="#e4b961"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6.2 6.2l3.5 3.5M22.3 22.3l3.5 3.5M25.8 6.2l-3.5 3.5M9.7 22.3l-3.5 3.5" stroke="#d8a74e" strokeWidth="2.3" strokeLinecap="round"/></svg></span>;
}

function youtubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    let id = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      const parts = url.pathname.split('/');
      id = url.pathname === '/watch' ? url.searchParams.get('v') : (['embed', 'shorts', 'live'].includes(parts[1]) ? parts[2] : null);
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? `https://www.youtube.com/embed/${id}` : null;
  } catch { return null; }
}

const withoutEndingPunctuation = value => String(value || '').replace(/[。！？!?.,，、；;：:]+(?=\s*(?:\n|$))/g, '');

function EventVideo({ url, title }) {
  if (!url || !/^https:\/\//.test(url)) return null;
  const embedUrl = youtubeEmbedUrl(url);
  if (embedUrl) return <div className="event-video"><h3>活動影片</h3><div className="youtube-frame"><iframe src={embedUrl} title={`${title} 活動影片`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div>;
  if (/\.mp4(?:[?#]|$)/i.test(url)) return <div className="event-video"><h3>活動影片</h3><video controls playsInline preload="metadata" src={url}>你的瀏覽器無法播放這段影片</video></div>;
  return <p><a href={url} target="_blank" rel="noopener noreferrer">觀看活動影片 ↗</a></p>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [year, setYear] = useState('全部');
  const [category, setCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState(demoEvents);
  const [isDemo, setIsDemo] = useState(true);
  const [dataNotice, setDataNotice] = useState('');
  useEffect(() => {
    let mounted = true;
    loadPublishedEvents().then(items => {
      if (!mounted) return;
      if (items.length) {
        setEvents(items);
        setIsDemo(false);
        setDataNotice('');
      } else {
        setDataNotice('目前沒有公開發布的正式活動，以下繼續展示示範內容');
      }
    }).catch(() => {
      if (mounted) setDataNotice('正式活動尚未開放讀取，以下繼續展示示範內容');
    });
    return () => { mounted = false; };
  }, []);
  const years = ['全部', ...new Set(events.map(e => e.year).filter(Boolean))].sort((a,b) => a === '全部' ? -1 : b === '全部' ? 1 : b.localeCompare(a));
  const categories = ['全部', ...new Set(events.map(e => e.tag).filter(Boolean))];
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filtered = events.filter(event =>
    (year === '全部' || event.year === year) &&
    (category === '全部' || event.tag === category) &&
    (!normalizedSearch || [event.title, event.summary, event.tag, event.date].join(' ').toLocaleLowerCase().includes(normalizedSearch))
  );

  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <>
      <div className="demo-banner">{isDemo ? '展示版本｜目前活動、日期與照片皆為示範內容' : '公開活動｜僅顯示已發布內容'}</div>
      <header className="site-header">
        <button className="brand" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); }} aria-label="回到首頁">
          <BrandMark /><span className="brand-text"><strong>圓滿</strong><small>COMPLETE LIFE</small></span>
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
            <h1 id="hero-heading">那些一起走過的日子<br /><em>都有光</em></h1>
            <p className="hero-sub">把相聚的溫度，收藏成可以再次翻閱的故事<br />這裡記得每一場相遇，和每一個認真生活的我們</p>
            <button className="hero-button" onClick={() => go('memories')}>走進我們的故事 <span>↗</span></button>
          </div>
          <div className="hero-side">A COLLECTION OF OUR MOMENTS　／　VOL. 01</div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-line"></span><span>01 / 04</span></div>
        </section>

        <section className="intro section-wrap" id="story">
          <div className="intro-side"><span className="section-index">01 — THE MEANING</span><div className="sun-symbol">✳</div></div>
          <div className="intro-main"><p className="eyebrow">A PLACE TO REMEMBER</p><h2>日子會往前<br />故事可以<span className="accent-underline">留下來</span></h2>
            <p>有些快樂，藏在照片裡<br />有些感動，要過了很久才慢慢明白</p>
            <p>我們把每次相聚的片刻收進這裡，讓那些一起笑過、走過、感受過的日子，不只留在記憶裡，也成為未來回望時的一份溫柔</p>
            <div className="handwritten">Remember the little things</div>
          </div>
          <div className="intro-stamp"><span>EVERY<br />MOMENT<br />MATTERS</span><span>✷</span></div>
        </section>

        <section className="memories" id="memories">
          <div className="section-wrap">
            <div className="section-heading"><div><p className="eyebrow">02 — OUR JOURNAL</p><h2>最近的<span className="italic-heading">相聚故事</span></h2><p className="heading-sub">每一次相見，都是值得收藏的篇章</p></div>
              <div className="years" role="group" aria-label="年份篩選">{years.map(y => <button key={y} className={year === y ? 'active' : ''} onClick={() => setYear(y)}>{y === '全部' ? '所有年份' : y}</button>)}</div>
            </div>
            <div className="event-controls">
              <label className="search-field"><span>搜尋活動</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="輸入活動名稱、日期或關鍵字…" /></label>
              <label className="category-field"><span>活動分類</span><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(t => <option key={t} value={t}>{t === '全部' ? '所有分類' : t}</option>)}</select></label>
              {(search || category !== '全部' || year !== '全部') && <button className="clear-filters" onClick={() => {setSearch('');setCategory('全部');setYear('全部');}}>清除篩選</button>}
            </div>
            {dataNotice && <p className="data-notice" role="status">{dataNotice}</p>}
            <div className="result-summary" aria-live="polite">找到 {filtered.length} 場活動</div>
            <div className="event-grid">{filtered.map((event, i) => <article className="event-card" key={event.id}>
              <button className="event-photo" onClick={() => setSelectedEvent(event)} aria-label={`查看${event.title}`}>
                <img loading="lazy" src={event.image?.trim() || defaultEventCover} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = defaultEventCover; }} alt={event.title + (isDemo ? '示範配圖' : '活動封面')} /><span className="photo-number">0{i+1}</span><span className="photo-more"><Arrow diagonal /></span>
              </button>
              <div className="event-meta"><span>{event.date}</span><span className="meta-dot">•</span><span>{event.tag}</span></div>
              <button className="event-title" onClick={() => setSelectedEvent(event)}>{withoutEndingPunctuation(event.title)}</button>
              <p className="event-summary">{withoutEndingPunctuation(event.summary)}</p>
              <div className="event-footer"><span>{event.count}{isDemo ? ' · 示範內容' : ''}</span><button onClick={() => setSelectedEvent(event)}>閱讀故事 <Arrow /></button></div>
            </article>)}</div>
            {filtered.length === 0 && <div className="no-events"><h3>還沒找到符合條件的活動</h3><p>可以試著調整關鍵字或清除篩選條件</p><button onClick={() => {setSearch('');setCategory('全部');setYear('全部');}}>顯示所有活動</button></div>}
            <div className="center-footnote">{isDemo ? '— 更多真實活動，將在正式上線後陸續收藏 —' : '— 謝謝你和我們一起收藏這些片刻 —'}</div>
          </div>
        </section>

        <section className="quote-band"><div className="section-wrap quote-inner"><span>“</span><p>多年以後，讓我們仍能記得<br />那一天的風，和彼此的笑容</p><div className="quote-caption">FOR EVERY MEMORY WE MADE TOGETHER</div></div></section>

        <section className="gallery section-wrap" id="gallery">
          <div className="section-heading gallery-title"><div><p className="eyebrow">03 — LITTLE MOMENTS</p><h2>那些<span className="italic-heading">剛好的瞬間</span></h2><p className="heading-sub">不需要特別的理由，日常就很值得紀念</p></div><div className="gallery-label">PHOTO DIARY<br />2026 COLLECTION</div></div>
          <div className="gallery-grid"><figure className="gallery-main"><img loading="lazy" src={photos.lake} alt="高山湖泊示範風景照片" /><figcaption>01 / 路上的風景</figcaption></figure><figure><img loading="lazy" src={photos.flowers} alt="山巒自然示範風景照片" /><figcaption>02 / 生活的留白</figcaption></figure><figure><img loading="lazy" src={photos.picnic} alt="咖啡示範照片" /><figcaption>03 / 一起喝杯咖啡</figcaption></figure></div>
          <p className="photo-notice">※ 本頁照片為示意圖片，並非團體實際活動紀錄</p>
        </section>

        <section className="closing" id="closing"><div className="closing-ornament">✳</div><p className="eyebrow">TO BE CONTINUED</p><h2>故事還在繼續<br />下次也一起吧</h2><p>每一個今天，都可能是未來最想念的那一天</p><button onClick={() => go('memories')}>再翻翻我們的故事 <Arrow diagonal /></button><div className="closing-small">WITH LOVE, FROM ALL OF US</div></section>
      </main>
      <footer><div className="footer-brand"><BrandMark /><div><strong>圓滿</strong><small>把每一段相聚，收藏成光</small></div></div><div className="footer-right"><span>© 2026 COMPLETE LIFE</span><span>一個關於我們的故事收藏所</span></div></footer>

      {selectedEvent && <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}><section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="關閉">✕</button><img src={selectedEvent.image?.trim() || defaultEventCover} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = defaultEventCover; }} alt={selectedEvent.title + (isDemo ? '示意圖片' : '活動封面')} /><div className="modal-content"><p className="eyebrow">{selectedEvent.date} · {selectedEvent.tag}</p><h2 id="modal-title">{withoutEndingPunctuation(selectedEvent.title)}</h2><p>{withoutEndingPunctuation(selectedEvent.story || selectedEvent.summary)}</p>
          {selectedEvent.location && <p className="event-location">地點｜{selectedEvent.location}</p>}
          {selectedEvent.photos?.length > 0 && <div className="modal-gallery">{selectedEvent.photos.map((url,i) => <img key={i} loading="lazy" src={url} alt={selectedEvent.title + '照片 ' + (i+1)} />)}</div>}
          <EventVideo url={selectedEvent.videoUrl} title={selectedEvent.title} />
          {isDemo && <div className="modal-note">這是示範活動，正式活動的照片、故事與影片將由管理員審核發布後顯示</div>}<button onClick={() => setSelectedEvent(null)}>回到首頁 <Arrow /></button></div>
      </section></div>}
    </>
  );
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
