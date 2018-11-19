set APPLICATION=%cd%
cd ./node_modules/electron/dist
cls
electron "%APPLICATION%/source"
cd %APPLICATION%
cls
