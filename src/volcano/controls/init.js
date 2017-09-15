export function init() {
    // make Header
    this.wrap.append('h3').text('Controls');
    // make instructions
    this.wrap.append('span').text('Use selections below to filter the volcano plots');

    //make FilterToggle
    this.makeFilterToggle();

    //initialize the filters
    if (settings.filterTypes) {
        if (settings.filterTypes[0] == 'List') {
            this.makeList();
        } else if (settings.filterTypes[0] == 'Tree') {
            this.makeTree();
        }
    } else {
        //or hide the controls div if filters aren't provided
        this.wrap.classed('hidden', true);
    }
}
