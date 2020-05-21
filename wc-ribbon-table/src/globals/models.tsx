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
    // id?: string;
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
          description: "description of header 1 - no base URL"
        },
        {
          label: "header-2x",
          id: "hid-2",
          baseURL : "http://example.com",
          description: "description of header 2 - with base URL"
        },
        {
          label: "header-3",
          id: "hid-3"
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
              label: "r1-h1",
              headerId: "hid-1",
              description: "description of row 1 header 1"
            },
            {
              label: "r1-h2",
              headerId: "hid-2",
              url: "http://example.com/some-page-1-2"
            },
            {
                label: "r1-h3",
                headerId: "hid-3"
            },
            {
                label: "r1-h4",
                headerId: "hid-4"
            }
          ]
        },
        
        {
          // id: 2,
          cells: [
            {
              label: "r2-h1",
              headerId: "hid-1"
            },
            {
              label: "r2-h2",
              headerId: "hid-2",
              url: "some-page-2-2"
            },
            {
                label: "r2-h3",
                headerId: "hid-3"
            },
            {
                label: "r2-h4",
                headerId: "hid-4"
            }
          ]
        },

        {
          // id: 3,
          cells: [
            {
              label: "r3-h1",
              headerId: "hid-1"
            },
            {
              label: "r3-h2",
              headerId: "hid-2",
              url: "some-page-3-2"
            },
            {
              label: "r3-h3",
              headerId: "hid-3",
              description: "description of row 3 header 3",
              url: "some-page-3-3"
            },
            {
                label: "r3-h4",
                headerId: "hid-4"
            }            
          ]
        },
      
        {
          // id: 4,
          cells: [
            {
              label: "r2-h1",
              headerId: "hid-1"
            },
            {
              label: "r2-h2",
              headerId: "hid-2",
              url: "some-page-2-2"
            },
            {
                label: "r2-h3",
                headerId: "hid-3"
            },
            {
                label: "r2-h4",
                headerId: "hid-4"
            }
          ]
        }          

      ]
    
  }

