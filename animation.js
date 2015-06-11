var data = [];
for (var i = 0; i < 750; i++) {
    data.push({
	name: 'Element ' + i,
	country: 'Sweden',
	city: 'Gothenburg'
    });
}
for (var i = 0; i < 750; i++) {
    data.push({
	name: 'Fisk ' + i,
	country: 'Germany',
	city: 'Berlin'
    });
}

data.sort(function() {
    return .5 - Math.random();
});

(function(Math, data) {

    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
	run(data);
    });

    function run(data, container, tpl) {
	render(data, 2);
	setTimeout(function() {
	    filter(data, function(x) {
		return x.country === 'Germany';
	    });
	    reRender(data, 2);
	}, 2000);

	setTimeout(function() {
	    filter(data, function(x) {
		return x.country === 'Sweden';
	    });
	    reRender(data, 2);
	}, 6000);
    }

    function reRender(data, cols) {
	var nrVisible = 0;
	for (var i in data) {
	    var item = data[i];
	    if (item.visible) {
		setTranslate3d(item, cols, nrVisible);
		nrVisible++;
	    }
	}

	function fnGenerator(visible, data) {
	    return function() {
		setTimeout(function() {
		    updateTransform(data);
		}, visible * 30);
	    };
	}

	for (var i in data) {
	    if ( ! data[i].visible) {
		updateTransform(data[i]);
	    }
	}

	var visible = 0;
	for (var i in data) {
	    if (data[i].visible) {
		fnGenerator(visible++, data[i])();
	    }
	}
    }

    function render(data, cols) {
	var container = document.getElementsByClassName('animation')[0];
	var tpl = consumeElement(container.children[0]);

	for (var i in data) {
	    renderElement(container, tpl, cols, data[i], i);
	}
    }

    function renderElement(container, tpl, cols, item, index) {
	var clone = tpl.cloneNode(true);
	clone.innerHTML = item.name + ' ' + item.country + ' ' + item.city;
	item.domNode = clone;
	item.visible = true;
	item.transform = {};
	setTranslate3d(item, cols, index);
	item.transform.scale = 'scale(1,1)';
	updateTransform(item);

	container.appendChild(clone);
	return clone;
    }

    function consumeElement(element) {
	element.parentNode.removeChild(element);
	return element;
    }

    function hideElement(item) {
	item.transform.scale = 'scale(0,1)';
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
	return 'translate('+
	    [((index % cols)*100) + '%', (Math.floor(index / cols) * 100) + '%'].join(',')+
	    ')';
    }

    function updateTransform(item) {
	var element = item.domNode;

	if (item.visible === false) {
	    element.style['opacity']= 0;
	} else {
	    element.style['opacity']= 1;
	}

	var transformStr = '';
	Object.keys(item.transform).forEach(function(key) {
	    transformStr += ' ' + item.transform[key];
	});
	element.style['-webkit-transform']= transformStr;
	element.style['transform']= transformStr;

	return element;
    }

    function filter(data, condFn) {
	for (var i in data) {
	    if (condFn(data[i])) {
		showElement(data[i]);
	    } else {
		hideElement(data[i]);
	    }
	}
    }

})(Math, data);
