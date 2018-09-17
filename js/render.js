/*global vm*/
/*global document*/

var render;

(function () {
    
    "use strict";
    
    var $scene = document.querySelector("#content"),
        $room = document.querySelector("#room");
    
    render = function () {
        
        $scene.innerHTML = "";
        
        if (vm.room === "Fleming") {
            $room.setAttribute("obj-model", "obj: #fleming-whittle-obj;");
            $room.setAttribute("rotation", "0 90 0");
            $room.setAttribute("position", "3 0 70");
        } else if (vm.room === "Whittle") {
            $room.setAttribute("obj-model", "obj: #fleming-whittle-obj;");
            $room.setAttribute("rotation", "0 0 0");
            $room.setAttribute("position", "49 0 26");
        }
    
        vm.items.forEach(function (item) {

            var $items = [];

            if (item.type === "stage") {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("width", item.width);
                $items[0].setAttribute("height", item.height);
                $items[0].setAttribute("position", "0 " + ((item.bottom || 0) + (item.height / 2)) + " " + (item.back || 0));
                $items[0].setAttribute("color", "#111");
                $items[0].setAttribute("depth", item.depth);
                
            } else if (item.type === "set") {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("width", item.width);
                $items[0].setAttribute("height", item.height);
                $items[0].setAttribute("position", "0 " + ((item.bottom || 0) + (item.height / 2)) + " " + (item.back || 0));
                $items[0].setAttribute("color", item.lighting || "#FFF");
                $items[0].setAttribute("src", "assets/uplighters.png");
                $items[0].setAttribute("depth", "0.2");

            } else if (item.type === "screen") {
                $items.push(document.createElement("a-box"));
                $items[0].setAttribute("width", item.width);
                $items[0].setAttribute("height", item.height);
                $items[0].setAttribute("position", "0 " + ((item.bottom || 0) + (item.height / 2)) + " " + (item.back || 0));
                $items[0].setAttribute("color", "#FFF");
                $items[0].setAttribute("depth", "0.1");

                if (item.surround) {
                    $items.push(document.createElement("a-box"));
                    $items[1] = document.createElement("a-box");
                    $items[1].setAttribute("color", "#000");
                    $items[1].setAttribute("width", item.width + (2 * item.surround));
                    $items[1].setAttribute("height", item.height + (2 * item.surround));
                    $items[1].setAttribute("depth", "0.1");
                    $items[1].setAttribute("position", "0 " + ((item.bottom || 0) + (item.height / 2)) + " " + ((item.back || 0) - 0.1));
                }

            } else if (item.type === "graphic") {
                $items.push(document.createElement("a-image"));
                $items[0].setAttribute("opacity", "0.8");
                $items[0].setAttribute("width", item.width);
                $items[0].setAttribute("height", item.height);
                $items[0].setAttribute("position", (item.left || 0) + " " + ((item.bottom || 0) + (item.height / 2)) + " " + ((item.back || 0) + 0.1));
                $items[0].setAttribute("src", "user-content/" + item.src);
            }

            $items.forEach(function ($item) {
                $scene.appendChild($item);
            });
            
            // update set wash colour
            vm.items.forEach(function (item) {
                if (item.type === "set") {
                    document.querySelector("#set-wash").value = item.lighting;
                } 
            });

        });
        
    };

}());