// Shared ad copy. Loaded by both the content script and the popup so the
// per-ad toggle list can never drift from what actually gets shown.
//
//   tier   1 gentle -> 3 blunt; escalates as you ignore swarms in a session.
//   hosts  optional; ad only applies on these sites.
//   hours  optional [start, end) in local 24h time; wraps past midnight.
//
// Ads with hosts/hours are "contextual": they sit outside the tier ladder and
// get priority when they apply.
const ADS = [
  // --- tier 1: gentle ---
  {
    tier: 1,
    kicker: "Mood Market Alert",
    message: "This spiral is not sponsored.",
    subtext: "A walk, a glass of water, or one decisive email would outperform this feed."
  },
  {
    tier: 1,
    kicker: "Paid Placement",
    message: "You do not need another opinion. Start.",
    subtext: "Momentum is still available. It has not gone out of stock."
  },
  {
    tier: 1,
    kicker: "Promoted by Future You",
    message: "A walk would outperform this feed.",
    subtext: "Fresh air remains embarrassingly overpowered."
  },
  {
    tier: 1,
    kicker: "Sponsored Calm",
    message: "You can log off before this gets bleak.",
    subtext: "No grand reinvention required. Just close one thing."
  },
  {
    tier: 1,
    kicker: "Family Plan Upgrade",
    message: "Call your Mom.",
    subtext: "It is a better use of your phone than whatever this is."
  },

  // --- tier 2: firm ---
  {
    tier: 2,
    kicker: "Behavioral Ad",
    message: "You are 3 tabs away from feeling worse.",
    subtext: "This is your reminder that stopping counts as a skill."
  },
  {
    tier: 2,
    kicker: "Attention Buyback",
    message: "Your brain has better uses than refresh-refresh-refresh.",
    subtext: "Try one small real-world action before the next scroll."
  },
  {
    tier: 2,
    kicker: "Special Offer",
    message: "Leave now and call it discipline.",
    subtext: "You do not need to consume your way into clarity."
  },

  // --- tier 3: blunt ---
  {
    tier: 3,
    kicker: "Limited-Time Offer",
    message: "Your mood is being auctioned off. Close the app.",
    subtext: "Someone is making money from your nervous system. You can leave."
  },
  {
    tier: 3,
    kicker: "Final Notice",
    message: "You've been here a while. This is the doom now.",
    subtext: "Not a metaphor. You are in it right now."
  },
  {
    tier: 3,
    kicker: "Final Notice",
    message: "Still scrolling. The feed is winning.",
    subtext: "It does not get better further down. It never has."
  },
  {
    tier: 3,
    kicker: "Final Notice",
    message: "This is not reading. It's grazing. Stop.",
    subtext: "Put the phone down. Right now. Yes, now."
  },

  // --- contextual: time of day ---
  {
    hours: [23, 5],
    kicker: "Night Shift Ad",
    message: "Nothing good gets decided at 1am. Bed.",
    subtext: "The scroll is not resting you. Sleep is. It always was."
  },
  {
    hours: [5, 9],
    kicker: "Morning Placement",
    message: "You have not started your day. You've started theirs.",
    subtext: "The first hour is the good one. Don't hand it over."
  },

  // --- contextual: site specific ---
  {
    hosts: ["youtube.com"],
    kicker: "Up Next",
    message: "One more video was a lie four videos ago.",
    subtext: "The watch page is a treadmill. You get to step off whenever you want."
  },
  {
    hosts: ["x.com", "twitter.com"],
    kicker: "What's Happening",
    message: "You didn't come here to be angry. It just pays better.",
    subtext: "Outrage is the product. Your calm is not for sale to them."
  },
  {
    hosts: ["reddit.com"],
    kicker: "Hot Posts",
    message: "You're reading strangers argue instead of living your day.",
    subtext: "None of these opinions will still matter to you by dinner."
  },
  {
    hosts: ["instagram.com"],
    kicker: "Suggested For You",
    message: "Everyone here is performing. You're the only one watching alone.",
    subtext: "Nobody's real life looks like their grid. Not even theirs."
  },
  {
    hosts: ["tiktok.com"],
    kicker: "For You",
    message: "An hour just vanished and you can't name one thing you saw.",
    subtext: "It's built to erase itself. That's why it feels like nothing."
  },
  {
    hosts: ["facebook.com"],
    kicker: "On Your Mind?",
    message: "The people who matter aren't in this feed. They're a text away.",
    subtext: "Message one person you actually miss. Close this after."
  },
  {
    hosts: ["news.ycombinator.com"],
    kicker: "New Comments",
    message: "Reading about building things is not building things.",
    subtext: "The tab you were supposed to be in is still open. Go back to it."
  }
];

// Fake sponsor slugs for the popup title bar; one per popup.
const SPONSOR_LINES = [
  "Sponsored by your future self",
  "Brought to you by Touching Grass™",
  "Sponsored by Going Outside",
  "A message from the Department of Enough",
  "Paid for by Friends of Sleep",
  "Sponsored by Doing The Thing",
  "Brought to you by Tomorrow Morning You",
  "Paid placement from The Rest of Your Life",
  "Sponsored by Literally Anything Else"
];
