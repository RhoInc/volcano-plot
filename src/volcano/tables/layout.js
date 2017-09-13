export default function layout() {
  //Selected table
    this.selected.wrap = this.parent.wrap
        .append('div')
        .classed('table selected-table', true);
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
            .data(this.selected.columns)
            .enter()
        .append('th')
        .text(d => d);
    this.selected.table
        .append('tbody')
        .append('tr')
        .append('td')
        .attr('colspan', this.selected.columns.length)
        .text('None selected');

  //Details table
    this.details.wrap = this.parent.wrap
        .append('div')
        .classed('details-table', true);
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
