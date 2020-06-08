export class SuperCell {
  id?: string;
  headerId: string;
  clickable?: boolean;
  selectable?: boolean;
  foldable?: boolean;
  values: Cell[];
}

export class Cell {
    id?: string;
    label: string;
    description?: string;
    url?: string;
    icon?: string;
    clickable?: boolean;
    selectable?: boolean;
}

export class HeaderCell extends Cell {
    sortable?: boolean;
    searchable?: boolean;
    baseURL?: string;       // if defined, convert cell URL to use this baseURL
    foldListThr?: number;   // if defined, fold the cells that have more than X items
    hide?: boolean;          // if true, won't show the column that would be considered only for treatment (eg grouping)
}

// export class RowCell extends Cell {
//     headerId: string;
// }

export class Row {
    foldable?: boolean;
    // id?: string;
    cells: SuperCell[];
}

export class Table {
    header: HeaderCell[];
    rows: Row[];
    newTab?: boolean;
}



export const dataMockup : Table = {
    newTab : true,
    header : [
        {
          label: "header-1",
          id: "hid-1",
          description: "description of header 1 - no base URL",
          hide: false
        },
        {
          label: "header-2x",
          id: "hid-2",
          baseURL : "http://example.com",
          description: "description of header 2 - with base URL"
        },
        {
          label: "header-3",
          id: "hid-3",
          hide: false
        },
        {
          label: "header-4",
          id: "hid-4"
        }
    ],

    rows: [
        {
          // id: 1,
          cells: [
            {
              headerId: "hid-1",
              values: [
                {
                  label: "r1-h1",
                  description: "description of row 1 header 1"
                }
              ]
            },
            {
              headerId: "hid-2",
              values: [
                {
                  label: "r1-h2",
                  url: "http://example.com/some-page-1-2"
                }
              ]
            },
            {
              headerId: "hid-3",
              values: [
                {
                    label: "r1-h3",
                }
              ]
            },
            {
              headerId: "hid-4",
              values: [
                {
                    label: "r1-h4",
                }
              ]
            }
          ]
        },
        
        {
          // id: 2,
          cells: [
            {
              headerId: "hid-1",
              values: [
                {
                  label: "r2-h1",
                }
              ]
            },
            {
              headerId: "hid-2",
              values: [
                {
                  label: "r2-h2",
                  url: "some-page-2-2"
                }
              ]
            },
            {
              headerId: "hid-3",
              values: [
                {
                    label: "r2-h3",
                }
              ]
            },
            {
              headerId: "hid-4",
              values: [
                {
                    label: "r2-h4",
                }
              ]
            }
          ]
        },

        {
          // id: 3,
          cells: [
            {
              headerId: "hid-1",
              values: [
                {
                  label: "r1-h1",
                }
              ]
            },
            {
              headerId: "hid-2",
              values: [
                {
                  label: "r3-h2",
                  url: "some-page-3-2"
                }
              ]
            },
            {
              headerId: "hid-3",
              values: [
                {
                  label: "r1-h3",
                  description: "description of row 3 header 3",
                  url: "some-page-3-3"
                }
              ]
            },
            {
              headerId: "hid-4",
              values: [
                {
                    label: "r3-h4a",
                    url: "some-page-3-4a"
                }, 
                {
                  label: "r3-h4b",
                  url: "some-page-3-4b"
                }            
              ]
            }
          ]
        },
      
        {
          // id: 4,
          cells: [
            {
              headerId: "hid-1",
              values: [
                {
                  label: "r2-h1",
                }
              ]
            },
            {
              headerId: "hid-2",
              values: [
                {
                  label: "r2-h2",
                  url: "some-page-2-2"
                }
              ]
            },
            {
              headerId: "hid-3",
              values: [
                {
                    label: "r2-h3",
                }
              ]
            },
            {
              headerId: "hid-4",
              values: [
                {
                    label: "r2x-h4x",
                }
              ]
            }
          ]
        },

        {
          // id: 5,
          cells: [
            {
              headerId: "hid-1",
              values: [
                {
                  label: "r1-h1",
                  description: "description of row 5 header 1"
                }
              ]
            },
            {
              headerId: "hid-2",
              values: [
                {
                  label: "r5-h2",
                  url: "http://example.com/some-page-1-2"
                }
              ]
            },
            {
              headerId: "hid-3",
              values: [
                {
                    label: "r5-h3",
                }
              ]
            },
            {
              headerId: "hid-4",
              values: [
                {
                    label: "r5-h4",
                }
              ]
            }
          ]
        }
        
      ]
    
  }

