// Everything about "who you are" lives in this one file.
// Change the text between the quotes and the whole site updates.

export const site = {
  /** Shown in the browser tab and the top-left corner. */
  title: "Fishyy's Library",
  /** Your name as it appears across the site. */
  author: 'Fishyy',
  /** Used by search engines and link previews. */
  description: "Fishyy's library of CTF challenge write-ups.",

  /** Paragraphs shown on the About page. Add, remove or rewrite freely. */
  about: [
    "Hi, I'm Fishyy. I play CTFs and keep my write-ups here, so I can find them again and so others can learn from them.",
    'Write-ups are published only after the CTF has ended.',
  ],

  /**
   * Your links, shown on the homepage and the About page.
   * Remove the "//" in front of a line to turn it on, and add as many as you like.
   */
  links: [
    // { label: 'GitHub', url: 'https://github.com/your-name' },
    // { label: 'Discord', url: 'https://discord.com/users/your-id' },
    // { label: 'CTFtime', url: 'https://ctftime.org/user/your-id' },
  ] as { label: string; url: string }[],

  /** How many write-ups each Archive page shows. */
  archivePageSize: 20,
};

/**
 * The introduction on the homepage.
 * To hide a piece, make it empty: '' for text, [] for a list.
 */
export const home = {
  /** The small pill above the greeting, e.g. 'Currently playing CTFs'. Empty = hidden. */
  status: '',
  /** The small line above the big heading. */
  greeting: "Hey, It's me, It's Fishity",
  /** The big heading. */
  heading: "Welcome to Fishyy's library",
  /**
   * Typed out one after another under the heading,
   * e.g. ['CTF Player', 'Write-up Collector']. Empty = hidden.
   */
  roles: [] as string[],
  /** A few sentences introducing yourself. */
  intro:
    'A shelf of CTF write-ups: what I solved, how I solved it, and what I learned along the way.',
};

/**
 * The terminal-style card on the homepage.
 * Set `show` to true to display it next to the introduction.
 */
export const terminal = {
  show: false,
  /** The text in the card's title bar. */
  title: 'fishyy@library: ~',
  /** Shown under your name. */
  handle: '@fishyy',
  /**
   * Your picture. Put an image in the "public" folder and write its name
   * here with a slash in front, e.g. '/avatar.png'. While empty, the card
   * shows the first letter of your name.
   */
  avatar: '',
  /** The answer to the "whoami" line. */
  whoami: 'CTF Player',
  /** Facts about you, as label and value. Add or remove lines freely. */
  info: [
    { label: 'school', value: 'Your school' },
    { label: 'status', value: 'studying' },
    { label: 'city', value: 'Your city' },
  ],
  /** What you focus on. */
  focus: ['web', 'crypto', 'forensics'],
};

/** The "????" page. */
export const wip = {
  /** The big line. */
  heading: 'No one is here but us, chicken!',
  /** Optional lines under it, one paragraph each, e.g. ['First line.', 'Second line.']. */
  lines: [] as string[],
  /** The name shown next to the progress bar. */
  label: '????.1',
  /** How full the progress bar is, from 0 to 100. */
  progress: 30,
};

/** The navigation bar. An item without `href` is shown but does nothing when clicked. */
export const nav: { label: string; href?: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Archive', href: '/archive/' },
  { label: '????', href: '/wip/' },
];
