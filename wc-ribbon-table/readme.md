
# Ribbon Table Web Component

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

- Put a script tag  `<script src='https://unpkg.com/@geneontology/wc-ribbon-table/dist/wc-ribbon-table.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

```html
<html>
<head>
  <script type="module" src="https://unpkg.com/@geneontology/wc-ribbon-table/dist/wc-ribbon-table/wc-ribbon-table.esm.js"></script>
  <script nomodule="" src="https://unpkg.com/@geneontology/wc-ribbon-table/dist/wc-ribbon-table/wc-ribbon-table.js"></script>
</head>
<body>

  <wc-ribbon-table data="{your_json_data}"></wc-ribbon-table>

</body>
</html>
```

### Node Modules
- Run `npm install wc-ribbon-table --save`
- Put a script tag similar to this `<script src='node_modules/@geneontology/wc-ribbon-table/dist/wc-ribbon-table.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc