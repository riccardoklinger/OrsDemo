///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare',
'jimu/BaseWidget',
'dijit/_WidgetsInTemplateMixin',
'dojo/_base/lang',
"dijit/form/Button",
"dijit/form/TextBox",
"dojo/dom",
"dojo/on",
"dojo/parser",
"dijit/registry",
"dojo/request/xhr",
"esri/geometry/Point",
"esri/symbols/SimpleMarkerSymbol",
"esri/graphic",
"esri/layers/GraphicsLayer",
"dojo/domReady!"],
function(declare, BaseWidget, _WidgetsInTemplateMixin, lang, Button, TextBox, dom, on, parser, registry, xhr,
Point, SimpleMarkerSymbol, Graphic, GraphicsLayer) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget, _WidgetsInTemplateMixin], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,
    baseClass: 'jimu-widget-demo',

    postCreate: function() {
      this.inherited(arguments);

      console.log('postCreate');
    },



    startup: function() {
      this.inherited(arguments);
      coordinates = [0,1];
      map = this.map;
      parser.parse();
      apiKey = "5b3ce3597851110001cf624837d7e85ce8144bd792ed5970e11d788e";
      var glS = new GraphicsLayer({id:"START"});
      var glE = new GraphicsLayer({id:"END"});
      var addPoint = function(coords, type){
        var gl = new GraphicsLayer();
        var p = new Point(coords[0], coords[1]);
        var s = new SimpleMarkerSymbol().setSize(10);
        var g = new Graphic(p, s);
        gl.add(g);
        if (type == "start"){

        }
        this.map.addLayer(gl);
      }

      var validateAdd = function(id){
        coordinates = this.coordinates;
        xhr("https://api.openrouteservice.org/geocode/search",{
          query: {
            api_key: apiKey,
            text: dojo.byId(id).value,
            ze: 1
          },
          handleAs: "json"
          }).then(function(data){

            dojo.byId(id).value = data["features"][0]["properties"]["label"];
            if (id == "StartPoint"){
              this.coordinates[0] = data["features"][0]["geometry"]["coordinates"];
              addPoint(data["features"][0]["geometry"]["coordinates"], "start");
            } else {
              this.coordinates[1] = data["features"][0]["geometry"]["coordinates"];
              addPoint(data["features"][0]["geometry"]["coordinates"], "end");
            }
          }, function(err){
            alert("no address for "+ dojo.byId(id).value + " found!");
            if (id == "StartPoint"){
                this.coordinates[0] = []
              } else {
                this.coordinates[1] = []
              }
          })
      }
      startIn = registry.byId("StartPoint");
      startIn.on("blur", function(){
        validateAdd("StartPoint");
      })
      stopIn = registry.byId("StopPoint");
      stopIn.on("blur", function(){
        validateAdd("StopPoint");
      })
      var myButton = new Button({
        label: "Get Route!",
        onClick: this.getRoute
      }
      , "RouteButton").startup();
    },

    getRoute: function(){
      this.inherited(arguments);

      //geocode the start/stop:

      apiKey = "5b3ce3597851110001cf624837d7e85ce8144bd792ed5970e11d788e";
      //console.log(this.startIn);
      console.log(start + " to " + stop)
    },

    findRoute: function(coords){
      this.inherited(arguments);
      console.log(coords);
    },

    geoCode: function(textbox){
      this.inherited(arguments);

    },

    onOpen: function(){
      //this.inherited(arguments);
      console.log('onOpen');
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    showVertexCount: function(count){
      //this.vertexCount.innerHTML = 'The vertex count is: ' + count;
    }
  });
});
