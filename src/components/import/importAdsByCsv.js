import React, { Component } from 'react'
import ReactFileReader from 'react-file-reader' // move to single component later
import { Api, HandleCSV } from '../constants'
import TvIcon from '../../Assets/imgs/tv-icon-upload.svg'

class ImportAdsByCSV extends Component {
	constructor(props, context) {
		super(props, context)

		this.state = {
			imported: false,
			uploading: false
		}

		this.api = new Api()
		this.handleCSV = new HandleCSV()
	}

	setStateAsync(state) {
		return new Promise(resolve => {
			this.setState(state, resolve)
		})
	}

	// Returns the csv that the user uploads // move to a single component
	handleFiles = files => {
		this.setState({
			uploading: true
		})

		const self = this
		var reader = new FileReader()
		reader.onload = async function(e) {
			// Convert the CSV to object and send to API
			self.setStateAsync({
				imported: await self.api.createBulkAds(
					await self.handleCSV.csvToObject(reader.result)
				),
				uploading: false
			})
		}
		reader.readAsText(files[0])
	}

	render() {
		const buttonToUpload = () => {
			if (this.state.imported) {
				return (
					<button className="btn" disabled>
						Upload successful
					</button>
				)
			} else {
				if (this.state.uploading) {
					return (
						<button className="btn" disabled>
							Uploading
						</button>
					)
				} else {
					return <button className="btn">Upload Ads</button>
				}
			}
		}

		return (
			<div>
				<img src={TvIcon} alt="Upload Ads" />
				<ReactFileReader
					handleFiles={this.handleFiles}
					fileTypes={'.csv'}>
					{buttonToUpload()}
				</ReactFileReader>
				<span>CSV format only</span>
			</div>
		)
	}
}

export default ImportAdsByCSV
