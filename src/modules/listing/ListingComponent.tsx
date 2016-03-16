
import AlgoliaSearch from "./src/modules/datasources/AlgoliaLoader";
import {BranchenbuchResult} from "../interfaces/AlgoliaInterfaces";
import PlaceEntry from "./PlaceEntry";

import PlaceCard from "./PlaceCard";
import IPlaceProps from "./PlaceCard";

// Defines the interface of the properties of the App component
interface IProps {
    key: number;
    product: number;
    category: string;
    link: string;
    geo: string;
}

// Defines the interface of the state of the App component
interface IState {
    entries?: Array<any>;
    active?:boolean;
}

class ListingComponent extends React.Component<IProps, IState> {
    constructor(props : IProps) {
        super(props);

        this.state = {
            entries: [],
            active: true
        };

    }

    componentWillMount(){

        var params = {

            hitsPerPage: 10,

            // Geo Search
            aroundLatLng: this.props.geo,

            // Only results of the same category
            facetFilters: ["all_branche_names:"+this.props.category],

            getRankingInfo: true
        };

        var search = AlgoliaSearch.singleSearch("", params, this.onSearchComplete);

    }

    onSearchComplete = (error, data) => {
        let hits = data.hits;
        console.log(hits);

        var entries:PlaceEntry[] = [];
        let i = -1;

        for(let key in hits)
        {
            if(hits.hasOwnProperty(key))
            {
                // Remove potential duplicate of current page
                if(hits[key].id != this.props.key && entries.length < 3){
                    entries[++i] = new PlaceEntry(hits[key]);
                }
            }
        }

        // Update state, will trigger a rerender
        this.setState({
            entries: entries
        });

    };

    public render(){
        if(this.state.active === false || this.state.entries.length === 0){
            return null;
        }

        if(this.props.product)

            var entries = this.state.entries.map(function (place:PlaceEntry) {
                return (
                    <PlaceCard
                        key={place.key}
                        name={place.name}
                        address={place.address}
                        plz_ort={place.plz_ort}
                        avgRating={place.avgRating}
                        distance={place.distance}
                        image={place.image}
                        link={place.link}
                        numRatings={place.numRatings}
                    />
                );
            }, this);

        return (
            <div>
                <h2 className="places-nearby-title">Ähnliches in der Nähe <span>Anzeige</span></h2>
                <div className="places-nearby">
                    {entries}
                </div>
                <p><a href={this.props.link} className="places-nearby__category">Alle Orte aus der Kategorie &quot;{this.props.category}&quot;</a></p>
            </div>
        );
    }
}

/**
 * Initialization
 */
export default function PlacesNearbyInit(){
    $(document).ready(() => {
        let placesElement = $(".places-nearby");

        if(placesElement.length){
            //new PlacesNearby(placesElement);

            let currentPageId = parseInt(placesElement.data("entry"));
            let currentPageProduct = parseInt(placesElement.data("product"));
            let categoryName = placesElement.data("category");
            let categoryUrl = placesElement.data("link");
            let geoLatLong = placesElement.data("geo");

            ReactDOM.render(
                <PlacesNearby
                    key={currentPageId}
                    product={currentPageProduct}
                    category={categoryName}
                    link={categoryUrl}
                    geo={geoLatLong}
                />,
                document.getElementById("places-nearby")
            );

        }
    });
}



