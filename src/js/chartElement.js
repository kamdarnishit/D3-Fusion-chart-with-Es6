const colors = {
    "revenue": {"tablet": "#89D43F", "smartphone" : "#3C661C", "areaChart" : "#F6FBF3", "lineChart" : "#D9ECC0"},
    "impressions": {"tablet": "#6FC9E4", "smartphone" : "#345569", "areaChart" : "#F6FAFB", "lineChart" : "#DFEFF7"},
    "visits": {"tablet": "#F1BF32", "smartphone" : "#B55029", "areaChart" : "#FEFAF3", "lineChart" : "#F7F0D3"},
}

class ChartElement extends HTMLElement {

    constructor() {
        super();

        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'});

        // style for each chart-element
        const style = document.createElement('style');

        // Following condition is for Jasmine specs
        if(this.type==null){
            var type = "revenue";
        }
        else{
            var type = this.type;
        }

        style.innerHTML = `
            .chart-wrapper{
                width:400px;
                font-family: 'Roboto';
            }
            .chart-meta-wrapper{
                display:flex;
                justify-content: space-between;
            }
            .chart-meta{ 
                width: 9rem;
                font-size: 20px;
                font-weight: 500;
                min-width: 155px;
            }
            .chart-title#tablet{   
                text-align:left;
                color: ${colors[type].tablet};
            }
            .chart-title#smartphone{   
                color: ${colors[type].smartphone};
                text-align: right;
            }
            .chart-title#smartphone .chart-meta-value{
                justify-content: flex-end;
            }
            .chart-meta-value{
                display:flex;
                justify-content: space-between;
            }
            .chart-meta-tablet .chart-meta-value{
                justify-content: flex-start;
            }
            .chart-meta-smartphone .chart-meta-value{
                justify-content: flex-end;
            }
            .chart-meta-value-percentage{
                color: #A2A2A2;
                margin-right: 20px;
            }
            .chart-meta-value-sum{
                font-weight: 400;
                color: #CDCDCD;
            }
        `;
        
        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'chart-wrapper');

        wrapper.innerHTML = `
            <svg id="chart" class="chart-${type}"></svg>
            <div class="chart-meta-wrapper">
                <div class="chart-meta chart-meta-tablet">
                    <div class="chart-title" id="tablet">Tablet</div>
                    <div class="chart-meta-value">
                        <div class="chart-meta-value-percentage"></div>
                        <div class="chart-meta-value-sum">120000</div>
                    </div>
                </div>
                <div class="chart-meta chart-meta-smartphone">
                    <div class="chart-title" id="smartphone">Smartphone</div>
                    <div class="chart-meta-value">
                        <div class="chart-meta-value-percentage">60%</div>
                        <div class="chart-meta-value-sum">120000</div>
                    </div>
                </div>
            </div>
        `;

        // append style and wrapper elements to shadow root
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    // Asynchronous function to draw d3 charts
    async drawChart(typeData) {

        var text = "";
        
        var width = 400;
        var height = 300;
        var thickness = 10;
        var duration = 750;
        
        var radius = Math.min(width, height) / 2;
        
        var pieChartColor = [];

        pieChartColor.push(colors[this.type].tablet);
        pieChartColor.push(colors[this.type].smartphone);
    
        var svg = d3.select(this.shadowRoot)
        .select("#chart")
        .attr('width', width)
        .attr('height', height);
        
        var g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')')
        .attr('id','donutChart')
        .attr('class','parentGContainer');
        
        var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius); 
        
        var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);
        
        var path = g.selectAll('path')
        .data(pie(typeData[1]))
        .enter()
        .append("g")
        .append('path')
        .attr('id','pie')
        .attr('d', arc)
        .attr('fill', (d,i) => pieChartColor[i])
        .each(function(d, i) { this._current = i; }); 
        
        g.append('text')
        .attr('transform','translate(0,-50)')
        .attr('text-anchor', 'middle')
        .attr('font-size', '25px')
        .attr('fill','#AFAFAF')
        .style('font-family','Roboto')
        .style('text-transform','uppercase')
        .attr('y', 0)
        .attr('class', "type-text")
        .text(this.type);

        var tabletValue = '';
        var smartphoneValue = '';
        var sum = '';

        if(this.type=="revenue"){
            tabletValue = `${this.numberWithDecimal(typeData[1][0].value)}€`
            smartphoneValue = `${this.numberWithDecimal(typeData[1][1].value)}€`
            sum = `${this.numberWithDecimal(typeData[1][0].value + typeData[1][1].value)}€`
        }
        else{
            tabletValue = `${this.numberWithDecimal(typeData[1][0].value)}`
            smartphoneValue = `${this.numberWithDecimal(typeData[1][1].value)}`
            sum = `${this.numberWithDecimal(typeData[1][0].value + typeData[1][1].value)}`
        }

        g.append('text')
            .attr('transform','translate(0,-10)')
            .attr('text-anchor', 'middle')
            .attr('font-size', '2em')
            .style('font-family','Roboto')
            .attr('fill','#3E3E3E')
            .attr('y', 0)
            .attr('class', "type-value")
            .text(sum);

        const x = d3.scaleTime()
            .rangeRound([0,200])
            .domain([0,typeData[0].length-1]);

        const y = d3.scaleLinear()
            .rangeRound([40, 0])
            .domain(d3.extent(typeData[0], d => d.value));

        const area = d3.area()
            .x((d,i) => x(i))
            .y1(100)
            .y0(d => y(d.value));

        const line = d3.line()
            .x((d,i) => x(i))
            .y(d => y(d.value));

        const g2 = svg.append('g')
            .attr('transform','translate(70,160) scale(1.3,1.3)')
            .attr('clip-path','circle(100px at 100px -5px)')
            .attr('class','parentGContainer');

        // Append Area Chart to svg
        g2.append('path')
            .datum(typeData[0])
            .attr('fill',colors[this.type].areaChart)
            .attr('stroke','none')
            .attr("stroke-width", 1.5)
            .attr("d", area);
          
        // Append Line Chart to svg
        g2.append('path')
            .datum(typeData[0])
            .attr('fill','none')
            .attr('stroke',colors[this.type].lineChart)
            .attr("stroke-width", 1.5)
            .attr("d", line)


        this.shadowRoot.querySelector('.chart-meta-tablet .chart-meta-value-percentage').innerHTML = `${(typeData[1][0].value / (typeData[1][0].value + typeData[1][1].value))*100}%`
        this.shadowRoot.querySelector('.chart-meta-tablet .chart-meta-value-sum').innerHTML = tabletValue
        
        this.shadowRoot.querySelector('.chart-meta-smartphone .chart-meta-value-percentage').innerHTML = `${(typeData[1][1].value / (typeData[1][0].value + typeData[1][1].value))*100}%`
        this.shadowRoot.querySelector('.chart-meta-smartphone .chart-meta-value-sum').innerHTML = smartphoneValue

    }

    // Fires when element is inserted into the DOM 
    connectedCallback () {
        const _parent = this;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://jsonstub.com/api/marfeel/statistics/${this.type}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('JsonStub-User-Key', 'a13d05df-bfb5-4361-965e-c1a9b7d3c9f8');
        xhr.setRequestHeader('JsonStub-Project-Key', '33b33a5d-e16a-497c-92be-4d3fa031b982');
        xhr.send();

        xhr.onload = function() {
            var data = JSON.parse(xhr.response);
            _parent.drawChart(data);
          };
        
    }

    // get Attribute Type
    get type() {
        return this.getAttribute('type');
    }

    // convert number to decimal seperated number
    numberWithDecimal(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}
customElements.define('chart-element', ChartElement)

export default ChartElement
