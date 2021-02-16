# my-component



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                                                                                                                                                                                                                                                                                                                      | Type     | Default     |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `category`    | `category`    | Category to constrain the search; by default search "gene" Other values accepted: `undefined` : search both terms and genes `gene` : will only search genes used in GO `biological%20process` : will search for GO BP terms `molecular%20function` : will search for GO MF terms `cellular%20component` : will search for GO CC terms `cellular%20component,molecular%20function,biological%20process` : will search any GO term | `string` | `"gene"`    |
| `maxResults`  | `max-results` | Maximum number of results to show                                                                                                                                                                                                                                                                                                                                                                                                | `number` | `100`       |
| `placeholder` | `placeholder` | Default placeholder for the autocomplete                                                                                                                                                                                                                                                                                                                                                                                         | `string` | `""`        |
| `value`       | `value`       |                                                                                                                                                                                                                                                                                                                                                                                                                                  | `string` | `undefined` |


## Events

| Event          | Description                                                        | Type               |
| -------------- | ------------------------------------------------------------------ | ------------------ |
| `itemSelected` | Event triggered whenever an item is selected from the autocomplete | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
