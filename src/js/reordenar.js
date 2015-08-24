function reordenar (arr) {
	var narr = [],
	flag = false,
	index = 1;

	narr[0] = arr[Math.floor(Math.random()*arr.length)];

	for (var i = 0; arr.length != narr.length; i++) {
		flag = false;
		var random = Math.floor(Math.random()*arr.length),
			posible = arr[random];

		for (var i = 0; i < narr.length; i++) {
			if(narr[i] == posible) flag = true;
		};
		if (!flag) {
			narr[index] = posible;
			index++;
		}
	};

	return narr;
}
