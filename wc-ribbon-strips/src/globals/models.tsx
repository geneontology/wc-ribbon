export class RibbonGroup {
    id: string;
    label: string;
    description: string;
    type: string;
}

export class RibbonCategory {
    id: string;
    label: string;
    description: string;
    groups: [RibbonGroup];
}

export class RibbonSubject {
    id: string;
    label: string;
    taxon_id: string;
    taxon_label: string;
    nb_classes: number;
    nb_annotations: number;    
    groups: [{}];
}

export class RibbonModel {
    categories: [RibbonCategory];
    subjects: [RibbonSubject];
}

export class RibbonCellEvent {
    subjects : [RibbonSubject];
    group : RibbonGroup;
}

export class RibbonCellClick extends RibbonCellEvent {
    selected : boolean[];
}

