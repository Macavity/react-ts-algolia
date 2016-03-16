
import {Config} from "/src/modules/Config";

declare var algoliasearch:any;


export interface IAlgoliaResult {
    objectID: string;
    _highlightResult?: Object;
    _rankingInfo?: {
        nbTypos : number,
        firstMatchedWord : number;
        proximityDistance : number;
        userScore : number;
        geoDistance : number;
        geoPrecision : number;
        nbExactWords : number;
        words: number;
        matchedGeoLocation : {
            lat : number;
            lng : number;
            distance: number;
        }
    };
}

interface ITag {
    "id" : number;
    "name" : string;
    "url" : string;
}

interface IGeoLoc {
    lat: number;
    lng: number;
}

export interface IIndexResult extends IAlgoliaResult {
    "objectID" : string;
    "name" : string;
    "active" : boolean;
    "description" : string;
    "tags" : ITag[];
}

export interface IAlgoliaResult {
    objectID: String;
    _highlightResult?: Object;
    _rankingInfo?: {
        nbTypos : Number,
        firstMatchedWord : Number;
        proximityDistance : Number;
        userScore : Number;
        geoDistance : Number;
        geoPrecision : Number;
        nbExactWords : Number;
        words: Number;
        matchedGeoLocation : {
            lat : Number;
            lng : Number;
            distance: Number;
        }
    };
}

/**
 * Base Algolia Search Module that is used for all algolia search requests
 *
 * @author Alexander Pape <a.pape@paneon.de>
 */
export default class AlgoliaSearch {

    private static instance:AlgoliaSearch;

    private index:string;
    private appId:string;
    private appKey:string;

    private searchClient;
    private searchIndex;

    constructor() {
        this.index = Config.get("algoliaIndex");
        this.appId = Config.get("algoliaApp");
        this.appKey = Config.get("algoliaKey");
    }

    public static getInstance():AlgoliaSearch {
        if(AlgoliaSearch.instance == null) {
            AlgoliaSearch.instance = new AlgoliaSearch();
        }
        return AlgoliaSearch.instance;
    }

    static isAlgoliaLoaded (){
        return (typeof algoliasearch !== "undefined");
    }

    public singleSearch (query, params?:AlgoliaQueryParameters, onSuccessCallback?: Function)
    {
        this.searchIndex.search(query, params, (error, data) => {
            this.afterSearchComplete(error, data, onSuccessCallback);
        } );
    }

    public multiSearch (queries, onSuccessCallback?: Function)
    {
        for(let i = 0, length = queries.length; i < length; ++i){
            // Use default index if none is given.
            if(typeof queries[i].indexName === "undefined" || queries[i].indexName.length === 0){
                queries[i].indexName = this.index;
            }
        }

        this.searchClient.search(queries, (error, data) => {
            this.afterSearchComplete(error, data, onSuccessCallback);
        } );
    }

    /*
     * ==============================
     * Events
     * ==============================
     */
    protected afterSearchComplete (error, data, callback?: Function)
    {
        if(!callback){
            callback = this.onSearchComplete;
        }

        if(error && error.message.length > 0){
            debug(error.message);
        }

        if(typeof data === "undefined" || (typeof data.hits === "undefined" && typeof data.results === "undefined"))
        {
            // Empty prototype
            data = { hits: [], results: [] };
        }

        callback(error, data);
    }

    /*
     * ==============================
     * Callbacks
     * ==============================
     */
    protected onSearchComplete (error, data){
    }

}
