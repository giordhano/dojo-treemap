var groupByChanged, sizeByChanged, colorByChanged, 
	thresholdChanged, MyTreeMap;

var colorByPriorityFunc = function(item){
	switch(item.priority){
		case "highest":
			return {r: 255, g: 0, b: 0};
		case "high":
			return {r: 170, g: 0, b: 0};
		case "normal":
			return {r: 170, g: 85, b: 0};
		case "low":
			return {r: 85, g: 170, b: 0};
		case "lowest":
			return {r: 0, g: 255, b: 0};
	}
};		

var colorBySeverityFunc = function(item){
	switch(item.severity){
		case "blocker":
			return {r: 255, g: 0, b: 0};
		case "critical":
			return {r: 170, g: 0, b: 0};
		case "major":
			return {r: 170, g: 85, b: 0};
		case "normal":
			return {r: 85, g: 170, b: 0};
		case "minor":
			return {r: 0, g: 170, b: 0};
		case "trivial":
			return {r: 0, g: 255, b: 0};	
	}
};		

var sizeByPriorityFunc = function(item){
	switch(item.priority){
		case "highest":
			return 5;
		case "high":
			return 4;
		case "normal":
			return 3;
		case "low":
			return 2;
		case "lowest":
			return 1;			
	}
};		

var sizeBySeverityFunc = function(item){
	switch(item.severity){
		case "blocker":
			return 10;
		case "critical":
			return 8;
		case "major":
			return 7;
		case "normal":
			return 3;
		case "minor":
			return 2;
		case "trivial":
			return 1;			
	}
};		
			
			require(["dojo/ready", "dojo/dom", "dojo/_base/Color", "dojo/_base/declare", "dojo/parser",
					"dijit/registry", "dijit/Tooltip", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct",
					"dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojox/treemap/TreeMap",
					"dojox/data/CsvStore", "dojo/store/DataStore",
					"dijit/form/RadioButton", "dojox/treemap/Keyboard",
					"dojox/treemap/DrillDownUp"],
					function(ready, dom, Color, declare, parser, registry, Tooltip, domStyle, domAttr, domConstruct, BorderContainer, 
						ContentPane, TreeMap, CsvStore, DataStore, RadioButton, Keyboard,	DrillDownUp) {

				//var store = new DataStore({ store: new CsvStore({url: "http://bugs.dojotoolkit.org/report/132?asc=1&format=csv"}) });
				var store = new DataStore({ store: new CsvStore({url: "report_132.csv"}) });
				
				ready(function(){
					MyTreeMap = declare([TreeMap, Keyboard, DrillDownUp], {
						createRenderer: function(item, level, kind){							
							if(kind == "leaf"){
								var div = domConstruct.create("a");
								domAttr.set(div, "href", "http://bugs.dojotoolkit.org/ticket/"+item.ticket);
								domStyle.set(div, "overflow", "hidden");
								domStyle.set(div, "position", "absolute");					
								return div;								
							}else{
								return this.inherited(arguments);
							}		
						}
					});
					parser.parse();
			        var treeMap = registry.byId("treeMap");
					treeMap.set("colorFunc", colorByPriorityFunc);
					treeMap.set("areaFunc", sizeBySeverityFunc);
	  	            treeMap.set("groupAttrs", ["component"]);
		        	treeMap.set("store", store);
					treeMap.onItemRollOver = function(evt){
						if(evt.item.summary){
							Tooltip.show(evt.item.summary, evt.renderer);
						}
					};
					treeMap.onItemRollOut = function(evt){
						Tooltip.hide(evt.renderer);
					};
		      	});
				
				groupByChanged = function(value){
					var groupBy = null;				
			        if(dom.byId("g2").checked){
			          	groupBy = ["owner"];
					} else if(dom.byId("g3").checked){
			          	groupBy = ["component"];
					}else if(dom.byId("g4").checked){
						groupBy = ["milestone"];	
					}
			        var treeMap = registry.byId("treeMap");
			        if(groupBy != null){
			          treeMap.set("groupAttrs", groupBy);
			        }else{
			          treeMap.set("groupAttrs", null);
					}
				};
			      
			    sizeByChanged = function(value){
			        var treeMap = registry.byId("treeMap");
			        if(dom.byId("s2").checked){
			         	treeMap.set("areaFunc", sizeByPriorityFunc);
					}else if(dom.byId("s3").checked){
			         	treeMap.set("areaFunc", sizeBySeverityFunc);
					}
				};
			      
			    colorByChanged = function(value){
					var colorBy = null;
			        var treeMap = registry.byId("treeMap");
			        if(dom.byId("c2").checked){
			         	treeMap.set("colorFunc", colorByPriorityFunc);
			        }else if(dom.byId("c3").checked){
			         	treeMap.set("colorFunc", colorBySeverityFunc);
					}
				};
		  });