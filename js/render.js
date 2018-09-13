/*global vm*/
/*global document*/

var render;

(function () {
    
    "use strict";
    
    var $scene = document.querySelector("#content");
    
    render = function () {
        
        $scene.innerHTML = "";
    
        vm.items.forEach(function (item) {

            var $items = [document.createElement("a-box")];

            $items[0].setAttribute("width", item.width);
            $items[0].setAttribute("height", item.height);
            $items[0].setAttribute("position", "0 " + ((item.bottom || 0) + (item.height / 2)) + " " + (item.back || 0));

            if (item.type === "stage") {
                $items[0].setAttribute("color", "#111");
                $items[0].setAttribute("depth", item.depth);
            } else if (item.type === "set") {
                $items[0].setAttribute("color", item.lighting || "#FFF");
                $items[0].setAttribute("src", "assets/uplighters.png");
                $items[0].setAttribute("depth", "0.2");
            } else if (item.type === "screen" || item.type === "graphic-printed") {
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
            }

            $items.forEach(function ($item) {
                $scene.appendChild($item);
            });

        });
        
    };

}());