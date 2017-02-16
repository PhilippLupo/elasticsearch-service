import { Promise } from 'es6-promise';
import { Service } from '../lib/Service';
import { RequestService, IRequestOptions } from '../services/RequestService';


export class ElasticSearchService extends Service {

  private _requestService = <RequestService>RequestService.inject();
  private _searchURL: string = "";

  public set searchUrl(searchUrl: string) {
    this._searchURL = searchUrl;
  }



  public search(searchTerm: string, customConfig?): Promise<Object | Array<any>> {
    let config = null;
    if (customConfig) {
      return this._requestService.fetchJSON(this._searchURL, customConfig);
    } else {
      const defaultConfig = this.getDefaultConfig(searchTerm);
      return this._requestService.fetchJSON(this._searchURL, defaultConfig);
    }
  }

  private getDefaultConfig(searchTerm: string):IRequestOptions {
    return {
      method: 'POST',
      body: {
        "query": {
          "match": {
            "url": searchTerm
          }
        },
        "highlight": {
          "pre_tags": ["<strong>"],
          "post_tags": ["</strong>"],
          "fields": {
            "*": {}
          },
          "require_field_match": false
        }
      }
    }
  }
}
