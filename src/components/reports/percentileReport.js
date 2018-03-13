import React, { Component } from 'react';
import { LoadingSpinner, ColorTag, ExportCSV } from '../../components';
import { FunctionsResults } from '../functions';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import 'react-sticky-table/dist/react-sticky-table.css';
var _ = require('lodash');

const functionsResults  = new FunctionsResults ();

class PercentileReport extends Component {
    constructor() {
        super();
        this.state = {
            allResults: [],
            average: [],
        };
    }

    static defaultProps = {
        functionsResults
    }

    async componentDidMount() {
        // Get the percentile values and the percentile average of selected return => [allResults, average]
        let percentile = await this.props.functionsResults.getPercentileScore(this.props.allResults);

        this.setState({
            allResults: percentile.selectedAds,
            average: percentile.average
        });
    }

    render() {
        // Key for rows
        let trKey = 0;

        const displayHeaderTable = () => {
            const self = this;
            trKey++;

            let cells = [];
            let valuesCell = [];
            _.mapValues(self.state.allResults, function (single) {
                valuesCell.push(single.ad.shortname);
            })

            cells.push(<Cell key={0}><ExportCSV toExport={self.props.allResults}/></Cell>);
            valuesCell.map( function (single, i) {
                cells.push(<Cell key={i+1}>{single}</Cell>);
            })

            return (
                <Row>
                    { cells }
                </Row>
            );
        }

        const showColorTag = (_.size(this.state.allResults)) >= 5 ? true : false;

        const displaySingleKPI = (kpi, nameOfClass, title) => {
            const self = this;
            trKey++;

            let cells = [];
            let valuesCell = [];
            _.mapValues(self.state.allResults, function (single) {
                //Get the percentile value
                let v = (single['percentile']==null || (isNaN(single['percentile'][kpi])) ? 0 : single['percentile'][kpi]);
                valuesCell.push(Math.round(v));
            })

            cells.push(<Cell key={0}>{ title }</Cell>);
            valuesCell.map( function (single, i) {
                const kpiValue = self.state.average[kpi];
                cells.push(
                    <Cell key={i+1}>
                        {single}th
                        { showColorTag && (
                            <ColorTag difference={ single - kpiValue }/>
                        )}
                    </Cell>
                );
            })

            return (
                <Row className={nameOfClass}>
                    { cells }
                </Row>
            );
        }


        if (_.isEmpty(this.state.average) || (this.state.average.length > 0)){
            return (
                <LoadingSpinner/>
            )
        } else {
            return (
                <StickyTable stickyHeaderCount={1} stickyColumnCount={1}>
                    {displayHeaderTable()}

                    {displaySingleKPI('total', 'level1', 'SpotOn score')}

                    {displaySingleKPI('brandRelevance', 'level2', 'Brand Relevance')}
                    {displaySingleKPI('brandRecall', 'level3', 'Brand Recall')}
                    {displaySingleKPI('relevance', 'level3', 'Relevance')}
                    {displaySingleKPI('brandFit', 'level3', 'Brand Fit')}

                    {displaySingleKPI('viewerEngagement', 'level2', 'Viewer Engagement')}
                    {displaySingleKPI('adAppeal', 'level3', 'Ad Appeal')}
                    {displaySingleKPI('shareability', 'level3', 'Shareability')}
                    {displaySingleKPI('callToAction', 'level3', 'Call to Action')}

                    {displaySingleKPI('adMessage', 'level2', 'Ad Message')}
                    {displaySingleKPI('toneOfVoice', 'level3', 'Tone of Voice')}
                    {displaySingleKPI('emotion', 'level3', 'Emotion')}
                    {displaySingleKPI('uniqueness', 'level3', 'Uniqueness')}
                    {displaySingleKPI('messaging', 'level3', 'Messaging')}

                </StickyTable>
            );
        }
    }
}

export default PercentileReport;

