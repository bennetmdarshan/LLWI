# Living Life With Insulin

A complete, responsive community and travel website with a fluid animated background, photo galleries, mobile navigation, FAQs, and WhatsApp enquiry links.

**The website is already built. You do not need Node.js, npm, a database, or a build service to publish it.**

## Upload to GitHub and publish

1. Unzip `LLWI-GitHub.zip` on your computer.
2. Create a GitHub repository, or open the repository you want to use.
3. Upload the **contents of the `LLWI-GitHub` folder** to the repository root and commit the files. Keep the `docs` and `content` folders intact. Do not upload just the ZIP or place the whole export inside another folder.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**. Choose the **main** branch and the **/docs** folder, then click **Save**. If you use a different default branch, select that branch instead.
6. GitHub displays your website URL on the Pages settings screen when deployment is complete.

For a project repository, the address normally has this form: `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

The files use relative links, so you can choose any repository name. Photos, fonts, styles and scripts are included. The `docs/.nojekyll` marker keeps the site as plain static files.

Uploading to a repository stores the files; enabling Pages publishes the website. This export does not include the original hosting service's private access gate. Review the supplied photos and contact details before publishing.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## What is included

| File or folder | Purpose |
| --- | --- |
| `docs/` | Complete website, ready for GitHub Pages or another static host |
| `docs/index.html` | Homepage |
| `docs/styles.css` | Typography, layout, colours and responsive styles |
| `docs/app.js` | Fluid background, menus, filters and photo viewer |
| `docs/assets/` | All 13 community photographs in responsive WebP sizes, local fonts and favicon |
| `content/` | Editable website copy and photo metadata |
| `build.py` | Python generator for all 15 HTML pages |
| `check_site.py` | Internal link, image, asset and page checks |
| `LICENSES/` | Font licensing information |

The pages include Home, Our Story, Trips, Community, Stories, FAQs, Contact, three photo collections, three journal articles, Privacy, and Website & Booking Information.

## Preview on your computer

From the `LLWI-GitHub` folder, run:

```sh
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000 in your browser. On Windows, use `py` in place of `python3` if that is how Python is installed.

## Edit the website

Edit these files, then rebuild the HTML with Python 3.9 or newer:

- `content/site.json`: founder, contact details, FAQs, photo collections and upcoming trips.
- `content/home.json`: homepage introduction and community value cards.
- `content/photos.json`: photo titles, descriptions, categories and focal points.
- `content/journal.json`: journal articles.
- `build.py`: page sections and shared HTML components.

```sh
python3 build.py
python3 check_site.py
```

Commit both the edited source files and the rebuilt `docs/` folder. GitHub Pages serves `docs/` directly; it does not run the Python generator for you. If you edit generated HTML directly, a later rebuild will overwrite those HTML changes.

For design or interaction changes, edit `docs/styles.css` or `docs/app.js` directly. These files do not need a build step. If Node.js is installed, you can optionally check JavaScript syntax with `node --check docs/app.js`.

### Your public website URL

The site works immediately without this step. Once your final website URL is known, set `siteUrl` in `content/site.json`, for example:

```json
"siteUrl": "https://YOUR-USERNAME.github.io/YOUR-REPOSITORY"
```

Rebuild and commit the changes. The generator will add absolute canonical links, social sharing image URLs, and a sitemap using your actual URL. Leave `siteUrl` empty until you know the final address. You can also override it using the `SITE_URL` environment variable when building.

### Adding upcoming trips

Copy the record in `content/trip-template.json` into the `upcomingTrips` list in `content/site.json`. Fill in the confirmed name, unique slug, description, cover photo ID and trip details. The generator creates a detail page for each record. Filters appear when matching destination, month or experience data exists.

No unconfirmed dates, prices, availability or testimonials are included. Current photo collections show past moments rather than bookable departures. Journal articles are editorial reflections. Contact links open WhatsApp with a draft message; visitors choose whether to send it.

## Photo placement and accessibility

The boat, beach and waterfall photos lead the homepage. The staircase photo supports the friendship sections; dinner and gathering photos support the community sections. All 13 photographs appear in the album. Images have 600, 1000 and 1600 px variants, and the photo viewer preserves the complete frame.

The site supports keyboard navigation, visible focus, accessible image descriptions, Escape to dismiss the photo viewer, a motion pause control and reduced-motion preferences. Background animation pauses when the browser tab is hidden.

## Deployment troubleshooting

- **The site shows a README instead of the homepage:** select `/docs` in Pages settings and check that `docs/index.html` is at the repository root's `docs` folder.
- **A photo or font is missing:** upload the entire `docs/assets` folder, keeping filenames unchanged.
- **Your text edit did not appear:** run `python3 build.py`, then commit the updated `docs` files.
- **You changed your domain or repository name:** relative navigation continues to work; update `siteUrl` and rebuild the metadata.

## Rights and credits

The photographs and LLWI branding were supplied for this project; this package does not grant third parties reuse rights to those materials. The bundled Plus Jakarta Sans, DM Sans and DM Serif Display fonts use the SIL Open Font License; see `LICENSES/`.
