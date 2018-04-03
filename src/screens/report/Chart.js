import React, { Component } from 'react';
import {
    Api,
    RadarCharts,
    BarCharts,
    StackedBarCharts,
    GetKPIs,
    LoadingSpinner
} from '../../components';
import {
    Tab,
    Tabs,
    TabList,
    TabPanel
} from 'react-tabs';

const api = new Api();
const getKPIs = new GetKPIs();

class Chart extends Component {
    constructor() {
        super();
        this.state = {
            thisResults: {},
            isLoaded: false
        };
    }

    static defaultProps = {
        api,
        getKPIs
    }

    getAdsFromURL = async () => {
        // Get the adname of this Ad
        let allResults = {};

        let ads = this.props.match.params.id;
        ads = ads.split("&");

        for ( let single in ads ) {
            if (ads[single]){
                const thisAd = await this.props.api.fetchSingleAd(ads[single]);
                allResults[ads[single]] = thisAd;
                this.props.handleSelection(thisAd.ad, true)
            }
        };
        // Save them into the state
        this.setState({
            thisResults: allResults,
            isLoaded: true
        });
    }

    componentDidMount = async () => {
        this.getAdsFromURL();
    }

    render() {
        if (this.state.isLoaded){
            let total = [ 'Total' ];
            let mainKPIs = [ 'Brand Relevance', 'Viewer Engagement', 'Ad Message' ];
            let singleKpis = [ 'Brand Recall', 'Relevance', 'Brand Fit', 'Ad Appeal', 'Shareability', 'Call to action', 'Tone of voice', 'Emotion', 'Uniqueness', 'Messaging' ];
            let brandRelevance = [ 'Brand Recall', 'Relevance', 'Brand Fit' ];
            let viewerEngagement = [ 'Ad Appeal', 'Shareability', 'Call to action' ];
            let adMessage = [ 'Messaging', 'Tone of voice', 'Emotion', 'Uniqueness' ];

            return(
                <Tabs>
                    <TabList>
                        <Tab>Spot On score</Tab>
                        <Tab>L1 KPIs</Tab>
                        <Tab>Brand Relevance</Tab>
                        <Tab>Viewer Engagement</Tab>
                        <Tab>Ad Message</Tab>
                        <Tab>KPIs details</Tab>
                    </TabList>

                    <TabPanel>
                        <BarCharts thisResults={this.state.thisResults} kpis={this.props.getKPIs.init(total)}/>
                    </TabPanel>
                    <TabPanel>
                        <BarCharts thisResults={this.state.thisResults} kpis={this.props.getKPIs.init(mainKPIs)}/>
                    </TabPanel>
                    <TabPanel>
                        <StackedBarCharts thisResults={this.state.thisResults} kpis={this.props.getKPIs.init(brandRelevance)}/>
                    </TabPanel>
                    <TabPanel>
                        <StackedBarCharts thisResults={this.state.thisResults} kpis={this.props.getKPIs.init(viewerEngagement)}/>
                    </TabPanel>
                    <TabPanel>
                        <StackedBarCharts thisResults={this.state.thisResults} kpis={this.props.getKPIs.init(adMessage)}/>
                    </TabPanel>
                    <TabPanel>
                        <RadarCharts thisResults={this.state.thisResults} kpis={this.props.getKPIs.init(singleKpis)}/>
                    </TabPanel>
                </Tabs>
            )
        } else {
            return (
                <LoadingSpinner/>
            )
        }
    }
}

export default Chart;
