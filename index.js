// Data
var data = [];
for (var i = 0; i < 40000; i++) {
    data.push({
        name: 'Element ' + i,
        country: 'Sweden',
        city: 'Gothenburg',
        id: i
    });
}
for (var i = 0; i < 40000; i++) {
    data.push({
        name: 'Fisk ' + i,
        country: 'Germany',
        city: 'Berlin',
        id: i
    });
}
data.sort(function() {
    return .5 - Math.random();
});

var container = document.getElementsByClassName('animation')[0];
var tpl = container.children[0];
var linkFn = function(html, item) {
    return html;
};
Terrassimation.init(container, data, linkFn);
Terrassimation.setFilterFn(function(x) {
    return x.id % 2 === 0;
});
Terrassimation.showMore(5);

setTimeout(function() {
    Terrassimation.showMore(500);
}, 2000);

setTimeout(function() {
    Terrassimation.setFilterFn(function(x) {
        return x.id % 3 === 0;
    });
    Terrassimation.showMore(5);
}, 6000);
