const csv = require('csvtojson')
var _ = require('lodash')

class HandleCSV {
	/**
	 * Turns the CSV string into an Object
	 *
	 * @param {String} csvString              String of the CSV imported
	 * @returns {Array}                       Array of object of the CSV rows
	 */
	csvToObject = async csvString => {
		// The array we're going to build
		let jsonObj = []

		// Async / await usage
		const csvArray = await csv({
			noheader: true,
			output: 'csv'
		}).fromString(csvString)

		var headers = csvArray[0]
		for (var i = 1; i < csvArray.length; i++) {
			var data = csvArray[i]
			var obj = {}
			for (var j = 0; j < data.length; j++) {
				if (
					data[j] !== undefined ||
					data[j] !== null ||
					data[j].trim() !== ''
				) {
					obj[headers[j].trim()] = data[j].trim()
				} else {
					obj[headers[j].trim()] = null
				}
			}
			jsonObj.push(obj)
		}
		JSON.stringify(jsonObj)
		return jsonObj
	}

	exportObjectToCSV = (filename, rows) => {
		let toExport = []

		toExport.push(_.keys(rows['0']))

		for (let key in rows) {
			let byKey = _.values(rows[key])
			toExport.push(byKey)
		}

		rows = toExport

		// ---------------------

		var processRow = row => {
			var finalVal = ''
			for (var j = 0; j < row.length; j++) {
				var innerValue = row[j] === null ? '' : row[j].toString()
				if (row[j] instanceof Date) {
					innerValue = row[j].toLocaleString()
				}
				var result = innerValue.replace(/"/g, '""')
				if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
				if (j > 0) finalVal += ','
				finalVal += result
			}
			return finalVal + '\n'
		}

		var csvFile = ''
		for (var i = 0; i < rows.length; i++) {
			csvFile += processRow(rows[i])
		}

		var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, filename)
		} else {
			var link = document.createElement('a')
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob)
				link.setAttribute('href', url)
				link.setAttribute('download', filename)
				link.style.visibility = 'hidden'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			}
		}
	}
}

export default HandleCSV
