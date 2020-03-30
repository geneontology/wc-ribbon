// export function filterPB(assocs) {
//     var list = [];
//     for (var assoc of assocs) {
//         if (assoc.object.id != 'GO:0005515') {
//             list.push(assoc);
//         }
//     }
//     return list;
// }

// // export function getEXP(assocs) {
// //     var list = [];
// //     for (var assoc of assocs) {
// //         if (assoc.evidence_type in exp_codes) {
// //             list.push(assoc);
// //         }
// //     }
// //     return list;
// // }

// export function getAspect(group) {
//     for (let cat of this.state.ribbon.categories) {
//         let found = cat.groups.filter(elt => {
//             return elt.id == group.id;
//         });
//         if (found.length > 0) {
//             return cat;
//         }
//     }
//     return undefined;
// }

// export function getAspectIdLabel(group) {
//     for (let cat of this.state.ribbon.categories) {
//         let found = cat.groups.filter(elt => {
//             return elt.id == group.id;
//         });
//         if (found.length > 0) {
//             return [cat.id, cat.label];
//         }
//     }
//     return undefined;
// }

// export function filterCrossAspect(group, assocs) {
//     var list = [];
//     var aspect = this.getAspectIdLabel(group);
//     for (var assoc of assocs) {
//         let cat = assoc.object.category[0] == 'molecular_activity' ? 'molecular_function' : assoc.object.category[0];
//         if (aspect == undefined || cat == aspect[1]) {
//             list.push(assoc);
//         }
//     }
//     return list;
// }





// export function sameEntity(entity1, entity2) {
//     return entity1.id == entity2.id &&
//         entity1.iri == entity2.iri &&
//         JSON.stringify(entity1.category) == JSON.stringify(entity2.category)
// }

// export function sameEvidences(assoc1, assoc2) {
//     if (assoc1.evidence != assoc2.evidence || assoc1.evidence_type != assoc2.evidence_type)
//         return false;
//     if (JSON.stringify(assoc1.evidence_closure) != JSON.stringify(assoc2.evidence_closure))
//         return false;
//     if (JSON.stringify(assoc1.evidence_subset_closure) != JSON.stringify(assoc2.evidence_subset_closure))
//         return false;
//     if (JSON.stringify(assoc1.evidence_type_closure) != JSON.stringify(assoc2.evidence_type_closure))
//         return false;
//     if (JSON.stringify(assoc1.publications) != JSON.stringify(assoc2.publications))
//         return false;
//     if (assoc1.reference && assoc2.reference)
//         if (JSON.stringify(assoc1.reference) != JSON.stringify(assoc2.reference))
//             return false;
//     if (JSON.stringify(assoc1.provided_by) != JSON.stringify(assoc2.provided_by))
//         return false;
//     if (assoc1.evidence_with && assoc2.evidence_with)
//         return JSON.stringify(assoc1.evidence_with) != JSON.stringify(assoc2.evidence_with);
//     return true;
// }

// export function sameAssociation(assoc1, assoc2) {
//     if (!this.sameEntity(assoc1.subject, assoc2.subject))
//         return false;
//     if (!this.sameEntity(assoc1.object, assoc2.object))
//         return false;
//     if (assoc1.negated != assoc2.negated)
//         return false;
//     if (assoc1.qualifier && assoc2.qualifier)
//         return JSON.stringify(assoc1.qualifier) == JSON.stringify(assoc2.qualifier)
//     if (assoc1.slim && assoc2.slim)
//         return JSON.stringify(assoc1.slim) == JSON.stringify(assoc2.slim)
//     return true;
// }

// export function evidenceAssociationKey(assoc) {
//     return this.associationKey(assoc) + '@' + assoc.evidence_type;
// }

// export function associationKey(assoc) {
//     if (assoc.qualifier) {
//         return assoc.subject.id + '@' + assoc.object.id + '@' + assoc.negated + '@' + assoc.qualifier.join("-");
//     }
//     return assoc.subject.id + '@' + assoc.object.id + '@' + assoc.negated;
// }

// export function fullAssociationKey(assoc) {
//     var key = this.associationKey(assoc) + '@' + assoc.evidence_type + '@' + assoc.provided_by + '@' + assoc.reference.join('#');
//     return key;
// }

// export function diffAssociations(assocs_all, assocs_exclude) {
//     var list = [];
//     for (let assoc of assocs_all) {
//         let found = false;
//         let key_all = this.fullAssociationKey(assoc);
//         for (let exclude of assocs_exclude) {
//             let key_exclude = this.fullAssociationKey(exclude);
//             if (key_all == key_exclude) {
//                 found = true;
//                 break;
//             }
//         }
//         if (!found) {
//             list.push(assoc);
//         }
//     }
//     return list;
// }

// /**
//  * Group association based on the keys (subject , object) and (optional) qualifier
//  * @param {*} assoc_data 
//  */
// export function groupAssociations(assoc_data) {
//     var grouped_map = new Map();
//     for (var assoc of assoc_data) {
//         var key = this.associationKey(assoc);
//         var array = []
//         if (grouped_map.has(key)) {
//             array = grouped_map.get(key);
//         } else {
//             grouped_map.set(key, array);
//         }
//         array.push(assoc);
//     }
//     return grouped_map;
// }

// export function concatMaps(map1, map2) {
//     var map = new Map();
//     for (var key of map1.keys()) {
//         map.set(key, map1.get(key));
//     }
//     for (var key of map2.keys()) {
//         if (map.has(key)) {
//             var current = map.get(key);
//             var array = map2.get(key);
//             for (var item of array) {
//                 current.push(item);
//             }
//         } else {
//             map.set(key, map2.get(key));
//         }
//     }
//     return map;
// }

// export function mergeEvidences(grouped_map) {
//     var merged = []
//     for (var [key, group] of grouped_map.entries()) {
//         if (group.length == 1) {
//             merged.push(group[0])
//         } else {
//             // merge evidences
//             var evidence_map = new Map();
//             for (var i = 0; i < group.length; i++) {
//                 evidence_map = this.concatMaps(evidence_map, group[i].evidence_map);
//             }

//             group[0].evidence_map = evidence_map;

//             // merge publications
//             var pubs = new Set();
//             for (var i = 0; i < group.length; i++) {
//                 if (group[i].publications) {
//                     for (var pub of group[i].publications) {
//                         pubs.add(pub);
//                     }
//                 }
//             }
//             group[0].publications = Array.from(pubs);

//             // merge references
//             var refs = new Set();
//             for (var i = 0; i < group.length; i++) {
//                 if (group[i].reference) {
//                     for (var ref of group[i].reference) {
//                         refs.add(ref);
//                     }
//                 }
//             }
//             group[0].reference = Array.from(refs);

//             merged.push(group[0]);
//         }
//     }
//     return merged
// }

// /** 
//  * build from the association response of BioLink
// */
// export function buildEvidenceMap() {
//     console.log('assoc_data: ', this.state.selected.data);
//     for (var assoc of this.state.selected.data) {
//         assoc.evidence_map = new Map();
//         assoc.evidence_map.set(assoc.evidence, [
//             {
//                 evidence_id: assoc.evidence,
//                 evidence_type: assoc.evidence_type,
//                 evidence_label: assoc.evidence_label,
//                 evidence_qualifier: assoc.evidence_qualifier ? assoc.evidence_qualifier : [],
//                 evidence_with: assoc.evidence_with ? assoc.evidence_with : [],
//                 evidence_refs: assoc.reference ? assoc.reference.filter(ref => ref.startsWith("PMID:")) : []
//             }
//         ]);
//     }

//     var grouped_map = this.groupAssociations(this.state.selected.data);
//     var merged_map = this.mergeEvidences(grouped_map);

//     return {
//             subject : this.state.selected.subject,
//             group : this.state.selected.group,
//             data : merged_map,
//             ready : true
//           }
// }

// export function filterOther(assocs, subjects, group) {
//     console.log("assocs: ", assocs);
//     console.log("group: ", group);

//     // Hard coded subjects[0]
//     var subject_id = subjects[0];
//     console.log("subject_id: ", group.id + (group.type == "Other" ? "-other" : "") , subject_id);
//     var item = this.getSubjectItem(subject_id, group.id + (group.type == "Other" ? "-other" : ""));
//     console.log("item: ", item);
    
//     var filteredAssocs = [];
//     for(let assoc of assocs) {
//       if(item.ALL.terms.includes(assoc.object.id)) {
//         filteredAssocs.push(assoc);
//       }
//     }
//     return filteredAssocs;
//   }