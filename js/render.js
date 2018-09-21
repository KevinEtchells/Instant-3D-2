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
            if (vm.room === "Fleming") {
                $room.setAttribute("gltf-model", "#fleming-whittle");
                $room.setAttribute("rotation", "0 0 0");
                $room.setAttribute("position", "0 0 7");
            } else if (vm.room === "Whittle") {
                $room.setAttribute("gltf-model", "#fleming-whittle");
                $room.setAttribute("rotation", "0 270 0");
                $room.setAttribute("position", "29.4 0 8");
            }
        }

        items.forEach(function (item) {

            var $items = [];

            if (item.type === "stage") {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("width", feetToMetres(item.width));
                $items[0].setAttribute("height", feetToMetres(item.height));
                $items[0].setAttribute("position", "0 " + (feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + feetToMetres(item.zPos || 0));
                $items[0].setAttribute("color", "#111");
                $items[0].setAttribute("depth", feetToMetres(item.depth));
                
            } else if (item.type === "set") {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("width", feetToMetres(item.width));
                $items[0].setAttribute("height", feetToMetres(item.height));
                $items[0].setAttribute("position", "0 " + (feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + feetToMetres(item.zPos || 0));
                $items[0].setAttribute("color", item.lighting || "#FFF");
                $items[0].setAttribute("src", "assets/uplighters.png");
                $items[0].setAttribute("depth", "0.05");

            } else if (item.type === "screen") {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("width", feetToMetres(item.width));
                $items[0].setAttribute("height", feetToMetres(item.height));
                $items[0].setAttribute("position", "0 " + (feetToMetres(item.yPos || 0) + (feetToMetres(item.height) / 2)) + " " + feetToMetres(item.zPos || 0));
                $items[0].setAttribute("color", "#FFF");
                $items[0].setAttribute("depth", "0.05");

                if (item.surround) {
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
                
            } else if (item.type === "lectern") {
                $items.push(document.createElement("a-entity"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("position", (item.xPos || 0) + " " + (item.yPos || 0) + " " + (item.zPos || 0));
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
                $items.push(document.createElement("a-entity"));
                $items[0].setAttribute("id", item.id);
                $items[0].setAttribute("position", (item.xPos || 0) + " " + (item.yPos || 0) + " " + (item.zPos || 0));
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
                
            }

            $items.forEach(function ($item) {
                $scene.appendChild($item);
            });

        });
        
        // update set wash colour
        vm.items.forEach(function (item) {
            if (item.type === "set") {
                document.querySelector("#set-wash").value = item.lighting;
            }
        });
        
        
        if (renderRoom) {
            
            // audience chairs
            (function () {

                var AISLE_WIDTH = 2.5,
                    CHAIR_WIDTH = 0.55,
                    CHAIR_DEPTH = 1.2,
                    frontRow = 3,
                    chairsPerRow = (vm.room === "Fleming" ? 18 : 13), // 14 per row for Whittle
                    chairIndex = 0,
                    row = 1,
                    side = "left",
                    $chairsContainer = document.querySelector("#chairs"),
                    chairs;
                
                chairs = (function () {
                    var MAX_CHAIRS = (vm.room === "Fleming" ? 12 * 18 : 20 * 13),
                        chairArray = [],
                        i,
                        rnd;
                    for (i = 0; i < MAX_CHAIRS; i = i + 1) {
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

        }

    };

}());
