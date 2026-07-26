dir = "C:\\Users\\marti\\Documents\\Programing Stuff\\ROM Editor\\Live\\tiles\\";
ofile = getFileList(dir);
setBatchMode(true);
for(i=0; i<ofile.length; i++){
	if(endsWith(toLowerCase(ofile[i]), ".png")){
		thisFile = ofile[i];
		woEnding = replace(thisFile, ".png", "");
		pixelVal = "" + woEnding + ",";
		open(dir + thisFile);
		getDimensions(w, h, ch, sl, fr);
		for(x=0; x<w; x++){
			for(y=0; y<h; y++){
				thisVal = getPixel(x, y);
				pixelVal = pixelVal + thisVal + ", ";
			}			
		}
		close();
		len = lengthOf(pixelVal)-2;
		pixelVal = substring(pixelVal, 0, len);
		print(pixelVal);
	}
}
setBatchMode(false);