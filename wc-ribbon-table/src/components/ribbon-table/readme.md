# wc-ribbon-table



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                                                                              | Type     | Default                                               |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------- |
| `baseApiUrl`     | `base-api-url`     |                                                                                                                                                                                                                                                                          | `string` | `"http://api.geneontology.org/api/ontology/ribbon/"`  |
| `bioLinkData`    | `bio-link-data`    | Reading biolink data. This will trigger a render of the table as would changing data                                                                                                                                                                                     | `string` | `undefined`                                           |
| `data`           | `data`             | Must follow the appropriate JSON data model Can be given as either JSON or stringified JSON                                                                                                                                                                              | `string` | `undefined`                                           |
| `filterBy`       | `filter-by`        | Filter rows based on the presence of one or more values in a given column Example: filter-by="evidence:ISS,ISO" Note: if value is "", remove any filtering                                                                                                               | `string` | `undefined`                                           |
| `groupBaseUrl`   | `group-base-url`   |                                                                                                                                                                                                                                                                          | `string` | `"http://amigo.geneontology.org/amigo/term/"`         |
| `groupBy`        | `group-by`         | Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 Note: if value is "", remove any grouping | `string` | `undefined`                                           |
| `orderBy`        | `order-by`         | This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping Note: if value is "", remove any ordering                                                                                            | `string` | `undefined`                                           |
| `subjectBaseUrl` | `subject-base-url` |                                                                                                                                                                                                                                                                          | `string` | `"http://amigo.geneontology.org/amigo/gene_product/"` |


## Methods

### `showCurie() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `showOriginalTable() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `showTable() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
