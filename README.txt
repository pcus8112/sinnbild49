SINNBILD49.COM – WEBSITE PACKAGE
Version: 1.0 / 1 September 2026

WHAT IS INCLUDED
----------------
- Responsive website in German (Germany), English (United States), and French (Québec)
- 49-card 7×7 selection field
- One-time random shuffle in the visitor's browser
- Ten-card neutral layout with fixed positions
- Versioned reading code with checksum
- Copy, email, and self-interpretation functions
- Public handbook with all 49 card descriptions and reflection questions
- Method, legal notice, privacy information, robots.txt, sitemap, and CNAME
- Existing SINNBILD49 logo, card back, and 49 optimized card images
- No external JavaScript libraries, analytics, cookies, database, or build process

QUICK DEPLOYMENT
----------------
Upload the CONTENTS of this folder to the root of the webspace. index.html must be
located directly in the published root. The site works as static HTML, CSS, and
JavaScript; PHP, Node.js, and a database are not required.

GITHUB PAGES
------------
1. Create or open the repository for sinnbild49.com.
2. Upload all files and folders from this package to the repository root.
3. In Settings > Pages, publish from the main branch and root folder.
4. Enter sinnbild49.com as the custom domain and enable HTTPS.
5. The included CNAME file already contains sinnbild49.com.

CENTRAL SETTINGS
----------------
Open js/config.js to change:
- owner name
- email address
- postal address
- domain
- Amazon links for DE, EN/US, and FR/Canada

Amazon buttons remain visibly marked “coming soon” and cannot be clicked until a
URL is entered. Do not add affiliate parameters unless the required affiliate
disclosure is also added to the website.

PRIVACY
-------
The question and the selected cards are processed only in the browser. Nothing
is automatically submitted. Clicking the email button opens the visitor's own
email application. The only local browser setting stored is the language choice.

The legal page currently describes GitHub Pages as the anticipated host. If a
different hosting provider is used, update the hosting paragraph before launch.
Because legal requirements can depend on the final host, commercial status, and
country of publication, the legal text should be checked once more before the
public launch.

TEST BEFORE PUBLISHING
----------------------
- Open all four HTML pages and switch through all three languages.
- Complete one full ten-card reading on a phone and a desktop computer.
- Test copying through HTTPS; local file previews use a compatibility fallback.
- Test the email button on the intended phone.
- Add the final Amazon URLs when available.
- Confirm that pcusinger@gmail.com is the desired public contact address.

IMPORTANT FILES
---------------
index.html          The card reading
method.html         Philosophy and method
handbook.html       Ten positions and all 49 cards
legal.html          Legal notice, privacy, and limits
js/config.js        Owner, address, email, domain, Amazon links
js/cards.js         Card titles, descriptions, and reflection questions
css/styles.css      Complete visual design and responsive layout
assets/cards/       49 optimized website card images

COPYRIGHT
---------
SINNBILD49 text, card images, logo, and design are reserved to Pierre C. U. Singer.
