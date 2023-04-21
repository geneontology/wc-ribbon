![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# GO Autocomplete Web Component

The GO Autocomplete is a Web Component to quickly find genes and terms used in GO [http://geneontology.org/](http://geneontology.org/). It is used in the GO ribbon sandbox to help users find their genes of interest. Try the GO ribbon here: [http://geneontology.org/ribbon.html](http://geneontology.org/ribbon.html)

## Getting Started

### Script tag

- Put a script tag  `<script src='https://unpkg.com/@geneontology/wc-go-autocomplete/dist/wc-go-autocomplete.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

```html
<html>
<head>
  <script type="module" src="https://unpkg.com/@geneontology/wc-go-autocomplete/dist/wc-go-autocomplete/wc-go-autocomplete.esm.js"></script>
  <script nomodule="" src="https://unpkg.com/@geneontology/wc-go-autocomplete/dist/wc-go-autocomplete/wc-go-autocomplete.js"></script>
</head>
<body>

    <!--  This add the go autocomplete to your page -->
    <wc-go-autocomplete id="ac"></wc-go-autocomplete>

    <!-- This allows to react when an item is selected from the go autocomplete -->
    <script>
      let elt = document.getElementById("ac");
      document.addEventListener("itemSelected", (evt) => {
        console.log("item selected: ", evt.detail);
      });
    </script>

</body>
</html>
```

### Node Modules
- Run `npm install @geneontology/wc-go-autocomplete --save`
- Put a script tag similar to this `<script src='node_modules/@geneontology/wc-go-autocomplete/dist/wc-go-autocomplete.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

## Additional note
The GO Autocomplete Web Component is powered by the GO API [http://api-sierra.geneontology.io/](http://api-sierra.geneontology.io/){:target="blank"}