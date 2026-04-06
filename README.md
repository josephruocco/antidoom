# AntiDoom

AntiDoom is now split into two parts:

- `extension/` for the Chrome extension
- `demo/` for the hosted HTML demo site

## Load The Extension In Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select `/Users/josephruocco/antidoom/extension`.

## Host The Demo

For Netlify:

- Build command: leave blank
- Publish directory: `demo`

The demo entry point is [demo/index.html](/Users/josephruocco/antidoom/demo/index.html).

## Extension

- Watches for sustained scrolling on distracting sites by default: Reddit, YouTube, X/Twitter, Instagram, TikTok, Facebook, and Hacker News.
- Shows fake popup ads with dry, positive anti-doomscroll messages.
- Lets you test a popup from the extension UI.

## Demo

- Shows a hosted playground for the AntiDoom concept.
- Includes many example ads, popup controls, spam mode, and a custom ad builder.
- Includes the WordArt-inspired AntiDoom logo and the celebration reel.

-test
