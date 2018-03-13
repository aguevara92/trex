import React, { Component } from 'react';
import { Api } from '../../constants';
import ReactFileReader from 'react-file-reader'; // move to single component later
import { HandleCSV, TabulateAnswers } from '../functions';
import QuestIcon from'../../Assets/imgs/questionnaire-icon.svg';

const api = new Api();
const handleCSV = new HandleCSV();
const tabulateAnswers  = new TabulateAnswers ();


class ImportResultsByCSV extends Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            imported: false
        }
    }

    static defaultProps = {
        api,
        handleCSV,
        tabulateAnswers
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    // Returns the csv that the user uploads // move to a single component

    handleFiles = files => {
        const self = this;
        var reader = new FileReader();
        this.setState({
            uploading: true
        })
        reader.onload = async function(e) {
            let results = self.props.handleCSV.csvToObject(reader.result);

            // Import to DB the results
            //await self.props.api.createBulkResults(results); -- Import the results
            let KPIs = self.props.tabulateAnswers.init(results);
            // Convert the CSV to object and send to API
            self.setStateAsync({
                imported: await self.props.api.createKPI(KPIs),
                uploading: false
            })
        }
        reader.readAsText(files[0]);
    }

    render() {

        const buttonToUpload = () => {
            if (this.state.imported){
                return (
                    <button className='btn' disabled>Upload successful</button>
                )
            } else {
                if (this.state.uploading){
                    return (
                        <button className='btn' disabled>Uploading</button>
                    )
                } else {
                    return (
                        <button className='btn'>Upload Results</button>
                    )
                }
            }
        }

        return (
            <div>
                <img  src={QuestIcon} alt="Upload Results"/>
                <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
                    { buttonToUpload() }
                </ReactFileReader>
                <span>CSV format only</span>
            </div>
        )
    }
}

export default ImportResultsByCSV;