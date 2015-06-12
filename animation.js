/*
 * Example of how to use:
 * var container = document.getElementsByClassName('animation')[0];
 * var tpl = container.children[0];
 * Terrasimation.init(data, container, tpl);
 * Terrasimation.setFilterFn(function(x) {
 *     return x.id % 2 === 0;
 * });
 * Terrasimation.showMore(2);
 *
 * If you exchange the filterFn 0 items will be shown.
 * I.e. if you call showMore(2) in total 2 elements will be shown. 
 */
var Terrasimation = {};

// The actual stuff
(function(Terrasimation) {

    'use strict';

    Terrasimation.init = init;
    Terrasimation.setFilterFn = setCondFn;
    Terrasimation.showMore = showMore;

    var data;
    var filter;
    var condFn;

    var nrToShow = 0;

    function setCondFn(_condFn) {
        condFn = _condFn;
        nrToShow = 0;
    }

    function showMore(items) {
        nrToShow += items;
        return filter(0, nrToShow)
    }

    function init(_data, container, tpl) {
        var reRenderFn = render(_data, 2);
        filter = filter.bind(null, reRenderFn);
        data = _data;
    }

    function reRender(getYFn, data, cols) {

        var currentYCord = document.documentElement.scrollTop || 
        	document.body.scrollTop;

        var nrVisible = 0;
        var wasVisible = 0;
        for (var i in data) {
            var item = data[i];

            if (item.visible) {
	            var row = Math.floor(nrVisible/cols);
                item.domNode.style.display = 'inline-block';
            	item.inViewPort = getYFn(row) - currentYCord < 3000;
                setTranslate3d(item, cols, nrVisible);
                nrVisible++;
            } else if (item.wasVisible) {
                item.domNode.style.display = 'inline-block';
                var row = Math.floor(wasVisible/cols);
                item.inViewPort = getYFn(row) - currentYCord < 3000;
                wasVisible++;
            } else {
                item.inViewPort = false;
            }
        }

        for (var i in data) {
            if (!data[i].inViewPort) {
                updateTransform(data[i]);
            }
        }

        setTimeout(function() {
            for (var i in data) {
                if (data[i].inViewPort) {
                    updateTransform(data[i]);
                }
            }
        }, 10);

        // We optimize by hidning those not visible to prevent animation
        // We need to show them again
        setTimeout(function() {
            for (var i in data) {
                if (data[i].visible) {
                    data[i].domNode.style.display = 'inline-block';
                }
            }
        }, 400);
    }

    function getY(offsetY, height, row) {
        return offsetY + row * height;
    }

    function render(data, cols) {
        var container = document.getElementsByClassName('animation')[0];
        var tplNode = container.children[0];

        var rect = tplNode.getBoundingClientRect();
        var y0 = rect.top;
        var h = rect.height;
        var yCordFn = getY.bind(null, y0, h);

        var tpl = consumeElement(tplNode);

        for (var i in data) {
            renderElement(container, tpl, cols, data[i], i);
        }

        return reRender.bind(null, yCordFn);

    }

    function renderElement(container, tpl, cols, item, index) {
        var clone = tpl.cloneNode(true);
        clone.innerHTML = item.name + ' ' + item.country + ' ' + item.city;
        item.domNode = clone;
        item.visible = false;
        item.wasVisible = false;
        item.transform = {};
        setTranslate3d(item, cols, index);
        item.transform.scale = 'scale(0,0)';
        item.domNode.style.display = 'none';
        updateTransform(item);

        container.appendChild(clone);
        return clone;
    }

    function consumeElement(element) {
        element.parentNode.removeChild(element);
        return element;
    }

    function hideElement(item) {
        item.transform.scale = 'scale(0,0)';
        item.wasVisible = item.visible;
        item.visible = false;
    }

    function showElement(item) {
        item.transform.scale = 'scale(1,1)';
        item.visible = true;
    }

    function setTranslate3d(item, cols, index) {
        var transform = getTranslate3d(cols, index);
        item.transform.translate3d = transform;
        return item;
    }

    function getTranslate3d(cols, index) {
        return 'translate(' + [((index % cols) * 100) + '%', (Math.floor(index / cols) * 100) + '%'].join(',') +
            ')';
    }

    function updateTransform(item, inViewPort) {
        var element = item.domNode;

        if (item.visible === false) {
        	if (item.inViewPort === false) {
            	element.style.display = 'none';
        	}
            element.style['opacity'] = 0;
        } else {
            // Prevent animation
            if (item.inViewPort === false) {
                element.style.display = 'none';
            }
            element.style['opacity'] = 1;
        }

        var transformStr = '';
        Object.keys(item.transform).forEach(function(key) {
            transformStr += ' ' + item.transform[key];
        });
        element.style['-webkit-transform'] = transformStr;
        element.style['transform'] = transformStr;

        return element;
    }

    function filter(renderFn, start, amount) {
        var end = start + amount;
        var collectedNr = 0;
        for (var i in data) {
            var collect = condFn(data[i]);
            if (collect && collectedNr >= start && collectedNr < end) {
                showElement(data[i]);
            } else {
                hideElement(data[i]);
            }

            if (collect) {
                collectedNr++;
            }
        }

        renderFn(data, 2);

        return collectedNr;
    }

})(Terrasimation);







