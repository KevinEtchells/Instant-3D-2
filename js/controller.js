/*global Vue*/
/*global render*/
/*global window*/
/*global FileReader*/
/*global saveAs*/

var vm;

(function () {

    "use strict";

    vm = new Vue({

        el: "#app",

        data: {
            room: "Fleming",
            width: 40,
            items: [
                {type: "stage", width: 40, height: 2, depth: 8},
                {type: "set", width: 40, height: 11, bottom: 2, back: -4, lighting: "#0b63f4"},
                {type: "screen", width: 16, height: 9, bottom: 5.5, back: -3, surround: 0.33},
                {type: "lectern", colour: "#0b63f4"}
            ]
        },
        
        methods: {
            
            update: function () {
                render();  
            },
            
            updateWidth: function (event) {
                var data = this;
                this.items.forEach(function (item) {
                    if (item.type === "set" || item.type === "stage") {
                        item.width = data.width;
                    }
                });
                render();
            },
          
            updateSetWash: function (event) {
                this.items.forEach(function (item) {
                    if (item.type === "set") {
                        item.lighting = event.target.value;
                    } 
                });
                render();
            },
            
            addItem: function (type) {
                this.items.push({
                    id: Date.now(),
                    type: type,
                    width: 8,
                    height: 4,
                    bottom: 7,
                    left: 15,
                    back: -3
                });
            },
            
            removeItem: function (id) {
                var foundIndex = -1;
                this.items.forEach(function (item, itemIndex) {
                    if (item.id && item.id === id) {
                        foundIndex = itemIndex;
                    }
                });
                if (foundIndex !== -1) {
                    this.items.splice(foundIndex, 1);
                }
            },
            
            openFile: function (event) {
                var reader = new FileReader(),
                    self = this;
                if (event.target.files) {
                    reader.onload = function(){
                        var data = JSON.parse(reader.result),
                            prop;
                        for (prop in data) {
                            if (data.hasOwnProperty(prop)) {
                                self[prop] = data[prop];
                            }
                        }
                        render();
                    };
                    reader.readAsText(event.target.files[0]);
                }
            },
            saveFile: function () {
                var blob = new Blob([JSON.stringify(this.$data)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "visual.json");
            }
            
        },
        
        created: function () {
            window.setTimeout(function () {
                render();
            }, 1000);
        }

    });

}());
