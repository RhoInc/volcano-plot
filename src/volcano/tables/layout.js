export default function layout() {
  //Selected table
    this.selected.wrap = this.parent.wrap
        .append('div')
        .classed('table', true)
        .attr('id', 'selected-table');
    this.selected.wrap
        .append('div')
        .classed('title', true)
        .html('Selected Taxa (n=<span id = "nSelected">0</span>)');
    this.selected.wrap
        .append('div')
        .classed('instruction', true)
        .html('Click and drag a figure or use the search bar below to select taxa.');
    this.selected.table = this.selected.wrap
        .append('table');
    this.selected.table
        .append('thead')
        .selectAll('th')
            .data(this.selected.variables.map(d => d.label || d.value_col || d))
            .enter()
        .append('th')
        .text(d => d);
    this.selected.table
        .append('tbody')
        .append('tr')
        .append('td')
        .attr({
            'id': 'none-selected',
            'colspan': this.selected.variables.length
        })
        .text('None selected');

  //Details table
    this.details.wrap = this.parent.wrap
        .append('div')
        .classed('table', true)
        .attr('id', 'details-table');
    this.details.wrap
        .append('div')
        .classed('title', true)
        .text('Details');
    this.details.wrap
        .append('div')
        .classed('instruction', true)
        .html('Mouse over the figure or summary table for taxa details.');
    this.details.table = this.details.wrap
        .append('table');
    this.details.table
        .append('thead');
    this.details.table
        .append('tbody');
}
