
# Ribbon Table Web Component

The Ribbon Table is used to list, cluster and order annotations usually selected from the Ribbon Strips. Try the GO ribbon here: [http://geneontology.org/ribbon.html](http://geneontology.org/ribbon.html)

## Getting Started

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

  <!--  This add the ribbon table to your page based on a json data object -->
  <wc-ribbon-table data="{your_json_data}"></wc-ribbon-table>

</body>
</html>
```

### Node Modules
- Run `npm install @geneontology/wc-ribbon-table --save`
- Put a script tag similar to this `<script src='node_modules/@geneontology/wc-ribbon-table/dist/wc-ribbon-table.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc