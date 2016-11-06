echo Removing previous html build
rm -rf dist/app/html/
echo Copying html files to build
cp -R src/html/ dist/app/html/
echo Finished copying html files
