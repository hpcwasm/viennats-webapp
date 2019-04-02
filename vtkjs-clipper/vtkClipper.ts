import macro from 'vtk.js/Sources/macro';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';

const { vtkErrorMacro } = macro;

// ----------------------------------------------------------------------------
// vtkCutter methods
// ----------------------------------------------------------------------------

function vtkCutter(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCutter');

  // Capture "parentClass" api for internal use
  const superClass = Object.assign({}, publicAPI);

  publicAPI.getMTime = () => {
    let mTime = superClass.getMTime();
    if (!model.cutFunction) {
      return mTime;
    }

    mTime = Math.max(mTime, model.cutFunction.getMTime());
    return mTime;
  };

  function dataSetCutter(input, output) {
    const numCells = input.getNumberOfCells();
    const points = input.getPoints();
    const pointsData = points.getData();
    const numPts = points.getNumberOfPoints();
    const cellDataValues = input.getCellData() === undefined ? undefined: input.getCellData().getScalars().getData();
    const newPointsData = [];
    const newLinesData = [];
    const newPolysData = [];
    const newCellDataValues = [];
    // console.log("################cellDataValues");
    // console.log(cellDataValues);  
    if (!model.cutScalars || model.cutScalars.length < numPts) {
      model.cutScalars = new Float32Array(numPts);
    }

    // Loop over all points evaluating scalar function at each point
    let inOffset = 0;
    let outOffset = 0;
    while (inOffset < pointsData.length) {
      model.cutScalars[outOffset++] = model.cutFunction.evaluateFunction(
        pointsData[inOffset++],
        pointsData[inOffset++],
        pointsData[inOffset++]
      );
    }

    const dataCell = input.getPolys().getData();
    const crossedEdges = [];
    const x1 = new Array(3);
    const x2 = new Array(3);
    // Loop over all cells; get scalar values for all cell points
    // and process each cell.
    /* eslint-disable no-continue */
    for (let cellId = 0; cellId < numCells; cellId++) {
      const nbPointsInCell = dataCell[0];
      // Check that cells have at least 3 points
      if (nbPointsInCell <= 2) {
        continue;
      }

      // Get associated scalar of points that constitute the current cell
      const cellPointsScalars = [];
      const valuesInCell = nbPointsInCell + 1; // first value is size
      let pointIndex;
      for (
        let i = valuesInCell * cellId + 1;
        i < valuesInCell * (cellId + 1);
        i++
      ) {
        pointIndex = dataCell[i];
        cellPointsScalars.push(model.cutScalars[pointIndex]);
      }

      // Check if all cell points are on same side (same side == cell not crossed by cut function)
      // TODO: won't work if one point scalar is = 0 ?
      const sideFirstPoint = cellPointsScalars[0] > 0;
      let allPointsSameSide = true;
      for (let i = 1; i < cellPointsScalars.length; i++) {
        const sideCurrentPoint = cellPointsScalars[i] > 0;
        if (sideCurrentPoint !== sideFirstPoint) {
          allPointsSameSide = false;
          break;
        }
      }

      // Go to next cell if cell is not crossed by cut function
      if (allPointsSameSide) {
        // add cell if on positive side
        if (sideFirstPoint)
        {
          
          // Get id of points that constitute the current cell
          const cellPointsID = [];
          for (
            let i = valuesInCell * cellId + 1;
            i < valuesInCell * (cellId + 1);
            i++
          ) {
            cellPointsID.push(dataCell[i]);
          }
          
          // add current cell points to newpoints
          newPolysData.push(cellPointsID.length);
          newCellDataValues.push(cellDataValues[cellId]);
          // console.log(cellPointsID.length);
          for (let i = 0; i < cellPointsID.length; i++)
          {
            
            newPointsData.push(pointsData[cellPointsID[i]*3+0]);
            newPointsData.push(pointsData[cellPointsID[i]*3+1]);
            newPointsData.push(pointsData[cellPointsID[i]*3+2]);
            newPolysData.push(newPointsData.length / 3 - 1);
          }
          // add current cell to newpolys
 
          
        }
        else{ 
          // do not add
        }
        
      }
    
      continue;

    }

    // Set points
    const outputPoints = output.getPoints();
    outputPoints.setData(newPointsData);
    if (outputPoints.getNumberOfComponents !== 3) {
      outputPoints.setNumberOfComponents(3);
    }

    // Set lines
    if (newLinesData.length !== 0) {
      output.getLines().setData(newLinesData);
    }

    // Set polys
    if (newPolysData.length !== 0) {
      // console.log(newPolysData);
      output.getPolys().setData(newPolysData);
      output.getCellData().setScalars(
        vtkDataArray.newInstance({ numberOfComponents: 1, name: 'Attribute', values: newCellDataValues })
      );      
    }
  }

  // expose requestData
  publicAPI.requestData = (inData, outData) => {
    // implement requestData
    const input = inData[0];

    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return;
    }

    if (!model.cutFunction) {
      vtkErrorMacro('Missing cut function');
      return;
    }

    const output = vtkPolyData.newInstance();

    dataSetCutter(input, output);

    outData[0] = output;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  cutFunction: null, // support method with evaluateFunction method
  cutScalars: null,
  cutValue: 0.0,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macro.algo(publicAPI, model, 1, 1);

  // Set implicit function use to cut the input data (is vtkPlane)
  macro.setGet(publicAPI, model, ['cutFunction', 'cutValue']);

  // Object specific methods
  vtkCutter(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCutter');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
