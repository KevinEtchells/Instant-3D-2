/*global vm*/
/*global document*/

var render;

(function () {

    "use strict";

    var $scene = document.querySelector("#content"),
        $room = document.querySelector("#room"),
        feetToMetres = function (value) {
            return value * 0.3048;
        };

    render = function (itemToRender, renderRoom) {

        var items;

        if (itemToRender) { // just render this one item
            items = [itemToRender];
            (function () {
                var $el = document.querySelector("#" + itemToRender.id);
                if ($el) {
                    $el.parentNode.removeChild($el);
                }
            }());
        } else { // render everything
            items = vm.items;
            $scene.innerHTML = "";
        }

        if (renderRoom) {
            if (vm.room === "Churchill") {
                $room.setAttribute("gltf-model", "#churchill");
                $room.setAttribute("rotation", "0 0 0");
                $room.setAttribute("position", "0 0 0.3");
            } else if (vm.room === "Fleming") {
                $room.setAttribute("gltf-model", "#fleming-whittle");
                $room.setAttribute("rotation", "0 0 0");
                $room.setAttribute("position", "0 0 7");
            } else if (vm.room === "Whittle") {
                $room.setAttribute("gltf-model", "#fleming-whittle");
                $room.setAttribute("rotation", "0 270 0");
                $room.setAttribute("position", "29.4 0 8");
            } else if (vm.room === "Mountbatten") {
                $room.setAttribute("gltf-model", "#mountbatten");
                $room.setAttribute("rotation", "0 0 0");
                $room.setAttribute("position", "-31.8 0 0.7");
            }
        }

        items.forEach(function (item) {

            var $items = [];

            if (item.type === "stage" && (vm.room === "Fleming" || vm.room === "Whittle")) {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("width", feetToMetres(item.width));
                $items[0].setAttribute("height", feetToMetres(item.height));
                $items[0].setAttribute("position", feetToMetres(item.xPos || 0) + " " + (feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + feetToMetres(item.zPos || 0));
                $items[0].setAttribute("color", "#111");
                $items[0].setAttribute("depth", feetToMetres(item.depth));

            } else if (item.type === "set") {

                if (vm.room === "Churchill") {

                    // TO DO: adjust width/height of flats
                    $items.push(document.createElement("a-box"));
                    $items.push(document.createElement("a-box"));
                    $items.push(document.createElement("a-box"));
                    $items[0].setAttribute("color", vm.roomsData.fixedSet.setWashCentre);
                    $items[1].setAttribute("color", vm.roomsData.fixedSet.setWashSame ? vm.roomsData.fixedSet.setWashCentre : vm.roomsData.fixedSet.setWashSides);
                    $items[2].setAttribute("color", vm.roomsData.fixedSet.setWashSame ? vm.roomsData.fixedSet.setWashCentre : vm.roomsData.fixedSet.setWashSides);
                    $items[0].setAttribute("width", "6.1");
                    $items[1].setAttribute("width", "8.5");
                    $items[2].setAttribute("width", "8.5");
                    $items[0].setAttribute("height", "4.57");
                    $items[1].setAttribute("height", "4.57");
                    $items[2].setAttribute("height", "4.57");
                    $items[0].setAttribute("depth", "0.05");
                    $items[1].setAttribute("depth", "0.05");
                    $items[2].setAttribute("depth", "0.05");
                    $items[0].setAttribute("src", "assets/uplighters.png");
                    $items[1].setAttribute("src", "assets/uplighters.png");
                    $items[2].setAttribute("src", "assets/uplighters.png");
                    $items[0].setAttribute("position", "0 3 -4.5");
                    $items[1].setAttribute("position", "-6 3 -1.7");
                    $items[2].setAttribute("position", "6 3 -1.7");
                    $items[1].setAttribute("rotation", "0 41.5 0");
                    $items[2].setAttribute("rotation", "0 -41.5 0");

                } else if (vm.room === "Fleming" || vm.room === "Whittle") {
                    (function () {
                        var i,
                            startXPos = (feetToMetres(item.width) / -2) + 0.61;
                        for (i = 0; i < item.width / 4; i = i + 1) {

                            // set panel
                            $items.push(document.createElement("a-box"));
                            $items[i * 2].setAttribute("width", 1.22);
                            $items[i * 2].setAttribute("height", feetToMetres(item.height));
                            $items[i * 2].setAttribute("position", ((i * 1.2205) + startXPos) + " " + (feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + feetToMetres(item.zPos || 0));
                            $items[i * 2].setAttribute("color", item.lighting || "#FFF");
                            $items[i * 2].setAttribute("src", "assets/uplighters.png");
                            $items[i * 2].setAttribute("depth", "0.05");

                            // chromabatten
                            $items.push(document.createElement("a-entity"));
                            $items[(i * 2) + 1].setAttribute("gltf-model", "#chromabatten");
                            //$items[(i * 2) + 1].id = "chromabatten" + i;
                            $items[(i * 2) + 1].setAttribute("position", ((i * 1.22) + startXPos) + " 0.68 " + (feetToMetres(item.zPos || 0) + 0.2));

                        }
                    }());

                } else if (vm.room === "Mountbatten") {

                    $items.push(document.createElement("a-box"));
                    $items.push(document.createElement("a-box"));
                    $items.push(document.createElement("a-box"));
                    $items[0].setAttribute("color", vm.roomsData.fixedSet.setWashCentre);
                    $items[1].setAttribute("color", vm.roomsData.fixedSet.setWashSame ? vm.roomsData.fixedSet.setWashCentre : vm.roomsData.fixedSet.setWashSides);
                    $items[2].setAttribute("color", vm.roomsData.fixedSet.setWashSame ? vm.roomsData.fixedSet.setWashCentre : vm.roomsData.fixedSet.setWashSides);
                    $items[0].setAttribute("width", "9.8");
                    $items[1].setAttribute("width", "3.45");
                    $items[2].setAttribute("width", "3.45");
                    $items[0].setAttribute("height", "4.7");
                    $items[1].setAttribute("height", "4.7");
                    $items[2].setAttribute("height", "4.7");
                    $items[0].setAttribute("depth", "0.05");
                    $items[1].setAttribute("depth", "0.05");
                    $items[2].setAttribute("depth", "0.05");
                    $items[0].setAttribute("src", "assets/uplighters.png");
                    $items[1].setAttribute("src", "assets/uplighters.png");
                    $items[2].setAttribute("src", "assets/uplighters.png");
                    $items[0].setAttribute("position", "0 2.3 -1");
                    $items[1].setAttribute("position", "-5.55 2.3 0");
                    $items[2].setAttribute("position", "5.55 2.3 0");
                    $items[1].setAttribute("rotation", "0 60 0");
                    $items[2].setAttribute("rotation", "0 -60 0");

                }

            } else if (item.type === "screen") {
                $items.push(document.createElement("a-box"));

                if (vm.room === "Churchill") {
                    $items[0].setAttribute("width", "5.8");
                    $items[0].setAttribute("height", "3.26");
                    $items[0].setAttribute("position", "0 4 -3.9");
                } else {
                    $items[0].setAttribute("width", feetToMetres(item.width));
                    $items[0].setAttribute("height", feetToMetres(item.height));
                    $items[0].setAttribute("position", "0 " + (vm.room === "Mountbatten" ? 3.4 : feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + feetToMetres(item.zPos || 0));
                }

                $items[0].setAttribute("color", "#FFF");
                $items[0].setAttribute("depth", "0.05");

                if (item.surround && (vm.room === "Fleming" || vm.room === "Whittle")) {
                    $items.push(document.createElement("a-box"));
                    $items[1] = document.createElement("a-box");
                    $items[1].setAttribute("color", "#000");
                    $items[1].setAttribute("width", feetToMetres(item.width) + (2 * feetToMetres(item.surround)));
                    $items[1].setAttribute("height", feetToMetres(item.height) + (2 * feetToMetres(item.surround)));
                    $items[1].setAttribute("depth", "0.05");
                    $items[1].setAttribute("position", "0 " + (feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + (feetToMetres(item.zPos || 0) - 0.02));
                }

            } else if (item.type === "graphic") {

                $items.push(document.createElement("a-image"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("opacity", "0.8");
                $items[0].setAttribute("width", item.width);
                $items[0].setAttribute("height", item.width * item.ratio);
                $items[0].setAttribute("position", (item.xPos || 0) + " " + (item.yPos || 0) + " " + ((item.zPos || 0) + 0.02));
                $items[0].setAttribute("src", "user-content/" + item.src);

                if (vm.room === "Churchill") {
                    if (item.xPos > 3) {
                        $items[0].setAttribute("rotation", "0 -41.5 0");
                    } else if (item.xPos < -3) {
                        $items[0].setAttribute("rotation", "0 41.5 0");
                    } else {
                        $items[0].setAttribute("rotation", "0 0 0");
                    }
                } else if (vm.room === "Mountbatten") {
                    if (item.xPos > 4.9) {
                        $items[0].setAttribute("rotation", "0 -60 0");
                    } else if (item.xPos < -4.9) {
                        $items[0].setAttribute("rotation", "0 60 0");
                    } else {
                        $items[0].setAttribute("rotation", "0 0 0");
                    }
                }

            } else if (item.type === "lectern") {

                let yPos = item.yPos || 0;
                if (vm.room === "Churchill") {
                    yPos = yPos + 0.11;
                }

                $items.push(document.createElement("a-entity"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("position", (item.xPos || 0) + " " + yPos + " " + (item.zPos || 0));
                $items[0].setAttribute("rotation", "0 -15 0");
                (function () {
                    var $el1 = document.createElement("a-entity"),
                        $el2 = document.createElement("a-entity"),
                        $light1 = document.createElement("a-entity"),
                        $light2 = document.createElement("a-entity");
                    $el1.setAttribute("obj-model", "obj: #felt-lectern-external;");
                    $el1.setAttribute("material", "color: " + item.colour);
                    $el2.setAttribute("obj-model", "obj: #felt-lectern-internal;");
                    $el2.setAttribute("material", "color: #000;");

                    // lights
                    $light1.setAttribute("light", "angle:15;type:spot;penumbra:1;castShadow:true");
                    $light2.setAttribute("light", "angle:15;type:spot;penumbra:1;castShadow:true");
                    $light1.setAttribute("position", "2 5 1");
                    $light2.setAttribute("position", "-2.4 5 2");
                    $light1.setAttribute("rotation", "-41.6 43.4 28.9");
                    $light2.setAttribute("rotation", "-38 -29 5.5");
                    $el1.appendChild($light1);
                    $el1.appendChild($light2);

                    $items[0].appendChild($el1);
                    $items[0].appendChild($el2);

                }());

            } else if (item.type === "top-table") {

                let yPos = item.yPos || 0;
                if (vm.room === "Churchill") {
                    yPos = yPos + 0.12;
                }

                $items.push(document.createElement("a-entity"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("position", (item.xPos || 0) + " " + yPos + " " + (item.zPos || 0));
                (function () {
                    var i,
                        $el;
                    for (i = 0; i < item.size; i = i + 1) {
                        $el = document.createElement("a-entity");
                        $el.setAttribute("gltf-model", "#tt-gltf");
                        $el.setAttribute("position", ((i + 1) * 0.7) + " 0 0");
                        $items[0].appendChild($el);
                    }
                }());

            } else if (item.type === "bucket-chairs") {

                let yPos = item.yPos || 0;
                if (vm.room === "Churchill") {
                    yPos = yPos + 0.12;
                }

                $items.push(document.createElement("a-entity"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("position", (item.xPos || 0) + " " + yPos + " " + (item.zPos || 0));
                (function () {

                    var i,
                        $el;

                    // Get chair rotations
                    let middle = Math.round(item.size / 2) - 1;
                    let rotations = [];
                    let amount = 0;
                    // first half:
                    for (i = middle; i >= 0; i--) {
                        rotations[i] = amount;
                        amount = amount + 10;
                    }
                    // second half:
                    amount =  item.size % 2 ? -10 : 0;
                    for (i = middle + 1; i <= item.size; i++) {
                        rotations[i] = amount;
                        amount = amount - 10;
                    }

                    for (i = 0; i < item.size; i = i + 1) {
                        $el = document.createElement("a-entity");
                        $el.setAttribute("gltf-model", "#bucket-chair");
                        $el.setAttribute("position", ((i + 1) * 0.8) +  " 0 " + (Math.pow(Math.abs(rotations[i]), 1.7) * 0.002)); // the Y position isn't linear relative to rotation
                        $el.setAttribute("rotation", "0 " + rotations[i] + " 0");
                        $items[0].appendChild($el);
                    }
                }());

            }

            $items.forEach(function ($item) {
                $scene.appendChild($item);
            });

        });

        if (renderRoom) {

            // audience chairs
             if (vm.seatingStyle === "Theatre") {

                (function () {

                    var AISLE_WIDTH = 2.5,
                        CHAIR_WIDTH = 0.55,
                        CHAIR_DEPTH = 1.2,
                        frontRow = (function () {
                            let furthestPos = 2.4
                            if (vm.room === "Fleming" || vm.room === "Whittle") {
                                // check each stage position
                                vm.items.forEach(function (item) {
                                    if (item.type === "stage") {
                                        const newPos = feetToMetres(item.depth) + feetToMetres(item.zPos) - 0.2;
                                        if (furthestPos < newPos) {
                                            furthestPos = newPos;
                                        }
                                    }
                                });
                            }
                            return furthestPos;
                        }()),
                        maxChairs,
                        chairsPerRow,
                        chairIndex = 0,
                        row = 1,
                        side = "left",
                        $chairsContainer = document.querySelector("#chairs"),
                        chairs;

                    // determine number of chairs based on room
                    if (vm.room === "Churchill") {
                        chairsPerRow = 12;
                        maxChairs = 20 * 12;
                    } else if (vm.room === "Fleming") {
                        chairsPerRow = 18;
                        maxChairs = 12 * 18;
                    } else if (vm.room === "Whittle") {
                        chairsPerRow = 13;
                        maxChairs = 20 * 13;
                    } else if (vm.room === "Mountbatten") {
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
                                chairArray.push("pink");
                            } else {
                                chairArray.push("purple");
                            }
                        }
                        return chairArray;
                    }());

                    // clear existing chairs
                    $chairsContainer.innerHTML = "";

                    chairs.forEach(function (colour) {

                        var $el = document.createElement("a-entity"),
                            xPos;

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

                        //console.log(chairIndex + " : " + side + ": " + row + " : " + xPos);

                        $el.setAttribute("obj-model", "obj: #chair-" + colour + "-obj; mtl: #chair-" + colour + "-mtl");
                        $el.className = "chair";
                        $el.setAttribute("rotation", "0 180 0");
                        $el.setAttribute("position", xPos + " 0.58 " + ((row * CHAIR_DEPTH) + frontRow));
                        $chairsContainer.appendChild($el);
                    });
                }());

            } else { // hide chairs
                document.querySelector("#chairs").innerHTML = "";
            }

        }

    };

}());
