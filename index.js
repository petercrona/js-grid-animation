// Data
var data = [];
for (var i = 0; i < 800; i++) {
    data.push({
        name: 'Element ' + i,
        country: 'Sweden',
        city: 'Gothenburg',
        id: i
    });
}
for (var i = 0; i < 800; i++) {
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
Terrasimation.init(data, container, tpl);
Terrasimation.setFilterFn(function(x) {
    return x.id % 2 === 0;
});
Terrasimation.showMore(5);

setTimeout(function() {
    Terrasimation.showMore(500);
}, 2000);

setTimeout(function() {
    Terrasimation.setFilterFn(function(x) {
        return x.id % 3 === 0;
    });
    Terrasimation.showMore(5);
}, 6000);
