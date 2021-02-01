
# Spinner Web Component

The CSS code for the spinner is based on https://loading.io/css/ .

This web component simply ease the integration of the spinner in your code.

## Getting Started

To start the component in a dev environment:
```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```

## Using this component

### Script tag

- Put a script tag  `<script src='https://unpkg.com/@geneontology/wc-spinner/dist/wc-spinner.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

```html
<html>
<head>
    <script src="https://unpkg.com/@geneontology/wc-spinner/dist/wc-spinner.js"/>
</head>
<body>
  <wc-spinner spinner-style="ripple" spinner-color=blue spinner-size=80></wc-spinner>
</body>
</html>
```

Accepted values for 'spinner-style': default, spinner, circle, ring, dual-ring, roller, ellipsis, grid, hourglass, ripple, facebook, heart


### Node Modules
- Run `npm install @geneontology/wc-spinner --save`
- Put a script tag similar to this `<script src='node_modules/@geneontology/wc-spinner/dist/wc-spinner.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc