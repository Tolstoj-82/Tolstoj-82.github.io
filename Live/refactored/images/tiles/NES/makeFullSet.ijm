iDir = getDirectory("Chose your input folder");
for(i=0; i<10; i++){
	currentDir = iDir + i + "\\";
	open(currentDir + "1.png");
	saveAs("png", currentDir + "2.png");
	saveAs("png", currentDir + "3.png");
	saveAs("png", currentDir + "4.png");
	saveAs("png", currentDir + "5.png");
	saveAs("png", currentDir + "6.png");
	saveAs("png", currentDir + "O.png");
	saveAs("png", currentDir + "T.png");
	close();
	open(currentDir + "\\" + "L.png");
	saveAs("png", currentDir + "Z.png");
	close();
	open(currentDir + "\\" + "J.png");
	saveAs("png", currentDir + "S.png");
	close();
}
