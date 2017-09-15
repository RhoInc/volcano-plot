export function makeFilterToggle() {
    var controls = this;
    var chart = this.parent;
    var settings = this.parent.config;
    console.log(settings);
    this.filterToggle = {};
    if (settings.filterTypes.length > 1) {
        this.filterToggle.wrap = this.wrap.append('ul').attr('class', 'filterToggle');
        var toggleOptions = this.filterToggle.wrap
            .selectAll('li')
            .data(settings.filterTypes)
            .enter()
            .append('li')
            .append('a')
            .text(d => d)
            .classed('active', function(d, i) {
                return i == 0;
            });
        toggleOptions.on('click', function(d) {
            var activeFlag = d3.select(this).classed('active');
            if (!activeFlag) {
                toggleOptions.classed('active', false);
                controls.filterToggle.current = d;
                console.log(d);
                d3.select(this).classed('active', true);
                if (d == 'List') {
                    controls.makeList();
                } else if (d == 'Tree') {
                    controls.makeTree();
                }
            }
        });
    }
}
