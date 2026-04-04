export const EVENTS = [
  {
    id: '1979661782683',
    title: 'Academy Comedy Nights – Free English Stand-Up in Brussels',
    date: '2026-04-16',
    time: '20:00',
    venue: 'Latroupe Grote Markt',
    venueCity: 'Brussels',
    city: 'brussels',
    ticketType: 'free',
    ticketUrl: 'https://www.eventbrite.be/e/1979661782683',
    summary: 'Free-entry central Brussels comedy night with the clearest low-friction first-time BCN booking path.',
    note: 'Best for quick weekday conversion and first BCN visits.'
  },
  {
    id: '1892066374459',
    title: 'Friday Night Stand-Up Comedy In English For FREE!',
    date: '2026-04-24',
    time: '20:00',
    venue: 'Av. Orban 54',
    venueCity: 'Woluwe-Saint-Pierre (Brussels)',
    city: 'brussels',
    ticketType: 'free',
    ticketUrl: 'https://www.eventbrite.be/e/1892066374459',
    summary: 'Neighbourhood Brussels free night that broadens the BCN footprint beyond the centre.',
    note: 'Useful for repeat local audiences and softer Friday conversion.'
  },
  {
    id: '1980258240705',
    title: 'English Stand-Up Comedy Antwerp: Best of Belgium',
    date: '2026-04-26',
    time: '20:00',
    venue: 'Vertigo Antwerpen',
    venueCity: 'Antwerp',
    city: 'antwerp',
    ticketType: 'paid',
    ticketUrl: 'https://www.eventbrite.be/e/1980258240705',
    summary: 'Paid Antwerp showcase night with the strongest premium / destination feel in the snapshot.',
    note: 'Best fit for a cleaner, calmer, premium treatment.'
  },
  {
    id: '1979661786695',
    title: 'Academy Comedy Nights – Free English Stand-Up in Brussels',
    date: '2026-04-30',
    time: '20:00',
    venue: 'Latroupe Grote Markt',
    venueCity: 'Brussels',
    city: 'brussels',
    ticketType: 'free',
    ticketUrl: 'https://www.eventbrite.be/e/1979661786695',
    summary: 'Recurring Brussels Academy date that supports fast weekly publishing and clear repeat attendance behavior.',
    note: 'Strong recurring room signal.'
  },
  {
    id: '1984641303564',
    title: 'Academy Comedy Nights – Free English Stand-Up in Brussels',
    date: '2026-05-14',
    time: '20:00',
    venue: 'Latroupe Grote Markt',
    venueCity: 'Brussels',
    city: 'brussels',
    ticketType: 'free',
    ticketUrl: 'https://www.eventbrite.be/e/1984641303564',
    summary: 'Another recurring Brussels night that benefits from a stable, predictable BCN card system.',
    note: 'Good example of repeatable low-noise publishing.'
  },
  {
    id: '1980258241708',
    title: 'English Stand-Up Comedy Antwerp: Best of Belgium',
    date: '2026-05-24',
    time: '20:00',
    venue: 'Vertigo Antwerpen',
    venueCity: 'Antwerp',
    city: 'antwerp',
    ticketType: 'paid',
    ticketUrl: 'https://www.eventbrite.be/e/1980258241708',
    summary: 'Follow-up Antwerp paid date for users already primed for a stronger night-out frame.',
    note: 'Carries the cleanest premium value perception.'
  },
  {
    id: '1984641304567',
    title: 'Academy Comedy Nights – Free English Stand-Up in Brussels',
    date: '2026-05-28',
    time: '20:00',
    venue: 'Latroupe Grote Markt',
    venueCity: 'Brussels',
    city: 'brussels',
    ticketType: 'free',
    ticketUrl: 'https://www.eventbrite.be/e/1984641304567',
    summary: 'Late-May Brussels date keeping the recurring BCN free-entry path visible and familiar.',
    note: 'Supports a habit-forming BCN cadence.'
  },
  {
    id: '1980258242711',
    title: 'English Stand-Up Comedy Antwerp: Best of Belgium',
    date: '2026-06-28',
    time: '20:00',
    venue: 'Vertigo Antwerpen',
    venueCity: 'Antwerp',
    city: 'antwerp',
    ticketType: 'paid',
    ticketUrl: 'https://www.eventbrite.be/e/1980258242711',
    summary: 'Later Antwerp premium showcase that makes the paid BCN lane feel durable rather than one-off.',
    note: 'Strong premium anchor for later schedule pages.'
  }
];

export const CITY_ORDER = ['all', 'brussels', 'ghent', 'leuven', 'antwerp'];

export const CITY_META = {
  all: {
    label: 'All cities',
    accent: '#ff5a36',
    intro: 'See all upcoming BCN dates first, then narrow fast by city.',
    signup: 'Choose your city',
    emptyTitle: 'BCN is active across the network.',
    emptyText: 'Use the city filter to tighten the list quickly.'
  },
  brussels: {
    label: 'Brussels',
    accent: '#ff5b5b',
    intro: 'Recurring free-entry BCN rhythm with the densest room network and the easiest first booking path.',
    signup: 'Join Brussels list',
    emptyTitle: 'Brussels should usually stay live.',
    emptyText: 'If Brussels is empty, the snapshot likely needs refreshing.'
  },
  ghent: {
    label: 'Ghent',
    accent: '#7a5cff',
    intro: 'Historic BCN city with real proof, even when the current public schedule is between drops.',
    signup: 'Join Ghent list',
    emptyTitle: 'No Ghent date in the current snapshot.',
    emptyText: 'Use the city list instead of inventing filler events.'
  },
  leuven: {
    label: 'Leuven',
    accent: '#00b894',
    intro: 'Leuven stays in the BCN system as a real city lane, not a hidden secondary audience.',
    signup: 'Join Leuven list',
    emptyTitle: 'No Leuven date in the current snapshot.',
    emptyText: 'Keep the city visible and capture demand honestly.'
  },
  antwerp: {
    label: 'Antwerp',
    accent: '#ff9f43',
    intro: 'Paid showcase city with the strongest premium-night-out logic in the current event run.',
    signup: 'Join Antwerp list',
    emptyTitle: 'Antwerp is one of the current paid anchors.',
    emptyText: 'If nothing shows here, the content source needs updating.'
  }
};

export const VENUE_PROOF = {
  'Comedy Ket': '48 BCN events · 2,425 tickets',
  'Vertigo Antwerpen': '17 BCN events · 1,445 tickets',
  'Theater Tinnenpot': '6 BCN events · 903 tickets',
  'Kamea Restaurant': '21 BCN events · 948 tickets',
  'Latroupe Grote Markt': '25 BCN events · 1,199 tickets',
  'OPEK': '4 BCN events · 1,021 tickets',
  'Le Réservoir Bar': '8 BCN events · 559 tickets',
  'Vismarkt 7': '3 BCN events · 499 tickets',
  'a&o Hostel Antwerpen': '7 BCN events · 1,037 tickets',
  'Le Cheval Marin': '10 BCN events · 643 tickets',
  'a&o Brussel Centrum': '5 BCN events · 539 tickets',
  'Campus Corso': '1 BCN event · 101 tickets',
  'Art Base': '1 BCN event · 69 tickets',
  'Av. Orban 54': '7 BCN events · 488 tickets'
};

export function formatLongDate(value) {
  return new Intl.DateTimeFormat('en-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(`${value}T12:00:00`));
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat('en-BE', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(`${value}T12:00:00`));
}

export function getEvents(city = 'all') {
  return city === 'all' ? EVENTS : EVENTS.filter((event) => event.city === city);
}

export function nextEvent(city = 'all') {
  return getEvents(city)[0] || null;
}

export function ticketLabel(event) {
  return event.ticketType === 'free' ? 'Reserve free seat' : 'Get tickets';
}

export function ticketTypeLabel(event) {
  return event.ticketType === 'free' ? 'Free reservation' : 'Paid tickets';
}

export function venueProof(event) {
  return VENUE_PROOF[event.venue] || 'Real BCN venue with live Eventbrite ticketing in the supplied snapshot.';
}

export function cityAccent(city) {
  return CITY_META[city]?.accent || CITY_META.all.accent;
}
