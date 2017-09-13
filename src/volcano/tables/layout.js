import search from './drawSelected/search';

export default function layout() {
    const tables = this;

    /**-------------------------------------------------------------------------------------------\
      Selected table
    \-------------------------------------------------------------------------------------------**/

    //Header
    this.selected.wrap = this.parent.wrap
        .append('div')
        .classed('table', true)
        .attr('id', 'selected-table');
    this.selected.wrap
        .append('div')
        .classed('title', true)
        .html('Selected Taxa (n=<span class = "nSelected">0</span>)');
    this.selected.wrap
        .append('div')
        .classed('instruction', true)
        .html('Click and drag a figure or use the search bar below to select taxa.');

    //Search box
    this.selected.searchBox = this.selected.wrap.append('div').attr('id', 'search');
    this.selected.searchBox.append('span').text('Search:');
    this.selected.searchBox
        .append('input')
        .attr('type', 'search')
        .on('input', function() {
            search.call(tables, this.value.toLowerCase());
        });

    //Table
    this.selected.table = this.selected.wrap.append('table');
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
        .attr('id', 'none-selected')
        .append('td')
        .attr('colspan', this.selected.variables.length)
        .text('None selected');
    this.selected.table
        .select('tbody')
        .append('tr')
        .classed('hidden', true)
        .attr('id', 'gimme-moar')
        .append('td')
        .attr('colspan', this.selected.variables.length)
        .html(
            'Table displays 25 of <span class = "nSelected">0</span> rows. Click here to view 25 more rows.'
        )
        .on('click', () => {
            this.selected.multiplier += 1;
            this.drawSelected(this.selected.data);
        });

    /**-------------------------------------------------------------------------------------------\
      Details table
    \-------------------------------------------------------------------------------------------**/

    //Header
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

    //Table
    this.details.table = this.details.wrap.append('table');
    this.details.table.append('thead');
    this.details.table.append('tbody');
}
