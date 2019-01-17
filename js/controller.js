/*global Vue*/
/*global render*/
/*global window*/
/*global document*/
/*global FileReader*/
/*global saveAs*/
/*global Blob*/

var vm;

(function () {

    "use strict";

    vm = new Vue({

        el: "#app",

        data: {
            room: "Churchill",
            roomsData: {
                mountbatten: { // We are also using this for the Churchill
                    setWashCentre: "#0b63f4",
                    setWashSides: "#0b63f4",
                    setWashSame: true
                }
            },
            width: 40,
            items: [
                {type: "stage", width: 40, height: 2, depth: 8},
                {type: "set", width: 40, height: 11, yPos: 2, zPos: -4, lighting: "#0b63f4"},
                {type: "screen", width: 14, height: 8, yPos: 6, zPos: -3, surround: 0.2},
                {type: "lectern", colour: "#0b63f4", id: "lec1", xPos: 4, yPos: -0.73, zPos: 2.1},
                {type: "top-table", id: "tt1", size: 2, xPos: -5, yPos: 0.68, zPos: 0.7}
            ]
        },
        
        methods: {
            
            update: function (item, renderRoom) {
                render(item, renderRoom);
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

            newGraphic: function (item) {
                var img = new Image();
                img.onload = function () {
                    item.ratio = img.height / img.width;
                    render(item);
                };
                img.src = "user-content/" + item.src;
            },
            
            addItem: function (type) {
                this.items.push({
                    id: "item" + Date.now(),
                    type: type,
                    width: 3,
                    yPos: 2.7,
                    xPos: 4.3,
                    zPos: -1.19
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
            
            selectItem: function (clickedItem) {
                var self = this;
                // if selected, unselect all other items
                Vue.nextTick(function () {
                    if (clickedItem.selected) {
                        self.items.forEach(function (item) {
                            if (item.id !== clickedItem.id) {
                                item.selected = false;
                            }
                        });
                    }
                });
            },
            
            openFile: function (event) {
                var reader = new FileReader(),
                    self = this;
                if (event.target.files) {
                    reader.onload = function () {
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
                render(null, true);
            }, 1000);
        }

    });


    document.querySelector("body").onkeydown = function (event) {
        var key = event.key.toLowerCase();
        vm.items.forEach(function (item) {
            if (item.selected) {

                if (key === "i") {
                    item.yPos = item.yPos + 0.1;
                    render(item);
                } else if (key === "k") {
                    item.yPos = item.yPos - 0.1;
                    render(item);
                } else if (key === "j") {
                    item.xPos = item.xPos - 0.1;
                    render(item);
                } else if (key === "l") {
                    item.xPos = item.xPos + 0.1;
                    render(item);
                } else if (key === "u") {
                    item.zPos = item.zPos - 0.1;
                    render(item);
                } else if (key === "o") {
                    item.zPos = item.zPos + 0.1;
                    render(item);
                }

            }
        });

    };
    
}());
