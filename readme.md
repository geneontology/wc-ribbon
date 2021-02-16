![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Ribbon Web Component

This repository contains multiple web components, each published on NPM for easy integration in 3rd party projects:


| GH folder | Description | NPM package |
| ------------- | ------------- | ------------- |
| [wc-go-ribbon](https://github.com/geneontology/wc-ribbon/tree/master/wc-go-ribbon) | GO ribbon component benefiting from the components described below |  [@geneontology/wc-go-ribbon](https://www.npmjs.com/package/@geneontology/wc-go-ribbon) |
| [wc-ribbon-strips](https://github.com/geneontology/wc-ribbon/tree/master/wc-ribbon-strips) | interactive visual summary with colored cells for association data (e.g. gene <-> number of GO annotations | [@geneontology/wc-ribbon-strips](https://www.npmjs.com/package/@geneontology/wc-ribbon-strips) |
|  [wc-ribbon-table](https://github.com/geneontology/wc-ribbon/tree/master/wc-ribbon-table) |  table to display association data (e.g. gene <-> GO annotation | [@geneontology/wc-ribbon-table](https://www.npmjs.com/package/@geneontology/wc-ribbon-table)  |
| [wc-go-autocomplete](https://github.com/geneontology/wc-go-autocomplete/tree/master/wc-go-autocomplete) | GO Autocomplete Web Component to search for genes and terms |  [@geneontology/wc-go-autocomplete](https://www.npmjs.com/package/@geneontology/wc-go-autocomplete) |
|  [wc-spinner](https://github.com/geneontology/wc-ribbon/tree/master/wc-spinner) | simple spinner shared across components to display a pending process  |  [@geneontology/wc-spinner](https://www.npmjs.com/package/@geneontology/wc-spinner) |
|  [wc-light-modal](https://github.com/geneontology/wc-ribbon/tree/master/wc-light-modal) | simple modal component able to display HTML content and controllable through JS events  | [@geneontology/wc-light-modal](https://www.npmjs.com/package/@geneontology/wc-light-modal) |


An integrated simple to use Web Component dedicated to GO data and benefit from all these parts is available in the folder wc-go-ribbon.

Examples of web integration of the GO ribbon are also provided in the [web/](https://github.com/geneontology/wc-ribbon/tree/master/web) folder:
- [basic example](https://github.com/geneontology/wc-ribbon/blob/master/web/basic-go-ribbon.html) : the simplest way to integrate the GO ribbon anywhere
- [advanced example](https://github.com/geneontology/wc-ribbon/blob/master/web/advanced-go-ribbon.html) : advanced example to integrate the GO ribbon, giving access to various events and how to link the wc-ribbon-strips and wc-ribbon-table with Javascript
