import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  ExternalLink,
  Flower2,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import pandalData from './data/pandals.json';
import MapErrorBoundary from './components/MapErrorBoundary.jsx';

const PandalMap = lazy(() => import('./components/PandalMap.jsx'));
const INITIAL_VISIBLE = 12;

const copy = {
  en: {
    title: 'Bangaon Durga Puja 2026',
    language: 'বাংলা',
    languageLabel: 'Switch language to Bengali',
    guide: 'YOUR LOCAL PUJA COMPANION',
    heading: 'Find your Puja pandal',
    subtitle: 'Explore Durga Puja pandals around Bangaon and get there with confidence.',
    searchPlaceholder: 'Search pandal name or locality…',
    searchLabel: 'Search by pandal name or locality',
    allPandals: 'pandal locations in this guide',
    resultFor: 'results for',
    useLocation: 'Use my location',
    liveOn: 'Live location on',
    stopLocation: 'Stop live location',
    findingLocation: 'Finding your location…',
    locationExplainer: 'Allow location access to see your position on the map and sort nearby pandals first.',
    locationOn: 'Your location is updating. Nearby results are sorted by straight-line distance.',
    locationOff: 'Live location is off. Your position is not being tracked.',
    locationPermission: 'Location access was denied. Allow it in your browser settings, then try again. You can still search and get directions.',
    locationUnavailable: 'Your location could not be determined. Check your device location settings or try again outdoors.',
    locationTimeout: 'Location request timed out. Try again when you have a clearer GPS signal.',
    locationUnsupported: 'This browser does not support location access. You can still search and open directions.',
    locationSecure: 'For your privacy and browser security, location access usually requires HTTPS (or localhost).',
    list: 'List',
    map: 'Map',
    showing: 'Showing',
    of: 'of',
    pandals: 'pandals',
    noResults: 'No matching pandals found',
    noResultsHelp: 'Try a shorter name, a different spelling, or a locality from the address.',
    clearSearch: 'Clear search',
    showMore: 'Show more pandals',
    showLess: 'Show fewer',
    getDirections: 'Get directions',
    share: 'Share',
    coordinatesNotice: 'Coordinates are supplied in the source data and have not been independently verified.',
    coordinatesMissing: 'Directions unavailable: valid coordinates were not provided for this pandal.',
    area: 'Area',
    straightLine: 'straight-line distance',
    metres: 'm away',
    kmAway: 'km away',
    unnamedPandal: 'Pandal name unavailable',
    yourLiveLocation: 'Your live location',
    mapLoading: 'Loading interactive map…',
    mapFailed: 'The map could not be loaded. Search and the pandal list are still available.',
    showList: 'Show list instead',
    dataSource: 'Location data: uploaded Bangaon Durga Puja map dataset',
    privacy: 'Your location stays in this browser and is not sent to our server by this website.',
    footerNote: 'Community guide · Check the destination pin before travelling',
    developerCredit: 'Designed & developed by Debjoitee Biswas',
    helpHeading: 'Important help lines',
    helpIntro: 'Tap a number to call from your phone. For urgent emergencies, call 112.',
    emergencyLabel: 'National Emergency Response',
    emergencyNote: 'Police, fire and medical emergencies',
    childLabel: 'Child Helpline',
    childNote: 'Help and protection for children',
    cyberLabel: 'Cybercrime Helpline',
    cyberNote: 'Report online financial cyber fraud',
    policeLabel: 'Police (listed in supplied PDF)',
    policeNote: 'For urgent help, call 112',
    controlRoomLabel: 'Bongaon Police District Control Room',
    mahilaLabel: 'Mahila Sahayata Number',
    localNumbersNotice: 'The local contact numbers are reproduced from page 5 of the PDF you supplied. We could not independently confirm them; verify with Bongaon Police District before public use.',
    cyberPortal: 'Cybercrime reporting portal',
    officialLinks: 'Official help links',
    independentNotice: 'Independent community guide; not an official police or government website.',
    shareCopied: 'Directions link copied.',
    shareFailed: 'Unable to share this link from the browser.',
    shareText: 'Find this Puja pandal in Bangaon',
    selected: 'Selected pandal',
    searchHint: 'Search by the name or locality as it appears in the supplied dataset.',
    allLocations: 'All locations',
    nearest: 'Sorted nearby first',
    locationPrivacy: 'Location is only accessed after you tap the button. Stop live location any time.',
  },
  bn: {
    title: 'বনগাঁ দুর্গাপুজো ২০২৬',
    language: 'English',
    languageLabel: 'ভাষা ইংরেজিতে পরিবর্তন করুন',
    guide: 'আপনার এলাকার পুজো গাইড',
    heading: 'আপনার পুজো প্যান্ডেল খুঁজুন',
    subtitle: 'বনগাঁর দুর্গাপুজোর প্যান্ডেল খুঁজুন এবং সহজে সেখানে পৌঁছে যান।',
    searchPlaceholder: 'প্যান্ডেলের নাম বা এলাকার নাম লিখুন…',
    searchLabel: 'প্যান্ডেলের নাম বা এলাকা দিয়ে খুঁজুন',
    allPandals: 'টি প্যান্ডেলের অবস্থান এই গাইডে রয়েছে',
    resultFor: 'অনুসন্ধানের ফলাফল:',
    useLocation: 'আমার অবস্থান দেখুন',
    liveOn: 'লাইভ অবস্থান চালু',
    stopLocation: 'লাইভ অবস্থান বন্ধ করুন',
    findingLocation: 'আপনার অবস্থান খোঁজা হচ্ছে…',
    locationExplainer: 'মানচিত্রে নিজের অবস্থান দেখতে এবং কাছের প্যান্ডেল আগে পেতে অবস্থানের অনুমতি দিন।',
    locationOn: 'আপনার অবস্থান আপডেট হচ্ছে। সরলরেখার দূরত্ব অনুযায়ী কাছের প্যান্ডেল আগে দেখানো হচ্ছে।',
    locationOff: 'লাইভ অবস্থান বন্ধ। আপনার অবস্থান ট্র্যাক করা হচ্ছে না।',
    locationPermission: 'অবস্থানের অনুমতি দেওয়া হয়নি। ব্রাউজারের সেটিংসে অনুমতি দিয়ে আবার চেষ্টা করুন। তবুও প্যান্ডেল খোঁজা ও রাস্তা দেখা যাবে।',
    locationUnavailable: 'আপনার অবস্থান পাওয়া যায়নি। ফোনের লোকেশন সেটিংস দেখুন অথবা বাইরে থেকে আবার চেষ্টা করুন।',
    locationTimeout: 'অবস্থানের অনুরোধের সময় শেষ হয়েছে। GPS সিগন্যাল ভালো হলে আবার চেষ্টা করুন।',
    locationUnsupported: 'এই ব্রাউজারে অবস্থান দেখার সুবিধা নেই। প্যান্ডেল খোঁজা ও রাস্তা দেখা যাবে।',
    locationSecure: 'ব্রাউজারের নিরাপত্তার জন্য অবস্থান দেখতে সাধারণত HTTPS অথবা localhost প্রয়োজন।',
    list: 'তালিকা',
    map: 'মানচিত্র',
    showing: 'দেখানো হচ্ছে',
    of: 'মোট',
    pandals: 'টি প্যান্ডেল',
    noResults: 'কোনও প্যান্ডেল পাওয়া যায়নি',
    noResultsHelp: 'নামের কিছু অংশ, অন্য বানান অথবা ঠিকানায় থাকা এলাকার নাম দিয়ে চেষ্টা করুন।',
    clearSearch: 'অনুসন্ধান মুছুন',
    showMore: 'আরও প্যান্ডেল দেখুন',
    showLess: 'কম দেখুন',
    getDirections: 'রাস্তা দেখুন',
    share: 'শেয়ার',
    coordinatesNotice: 'অবস্থানের স্থানাঙ্ক উৎসের ডেটা থেকে নেওয়া; স্বাধীনভাবে যাচাই করা হয়নি।',
    coordinatesMissing: 'রাস্তা দেখানো যাচ্ছে না: এই প্যান্ডেলের বৈধ স্থানাঙ্ক দেওয়া নেই।',
    area: 'এলাকা',
    straightLine: 'সরলরেখার দূরত্ব',
    metres: 'মিটার দূরে',
    kmAway: 'কিমি দূরে',
    unnamedPandal: 'প্যান্ডেলের নাম পাওয়া যায়নি',
    yourLiveLocation: 'আপনার বর্তমান অবস্থান',
    mapLoading: 'ইন্টারঅ্যাক্টিভ মানচিত্র লোড হচ্ছে…',
    mapFailed: 'মানচিত্র লোড করা যায়নি। তবে প্যান্ডেলের তালিকা ও অনুসন্ধান ব্যবহার করা যাবে।',
    showList: 'পরিবর্তে তালিকা দেখুন',
    dataSource: 'অবস্থানের ডেটা: আপলোড করা বনগাঁ দুর্গাপুজো মানচিত্র',
    privacy: 'এই ওয়েবসাইট আপনার অবস্থান ব্রাউজারেই রাখে, সার্ভারে পাঠায় না।',
    footerNote: 'স্থানীয় গাইড · রওনা হওয়ার আগে মানচিত্রের পিন মিলিয়ে নিন',
    developerCredit: 'পরিকল্পনা ও নির্মাণ: Debjoitee Biswas',
    helpHeading: 'জরুরি সহায়তার নম্বর',
    helpIntro: 'মোবাইল থেকে কল করতে নম্বরে চাপ দিন। জরুরি পরিস্থিতিতে ১১২ নম্বরে কল করুন।',
    emergencyLabel: 'জাতীয় জরুরি সহায়তা',
    emergencyNote: 'পুলিশ, দমকল ও চিকিৎসা জরুরি পরিষেবা',
    childLabel: 'শিশু সহায়তা নম্বর',
    childNote: 'শিশুর নিরাপত্তা ও সুরক্ষার জন্য',
    cyberLabel: 'সাইবার অপরাধ হেল্পলাইন',
    cyberNote: 'অনলাইন আর্থিক সাইবার জালিয়াতির অভিযোগ',
    policeLabel: 'পুলিশ (প্রদত্ত PDF-এ উল্লিখিত)',
    policeNote: 'জরুরি সাহায্যের জন্য ১১২ নম্বরে কল করুন',
    controlRoomLabel: 'বনগাঁ পুলিশ জেলা কন্ট্রোল রুম',
    mahilaLabel: 'মহিলা সহায়তা নম্বর',
    localNumbersNotice: 'স্থানীয় যোগাযোগের নম্বরগুলি আপনার দেওয়া PDF-এর ৫ নম্বর পৃষ্ঠা থেকে নেওয়া। আমরা এগুলি স্বাধীনভাবে যাচাই করতে পারিনি; প্রকাশের আগে বনগাঁ পুলিশ জেলার সঙ্গে যাচাই করুন।',
    cyberPortal: 'সাইবার অপরাধ অভিযোগের পোর্টাল',
    officialLinks: 'সরকারি সহায়তার লিঙ্ক',
    independentNotice: 'এটি একটি স্বাধীন স্থানীয় গাইড; সরকারি বা পুলিশ বিভাগের অফিসিয়াল ওয়েবসাইট নয়।',
    shareCopied: 'রাস্তার লিঙ্ক কপি হয়েছে।',
    shareFailed: 'এই ব্রাউজার থেকে লিঙ্ক শেয়ার করা যায়নি।',
    shareText: 'বনগাঁর এই পুজো প্যান্ডেলটি খুঁজুন',
    selected: 'নির্বাচিত প্যান্ডেল',
    searchHint: 'আপলোড করা ডেটাসেটে যে নাম বা এলাকার বানান রয়েছে, সেটি দিয়ে খুঁজুন।',
    allLocations: 'সব অবস্থান',
    nearest: 'কাছের প্যান্ডেল আগে',
    locationPrivacy: 'আপনি বোতামে চাপলেই শুধু অবস্থান নেওয়া হবে। যেকোনও সময় লাইভ অবস্থান বন্ধ করতে পারেন।',
  },
};

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function distanceBetween(a, b) {
  if (!a || !b || ![a.latitude, a.longitude, b.latitude, b.longitude].every(Number.isFinite)) return null;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const radius = 6371000;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const startLat = radians(a.latitude);
  const endLat = radians(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(Math.min(1, h)));
}

function formatDistance(metres, language) {
  if (!Number.isFinite(metres)) return null;
  const locale = language === 'bn' ? 'bn-IN' : 'en-IN';
  if (metres < 1000) {
    return `${Math.round(metres).toLocaleString(locale)} ${copy[language].metres}`;
  }
  return `${(metres / 1000).toLocaleString(locale, { maximumFractionDigits: 1 })} ${copy[language].kmAway}`;
}

function directionsUrl(pandal) {
  if (!Number.isFinite(pandal.latitude) || !Number.isFinite(pandal.longitude)) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;
}

function LocationButton({ locationState, onClick, t }) {
  const isActive = locationState === 'active';
  const isRequesting = locationState === 'requesting';
  return (
    <button
      type="button"
      className={`button button-location ${isActive ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {isRequesting ? <span className="mini-spinner" aria-hidden="true" /> : <LocateFixed size={18} aria-hidden="true" />}
      <span>{isRequesting ? t.findingLocation : isActive ? t.stopLocation : t.useLocation}</span>
    </button>
  );
}

function PandalCard({ pandal, distance, language, t, selected, onSelect, onShare }) {
  const navUrl = directionsUrl(pandal);
  const name = pandal.name || t.unnamedPandal;
  return (
    <article className={`pandal-card ${selected ? 'is-selected' : ''}`}>
      <button className="card-main" type="button" onClick={() => onSelect(pandal.id)} aria-pressed={selected}>
        <span className="card-pin" aria-hidden="true"><MapPin size={19} /></span>
        <span className="card-info">
          <span className="card-title">{name}</span>
          {pandal.address && <span className="card-address">{pandal.address}</span>}
          {pandal.areaOrJurisdiction && (
            <span className="card-area"><span>{t.area}:</span> {pandal.areaOrJurisdiction}</span>
          )}
          {distance != null && <span className="distance-label"><Compass size={13} aria-hidden="true" /> {formatDistance(distance, language)} <span className="distance-footnote">· {t.straightLine}</span></span>}
        </span>
        <ChevronDown size={17} className={`card-chevron ${selected ? 'rotated' : ''}`} aria-hidden="true" />
      </button>
      <div className="card-bottom">
        <span className="unverified-label" title={t.coordinatesNotice}><span className="status-dot" />{language === 'bn' ? 'স্থানাঙ্ক যাচাই হয়নি' : 'Coordinates not verified'}</span>
        <div className="card-actions">
          <button className="text-action" type="button" onClick={() => onShare(pandal)} aria-label={`${t.share}: ${name}`}>
            <Share2 size={15} aria-hidden="true" /> <span>{t.share}</span>
          </button>
          {navUrl ? (
            <a className="button button-directions" href={navUrl} target="_blank" rel="noreferrer" aria-label={`${t.getDirections}: ${name}`}>
              <Navigation size={15} aria-hidden="true" /> <span>{t.getDirections}</span> <ExternalLink size={12} aria-hidden="true" />
            </a>
          ) : (
            <button className="button button-directions" type="button" disabled title={t.coordinatesMissing}>
              <Navigation size={15} aria-hidden="true" /> <span>{t.getDirections}</span>
            </button>
          )}
        </div>
      </div>
      {selected && (
        <div className="card-selected-note">
          <Check size={14} aria-hidden="true" /> {t.selected}
          {!navUrl && <span>{t.coordinatesMissing}</span>}
        </div>
      )}
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const [selectedId, setSelectedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationState, setLocationState] = useState('off');
  const [locationMessage, setLocationMessage] = useState('');
  const [toast, setToast] = useState('');
  const watchIdRef = useRef(null);
  const toastRef = useRef(null);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
    document.title = `${copy[language].title} | Bangaon Durga Puja Guide`;
  }, [language]);

  useEffect(() => () => {
    if (watchIdRef.current != null && navigator.geolocation) navigator.geolocation.clearWatch(watchIdRef.current);
    if (toastRef.current) window.clearTimeout(toastRef.current);
  }, []);

  const filteredPandals = useMemo(() => {
    const needle = normalize(query);
    const matches = pandalData.filter((pandal) => {
      if (!needle) return true;
      return normalize(`${pandal.name} ${pandal.address} ${pandal.areaOrJurisdiction} ${pandal.id}`).includes(needle);
    });
    if (currentPosition) {
      return matches
        .map((pandal) => ({ ...pandal, distanceMetres: distanceBetween(currentPosition, { latitude: pandal.latitude, longitude: pandal.longitude }) }))
        .sort((a, b) => {
          if (a.distanceMetres == null) return 1;
          if (b.distanceMetres == null) return -1;
          return a.distanceMetres - b.distanceMetres;
        });
    }
    return matches;
  }, [query, currentPosition]);

  const visiblePandals = filteredPandals.slice(0, visibleCount);
  const selectedPandal = filteredPandals.find((pandal) => pandal.id === selectedId) ?? null;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
    setSelectedId(null);
  }, [query]);

  function stopLocation() {
    if (watchIdRef.current != null && navigator.geolocation) navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setLocationState('off');
    setCurrentPosition(null);
    setLocationMessage(t.locationOff);
  }

  function toggleLocation() {
    if (locationState === 'active' || locationState === 'requesting') {
      stopLocation();
      return;
    }
    setLocationMessage('');
    if (!('geolocation' in navigator)) {
      setLocationState('off');
      setLocationMessage(t.locationUnsupported);
      return;
    }
    if (!window.isSecureContext) {
      setLocationState('off');
      setLocationMessage(t.locationSecure);
      return;
    }
    setLocationState('requesting');
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
          setLocationState('active');
          setLocationMessage(t.locationOn);
        },
        (error) => {
          if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
          setLocationState('off');
          setCurrentPosition(null);
          if (error.code === error.PERMISSION_DENIED) setLocationMessage(t.locationPermission);
          else if (error.code === error.TIMEOUT) setLocationMessage(t.locationTimeout);
          else setLocationMessage(t.locationUnavailable);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
      );
    } catch {
      setLocationState('off');
      setLocationMessage(t.locationUnavailable);
    }
  }

  async function sharePandal(pandal) {
    const url = directionsUrl(pandal) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pandal.name}, ${pandal.address}, Bangaon`)}`;
    const title = pandal.name || t.unnamedPandal;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${t.shareText}: ${title}`, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setToast(t.shareCopied);
      } else {
        window.prompt(t.share, url);
        return;
      }
      if (toastRef.current) window.clearTimeout(toastRef.current);
      toastRef.current = window.setTimeout(() => setToast(''), 2600);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setToast(t.shareFailed);
        if (toastRef.current) window.clearTimeout(toastRef.current);
        toastRef.current = window.setTimeout(() => setToast(''), 3000);
      }
    }
  }

  function handleSelect(id) {
    setSelectedId((previous) => previous === id ? null : id);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label={t.title}>
          <span className="brand-mark"><Flower2 size={23} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="brand-copy">
            <strong>{t.title}</strong>
            <span>{language === 'bn' ? 'বনগাঁ · পশ্চিমবঙ্গ' : 'Bangaon · West Bengal'}</span>
          </span>
        </a>
        <div className="topbar-actions">
          <span className="season-chip"><Sparkles size={13} aria-hidden="true" /> 2026</span>
          <button className="language-button" type="button" onClick={() => setLanguage((current) => current === 'en' ? 'bn' : 'en')} aria-label={t.languageLabel}>
            <span className="language-globe" aria-hidden="true">文</span>{t.language}
          </button>
        </div>
      </header>

      <main id="top" className="page-main">
        <section className="banner-wrap" aria-label={t.title}>
          <picture>
            <source
              type="image/webp"
              srcSet="/images/banner-480w.webp 480w, /images/banner-768w.webp 768w, /images/banner-1024w.webp 1024w, /images/banner-1440w.webp 1440w, /images/banner-1774w.webp 1774w"
              sizes="(max-width: 700px) 100vw, calc(100vw - 48px)"
            />
            <img className="banner-image" src="/images/banner-1024w.webp" alt="Bangaon Durga Puja Guide 2026 — illuminated pandals, Durga idol and map navigation" fetchPriority="high" decoding="async" />
          </picture>
          <div className="banner-caption"><span className="banner-caption-dot" />{language === 'bn' ? 'বনগাঁর পুজো দেখুন, সহজে পথ খুঁজুন' : 'Discover Bangaon. Find your route.'}</div>
        </section>

        <section className="search-section" aria-labelledby="search-heading">
          <div className="section-intro">
            <div className="eyebrow"><span className="eyebrow-line" />{t.guide}</div>
            <h1 id="search-heading">{t.heading}</h1>
            <p>{t.subtitle}</p>
          </div>

          <div className="search-location-row">
            <label className="search-box">
              <Search size={21} aria-hidden="true" />
              <span className="sr-only">{t.searchLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                autoComplete="off"
                aria-controls="pandal-results"
              />
              {query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label={t.clearSearch}><X size={17} /></button>}
              <kbd className="search-shortcut"><span>⌕</span></kbd>
            </label>
            <LocationButton locationState={locationState} onClick={toggleLocation} t={t} />
          </div>

          <div className="helper-line">
            <span className="helper-icon"><LocateFixed size={14} aria-hidden="true" /></span>
            <span>{locationState === 'active' ? t.locationOn : t.locationExplainer}</span>
          </div>
          {locationMessage && (
            <div className={`location-message ${locationState === 'active' ? 'message-success' : ''}`} role="status">
              <span className="message-indicator" />
              <span>{locationMessage}</span>
              {locationState === 'off' && currentPosition && <button type="button" className="dismiss-message" onClick={() => setLocationMessage('')} aria-label={language === 'bn' ? 'বার্তা বন্ধ করুন' : 'Dismiss message'}><X size={15} /></button>}
            </div>
          )}

          <div className="results-toolbar">
            <div className="result-summary" aria-live="polite" aria-atomic="true">
              <span className="result-count">{filteredPandals.length.toLocaleString(language === 'bn' ? 'bn-IN' : 'en-IN')}</span>
              <span>{query ? `${t.resultFor} “${query}”` : t.allPandals}</span>
              {currentPosition && <span className="nearby-tag"><ArrowDownWideNarrow size={13} aria-hidden="true" />{t.nearest}</span>}
            </div>
            <div className="view-switch" role="group" aria-label={language === 'bn' ? 'দেখার ধরন বেছে নিন' : 'Choose display mode'}>
              <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}><SlidersHorizontal size={16} aria-hidden="true" />{t.list}</button>
              <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView('map')} aria-pressed={view === 'map'}><MapIcon size={16} aria-hidden="true" />{t.map}</button>
            </div>
          </div>

          <div className="data-notice"><span className="notice-mark">i</span><span>{t.coordinatesNotice}</span></div>

          {filteredPandals.length === 0 ? (
            <div className="empty-state" id="pandal-results">
              <span className="empty-icon"><Search size={25} /></span>
              <h2>{t.noResults}</h2>
              <p>{t.noResultsHelp}</p>
              <button type="button" className="button button-outline" onClick={() => setQuery('')}>{t.clearSearch}</button>
            </div>
          ) : view === 'map' ? (
            <div className="map-layout" id="pandal-results">
              <section className="map-frame" aria-label={t.map}>
                <div className="map-status-pill"><span className="map-status-dot" />{currentPosition ? t.liveOn : t.allLocations}</div>
                <MapErrorBoundary fallback={<div className="map-fallback"><MapPin size={28} /><p>{t.mapFailed}</p><button type="button" className="button button-outline" onClick={() => setView('list')}>{t.showList}</button></div>}>
                  <Suspense fallback={<div className="map-fallback"><span className="mini-spinner" /><p>{t.mapLoading}</p></div>}>
                    <PandalMap pandals={filteredPandals} selectedId={selectedId} onSelect={setSelectedId} currentPosition={currentPosition} language={language} t={t} />
                  </Suspense>
                </MapErrorBoundary>
                <div className="map-footnote"><MapPin size={13} aria-hidden="true" />{t.coordinatesNotice}</div>
              </section>
              <section className="map-results-panel" aria-label={t.list}>
                <div className="map-list-heading"><div><h2>{language === 'bn' ? 'প্যান্ডেলের তালিকা' : 'Pandal list'}</h2><p>{filteredPandals.length.toLocaleString(language === 'bn' ? 'bn-IN' : 'en-IN')} {t.pandals}</p></div><span className="mini-count">{Math.min(8, filteredPandals.length)}</span></div>
                <div className="compact-results">
                  {filteredPandals.slice(0, 8).map((pandal) => (
                    <button key={pandal.id} type="button" className={`compact-result ${selectedId === pandal.id ? 'active' : ''}`} onClick={() => setSelectedId(pandal.id)}>
                      <span className="compact-pin"><MapPin size={15} aria-hidden="true" /></span>
                      <span className="compact-copy"><strong>{pandal.name || t.unnamedPandal}</strong><small>{pandal.address || pandal.areaOrJurisdiction}</small>{pandal.distanceMetres != null && <small className="compact-distance">{formatDistance(pandal.distanceMetres, language)}</small>}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                {filteredPandals.length > 8 && <button type="button" className="map-see-all" onClick={() => setView('list')}>{language === 'bn' ? 'সব প্যান্ডেলের তালিকা দেখুন' : 'See all pandals in list'} <ArrowRight size={15} /></button>}
                {selectedPandal && <div className="map-selected-detail"><span className="selected-detail-label">{t.selected}</span><strong>{selectedPandal.name}</strong>{selectedPandal.address && <span>{selectedPandal.address}</span>}{directionsUrl(selectedPandal) && <a href={directionsUrl(selectedPandal)} target="_blank" rel="noreferrer" className="button button-directions"><Navigation size={15} />{t.getDirections}<ExternalLink size={12} /></a>}</div>}
              </section>
            </div>
          ) : (
            <>
              <div className="pandal-grid" id="pandal-results">
                {visiblePandals.map((pandal) => (
                  <PandalCard
                    key={pandal.id}
                    pandal={pandal}
                    distance={pandal.distanceMetres}
                    language={language}
                    t={t}
                    selected={selectedId === pandal.id}
                    onSelect={handleSelect}
                    onShare={sharePandal}
                  />
                ))}
              </div>
              {filteredPandals.length > INITIAL_VISIBLE && (
                <div className="show-more-row">
                  {visibleCount < filteredPandals.length ? (
                    <button type="button" className="button button-more" onClick={() => setVisibleCount((count) => Math.min(count + 12, filteredPandals.length))}>{t.showMore}<ChevronDown size={16} aria-hidden="true" /></button>
                  ) : (
                    <button type="button" className="button button-more" onClick={() => setVisibleCount(INITIAL_VISIBLE)}>{t.showLess}<ChevronDown className="chevron-up" size={16} aria-hidden="true" /></button>
                  )}
                  <span>{t.showing} {Math.min(visibleCount, filteredPandals.length)} {t.of} {filteredPandals.length}</span>
                </div>
              )}
            </>
          )}

          <div className="privacy-strip">
            <span className="privacy-icon"><LocateFixed size={17} aria-hidden="true" /></span>
            <div><strong>{language === 'bn' ? 'আপনার গোপনীয়তা আপনার হাতে' : 'Your location, your choice'}</strong><p>{t.privacy} {t.locationPrivacy}</p></div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="brand-mark footer-mark"><Flower2 size={20} aria-hidden="true" /></span>
              <div><strong>{t.title}</strong><span>{t.footerNote}</span></div>
            </div>
            <div className="footer-author" aria-label={t.developerCredit}>
              <span className="footer-author-kicker">{language === 'bn' ? 'ওয়েবসাইট নির্মাতা' : 'Website creator'}</span>
              <strong>Debjoitee Biswas</strong>
              <span>{language === 'bn' ? 'পরিকল্পনা ও নির্মাণ' : 'Designed & developed'}</span>
            </div>
          </div>

          <section className="footer-help" aria-labelledby="help-heading">
            <div className="footer-help-heading">
              <div>
                <h2 id="help-heading">{t.helpHeading}</h2>
                <p>{t.helpIntro}</p>
              </div>
              <a className="footer-portal-link" href="https://www.cybercrime.gov.in/" target="_blank" rel="noreferrer">
                {t.cyberPortal}<ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
            <div className="help-grid">
              <a className="help-card help-card-primary" href="tel:112">
                <span className="help-label">{t.emergencyLabel}</span><strong>112</strong><small>{t.emergencyNote}</small>
              </a>
              <a className="help-card" href="tel:1098">
                <span className="help-label">{t.childLabel}</span><strong>1098</strong><small>{t.childNote}</small>
              </a>
              <a className="help-card" href="tel:1930">
                <span className="help-label">{t.cyberLabel}</span><strong>1930</strong><small>{t.cyberNote}</small>
              </a>
              <a className="help-card" href="tel:100">
                <span className="help-label">{t.policeLabel}</span><strong>100</strong><small>{t.policeNote}</small>
              </a>
              <a className="help-card help-card-local" href="tel:9147888230">
                <span className="help-label">{t.controlRoomLabel}</span><strong>9147888230</strong><small>{language === 'bn' ? 'প্রদত্ত PDF-এ উল্লিখিত স্থানীয় নম্বর' : 'Local number printed in supplied PDF'}</small>
              </a>
              <a className="help-card help-card-local" href="tel:7319224450">
                <span className="help-label">{t.mahilaLabel}</span><strong>7319224450</strong><small>{language === 'bn' ? 'প্রদত্ত PDF-এ উল্লিখিত স্থানীয় নম্বর' : 'Local number printed in supplied PDF'}</small>
              </a>
            </div>
            <p className="footer-help-notice">{t.localNumbersNotice}</p>
            <div className="footer-official-links">
              <span>{t.officialLinks}:</span>
              <a href="https://112.gov.in/" target="_blank" rel="noreferrer">112.gov.in</a>
              <a href="https://www.wcd.gov.in/child/child-helpline" target="_blank" rel="noreferrer">Child Helpline 1098</a>
              <a href="https://www.cybercrime.gov.in/" target="_blank" rel="noreferrer">cybercrime.gov.in</a>
            </div>
          </section>

          <div className="footer-bottom">
            <span>{t.dataSource}</span>
            <span>© 2026 · Bangaon</span>
            <span>{t.independentNotice}</span>
          </div>
        </footer>
      </main>
      {toast && <div role="status" className="toast-message"><Check size={16} aria-hidden="true" />{toast}</div>}
    </div>
  );
}
