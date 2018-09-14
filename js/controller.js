/*global Vue*/
/*global render*/
/*global window*/

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
                {type: "screen", width: 16, height: 9, bottom: 5.5, back: -3, surround: 0.33}
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
            }
            
        },
        
        created: function () {
            window.setTimeout(function () {
                render();
            }, 1000);
        }

    });

}());
