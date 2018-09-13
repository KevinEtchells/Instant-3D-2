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
            items: [
                {type: "stage", width: 56, height: 2, depth: 8},
                {type: "set", width: 56, height: 11, bottom: 2, back: -4, lighting: "#5511EE"},
                {type: "screen", width: 16, height: 9, bottom: 5.5, back: -3, surround: 0.33}
            ]
        },
        
        methods: {
          
            updateSetWash: function (event) {
                this.items.forEach(function (item) {
                    if (item.type === "set") {
                        item.lighting = event.target.value;
                    } 
                });
                render();
            }
            
        },
        
        created: function () {
            window.setTimeout(function () {
                render();
            }, 1000);
        }

    });

}());
