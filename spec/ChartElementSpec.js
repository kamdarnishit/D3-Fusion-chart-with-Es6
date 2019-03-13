describe('Chart Element', function() {
  var svg;
  var type = "revenue"

  beforeAll(function(done) {
    var chartElement= document.createElement("chart-element")
    chartElement.setAttribute("type",type)
    document.getElementsByTagName("body")[0].appendChild(chartElement);

    getSvg(done);

  });

  afterAll(function() {
    var chartElement = document.querySelector("chart-element")
    chartElement.parentNode.removeChild(chartElement);
  })

  it('should have the correct width', function() {
    console.log(svg);
    expect(svg.getAttribute("width")).toBe('400');
  });

  it('should have the correct height', function() {
    expect(svg.getAttribute("height")).toBe('300');
  });

  it('should have class with type name', function() {
    expect(svg.getAttribute("class")).toBe(`chart-${type}`);
  });

  it('should have donut chart', function() {
    var g = svg.querySelector("g");
    expect(g.getAttribute("id")).toBe('donutChart');
  });

  it('should be combined of two charts', function() {
    var g = svg.querySelector("g");
    expect(svg.querySelectorAll(".parentGContainer").length).toBe(2);
  });

  it('should have donut chart', function() {
    var g = svg.querySelector("g");
    expect(g.getAttribute("id")).toBe('donutChart');
  });

  it('should have inner text same as type name ', function() {
    var g = svg.querySelector("g");
    expect(g.querySelector(".type-text").innerHTML).toBe(type);
  });

  function getSvg(done) {
    setTimeout(function(){
      svg = d3.selectAll('chart-element')._groups[0][0].shadowRoot.querySelector("svg");
      done();
    },1500);
  }

});