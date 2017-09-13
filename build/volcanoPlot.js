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

    function makeNestedData(ids) {
        //convenience mappings
        var chart = this;
        var data = this.data.clean;
        var settings = this.config;
        if (ids) {
            var idset = new Set(ids);
            data = data.filter(function(d) {
                return idset.has(d[settings.id_col]);
            });
        }

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
        this.drawHexes();
        this.brush.parent = this;
        this.brush.init();
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

    function drawHexes() {
        var overlay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var chart = this.parent;
        var settings = this.parent.config;
        chart.plots.svgs.each(function(d) {
            //draw the main hexes/circles
            var pointGroups = d3
                .select(this)
                .selectAll('g.hexGroups')
                .data(overlay ? d.overlay : d.hexData)
                .enter()
                .append('g')
                .attr('class', 'hexGroup')
                .classed('overlay', overlay);

            pointGroups.each(function(d) {
                if (d.drawCircles) {
                    d3
                        .select(this)
                        .selectAll('circle')
                        .data(d)
                        .enter()
                        .append('circle')
                        .attr('class', 'point')
                        .attr('cx', function(d) {
                            return chart.x(d[settings.ratio_col]);
                        })
                        .attr('cy', function(d) {
                            return chart.y(d[settings.p_col]);
                        })
                        .attr('r', 2)
                        .attr('fill', function(d) {
                            return overlay ? 'white' : chart.colorScale(d[settings.colorVar]);
                        });
                } else {
                    d3
                        .select(this)
                        .append('path')
                        .attr('class', 'hex')
                        .attr('d', function(d) {
                            return chart.hexbin.hexagon(chart.radiusScale(d.size));
                        })
                        .attr('transform', function(d) {
                            return 'translate(' + d.x + ',' + d.y + ')';
                        })
                        .attr('fill', function(d) {
                            return overlay ? 'white' : d.color;
                        });
                }
            });
        });
    }

    function init$2() {
        var brush = this;
        var plots = this.parent;
        var chart = this.parent.parent;

        chart.plots.svgs.each(function(d) {
            d3
                .select(this)
                .append('g')
                .attr('class', 'brush')
                .call(
                    d3.svg
                        .brush()
                        .x(chart.x)
                        .y(chart.y)
                        .on('brushstart', function(d) {
                            brush.start.call(this, chart);
                        })
                        .on('brush', function(d) {
                            brush.update.call(this, chart);
                        })
                        .on('brushend', function(d) {
                            brush.end.call(this, chart);
                        })
                );
        });
    }

    function start(chart) {
        console.log('start brush');
        var brush = chart.plots.brush;
        var plots = chart.plots;
        var current = d3.select(this.parentNode.parentNode);

        chart.wrap.classed('brushed', true);
        plots.svgs.classed('brushing', false);
        current.classed('brushing', true);

        //clear all brushed hexes
        d3.selectAll('g.hexGroup.overlay').remove();

        //clear any brush rectangles in other panels
        chart.plots.svgs
            .selectAll('g:not(.brushing) g.brush rect.extent')
            .attr('height', 0)
            .attr('width', 0);

        //de-select all hexgroups
        var points = chart.plots.svgs
            .selectAll('circle.point')
            .attr('fill-opacity', 1)
            .classed('selected', false);

        var hexes = chart.plots.svgs
            .selectAll('path.hex')
            .attr('fill-opacity', 1)
            .classed('selected', false);
    }

    function update(chart) {
        console.log('brushing');
        var brush = chart.plots.brush;
        var settings = chart.config;
        var plots = chart.plots;
        var current = d3.select(this.parentNode.parentNode);
        var points = current.selectAll('circle.point');
        var hexes = current.selectAll('path.hex');
        var e = d3.event.target.extent();

        //Flag selected points and hexes
        //note - the hex data is stored in pixels, but the point data and brush data is in raw units, so we have to handle transforms accordingly.
        points.classed('selected', function(d) {
            return (
                e[0][0] <= +d[settings.ratio_col] &&
                +d[settings.ratio_col] <= e[1][0] &&
                e[0][1] <= +d[settings.p_col] &&
                +d[settings.p_col] <= e[1][1]
            );
        });

        hexes.classed('selected', function(d) {
            var x_raw = chart.x.invert(d.x);
            var y_raw = chart.y.invert(d.y);

            return e[0][0] <= x_raw && x_raw <= e[1][0] && e[0][1] <= y_raw && y_raw <= e[1][1]; // note - the order is flipped here because of the inverted pixel scale
        });

        //disable mouseover on unselected points
        //d3.selectAll("#"+outcome+" svg g g.allpoints g.points.unselected").classed("active",false)
        //d3.selectAll("#"+outcome+" svg g g.allpoints g.points.selected").classed("active",true)
    }

    function end(chart) {
        console.log('end brushing');

        var brush = chart.plots.brush;
        var settings = chart.config;
        var plots = chart.plots;
        var current = d3.select(this.parentNode.parentNode);

        //	build a data set of the selected taxa
        var current_points = current.selectAll('circle.selected').data();
        var current_hexes = current.selectAll('path.selected').data();
        var current_hexes = d3.merge(current_hexes);
        var currentIDs = d3.merge([current_points, current_hexes]).map(function(d) {
            return d[settings.id_col];
        });

        //prep hex overlay data
        if (currentIDs.length) {
            chart.data.overlay = chart.makeNestedData(currentIDs);
            chart.data.nested.forEach(function(d) {
                if (d.key != current.data()[0].key) {
                    d.overlay = chart.data.overlay.filter(function(e) {
                        return e.key == d.key;
                    })[0].hexData;
                } else {
                    d.overlay = [];
                }
            });
        } else {
            chart.data.nested.forEach(function(d) {
                d.overlay = [];
                chart.wrap.classed('brushed', false);
            });
        }

        //draw hex overlays
        plots.svgs.each(function(d) {
            chart.plots.drawHexes(true);
        });
    }

    var brush = {
        init: init$2,
        start: start,
        update: update,
        end: end
    };

    var plots = {
        init: init$1,
        layout: layout$1,
        drawAxis: drawAxis,
        drawHexes: drawHexes,
        brush: brush
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
