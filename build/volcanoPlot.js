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

        this.tables.parent = this;
        this.tables.init();
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
        var chart = this.parent;
        var settings = this.parent.config;

        chart.plots.svgs.each(function(d) {
            //draw the main hexes/circles
            var pointGroups = d3
                .select(this)
                .selectAll('g.hexGroups')
                .data(d.hexData)
                .enter()
                .append('g')
                .attr('class', 'hexGroup');

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
                            return chart.colorScale(d[settings.colorVar]);
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
                            return d.color;
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
                        .on('brushstart', brush.start)
                        .on('brush', brush.update)
                        .on('brushend', brush.end)
                );
        });
    }

    function start() {
        /*
  d3.select(this).classed("brushing",false)
  d3.selectAll(".volcanoPlot svg g")
  .classed("brushing",false)
  chart.classed("brushing", true);
  //clear all brushed hexes
  d3.selectAll("g.overlayGroup").remove()
    //clear any brush rectangles in other panels
  d3.selectAll(".volcanoPlot svg g:not(.brushing) g.brush rect.extent")
  .attr("height",0)
  .attr("width",0)
    //de-select all hexgroups
  var points=d3.selectAll("circle.point")
  .attr("fill-opacity",1)
  .classed("selected",false);
    var hexes=d3.selectAll("path.hex")
  .attr("fill-opacity",1)
  .classed("selected",false);
  */
    }

    function update() {
        /*
    console.log("Brushing")
      var points=chart.selectAll("circle.point");
      var hexes=chart.selectAll("path.hex");
      var e = d3.event.target.extent();
        //Flag selected points and hexes
      //note - the hex data is stored in pixels, but the point data and brush data is in raw units, so we have to handle transforms accordingly.
    points.classed("selected", function(d) {
        return e[0][0] <= +d["fc"] && +d["fc"] <= e[1][0]
            && e[0][1] <= +d["post"] && +d["post"] <= e[1][1];
      });
        hexes.classed("selected", function(d) {
        var x_raw = settings.x.invert(d.x)
        var y_raw = settings.y.invert(d.y)
          return e[0][0] <= x_raw && x_raw <= e[1][0]
          && e[0][1] <= y_raw && y_raw <= e[1][1]; // note - the order is flipped here because of the inverted pixel scale
      });
      //disable mouseover on unselected points
    //d3.selectAll("#"+outcome+" svg g g.allpoints g.points.unselected").classed("active",false)
    //d3.selectAll("#"+outcome+" svg g g.allpoints g.points.selected").classed("active",true)
    */
    }

    function end() {
        /*
    d3.selectAll("circle.point").attr("fill-opacity",0.5)
    d3.selectAll("path.hex").attr("fill-opacity",0.5)
    //	build a data set of the selected taxa
    var current_points=chart.selectAll("circle.selected").data()
    var current_hexes=chart.selectAll("path.selected").data()
    var current_hexes=d3.merge(current_hexes)
      console.log(current_points.length)
    console.log(current_hexes.length)
      var currentIDs=d3.merge([current_points,current_hexes]).map(function(d){return d[settings.vars.id]})
        //update the table
    //drawTable(current)
      //Draw the hex overlay
    //var overlaydata =
    //volcano.addHexData(overlaydata, settings, "overlay");
      d3.selectAll("div.volcanoPlot")
    .each(function(d){
      d.values.forEach(function(e){
        e.overlay = currentIDs.indexOf(e[settings.vars.id])>-1
      })
      volcano.addHexData([d], settings, "overlay");
      volcano.hexMap(d, d3.select(this).select("svg g"), settings)
    })
    */
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

    function init$3() {
        this.selected = {
            data: [],
            variables: [
                { value_col: 'phylum', label: 'Phylum' },
                { value_col: 'genus', label: 'Genus' },
                { value_col: 'gg_id', label: 'Details' }
            ],
            multiplier: 1
        };
        this.details = {
            data: {
                details: [],
                stats: []
            },
            variables: [
                { value_col: 'otu', label: 'OTU' },
                { value_col: 'phylum', label: 'Phylum' },
                { value_col: 'genus', label: 'Genus' },
                { value_col: 'family', label: 'Family' },
                { value_col: 'gg_id', label: 'Details' }
            ]
        };
        this.layout();
    }

    function search(value) {
        var _this = this;

        this.parent.data.searched =
            value !== ''
                ? this.parent.data.clean.filter(function(d) {
                      var match = false;

                      var _iteratorNormalCompletion = true;
                      var _didIteratorError = false;
                      var _iteratorError = undefined;

                      try {
                          for (
                              var _iterator = _this.selected.variables[Symbol.iterator](), _step;
                              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                              _iteratorNormalCompletion = true
                          ) {
                              var variable = _step.value;

                              if (match === false) {
                                  match = d[variable.value_col].toLowerCase().indexOf(value) > -1;
                                  if (match) break;
                              }
                          }
                      } catch (err) {
                          _didIteratorError = true;
                          _iteratorError = err;
                      } finally {
                          try {
                              if (!_iteratorNormalCompletion && _iterator.return) {
                                  _iterator.return();
                              }
                          } finally {
                              if (_didIteratorError) {
                                  throw _iteratorError;
                              }
                          }
                      }

                      return match;
                  })
                : [];
        this.drawSelected(this.parent.data.searched);
    }

    function layout$2() {
        var _this = this;

        var tables = this;

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
            .data(
                this.selected.variables.map(function(d) {
                    return d.label || d.value_col || d;
                })
            )
            .enter()
            .append('th')
            .text(function(d) {
                return d;
            });
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
            .on('click', function() {
                _this.selected.multiplier += 1;
                _this.drawSelected(_this.selected.data);
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

    function onClick(d, tables) {
        d3.select(this).classed('active', true);
        tables.drawDetails(d);
    }

    function drawSelected(data) {
        var _this = this;

        this.selected.data = data;
        this.selected.wrap.selectAll('.nSelected').text(data.length);
        this.selected.table.selectAll('tbody tr:not(#none-selected):not(#gimme-moar)').remove();
        this.selected.table.select('#none-selected').classed('hidden', data.length);
        this.selected.multiplier = data.length < 25 ? 1 : this.selected.multiplier;
        this.selected.table
            .select('#gimme-moar')
            .classed('hidden', data.length < 25 * this.selected.multiplier);
        var tables = this,
            rows = this.selected.table
                .select('tbody')
                .selectAll('tr.selected')
                .data(
                    data.filter(function(d, i) {
                        return i < 25 * _this.selected.multiplier;
                    })
                )
                .enter()
                .append('tr')
                .classed('selected', true)
                .on('click', function(d) {
                    rows.classed('active', false);
                    onClick.call(this, d, tables);
                });

        //Append data rows.
        rows.each(function(d) {
            var row = d3.select(this);

            row
                .selectAll('td')
                .data(
                    tables.selected.variables.map(function(variable) {
                        return d[variable.value_col];
                    })
                )
                .enter()
                .append('td')
                .text(function(d) {
                    return d;
                });
        });

        this.selected.table
            .select('tbody')
            .node()
            .appendChild(this.selected.table.select('#gimme-moar').node());
    }

    function drawDetails(datum) {
        this.details.data.info = datum;
        this.details.data.stats = this.parent.data.clean.filter(function(d) {
            return d.gg_id === datum.gg_id;
        });
        this.details.table.selectAll('tbody tr').remove();
        var infoHeader = this.details.table
                .select('tbody')
                .append('tr')
                .classed('header', true)
                .attr('id', 'info-header')
                .append('td')
                .attr('colspan', 2)
                .text('Taxa Information'),
            infoRows = this.details.table
                .select('tbody')
                .selectAll('tr.info')
                .data(this.details.variables)
                .enter()
                .append('tr')
                .classed('info', true),
            statsHeader = this.details.table
                .select('tbody')
                .append('tr')
                .classed('header', true)
                .attr('id', 'info-header')
                .append('td')
                .attr('colspan', 2)
                .text('Risk Ratios'),
            statsRows = this.details.table
                .select('tbody')
                .selectAll('tr.stats')
                .data(this.details.data.stats)
                .enter()
                .append('tr')
                .classed('stats', true);

        //Append info rows.
        infoRows.each(function(d) {
            var row = d3.select(this);

            row.append('td').text(function(d) {
                return d.label || d.value_col || d;
            });
            row.append('td').text(function(d) {
                return datum[d.value_col || d];
            });
        });

        //Append stats rows.
        statsRows.each(function(d) {
            var row = d3.select(this);

            row.append('td').text(function(d) {
                return d.plotName;
            });
            row.append('td').text(function(d) {
                return d3.format('.2f')(+d.fc) + ' (p=' + d3.format('.5f')(+d.p) + ')';
            });
        });
    }

    var tables = {
        init: init$3,
        layout: layout$2,
        drawSelected: drawSelected,
        drawDetails: drawDetails
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
            plots: plots,
            tables: tables
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
