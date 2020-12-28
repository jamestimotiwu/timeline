var inputLeft = document.getElementById("input-left");
var inputRight = document.getElementById("input-right");

//var thumbLeft = document.querySelector(".slider > .thumb.left");
//var thumbRight = document.querySelector(".slider > .thumb.right");
var slider = document.querySelector(".slider");
var range = document.querySelector(".slider > .range");
//var l_range = document.querySelector(".slider > .leftrange");
//var r_range = document.querySelector(".slider > .rightrange");

function setLeftValue() {
	var _this = inputLeft,
		min = parseInt(_this.min),
		max = parseInt(_this.max);


	_this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);

	var percent = ((_this.value - min) / (max - min)) * 100;

	//thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
  slider.style.clipPath = "inset(0% " + range.style.right + " 0% " + percent + "%)";
  // left range
  //l_range.style.right = (100-percent) + "%";
  //console.log("left" + percent);
}
setLeftValue();

function setRightValue() {
	var _this = inputRight,
		min = parseInt(_this.min),
		max = parseInt(_this.max);

	_this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);

	var percent = ((_this.value - min) / (max - min)) * 100;

	//thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
  slider.style.clipPath = "inset(0% " + (100 - percent) + "% 0% " + range.style.left + ")";
  // right range
  //r_range.style.left = percent + "%";
  //console.log("right" + (100-percent));
}
setRightValue();

inputLeft.addEventListener("input", setLeftValue);
inputRight.addEventListener("input", setRightValue);

/*
inputLeft.addEventListener("mouseover", function() {
	thumbLeft.classList.add("hover");
});
inputLeft.addEventListener("mouseout", function() {
	thumbLeft.classList.remove("hover");
});
inputLeft.addEventListener("mousedown", function() {
	thumbLeft.classList.add("active");
});
inputLeft.addEventListener("mouseup", function() {
	thumbLeft.classList.remove("active");
});

inputRight.addEventListener("mouseover", function() {
	thumbRight.classList.add("hover");
});
inputRight.addEventListener("mouseout", function() {
	thumbRight.classList.remove("hover");
});
inputRight.addEventListener("mousedown", function() {
	thumbRight.classList.add("active");
});
inputRight.addEventListener("mouseup", function() {
	thumbRight.classList.remove("active");
});
*/
