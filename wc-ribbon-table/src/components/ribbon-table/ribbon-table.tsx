import { Component, h, Prop, Watch, State, Method } from '@stencil/core';

import { Table, SuperCell } from '../../globals/models';
import { bioLinkToTable, addEmptyCells } from '../../globals/utils';

import * as dbxrefs from '@geneontology/dbxrefs';

@Component({
  tag: 'wc-ribbon-table',
  styleUrl: './ribbon-table.sass',
  shadow: false
})
export class RibbonTable {

  @Prop() baseApiUrl = "https://api.geneontology.org/api/ontology/ribbon/";

  @Prop() subjectBaseUrl: string = "http://amigo.geneontology.org/amigo/gene_product/";
  @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

  /**
   * Using this parameter, the table rows can bee grouped based on column ids
   * A multiple step grouping is possible by using a ";" between groups
   * The grouping applies before the ordering
   * Example: hid-1,hid-3 OR hid-1,hid-3;hid-2
   * Note: if value is "", remove any grouping
   */
  @Prop() groupBy: string;

  @Watch('groupBy')
  groupByChanged(newValue, oldValue) {
    // console.log("groupByChanged(" , newValue , "; " , oldValue , ")");
    if(newValue != oldValue) {
      this.updateTable();
    }
  }

  /**
   * This is used to sort the table depending of a column
   * The column cells must be single values
   * The ordering applies after the grouping
   * Note: if value is "", remove any ordering
   */
  @Prop() orderBy: string;

  @Watch("orderBy")
  orderByChanged(newValue, oldValue) {
    // console.log("orderByChanged(" , newValue , "; " , oldValue , ")");
    if(newValue != oldValue) {
      this.updateTable();
    }
  }

  /**
   * Filter rows based on the presence of one or more values in a given column
   * The filtering will be based on cell label or id
   * Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx"
   * Note: if value is "", remove any filtering
   */
  @Prop() filterBy: string;

  @Watch("filterBy")
  filterByChanged(newValue, oldValue) {
    // console.log("filterByChanged(" , newValue , "; " , oldValue , ")");
    if(newValue != oldValue) {
      this.updateTable();
    }
  }

  /**
   * Used to hide specific column of the table
   */
  @Prop() hideColumns: string;

  @Watch('hideColumns')
  hideColumnsChanged(newValue, oldValue) {
    if(newValue != oldValue) {
      this.updateTable();
    }
  }

  /**
   * Must follow the appropriate JSON data model
   * Can be given as either JSON or stringified JSON
   */
  @Prop() data : string;

    /**
   * Reading biolink data. This will trigger a render of the table as would changing data
   */
  @Prop() bioLinkData : string;

  /**
   * This contains the original table, converted from either data or bioLinkData
   * Its value only changes when data or bioLinkData changes
   */
  originalTable : Table;

  /**
   * Contains the current representation from originalTable, including any grouping or sorting
   * Any change to this state will trigger a render
   */
  @State()
  table : Table; 


  /**
   * Contains (header_id ; header)
   * Used to speed up some cell processing (eg access baseURL)
   */
  headerMap;


  @Watch('data')
  dataChanged(newValue, oldValue) {
    if(newValue != oldValue) {
      // console.log("DATA CHANGED: ", newValue);
      this.loadFromData();
    }
  }

  loadFromData() {
    if (typeof this.data == "string") {
      this.originalTable = JSON.parse(this.data);
    } else {
      this.originalTable = this.data;
    }
    this.updateTable();
  }

  @Watch('bioLinkData')
  bioLinkDataChanged(newValue, oldValue) {
    if(newValue != oldValue) {
      // console.log("BIOLINK DATA CHANGED: ", newValue);
      this.loadFromBioLinkData();
    }
  }

  loadFromBioLinkData() {
    
    // if no data, empty the current table
    if(this.bioLinkData == undefined || this.bioLinkData == "") {
      this.originalTable = undefined;
      this.table = undefined;
      return;
    }

    if(dbxrefs.isReady()) {
      if (typeof this.bioLinkData == "string") {
        this.originalTable = bioLinkToTable(JSON.parse(this.bioLinkData), dbxrefs.getURL);
      } else {
        this.originalTable = bioLinkToTable(this.bioLinkData, dbxrefs.getURL);
      }
      this.updateTable();

    } else {
      dbxrefs.init()
      .then(() => {
        console.log("dbx: ", dbxrefs);
        console.log(dbxrefs.getURL("WB", undefined, "WBGene00006575"))
        if (typeof this.bioLinkData == "string") {
          this.originalTable = bioLinkToTable(JSON.parse(this.bioLinkData), dbxrefs.getURL);
        } else {
          this.originalTable = bioLinkToTable(this.bioLinkData, dbxrefs.getURL);
        }
        this.updateTable();
      })
    }
  }

  updateTable() {
    if(this.originalTable) {
      // deep copy required to keep the original table safe
      let tempTable = JSON.parse(JSON.stringify(this.originalTable));
      tempTable = addEmptyCells(tempTable);

      // step-1: is grouping the table rows based on provided columns (if any)
      if(this.groupBy && this.groupBy != "") {
        // multiple steps grouping
        if(this.groupBy.includes(";")) {
          let split = this.groupBy.split(";");
          for(let groups of split) {
            tempTable = this.groupByColumns(tempTable, groups.split(","), false);            
          }
        // single step grouping
        } else {
          tempTable = this.groupByColumns(tempTable, this.groupBy.split(","), false);
        }
      }

      // step-2: order the table rows based on provided columns (if any)
      if(this.orderBy && this.orderBy != "") {
        tempTable.rows.sort((a, b) => { 
          // console.log("sort(", a, b, ")");
          let eqa = a.cells.filter(elt => elt.headerId == this.orderBy)[0]; 
          let eqb = b.cells.filter(elt => elt.headerId == this.orderBy)[0];
          return eqa.values[0].label.localeCompare(eqb.values[0].label);
        }); 
      }

      // step-3: filter the table based on provided {col, values} (if any)
      if(this.filterBy && this.filterBy != "") {
        // multiple steps grouping
        if(this.filterBy.includes(";")) {
          let split = this.filterBy.split(";");
          for(let filters of split) {
            tempTable = this.filterByColumns(tempTable, filters);
          }
        // single step grouping
        } else {
          tempTable = this.filterByColumns(tempTable, this.filterBy);
        }    
      }

      // step-4: hide columns based on provided hideColumns parameter
      if(this.hideColumns && this.hideColumns != "") {
        let cols = this.hideColumns.includes(",") ? this.hideColumns.split(",") : [this.hideColumns];
        for(let header of tempTable.header) {
          header.hide = cols.includes(header.id);
        }      
      }

      // assigning this to the state - will trigger a render
      this.table = tempTable;
      this.createHeaderMap();
    }    
  }

  goContextURL = "https://raw.githubusercontent.com/prefixcommons/biocontext/master/registry/go_context.jsonld";
  curie;

  componentWillLoad() {

    // enter with the regular data format
    if (this.data) {
      this.loadFromData();

      // enter with biolink data format
    } else if (this.bioLinkData) {
      this.loadFromBioLinkData();

    }
  }

  createHeaderMap() {
    this.headerMap = new Map();
    for(let header of this.table.header) {
      this.headerMap.set(header.id, header);
    }
  }

  mergeCells(cells) {
    return cells;
  }


  /**
   * Will group the table rows based on unique values in specified columns
   * @param table the table to be grouped
   * @param keyColumns ids of the columns to create unique rows - will only work with cells containing single value, not array
   * @param filterRedudancy if true, the values of merged columns will be filtered
   */
  groupByColumns(table, keyColumns, filterRedudancy = true) {
    // console.log("groupByColumns(", table , keyColumns, filterRedudancy , ")");

    var firstRow = table.rows[0].cells;
    var otherCells = firstRow.filter(elt => !keyColumns.includes(elt.headerId));
    var otherColumns = otherCells.map(elt => elt.headerId);
    // console.log("other cols: ", otherColumns);
    
    // building the list of unique rows
    var uRows = new Map();
    for(let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      let keyCells = row.cells.filter(elt => keyColumns.includes(elt.headerId));
      let key = keyCells.map(elt => elt.values[0].label).join("-");

      let rows = [];
      if(uRows.has(key)) {
        rows = uRows.get(key);
      } else {
        uRows.set(key, rows);
      }
      rows.push(row);
    }
    // console.log("unique rows: ", uRows);

    var newTable = { newTab: table.newTab, header : table.header, rows : [] }


    // this was required either by stenciljs or web component 
    // for an integration in alliance REACT project
    // somehow more recent iterators on Map were not working !
    var akeys = Array.from( uRows.keys() );

    // going through each set of unique rows
    // for(let rrows of uRows.values()) {
    for(let i = 0; i < akeys.length; i++) {
      let key = akeys[i];
      let rrows = uRows.get(key);
      // console.log("Uniq.Row ("  , key , "): ", rrows);
      let row = { cells: [] }      
      for(let header of table.header) {
        // console.log(" --- header: ", header);
        let eqcell : SuperCell = undefined;
        if(keyColumns.includes(header.id)) {
          eqcell = rrows[0].cells.filter(elt => elt.headerId == header.id)[0];
        } else if (otherColumns.includes(header.id)) {
          eqcell = {
            headerId: header.id,
            values: []
          }
          
          for(let eqrow of rrows) {
            let otherCell = eqrow.cells.filter(elt => elt.headerId == header.id)[0]
            eqcell.headerId = otherCell.headerId;
            eqcell.id = otherCell.id;
            eqcell.clickable = otherCell.clickable;
            eqcell.foldable = otherCell.foldable;
            eqcell.selectable = otherCell.selectable;
            
            // TODO: can include test here for filder redudancy
            for(let val of otherCell.values) {
              if(filterRedudancy) { }
              eqcell.values.push(val);            
            }
          }  
        }

        // console.log(" --- H: ", header , "E: ", eqcell);
        if(eqcell) {
          row.cells.push(eqcell);
        }
      }
      newTable.rows.push(row);
    }
    return newTable;
  }

  filterByColumns(table, filters) {
    let split = filters.split(":");
    let key = split[0];
    let values = split[1];
    if(values.includes(",")) {
      values = values.split(",");
    } else {
      values  = [values];
    }

    table.rows = table.rows.filter(row => {
      let eqcell = row.cells.filter(elt => {
        return elt.headerId == key;
      })[0];
      let hasValue = eqcell.values.some(elt => {
        // return (elt.label && values.includes(elt.label)) || (elt.id && values.includes(elt.id));
        return (elt.label && values.some(val => elt.label.includes(val))) || (elt.id && values.some(val => elt.id.includes(val)));
      });
      return hasValue;
    });
    return table;
  }


  render() {
    if(!this.table) {
      return "";
    }

    // console.log("TABLE:", table);
    return (
      <div>
        <table class="table">
            { this.renderHeader(this.table) }
            { this.renderRows(this.table) }
        </table>
      </div>
    );
  }

  renderHeader(table) {
    return <tr class="table__header">
      {
        table.header.map( cell => {
          return [
            cell.hide ? "" 
                      : <th title={cell.description} id={cell.id} class="table__header__cell">{cell.label}</th>
          ]
        })
      }
    </tr>
  }

  renderRows(table) {
    // console.log("Render table: ", table);
    return ( 
      table.rows.map( row => {
        return [
          <tr class="table__row">
            {
              row.cells.map( superCell => {
                if(!this.headerMap) {
                  return "";
                }
                let header = this.headerMap.get(superCell.headerId);
                if(header.hide) {
                  return "";
                }

                let baseURL = header.baseURL;
                // adding automatically the ending slash cause too many problem (eg base URL that are example.com/tototo?uri=)
                // baseURL = baseURL ? addEndingSlash(baseURL) : "";
                baseURL = baseURL ? baseURL : "";

                return (
                  <td class="table__row__supercell">
                    <ul class="table__row__supercell__list">
                      {
                        // Todo: this is where we can have a strategy for folding cells                        
                        superCell.values.map( cell => {
                          let url = cell.url;
                          if(url && baseURL.length > 0) {
                            url = baseURL + url.replace(baseURL, "");
                          }

                          // create tags if any
                          let tag_span = "";
                          if(cell.tags) {
                            tag_span = <span class='table__row__supercell__cell--not'>{cell.tags.join(", ")}</span>;
                          }
                          
                          return [
                            <li title={cell.description} class="table__row__supercell__cell">
                                { 
                                  cell.url 
                                    ? <a class="table__row__supercell__cell__link" href={url} target={this.table.newTab ? "_blank" : "_self"}>{tag_span} {cell.label}</a> 
                                    : <div onClick={cell.clickable ? (() => this.onCellClick(cell)) : () => "" }>{tag_span} {cell.label}</div>
                                }
                            </li>
                        ]                          
                        })
                      }
                    </ul>
                  </td>                  
                )

              })
            }
          </tr>
        ]
      })
    )
  }
 
  
  onCellClick(cell) {
    console.log("Cell clicked: ", cell);
  }

  @Method()
  async showOriginalTable() {
    console.log(this.originalTable);
  }

  @Method()
  async showTable() {
    console.log(this.table);
  }


  @Method()
  async showCurie() {
    console.log(this.curie);
  }

  @Method()
  async showDBXrefs() {
    console.log(dbxrefs.getDBXrefs())
  }

}
