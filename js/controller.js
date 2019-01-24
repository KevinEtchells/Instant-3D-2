/*global Vue*/
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
            selectedTab: "room",
            room: "Whittle",
            seatingStyle: "None",
            roomsData: {
                fixedSet: { // Mountbatten & Churchill
                    setWashCentre: "#0b63f4",
                    setWashSides: "#0b63f4",
                    setWashSame: true
                }
            },
            items: [
                {type: "stage", width: 40, height: 2, depth: 8, xPos: 0, yPos: 0, zPos: 0, id: "item01"},
                {type: "set", width: 40, yPos: 2, zPos: -4, lighting: "#0b63f4", id: "item02"},
                {type: "screen", width: 14, height: 8, yPos: 6, zPos: -3, surround: 0.2, id: "item03"},
                {type: "lectern", colour: "#0b63f4", id: "lec1", xPos: 4, yPos: -0.73, zPos: 2.1, id: "item04"},
                {type: "top-table", id: "tt1", size: 2, xPos: -5, yPos: 0.68, zPos: 0.7, id: "item05"}
            ],

            feetToMetres: function (value) {
                return value * 0.3048;
            },
            getChairRotation: function (totalChairs, chairIndex) {
                let middle = Math.round(totalChairs / 2) - 1;
                let rotations = [];
                let amount = 0;
                // first half:
                for (let i = middle; i >= 0; i--) {
                    rotations[i] = amount;
                    amount = amount + 10;
                }
                // second half:
                amount =  totalChairs % 2 ? -10 : 0;
                for (let i = middle + 1; i <= totalChairs; i++) {
                    rotations[i] = amount;
                    amount = amount - 10;
                }
                return rotations[chairIndex];
            },

            getChairs: function (room) {

                let self = this;

                const AISLE_WIDTH = 2.5,
                    CHAIR_WIDTH = 0.55,
                    CHAIR_DEPTH = 1.2,
                    frontRow = (function () {
                        let furthestPos = 2.4
                        if (room === "Fleming" || room === "Whittle") {
                            // check each stage position
                            self.items.forEach(function (item) {
                                if (item.type === "stage") {
                                    const newPos = self.feetToMetres(item.depth) + self.feetToMetres(item.zPos) - 0.2;
                                    if (furthestPos < newPos) {
                                        furthestPos = newPos;
                                    }
                                }
                            });
                        }
                        return furthestPos;
                    }());

                let maxChairs,
                    chairsPerRow,
                    chairIndex = 0,
                    row = 1,
                    side = "left",
                    chairs;

                // determine number of chairs based on room
                if (room === "Churchill") {
                    chairsPerRow = 12;
                    maxChairs = 20 * 12;
                } else if (room === "Fleming") {
                    chairsPerRow = 18;
                    maxChairs = 12 * 18;
                } else if (room === "Whittle") {
                    chairsPerRow = 13;
                    maxChairs = 20 * 13;
                } else if (room === "Mountbatten") {
                    chairsPerRow = 10;
                    maxChairs = 12 * 10;
                }

                chairs = (function () {
                    var chairArray = [],
                        i,
                        rnd;
                    for (i = 0; i < maxChairs; i = i + 1) {
                        rnd = Math.random();
                        if (rnd < 0.15 && chairArray[chairArray.length - 1] !== "pink" && chairArray[chairArray.length - 2] !== "pink") {
                            chairArray.push({colour: "pink"});
                        } else {
                            chairArray.push({colour: "purple"});
                        }
                    }
                    return chairArray;
                }());

                chairs.forEach(function (chair) {

                    let xPos;

                    if (chairIndex === chairsPerRow) {
                        if (side === "left") {
                            side = "right";
                        } else {
                            side = "left";
                            row = row + 1;
                        }
                        chairIndex = 1;
                    } else {
                        chairIndex = chairIndex + 1;
                    }

                    xPos = ((chairIndex - 1) * CHAIR_WIDTH) + (AISLE_WIDTH / 2);
                    if (side === "left") {
                        xPos = xPos * -1;
                    }

                    chair.position = xPos + " 0.58 " + ((row * CHAIR_DEPTH) + frontRow);
                });

                return chairs;

            }

        },

        methods: {

            changeRoom: function (newRoom) {
                let self = this;
                self.room = "";
                Vue.nextTick(function () {
                    self.room = newRoom;
                });
            },

            updateWidth: function (event) {
                var data = this;
                this.items.forEach(function (item) {
                    if (item.type === "set" || item.type === "stage") {
                        item.width = data.width;
                    }
                });
            },

            updateSetWash: function (event) {
                this.items.forEach(function (item) {
                    if (item.type === "set") {
                        item.lighting = event.target.value;
                    }
                });
            },

            newGraphic: function (item) {
                var img = new Image();
                img.onload = function () {
                    item.ratio = img.height / img.width;
                };
                img.src = "user-content/" + item.src;
            },

            addItem: function (type, width = 3, xPos = 4.3, yPos = 2.7, zPos = -1.19) {
                this.items.push({
                    id: "item" + Date.now(),
                    type: type,
                    width: width,
                    height: type === "stage" ? 2 : null,
                    depth: type === "stage" ? 8 : null,
                    xPos: xPos,
                    yPos: yPos,
                    zPos: zPos
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
                    };
                    reader.readAsText(event.target.files[0]);
                }
            },
            saveFile: function () {
                var blob = new Blob([JSON.stringify(this.$data)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "visual.json");
            }

        }

    });


    document.querySelector("body").onkeydown = function (event) {
        var key = event.key.toLowerCase();
        vm.items.forEach(function (item) {
            if (item.selected) {
                if (key === "i") {
                    item.yPos = item.yPos + 0.1;
                } else if (key === "k") {
                    item.yPos = item.yPos - 0.1;
                } else if (key === "j") {
                    item.xPos = item.xPos - 0.1;
                } else if (key === "l") {
                    item.xPos = item.xPos + 0.1;
                } else if (key === "u") {
                    item.zPos = item.zPos - 0.1;
                } else if (key === "o") {
                    item.zPos = item.zPos + 0.1;
                }
            }
        });

    };

}());
