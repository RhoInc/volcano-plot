export default function init() {
    this.selected = {columns: ['Phylum', 'Genus', 'Details']};
    this.details = {columns: ['key', 'value']};
    this.layout();
    this.drawSelected();
    this.drawDetails();
}
