export default function init() {
    this.selected = {
        data: [],
        variables:
            [
                {value_col: 'phylum', label: 'Phylum'}
            ,
                {value_col: 'genus', label: 'Genus'}
            ,
                {value_col: 'gg_id', label: 'Details'}
            ]};
    this.details = {
        data:
            {details: []
            ,stats: []},
        variables:
            [
                {value_col: 'otu', label: 'OTU'}
            ,
                {value_col: 'phylum', label: 'Phylum'}
            ,
                {value_col: 'genus', label: 'Genus'}
            ,
                {value_col: 'family', label: 'Family'}
            ,
                {value_col: 'gg_id', label: 'Details'}
            ]};
    this.layout();
    this.drawSelected(this.parent.data.raw.filter((d,i) => i < 100));
}
