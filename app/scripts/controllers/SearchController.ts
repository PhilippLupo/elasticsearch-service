import { Controller } from '../lib/Controller';
import { ElasticSearchService } from '../services/ElasticSearchService';
import { template } from '../lib/Template';

export class SearchController extends Controller {

  static selector: string = '.search';
  static requestURL: string = "https://1hy5arpx48.execute-api.us-east-1.amazonaws.com/prod/moebelat/_search";

  private _searchInput: HTMLElement = <HTMLElement>this.$().querySelector('.search-input');
  private _searchResult: HTMLElement = <HTMLElement>this.$().querySelector('.search-count');

  private _elasticSearchService = <ElasticSearchService>ElasticSearchService.inject();


  constructor(element: HTMLElement) {
    super(element);

    this._elasticSearchService.searchUrl = SearchController.requestURL;
    
    this._searchInput.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode == 13) {
        let searchVal = (<HTMLInputElement>this._searchInput).value;
        this._elasticSearchService.search(searchVal).then(
          (searchresult: Elasticsearch.SearchResponse<any>) => {
            
            this._searchResult.innerHTML = template(this._searchResult.innerHTML, { count: searchresult.hits.total });
            for (let index = 0; index < searchresult.hits.hits.length; index++) {
              let hit = searchresult.hits.hits[index];
              for (let key in hit.highlight) {
                console.log(key, hit.highlight[key]);
              }  
            }
            
          }).catch((error: Error) => {
            console.log("An error occured during the elastic search service: " + error.message);
          });
      }
    });
  }

}
