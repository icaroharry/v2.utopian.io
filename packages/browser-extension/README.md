## Utopian Extension

This is a browser extension which can be used to tip any creator of a GitHub issue or pull request. It uses the webapp's login flow to get authenticated. Every Github User will have a unique account which will have a separate virtual wallet. You can tip any issue or pull request using any cryptocurrency. The cryptocurrency will then be transferred to Utopian's account as an escrow, and the recipient will get notified by a comment under the issue or pull request. They can then install the extension and claim the tip. Users can withdraw the tip to their Steem account whenever they wish.

## Installation
1. Clone the repository `git clone https://github.com/EmailThis/extension-boilerplate.git`
2. Run `yarn install`
3. Run `yarn run build`

##### Load the extension in Chrome & Opera
1. Open Chrome/Opera browser and navigate to chrome://extensions
2. Select "Developer Mode" and then click "Load unpacked extension..."
3. From the file browser, choose to `extension-boilerplate/build/chrome` or (`extension-boilerplate/build/opera`)


##### Load the extension in Firefox
1. Open Firefox browser and navigate to about:debugging
2. Click "Load Temporary Add-on" and from the file browser, choose `extension-boilerplate/build/firefox`


## Developing
The following tasks can be used when you want to start developing the extension and want to enable live reload - 

- `yarn run chrome-watch`
- `yarn run opera-watch`
- `yarn run firefox-watch`


## Packaging
Run `yarn run dist` to create a zipped, production-ready extension for each browser. You can then upload that to the appstore.

### License

GPL-3.0 Copyright (c) 2018 Utopian Company SRLs.