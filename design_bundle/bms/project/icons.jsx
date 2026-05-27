/* ============================
   BMS — Icons (inline SVG)
   stroke icons, 1.6 width
   ============================ */

const Icon = ({ name, size = 18, className = "", style = {} }) => {
  const props = {
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style,
  };
  const paths = {
    home:    <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></>,
    user:    <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    users:   <><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M15 20c0-2.5 2-4.5 5-4.5"/></>,
    bus:     <><rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 12h16"/><circle cx="8" cy="19" r="1.6"/><circle cx="16" cy="19" r="1.6"/><path d="M7 7h4M13 7h4"/></>,
    wrench:  <><path d="M14.7 6.3a4 4 0 015.7 5L11 21l-4-4 9.4-9.4z"/><path d="M7 17l-3 3"/><path d="M10.5 10.5L7 14"/></>,
    coin:    <><circle cx="12" cy="12" r="9"/><path d="M9 9h5a2 2 0 010 4H9"/><path d="M9 13h5a2 2 0 010 4H9"/><path d="M12 6v12"/></>,
    fuel:    <><rect x="4" y="3" width="10" height="18" rx="1.5"/><path d="M4 11h10"/><path d="M14 7l3 2v8a2 2 0 002 2 2 2 0 002-2v-7l-3-3"/></>,
    cap:     <><path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></>,
    id:      <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="M14 10h5"/><path d="M14 13h4"/><path d="M5 17c.7-1.7 2.3-2.7 4-2.7s3.3 1 4 2.7"/></>,
    chat:    <><path d="M21 12a8 8 0 11-3.5-6.6L21 4l-1.4 3.4A8 8 0 0121 12z"/><path d="M8 11h8M8 14h5"/></>,
    shield:  <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></>,
    cart:    <><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11l2-8H6"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8 1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    bell:    <><path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 004 0"/></>,
    search:  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    download:<><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></>,
    filter:  <><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></>,
    chevdown:<><path d="M6 9l6 6 6-6"/></>,
    chevright:<path d="M9 6l6 6-6 6"/>,
    chevleft: <path d="M15 6l-6 6 6 6"/>,
    edit:    <><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/></>,
    eye:     <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    trash:   <><path d="M3 6h18"/><path d="M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    close:   <><path d="M6 6l12 12M18 6L6 18"/></>,
    check:   <><path d="M5 12l5 5L20 7"/></>,
    upload:  <><path d="M5 20h14"/><path d="M12 4v12"/><path d="M7 9l5-5 5 5"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></>,
    snow:    <><path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5"/></>,
    fan:     <><circle cx="12" cy="12" r="1.5"/><path d="M12 11c0-4 2-7 5-7s5 3 5 7-2 7-5 7-5-3-5-7z" transform="rotate(0 12 12)"/><path d="M12 11c0-4 2-7 5-7s5 3 5 7-2 7-5 7-5-3-5-7z" transform="rotate(120 12 12)"/><path d="M12 11c0-4 2-7 5-7s5 3 5 7-2 7-5 7-5-3-5-7z" transform="rotate(240 12 12)"/></>,
    alert:   <><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none"/></>,
    trendup: <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    trenddown:<><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></>,
    factory: <><path d="M3 21V11l5 3V9l5 3V8l5 3v10z"/><path d="M3 21h18"/></>,
    phone:   <><path d="M5 4l3.5-.5L10 8l-2 1.5a11 11 0 005.5 5.5L15 13l4.5 1.5L19 18a2 2 0 01-2 2A14 14 0 013 7a2 2 0 012-2z"/></>,
    moreV:   <><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/></>,
    refresh: <><path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 4v6h-6"/></>,
    dot:     <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>,
    seat:    <><path d="M6 4h6a3 3 0 013 3v6H6V4z"/><path d="M3 13h15v6"/><path d="M19 16h2"/></>,
    arrowUp: <><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>,
    arrowDown:<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>,
    building: <><path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16"/><path d="M16 9h3a2 2 0 012 2v10"/><path d="M4 21h18"/><path d="M8 7h4M8 11h4M8 15h4"/><path d="M18 13h1M18 17h1"/></>,
    mail:    <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></>,
    location:<><path d="M12 22s-7-7.5-7-12a7 7 0 0114 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

window.Icon = Icon;
