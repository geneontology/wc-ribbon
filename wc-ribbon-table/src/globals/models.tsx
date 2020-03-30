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
}

export class RowCell extends Cell {
    headerId: string;
}

export class Row {
    foldable?: boolean;
    id?: string;
    cells: RowCell[];
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
          description: "description of header 1"
        },
        {
          label: "header-2",
          id: "hid-2"
        },
        {
          label: "header-3",
          id: "hid-3"
        }
    ],

    rows: [
        {
          cells: [
            {
              label: "r1-h1",
              headerId: "hid-1",
              description: "description of row 1 header 1"
            },
            {
              label: "r1-h2",
              headerId: "hid-2",
              url: "http://example.com"
            },
            {
                label: "r1-h3",
                headerId: "hid-3"
            }
          ]
        },
        
        {
            cells: [
              {
                label: "r2-h1",
                headerId: "hid-1"
              },
              {
                label: "r2-h2",
                headerId: "hid-2"
              },
              {
                  label: "r2-h3",
                  headerId: "hid-3"
              }
            ]
          },

          {
            cells: [
              {
                label: "r3-h1",
                headerId: "hid-1"
              },
              {
                label: "r3-h2",
                headerId: "hid-2",
                url: "http://example.com"
              },
              {
                  label: "r3-h3",
                  headerId: "hid-3",
                  description: "description of row 3 header 3"
                }
            ]
          }          

      ]
    
  }