(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
          ? define(factory)
          : (global.volcanoPlot = factory());
})(this, function() {
    'use strict';

    var defaultSettings = {
        p_col: null,
        ratio_col: null,
        reference_col: null,
        comparison_col: null,
        height: 240,
        width: 300,
        margin: { top: 10, right: 10, bottom: 50, left: 80 },
        showYaxis: 'all',
        structure: [],
        colorVar: '',
        ratioLimit: 2.0,
        hexbin: {
            radius: { min: 3, max: 10 },
            countRange: { min: 3, max: 100 }
        }
    };

    function setDefaults(settings) {
        settings.p_col = settings.p_col ? settings.p_col : defaultSettings.p_col;
        settings.ratio_col = settings.ratio_col ? settings.ratio_col : defaultSettings.ratio_col;
        settings.height = settings.height ? settings.height : defaultSettings.height;
        settings.width = settings.width ? settings.width : defaultSettings.width;
        settings.margin = settings.margin ? settings.margin : defaultSettings.margin;
        settings.showYaxis = settings.showYaxis ? settings.showYaxis : defaultSettings.showYaxis;
        settings.structure = settings.structure ? settings.structure : [];
        settings.colorVar = settings.colorVar
            ? settings.colorVar
            : settings.structure.length >= 1 ? settings.structure[0] : defaultSettings.colorVar;
        settings.ratioLimit = settings.ratioLimit
            ? settings.ratioLimit
            : defaultSettings.ratioLimit;
        settings.hexbin = settings.hexbin ? settings.hexbin : {};
        settings.hexbin.radius = settings.hexbin.radius
            ? settings.hexbin.radius
            : defaultSettings.hexbin.radius;
        settings.hexbin.countRange = settings.hexbin.countRange
            ? settings.hexbin.countRange
            : defaultSettings.hexbin.countRange;

        return settings;
    }

    function init(data) {
        this.wrap = d3
            .select(this.element)
            .append('div')
            .attr('class', 'ig-volcano');

        this.config = setDefaults(this.config);
        this.layout();

        this.data = {};
        this.data.raw = data;
        this.data.clean = this.makeCleanData();
        this.makeScales();
        this.data.nested = this.makeNestedData();

        this.plots.parent = this;
        this.plots.init();

        console.log(this);
    }

    function makeScales() {
        var chart = this;
        var settings = this.config;

        this.x = d3.scale
            .linear()
            .range([0, settings.width])
            .domain(
                d3.extent(this.data.clean, function(d) {
                    return d[settings.ratio_col];
                })
            );

        this.y = d3.scale
            .log()
            .range([settings.height, 0])
            .domain([
                1,
                d3.min(this.data.clean, function(d) {
                    return d[settings.p_col];
                })
            ]);

        this.xAxis = d3.svg
            .axis()
            .scale(this.x)
            .orient('bottom');
        this.yAxis = d3.svg
            .axis()
            .scale(this.y)
            .orient('left')
            .ticks(5, d3.format('r'));

        this.colorScale = d3.scale
            .ordinal()
            .range(d3.scale.category10().range())
            .domain(
                d3
                    .set(
                        this.data.clean.map(function(d) {
                            return d[settings.colorVar];
                        })
                    )
                    .values()
            );

        this.radiusScale = d3.scale
            .sqrt()
            .range([settings.hexbin.radius.min, settings.hexbin.radius.max])
            .domain([settings.hexbin.countRange.min, settings.hexbin.countRange.max]);

        this.hexbin = d3
            .hexbin()
            .size([settings.width, settings.height])
            .radius(settings.hexbin.radius.max)
            .x(function(d) {
                return chart.x(d[settings.ratio_col]);
            })
            .y(function(d) {
                return chart.y(d[settings.p_col]);
            });
    }

    function makeCleanData() {
        var data = this.data.raw;
        var settings = this.config;

        var clean = data.map(function(d) {
            d.plotName = d[settings.comparison_col] + ' vs. ' + d[settings.reference_col];
            d[settings.p_col] = +d[settings.p_col];
            d[settings.ratio_col] = +d[settings.ratio_col];
            if (d[settings.ratio_col] > settings.ratioLimit) {
                d.origRatio = d[settings.ratio_col];
                d[settings.ratio_col] = +settings.ratioLimit;
                d.aboveLimit = true;
            }
            return d;
        });

        return clean;
    }

    function makeNestedData() {
        //convenience mappings
        var chart = this;
        var data = this.data.clean;
        var settings = this.config;

        var nested = d3
            .nest()
            .key(function(d) {
                return d.plotName;
            })
            .entries(data);
        nested.forEach(function(d) {
            d.hexData = chart.hexbin(d.values);
            console.log(d.hexData);
            //Flag the groups to draw the individual points
            d.hexData.forEach(function(e) {
                e.drawCircles = e.length <= settings.hexbin.countRange.min; //draw circles (t) or hex (f)

                //Set the radius of each hex
                e.size =
                    e.length > settings.hexbin.countRange.max
                        ? settings.hexbin.countRange.max
                        : e.length; //calculate the radius variable

                //count records for each level
                e.levels = d3
                    .nest()
                    .key(function(d) {
                        return d[settings.colorVar];
                    })
                    .rollup(function(d) {
                        return d.length;
                    })
                    .entries(e);

                e.levels.sort(function(a, b) {
                    return b.values - a.values;
                });
                e.color = chart.colorScale(e.levels[0].key);
            });
        });
        return nested;
    }

    function layout() {
        this.wrap.append('div').attr('class', 'top');
        this.wrap.append('div').attr('class', 'middle');
        var bottom = this.wrap.append('div').attr('class', 'bottom');
        bottom.append('div').attr('class', 'info third');
        bottom.append('div').attr('class', 'summarytable third');
        bottom.append('div').attr('class', 'details third');
    }

    function init$1() {
        this.layout();
        this.drawAxis();
        this.draw();
    }

    function layout$1() {
        var chart = this.parent;
        var settings = this.parent.config;

        chart.plots.svgs = chart.wrap
            .select('div.middle')
            .selectAll('div.volcanoPlot')
            .data(chart.data.nested, function(d) {
                return d.key;
            })
            .enter()
            .append('div')
            .attr('class', 'volcanoPlot')
            .append('svg')
            .attr('height', settings.height + settings.margin.top + settings.margin.bottom)
            .attr('width', function(d, i) {
                //change left margin
                return (i > 0) & (settings.showYaxis == 'first')
                    ? settings.width + (settings.margin.left - 60) + settings.margin.right
                    : settings.width + settings.margin.left + settings.margin.right;
            })
            .append('g')
            .attr('transform', function(d, i) {
                return (i > 0) & (settings.showYaxis == 'first')
                    ? 'translate(' + (settings.margin.left - 60) + ',' + settings.margin.top + ')'
                    : 'translate(' + settings.margin.left + ',' + settings.margin.top + ')';
            });
    }

    function drawAxis() {
        var chart = this.parent;
        var settings = this.parent.config;
        chart.plots.svgs
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + settings.height + ')')
            .call(chart.xAxis)
            .append('text')
            .attr('class', 'label')
            .attr('font-size', '24')
            .attr('x', 450)
            .attr('dy', '2em')
            .attr('fill', '#999')
            .style('text-anchor', 'middle')
            .text('Risk Ratio');

        chart.plots.svgs.each(function(d, i) {
            if (i == 0 || settings.showYaxis !== 'first') {
                var yAxisWrap = d3
                    .select(this)
                    .append('g')
                    .attr('class', 'y axis')
                    .call(chart.yAxis);

                yAxisWrap
                    .append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '-65px')
                    .attr('font-size', '24')
                    .attr('fill', '#999')
                    .style('text-anchor', 'end')
                    .text('p-value');

                yAxisWrap
                    .append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '-53px')
                    .attr('font-size', '10')
                    .attr('fill', '#999')
                    .style('text-anchor', 'end')
                    .text('(Click to change quadrants)');
            }
        });
    }

    function draw() {
        var chart = this.parent;
        var settings = this.parent.config;

        console.log("Will draw the points and set up the brush here (It's going to be great).");
        //plots.each(function(d){
        //  volcano.hexMap(d, d3.select(this), settings, "main")
        //  volcano.addBrush(d, d3.select(this), settings)
        //})
    }

    var plots = {
        init: init$1,
        layout: layout$1,
        drawAxis: drawAxis,
        draw: draw
    };

    function createVolcano() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var config = arguments[1];

        var volcano = {
            element: element,
            config: config,
            init: init,
            makeScales: makeScales,
            layout: layout,
            makeCleanData: makeCleanData,
            makeNestedData: makeNestedData,
            plots: plots
        };

        volcano.events = {
            init: function init$$1() {},
            complete: function complete() {}
        };

        volcano.on = function(event, callback) {
            var possible_events = ['init', 'complete'];
            if (possible_events.indexOf(event) < 0) {
                return;
            }
            if (callback) {
                volcano.events[event] = callback;
            }
        };

        return volcano;
    }

    var index = {
        createVolcano: createVolcano
    };

    return index;
});
