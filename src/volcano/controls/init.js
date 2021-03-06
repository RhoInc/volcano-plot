export function init() {
    // make Header
    var head = this.wrap.append('div').attr('class', 'head');
    head.append('h3').text('Controls');
    // make instructions
    head
        .append('small')
        .text(
            'Use selections below to filter the volcano plots. Click text to select a single level. Click Checkbox to toggle the level.'
        );

    //initialize the filters
    if (settings.filterTypes) {
        this.filters = {};
        this.filters.parent = this;
        this.filters.current = settings.filterTypes[0];
        this.filters.toggle = {};
        this.filters.toggle.wrap = this.wrap.append('ul').attr('class', 'filter toggle');
        this.filters.tree = {};
        this.filters.tree.wrap = this.wrap.append('div').attr('class', 'filter tree');

        this.filters.list = {};
        this.filters.list.wrap = this.wrap.append('div').attr('class', 'filter list');

        //initialize the filters
        if (settings.filterTypes.length > 1) {
            this.makeFilterToggle();
        }

        if (settings.filterTypes.indexOf('List') > -1) {
            this.filters.list.var = settings.structure_cols[0].value_col;
            this.makeListVarSelect();
            this.makeList();
            this.filters.list.wrap.classed('hidden', this.filters.current != 'List');
        }

        if (settings.filterTypes.indexOf('Tree') > -1) {
            this.makeTree();
            this.filters.tree.wrap.classed('hidden', this.filters.current != 'Tree');
        }

        console.log(this);
        //make FilterToggle (if needed)
    } else {
        //or hide the controls div if filters aren't provided
        this.wrap.classed('hidden', true);
    }
}
