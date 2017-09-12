(function() {
    d3.hexbin = function() {
        var width = 1,
            height = 1,
            r,
            x = d3_hexbinX,
            y = d3_hexbinY,
            dx,
            dy;

        function hexbin(points) {
            var binsById = {};

            points.forEach(function(point, i) {
                var py = y.call(hexbin, point, i) / dy,
                    pj = Math.round(py),
                    px = x.call(hexbin, point, i) / dx - (pj & 1 ? 0.5 : 0),
                    pi = Math.round(px),
                    py1 = py - pj;

                if (Math.abs(py1) * 3 > 1) {
                    var px1 = px - pi,
                        pi2 = pi + (px < pi ? -1 : 1) / 2,
                        pj2 = pj + (py < pj ? -1 : 1),
                        px2 = px - pi2,
                        py2 = py - pj2;
                    if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2)
                        (pi = pi2 + (pj & 1 ? 1 : -1) / 2), (pj = pj2);
                }

                var id = pi + '-' + pj,
                    bin = binsById[id];
                if (bin) bin.push(point);
                else {
                    bin = binsById[id] = [point];
                    bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                    bin.y = pj * dy;
                }
            });

            return d3.values(binsById);
        }

        hexbin.x = function(_) {
            if (!arguments.length) return x;
            x = _;
            return hexbin;
        };

        hexbin.y = function(_) {
            if (!arguments.length) return y;
            y = _;
            return hexbin;
        };

        hexbin.hexagon = function(radius) {
            var x0 = 0,
                y0 = 0;
            if (arguments.length < 1) radius = r;
            return (
                'm' +
                d3_hexbinAngles
                    .map(function(angle) {
                        var x1 = Math.sin(angle) * radius,
                            y1 = -Math.cos(angle) * radius,
                            dx = x1 - x0,
                            dy = y1 - y0;
                        (x0 = x1), (y0 = y1);
                        return [dx, dy];
                    })
                    .join('l') +
                'z'
            );
        };

        hexbin.mesh = function() {
            var path = [],
                mesh = hexbin
                    .hexagon()
                    .slice(0, 4)
                    .join('l');
            for (var y = 0, odd = false; y < height + r; y += dy, odd = !odd) {
                for (var x = odd ? dx / 2 : 0; x < width; x += dx) {
                    path.push('M', x, ',', y, 'm', mesh);
                }
            }
            return path.join('');
        };

        hexbin.size = function(_) {
            if (!arguments.length) return [width, height];
            (width = +_[0]), (height = +_[1]);
            return hexbin;
        };

        hexbin.radius = function(_) {
            if (!arguments.length) return r;
            r = +_;
            dx = r * 2 * Math.sin(Math.PI / 3);
            dy = r * 1.5;
            return hexbin;
        };

        return hexbin.radius(1);
    };

    var d3_hexbinAngles = d3.range(0, 2 * Math.PI, Math.PI / 3),
        d3_hexbinX = function(d) {
            return d[0];
        },
        d3_hexbinY = function(d) {
            return d[1];
        };
})();