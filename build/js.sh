echo Running Rollup
echo Creating index
rollup src/index.js --output app/index.js --config rollup.config.js
echo Finished
echo Creating renderer
rollup src/renderer.js --output app/renderer.js --config rollup.config.js
echo Finished
echo Finished Rollup
