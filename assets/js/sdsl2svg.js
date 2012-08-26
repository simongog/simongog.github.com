function initX(url){
global_id = global_id+1	
var id=global_id;
console.log("id = "+id)
return function init(json){
//name = url.replace(' for ','_');	
//d3.select("#space_chart").append("h1").append("a").attr("name",name).text(url);
//console.log(json)	
//id = id+1
var spaceJSON = null;
var node = null;
var color = d3.scale.category20();
var size_info = null;
var size_text = null;
var detailRect = null;
var detailView = null;
var overView = null;
var xr = null;
var yr = null;
var xro = null;
var yro = null;
var maxDataStructureDepths = 0;
var detailViewX = 0;
var detailViewWidth = 0;
var overViewX = 0;
var overViewWidth = 0;
var detailHeight = 0;
var detailViewHeight = 0;
var overHeight = 0;
var overViewHeight = 0;
var spaceChartWidth  = 0;
var detailViewY = 0;
var overViewY = 0;
var spaceChartHeight = 0;
var defs = null; 
var overZoomRectRight = null;
var overZoomRectLeft = null;

spaceJSON = json;
var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return d.size; });
var nodes = partition.size([1,1]).nodes(spaceJSON);


maxDataStructureDepths = max_depth(nodes[0]);
detailViewX = 10;
detailViewWidth = 450;
overViewX = detailViewX;
overViewWidth = detailViewWidth;
detailHeight = 20;
detailViewHeight = detailHeight * maxDataStructureDepths;
overHeight = detailHeight/2;
overViewHeight = detailViewHeight/2;
spaceChartWidth  = detailViewWidth + 20;
detailViewY = 50 + overViewHeight;
overViewY = detailViewY-overViewHeight;
spaceChartHeight = detailViewHeight + overViewHeight + detailViewY + 20;

xr = d3.scale.linear().domain([0,1]).range([0,detailViewWidth]); // for detail view
yr = d3.scale.linear().domain([0,1]).range([0,detailViewHeight]); // for detail view
xro = d3.scale.linear().domain([0,1]).range([0,overViewWidth]); //  for overview
yro = d3.scale.linear().domain([0,1]).range([overViewHeight-overHeight,0-overHeight]); // for overview

//var svgselect = d3.select("#space_chart").selectAll("svg");
//if ( length(svgselect)>0 ){
//   svgselect.remove();
//}
d3.select("#space_chart svg").remove();

var spaceChart = d3.select("#space_chart").append("svg:svg")
    .attr("width", spaceChartWidth)
    .attr("height",spaceChartHeight)
	.attr("id","svg-"+id);
	spaceChart.append("svg:rect").attr("x",0).attr("y",0).attr("width",spaceChartWidth).attr("height",spaceChartHeight)
	    .style("stroke","gray").style("stroke-width",0.8).style("fill-opacity",0);
defs = spaceChart.append("defs");
detailView = spaceChart.append("g")
				.attr("transform", "translate(" + detailViewX + "," + detailViewY + ")")
				.attr("clip-path", "url(#detailView-clip)");
overView = spaceChart.append("g")
    			.attr("transform", "translate(" + overViewX + "," + overViewY + ")")
				.attr("clip-path", "url(#overView-clip)");
           
  // add clip path for the detail view
  defs.append("svg:clipPath")
      .attr("id","detailView-clip")
	  .append("svg:rect")
	  .attr("x",0).attr("y",0)
	  .attr("width", detailViewWidth).attr("height",detailViewHeight); 

  // add clip path for the overview
  var overClipPath = defs.append("svg:clipPath")
      .attr("id","overView-clip")
	  .append("svg:rect")
	  .attr("x",0).attr("y",0/*-overHeight*/)
	  .attr("width", overViewWidth).attr("height",overViewHeight); 

var info = d3.select("#svg-"+id); 
size_info = info.append("g")
		        .attr("transform", "translate("+detailViewX+","+(overViewY-20)+")");	 
//var member_info = info.append("g")
//			 .attr("transform", "translate("+detailViewX+","+(detailViewHeight+detailViewY+20)+")");

detailRect = detailView.selectAll("rect").data(nodes);
var overRect = overView.selectAll("rect").data(nodes);

  // add clip path for the elements of the data structure
  defs.selectAll("clipPath")
      .data(nodes).enter()
	  .append("svg:clipPath")
	  .attr("id",function(d,i){return "detail-clip-"+i;})
	  .append("svg:rect")
	  .attr("x",0).attr("y",0)
	  .attr("id",function(d,i){return "clip-rect-"+i;})
	  .attr("width",function(d){return xr(d.dx);}).attr("height", detailHeight);
  // add groups and background rect for each of the elements of the data structure
  detailRect.enter().append("svg:g")
	 .attr('transform', function(d){return "translate("+xr(d.x)+","+yr(d.y)+")";})
	 .attr('clip-path', function(d,i){return "url(#detail-clip-"+i+")";})
	 .append("svg:rect")
	 .attr("class","unsel_rect")
	 .attr("id", function(d,i){return "detail-rect-"+i;})
	 .attr("y",0).attr("x",0)
	 .attr("width",function(d){return xr(d.dx);}).attr("height", detailHeight)
	 .style("fill", colour);
 // add text for each element
 detailRect.append("svg:text").text(function(d){return d.class_name.replace("sdsl::","")+" "+d.name;})
	 .attr('text-anchor','begin')
	 .attr("y",detailHeight-4).attr("x",5)
	 .attr("class", "detailLabel");
 // add overlay rect with methods to zoom in and out
 detailRect.append("svg:rect")
	 .attr("id", function(d,i){return "overlay-rect-"+i;})
	 .attr("y",0) .attr("x",0)
	 .attr("width",function(d){return xr(d.dx);}).attr("height", detailHeight)
	 .attr("fill", "white")
	 .attr("fill-opacity",0.0)
	 .on("mouseover",highlight)
	 .on("click",zoom);

  overRect.enter().append("svg:g")
	 .attr('transform', function(d){return "translate("+xro(d.x)+","+yro(d.y)+")";})
	 .append("svg:rect")
	 .attr("id", function(d,i){return "over-rect-"+i;})
	 .attr("y",0).attr("x",0)
	 .attr("width",function(d){return xro(d.dx);}).attr("height", overHeight)
	 .attr("class","unsel_rect")
	 .style("fill", colour);

   overZoomRectLeft = overView.append("svg:rect").attr("id", "overZoomRectLeft")
	  						.attr("y",0).attr("x",-overViewWidth).attr("width",overViewWidth)
							.attr("height",overViewHeight).attr("class","overzoomrect");  
   overZoomRectRight = overView.append("svg:rect").attr("id", "overZoomRectRight")
	  						.attr("y",0).attr("x",overViewWidth).attr("width",overViewWidth)
							.attr("height",overViewHeight).attr("class","overzoomrect");    

	detailView.append("svg:g").attr('transform','translate(-100,20)').attr("id","idX")
	          .append("svg:rect").attr('x',0).attr('y',0).attr('width','50').attr('height',50).attr("fill","red");
	detailView.selectAll("#idx")
	          .append("svg:rect").attr('x',0).attr('y',0).attr('width','50').attr('height',50).attr("fill","blue").attr("fill-opacity",0.5);


size_info.selectAll("text").data(["x","y"]).enter().append("svg:text")
	.attr("dx",0)
	.append("tspan")
    .text(function(d, i){return d+" "+i;})
	.attr("dx",0)
	.attr("dy",function(d,i){return i+"em";})
	.attr("class","size_info_text");
size_text = size_info.selectAll("text");	

updateInfo(nodes[0])
zoom(nodes[0])


var cur_d = null; // global variable for the currently inspected element

function updateInfo(d){
	size_info.selectAll("text")
		     .data([sizeMB(d),sizePercent(d,nodes[0])+" %"])
			 .select("tspan").text(function(d,i){return d});

	if ( cur_d != d ){
		if ( cur_d != null ){
			detailView.selectAll("rect").filter(function(d,i){return d==cur_d;})
			.attr("class","unsel_rect");
			overView.selectAll("rect").filter(function(d,i){return d==dd;})
			.attr("class","unsel_rect");	
		}
		dd = d
		detailView.selectAll("rect").filter(function(d,i){return d==dd;})
		.attr("class","sel_rect");
		overView.selectAll("rect").filter(function(d,i){return d==dd;})
		.attr("class","sel_rect");	
//		member_text.text(getClassPath(d));
	}
	cur_d = d;
}		 

function highlight(d){
	if ( cur_d != d ){
		if ( cur_d != null ){
			detailView.selectAll("rect").filter(function(d,i){return d==cur_d;})
			.attr("class","unsel_rect");
			overView.selectAll("rect").filter(function(d,i){return d==dd;})
			.attr("class","unsel_rect");	
		}
		dd = d
		detailView.selectAll("rect").filter(function(d,i){return d==dd;})
		.attr("class","sel_rect");
		overView.selectAll("rect").filter(function(d,i){return d==dd;})
		.attr("class","sel_rect");	
//		member_text.text(getClassPath(d));
	}
	cur_d = d;
}	

function getClassPath(d){
	if(d == null){
		return "";
	}else{
		return getClassPath(d.parent) + " > " + d.class_name.replace("sdsl::","") + " " + d.name;
	}
}

function zoom(d) {
	updateInfo(d)
	zoomDuration = 750
	xr.domain([d.x, d.x + d.dx]); // adjust the x domain to the current inspected element
	yr.domain([0, 1]).range([0, detailViewHeight]);   // display the parents
//	yr.domain([d.y, 1]).range([0, detailViewHeight]); // remove the parents
	size_text.transition().duration(zoomDuration).attr("x",xro(d.x+d.dx/2));
	dd = d;
	detailRect.transition().duration(zoomDuration)
	.attr("transform", function(d){
				if( is_anchor(d, dd) ){
				 return "translate(0,"+yr(d.y)+")"; // don't move parents
				 }else{
			     return "translate("+ xr(d.x)+","+yr(d.y)+")"; // move element itself and children
				 }
				 })
	.selectAll("rect")
	.attr("width", function(d) { return xr(d.x + d.dx) - xr(d.x); })
	.attr("height", function(d) { return yr(d.y + d.dy) - yr(d.y); });

	defs.transition().duration(zoomDuration)
	.selectAll('rect[id^="clip-rect-"]') 
	.attr("width", function(d) { return xr(d.x + d.dx) - xr(d.x); })
	.attr("height", function(d) { return yr(d.y + d.dy) - yr(d.y); });

	overZoomRectLeft.transition().duration(2*zoomDuration)
	.attr("x", xro(d.x)-overViewWidth);//.ease("elastic");
	overZoomRectRight.transition().duration(2*zoomDuration)
	.attr("x", xro(d.x+d.dx));//.ease("elastic");

//	overClipPath.transition().duration(zoomDuration)
//	.attr("y", yro(d.y));
}
// TODO: replace int_vector<0> by bit_vector

// tests if d is an anchor of dd
function is_anchor(d,dd){
	if( dd && d ){
		return d == dd || is_anchor(d, dd.parent);
	}else{
		return false;
	}	
}

// Get the max depth of the tree
function max_depth(d){
function max_depth_rec(d, depth){
	if( d.children ){
		var result = 0;
		for(var i=0; i < d.children.length; ++i){
			tmp = max_depth_rec(d.children[i], depth+1);
			result = Math.max(result, tmp);
		}
		return result;
	}else{
		return depth;
	}
}
return max_depth_rec(d, 1);
}

function sizeMB(d) {
    return (d.size / (1024*1024)).toFixed(2) + ' MiB';
}

function sizePercent(d, root){
	return (100.0*d.size / root.size).toFixed(2);
}


function colour(d) {
    return color(d.name);
}
};
}

