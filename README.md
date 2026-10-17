# Taber.js

A lightweight, dependency-free tab component built with modern JavaScript (ES6+).

Taber.js turns a set of links into tabs that control the visibility of matching content panels. It supports remembering the selected tab in the URL, a configurable active class, and an `onChange` callback.

> **Project background:** Taber.js is a personal learning and portfolio project. It was developed after studying a JavaScript tutorial that used prototype-based JavaScript. I reimplemented the concepts using an ES6 class and private fields/methods for use in my own projects. This repository does not claim that the original idea or every design decision is entirely original.

## Features

- No runtime dependencies or framework required.
- Activate content panels through tab links.
- Configure the CSS class applied to the active tab.
- Optionally remember the selected tab in the URL query string.
- Receive tab and panel elements through an `onChange` callback.
- Switch tabs programmatically by link selector or anchor element.
- Restore the container's original HTML with `destroy()`.

## Installation

### Use the CDN

Include the script after the tab and panel markup, or load it with `defer`:

```html
<script src="https://cdn.jsdelivr.net/gh/thanhwii/taber@v1.0.0/taber.min.js"></script>
```

Taber.js does not provide a separate CSS file. Add your own styles for the tabs and panels.

### Use the local source file

```html
<script src="./src/taber.js"></script>
```

You can also use the minified file included at the repository root:

```html
<script src="./taber.min.js"></script>
```

Adjust paths to match your project structure.

## Quick start

### 1. Add the tab navigation and panels

Each tab must be an anchor inside an `<li>` within the container selected by Taber. The anchor's `href` must point to an existing panel in the document.

```html
<div id="settings-tabs">
  <ul>
    <li><a href="#profile-panel">Profile</a></li>
    <li><a href="#security-panel">Security</a></li>
    <li><a href="#notifications-panel">Notifications</a></li>
  </ul>
</div>

<section id="profile-panel">
  <h2>Profile</h2>
  <p>Manage your profile information.</p>
</section>

<section id="security-panel">
  <h2>Security</h2>
  <p>Manage your security settings.</p>
</section>

<section id="notifications-panel">
  <h2>Notifications</h2>
  <p>Choose which notifications you receive.</p>
</section>
```

### 2. Initialize Taber

```html
<script src="https://cdn.jsdelivr.net/gh/thanhwii/taber@v1.0.0/taber.min.js"></script>
<script>
  const tabs = new Taber('#settings-tabs');
</script>
```

By default, the first tab is selected when Taber initializes.

## Configuration options

Pass a CSS selector for the tab container as the first argument, and an optional options object as the second argument.

```js
const tabs = new Taber('#settings-tabs', {
  remember: true,
  activeClassName: 'is-active',
  onChange: ({ tab, panel }) => {
    console.log('Selected tab:', tab);
    console.log('Selected panel:', panel);
  },
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `remember` | `boolean` | `false` | If enabled, stores the selected tab in a URL query parameter and restores it when the page initializes. |
| `onChange` | `function \| null` | `null` | Callback invoked when the selected tab changes. Receives an object containing `{ tab, panel }`. |
| `activeClassName` | `string` | `'taber--active'` | CSS class added to the active tab's closest `<li>` element and removed from the other tabs' `<li>` elements. |

## API

### `taber.switch(input)`

Switches to a tab programmatically. The input can be either the tab anchor's exact `href` value or the anchor element itself.

```js
// Switch using the target panel selector.
tabs.switch('#security-panel');

// Switch using an anchor element.
const profileLink = document.querySelector(
  '#settings-tabs a[href="#profile-panel"]'
);
tabs.switch(profileLink);
```

If the input does not match one of the tabs, Taber logs an error and leaves the selected tab unchanged.

### `taber.destroy()`

Restores the original HTML inside the tab container captured during initialization and makes the associated panels visible again.

```js
tabs.destroy();
```

After calling `destroy()`, create a new `Taber` instance if you want to initialize the same container again.

## Remembering the selected tab

Set `remember: true` to preserve the selected tab in the URL query string. Taber derives the query parameter key from the container selector and the value from the tab link's `href`, removing non-alphanumeric characters from each.

For example, a container selector of `#settings-tabs` produces the key `settingstabs`. A tab linking to `#security-panel` produces the value `securitypanel`. The URL may therefore look like this:

```text
?settingstabs=securitypanel
```

Taber uses `history.replaceState()` to update the URL without reloading the page. Use a stable, unique selector for each tab container when enabling this option.

## Styling

Taber.js handles tab activation and panel visibility; it does not include a stylesheet. The active class is applied to the `<li>` element containing the selected link, so style that class in your own CSS.

```css
#settings-tabs li.taber--active > a {
  font-weight: 700;
  border-bottom: 2px solid currentColor;
}

[hidden] {
  display: none !important;
}
```

The `[hidden]` rule helps ensure panels marked as hidden remain hidden if other CSS rules change their display behavior.

## Example with a change callback

```js
const tabs = new Taber('#settings-tabs', {
  activeClassName: 'is-active',
  onChange: ({ tab, panel }) => {
    console.log(`Changed to ${tab.textContent.trim()}`);
    console.log('Active panel:', panel.id);
  },
});
```

The callback receives:

- `tab`: the selected anchor element.
- `panel`: the corresponding content panel element.

The callback is not invoked for the initial tab selection during initialization. It runs when the selected tab changes afterward.

## Expected markup and behavior

- The container selector must match an element in the document.
- Tab links must be `<a>` elements inside `<li>` elements within that container.
- Each tab's `href` must be a valid CSS selector that matches an existing panel, such as `#profile-panel`.
- The number of tab links should match the number of corresponding panels.
- Taber uses the `hidden` property to show and hide panels.

## Development

The repository is organized as follows:

```text
.
├── src/
│   └── taber.js
├── taber.min.js
├── index.html
├── styles.css
├── package.json
├── package-lock.json
└── README.md
```

The `index.html` and `styles.css` files are used for the demo page. The source implementation is in `src/taber.js`, and `taber.min.js` is the minified browser build.

## Acknowledgements

This project was created as a learning exercise after studying JavaScript tutorial material. The reference approach used prototype-based JavaScript; this implementation adapts the concepts into an ES6 class with private fields and methods for personal projects.

Learning resource: [F8 — JavaScript Pro](https://f8.edu.vn/landing/js).

## License

No license has been specified for this repository. Before redistributing the code or adding an open-source license, review the terms of the tutorial material and any other applicable rights.
