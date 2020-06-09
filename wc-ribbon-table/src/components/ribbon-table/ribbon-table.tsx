import { Component, h } from '@stencil/core';

import { Table, SuperCell } from '../../globals/models';
import { Prop, Watch } from '@stencil/core';
import { bioLinkToTable, addEmptyCells } from '../../globals/utils';

import { parseContext, CurieUtil } from '../../../node_modules/@geneontology/curie-util-es5'
import { State } from '@stencil/core';
import { Method } from '@stencil/core';

// import { addEndingSlash, removeBaseURL } from '../../globals/utils';

// import { Table, Cell, Header, HeaderCell } from '../../globals/models';

@Component({
  tag: 'wc-ribbon-table',
  styleUrl: './ribbon-table.sass',
  shadow: true
})
export class RibbonTable {

  @Prop() baseApiUrl = "http://api.geneontology.org/api/ontology/ribbon/";

  @Prop() subjectBaseUrl: string = "http://amigo.geneontology.org/amigo/gene_product/";
  @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

  /**
   * Using this parameter, the table rows can bee grouped based on column ids
   * A multiple step grouping is possible by using a ";" between groups
   * Example: hid-1,hid-3 OR hid-1,hid-3;hid-2
   * Note: if value is "", remove any grouping
   */
  @Prop() groupBy: string;

  @Watch('groupBy')
  groupByChanged(newValue, oldValue) {
    console.log("groupByChanged(" , newValue , "; " , oldValue , ")");
    if(newValue != oldValue) {
      this.updateTable();
    }
  }

  /**
   * This is used to sort the table depending of a column
   * The column cells must be single values
   * Note: if value is "", remove any ordering
   */
  @Prop() orderBy: string;

  @Watch("orderBy")
  orderByChanged(newValue, oldValue) {
    if(newValue != oldValue) {
      console.log("orderBy: ", newValue);
    }
  }

  /**
   * Filter rows based on the presence of one or more values in a given column
   * Example: filter-by="evidence:ISS,ISO"
   * Note: if value is "", remove any filtering
   */
  @Prop() filterBy: string;

  @Watch("filterBy")
  filterByChanged(newValue, oldValue) {
    if(newValue != oldValue) {
      console.log("filterBy: ", newValue);
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
      console.log("DATA CHANGED: ", newValue);
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
      console.log("BIOLINK DATA CHANGED: ", newValue);
      this.loadFromBioLinkData();
    }
  }

  loadFromBioLinkData() {
    if(this.curie) {
      console.log("curie: ", this.curie);
      if (typeof this.bioLinkData == "string") {
        this.originalTable = bioLinkToTable(JSON.parse(this.bioLinkData), this.curie);
      } else {
        this.originalTable = bioLinkToTable(this.bioLinkData, this.curie);
      }
      this.updateTable();
    } else {
    fetch(this.goContextURL)
      .then(data => data.json())
      .then(json => {
        // console.log("json: ", json);
        var map = parseContext(json);
        // console.log("map: ", map);
        this.curie = new CurieUtil(map);
        console.log("curie: ", this.curie);
        if (typeof this.bioLinkData == "string") {
          this.originalTable = bioLinkToTable(JSON.parse(this.bioLinkData), this.curie);
        } else {
          this.originalTable = bioLinkToTable(this.bioLinkData, this.curie);
        }
        // console.log(this.table);
        this.updateTable();
      }
      );
    }
  }

  updateTable() {
    console.log("updateTable-1: ", this.originalTable);
    if(this.originalTable) {
      let tempTable = addEmptyCells(this.originalTable);
      console.log("updateTable-2: ", tempTable);
      if(this.groupBy) {
        console.log("updateTable-3: group-by(" + this.groupBy + ")");
        // multiple steps grouping
        if(this.groupBy.includes(";")) {
          let split = this.groupBy.split(";");
          for(let groups of split) {
            tempTable = this.groupByColumns(tempTable, groups.split(","), false);            
          }
        } else {
          tempTable = this.groupByColumns(tempTable, this.groupBy.split(","), false);
        }
      }
      this.table = tempTable;
      console.log("updateTable-4: ", this.table);
      this.createHeaderMap();
    }    
  }

  goContextURL = "https://raw.githubusercontent.com/prefixcommons/biocontext/master/registry/go_context.jsonld";
  curie;
  componentWillLoad() {
    // console.log("TableWillLoad: data = " , this.data , " ; bioLinkData = " , this.bioLinkData);

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
    console.log("groupByColumns(", table , keyColumns, filterRedudancy , ")");

    var firstRow = table.rows[0].cells;
    var otherCells = firstRow.filter(elt => !keyColumns.includes(elt.headerId));
    var otherColumns = otherCells.map(elt => elt.headerId);
    console.log("other cols: ", otherColumns);
    
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
    console.log("unique rows: ", uRows);

    var newTable = { newTab: table.newTab, header : table.header, rows : [] }

    // DEBUG
    console.log("uRows.entries(): " , uRows.entries());
    console.log("uRows.values(): " , uRows.values());


    console.log("DEBUG started");

    var keys = uRows.keys();
    console.log("keys: ", keys);
    for(var k of keys) {
      console.log("iterator key then map[key]: ", k , uRows.get(k));
    }

    var akeys = Array.from( uRows.keys() );
    console.log("akeys: ", akeys);
    for(let i = 0; i < akeys.length; i++) {
      console.log("loop key then map[key]: ", akeys[i] , uRows.get(akeys[i]));
    }

    for(var rrows of uRows.values()) {
      console.log("for var uRows.values() - rrows: ", rrows);
    }

    for(let rrows of uRows.values()) {
      console.log("for let uRows.values() - rrows: ", rrows);
    }

    for(var r in uRows) {
      for(var i = 0; i < uRows[r].length; i++) {
        console.log("for var r in uRows - r, i, value: ", r , i , uRows[r][i]);
      }
    }
    
    for (const [key, rrows] of uRows.entries()) {      
      console.log("for const uRows.entried() - [key, rrows]: ", key, rrows);
    }
    console.log("DEBUG finished");


    // going through each set of unique rows
    // for(let rrows of uRows.values()) {
    for (const [key, rrows] of uRows.entries()) {      
      console.log("Uniq.Row ("  , key , "): ", rrows);
      let row = { cells: [] }      
      for(let header of table.header) {
        console.log(" --- header: ", header);
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

        console.log(" --- H: ", header , "E: ", eqcell);
        if(eqcell) {
          row.cells.push(eqcell);
        }
      }
      newTable.rows.push(row);
    }
    return newTable;
  }


  render() {
    let table = this.table;
    if(!table) {
      return "";
    }

    // console.log("TABLE:", table);
    return (
      <div>
        <table class="table">
            { this.renderHeader(table) }
            { this.renderRows(table) }
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
                      : <th title={cell.description} class="table__header__cell">{cell.label}</th>
          ]
        })
      }
    </tr>
  }

  renderRows(table) {
    console.log("Render table: ", table);
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
                        superCell.values.map( cell => {
                          let url = cell.url;
                          if(url && baseURL.length > 0) {
                            url = baseURL + url.replace(baseURL, "");
                          }
                          return [
                            <li title={cell.description} class="table__row__supercell__cell">
                                { 
                                  cell.url 
                                    ? <a class="table__row__supercell__cell__link" href={url} target={this.table.newTab ? "_blank" : "_self"}>{cell.label}</a> 
                                    : <div  onClick={cell.clickable ? (() => this.onCellClick(cell)) : () => "" }>{cell.label}</div>
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

}
