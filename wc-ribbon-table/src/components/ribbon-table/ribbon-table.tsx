import { Component, h } from '@stencil/core';

import { Table, SuperCell } from '../../globals/models';
import { Prop, Watch } from '@stencil/core';
import { bioLinkToTable, addEmptyCells } from '../../globals/utils';

import { parseContext, CurieUtil } from '../../../node_modules/@geneontology/curie-util-es5'
import { State } from '@stencil/core';

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
   */
  @Prop() groupBy: string;

  /**
   * Must follow the appropriate JSON data model
   * Can be given as either JSON or stringified JSON
   */
  @Prop() data : string;

  /**
   * Contains the data object with the correct model (see model.tsx)
   */
  @State()
  table : Table; // = dataMockup;

  // @Watch('table')
  // tableChanged(newValue, oldValue) {
  //   if(newValue != oldValue) {
  //     this.updateTable();
  //   }
  // }

  /**
   * Contains (header_id ; header)
   * Used to speed up some cell processing (eg access baseURL)
   */
  headerMap;

  /**
   * Reading biolink data. This will trigger a render of the table as would changing data
   */
  @Prop() bioLinkData : string;

  @Watch('bioLinkData')
  bioLinkDataChanged(newValue, oldValue) {
    if(newValue != oldValue) {
      console.log("DATA CHANGED: ", newValue);
    }
  }

  updateTable() {
    if(this.table) {
      this.table = addEmptyCells(this.table);
      if(this.groupBy) {
        // multiple steps grouping
        if(this.groupBy.includes(";")) {
          let split = this.groupBy.split(";");
          for(let groups of split) {
            this.table = this.groupByColumns(this.table, groups.split(","), false);            
          }
        } else {
          this.table = this.groupByColumns(this.table, this.groupBy.split(","), false);
        }
      }    
      this.createHeaderMap();
    }    
  }

  goContextURL = "https://raw.githubusercontent.com/prefixcommons/biocontext/master/registry/go_context.jsonld";
  curie;
  componentWillLoad() {
    // console.log("TableWillLoad: data = " , this.data , " ; bioLinkData = " , this.bioLinkData);
    // enter with the regular data format
    if (this.data) {
      if (typeof this.data == "string") {
        this.table = JSON.parse(this.data);
      } else {
        this.table = this.data;
      }
      this.updateTable();

      // enter with biolink data format
    } else if (this.bioLinkData) {
      if(this.curie) {
        if (typeof this.bioLinkData == "string") {
          this.table = bioLinkToTable(JSON.parse(this.bioLinkData), this.curie);
        } else {
          this.table = bioLinkToTable(this.bioLinkData, this.curie);
        }
        this.updateTable();
      } else {
      fetch(this.goContextURL)
        .then(data => data.json())
        .then(json => {
          console.log("json: ", json);
          var map = parseContext(json);
          console.log("map: ", map);
          this.curie = new CurieUtil(map);
          console.log("curie: ",this.curie);
          if (typeof this.bioLinkData == "string") {
            this.table = bioLinkToTable(JSON.parse(this.bioLinkData), this.curie);
          } else {
            this.table = bioLinkToTable(this.bioLinkData, this.curie);
          }
          console.log(this.table);

          this.updateTable();
        }
        );
      }

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

    // going through each set of unique rows
    for(let rrows of uRows.values()) {
      console.log("Uniq.Row", rrows);
      let row = { cells: [] }      
      for(let header of table.header) {
        let eqcell : SuperCell = undefined;
        if(keyColumns.includes(header.id)) {
          eqcell = rrows[0].cells.filter(elt => elt.headerId == header.id)[0];
        } else if (otherColumns.includes(header.id)) {
          eqcell = {
            headerId: header.id,
            values: []
          }
          // console.log("oc: ", oc);
          for(let eqrow of rrows) {
            let otherCell = eqrow.cells.filter(elt => elt.headerId == header.id)[0]
            eqcell.headerId = otherCell.headerId;
            eqcell.id = otherCell.id;
            eqcell.clickable = otherCell.clickable;
            eqcell.foldable = otherCell.foldable;
            eqcell.selectable = otherCell.selectable;
            // console.log("-- othercell: " , otherCell);
            
            // TODO: can include test here for filder redudancy
            for(let val of otherCell.values) {
              if(filterRedudancy) { }
              eqcell.values.push(val);            
            }
          }  
        }
        console.log(header , eqcell);
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
      return "No data available";
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
                                    ? <a href={url} target={this.table.newTab ? "_blank" : "_self"}>{cell.label}</a> 
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

}
