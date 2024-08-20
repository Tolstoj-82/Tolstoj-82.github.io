w = 4*160;
h = 4*144;
for(j = 1; j<=2; j++){
	newImage("yo"+j, "RGB black", w, h, 1);
	
	selectWindow("yo"+j);
	
	colors = newArray(
	"w", // 0
	"w", // 1
	"w", // 2
	"b"  // 3
	//"w", // 4
	//"w", // 5
	//"w", // 6
	//"b"  // 7
	);
	
	i = 3;
	for(y=0; y<=h; y++){
		if(i == colors.length) i = 0; 
		thisColor = colors[i];
		for(x=1; x<=w; x++){
			if(thisColor == "b") setPixel(x, y, 0xffffff);
		}
		i++;
	}
	
	i = 3;
	for(x=0; x<=w; x++){
		if(i == colors.length) i = 0; 
		thisColor = colors[i];
		for(y=1; y<=h; y++){
			if(thisColor == "b") setPixel(x, y, 0xffffff);
		}
		i++;
	}
	setPixel(0, 0, 0xffffff);
	run("Gaussian Blur...", "sigma=" + j);
	run("Invert");
}
run("Images to Stack", "use");
run("Z Project...", "projection=[Min Intensity]");
selectImage("Stack");
close();