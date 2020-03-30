import { Component, h } from '@stencil/core';

import { dataMockup } from '../../globals/models';
import { Prop } from '@stencil/core';

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

  @Prop() data : string;

  table = dataMockup;

  componentWillLoad() {
  }

  // fetchData() {
  //   let url = "https://api.geneontology.org/api/bioentityset/slimmer/function?slim=GO:0002376&subject=HGNC:11998&rows=-1";    
  // }

  // fetchData(subjects, group) {
  //   if(subjects.includes(",")) {
  //       subjects = subjects.split(",");
  //   }
  //   if(subjects instanceof Array) {
  //       subjects = subjects.join('&subject=');
  //   }

  //   let query = this.baseApiUrl + '?subset=' + this.subset + '&subject=' + subjects;
  //   if(this.onlyExperimental) {
  //       query += EXP_CODES.map(exp => "&ecodes=" + exp).join("");
  //   }
  //   console.log('API query is ' + query);

  //   return fetch(query)
  //   .then( (response : Response) => {
  //       return response.json();
  //   })
  //   .catch( (error) => {
  //       return error;
  //   })
  // }      

  render() {

    return (
      <div>
        <table class="table">
            { this.renderHeader() }
            { this.renderRows() }
        </table>
      </div>
    );
  }

  renderHeader() {
    return <tr class="table__header">
      {
        this.table.header.map( cell => {
          return [
            <th title={cell.description} class="table__header__cell">{cell.label}</th>
          ]
        })
      }
    </tr>
  }

  renderRows() {
    return ( 
      this.table.rows.map( row => {
        return [
          <tr class="table__row">
            {
              row.cells.map( cell => {
                return [
                    <td title={cell.description} class="table__row__cell">
                        { 
                          cell.url 
                            ? <a href={cell.url} target={this.table.newTab ? "_blank" : "_self"}>{cell.label}</a> 
                            : <div  onClick={cell.clickable ? (() => this.onCellClick(cell)) : () => "" }>{cell.label}</div>
                        }
                    </td>
                ]
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
