'use strict';

const Excel = require('exceljs');
let workbook = new Excel.Workbook();
module.exports = {

  async readFile(field = [],file){
    let data = [];
    try{
      await workbook.xlsx.readFile(file);
      let worksheet = workbook.getWorksheet(1); //获取第一个worksheet
      worksheet.eachRow(function(row, rowNumber) {

        // let rowSize = row.cellCount;
        // let numValues = row.actualCellCount;
        // console.log(rowNumber + "单元格数量/实际数量:"+rowSize+"/"+numValues);
        // cell.type单元格类型：6-公式 ;2-数值；3-字符串
        if (rowNumber > 1){
          let value = {};
          row.eachCell(function(cell, colNumber) {

            if(cell.type === 6){
              value[field[colNumber - 1]] = cell.result;
            }else{
              value[field[colNumber - 1]] = cell.value;
            }
          });

          data.push(value);
        }

      });
    }catch(err){
      throw err;
    }
    return data;
  }
};
