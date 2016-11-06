echo Running Rollup
echo Creating index
rollup src/index.js --output dist/index.js --config rollup.config.js
echo Finished
echo Creating renderer
rollup src/renderer.js --output dist/app/renderer.js --config rollup.config.js
echo Finished
echo Finished Rollup
