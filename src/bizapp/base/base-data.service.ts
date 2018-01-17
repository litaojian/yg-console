import { Injectable, Injector} from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { CookieService } from './cookies.service';
import { BaseService } from './base-all.service';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';



export class DataObject {

	constructor(){
		//super();
	}

	get [Symbol.species]() {
		debugger;
		return null;
		//return Map;
	}

	set [Symbol.species](val:any) {
		debugger;
		//return Map;
	}

}


@Injectable()
export class BaseDataService extends BaseService {

	//private headers = new Headers({ 'Content-Type': 'application/json' });
	protected apiUrl = '/api/rest/nosetting';  // URL to web API

	protected listViewUrl = '/main/nosetting/list';  // URL to web API
	protected formViewUrl = '/main/nosetting/get';  // URL to web API

	// protected listActionUrl = '/api/nosetting';  // URL to web API
	// protected saveActionUrl = '/api/nosetting/save';  // URL to web API
	// protected deleteActionUrl = '/api/nosetting/delete';  // URL to web API
	// protected updateActionUrl = '/api/nosetting/update';  // URL to web API
	protected idField: string = "id";

	protected valuelistTypes:string[] = [];

	protected static CachedDataMap:Map<string, any> = new Map();

	constructor(injector: Injector) {
		super(injector);
		this.isTest = !environment.production;
		//
	}

	setIdField(value: string) {
		this.idField = value.toLowerCase();
	}

	getIdField() {
		return this.idField;
	}

	setIsTest(value: boolean) {
		this.isTest = value;
	}

	getIsTest(){
		return this.isTest;
	}

	setValuelistTypes(typenames:string[]){
		this.valuelistTypes = typenames;
	}

	getValuelistTypes(){
		return this.valuelistTypes;
	}

	getContextPath(url: string) {
		let pos = url.lastIndexOf(this.getListViewUrl());
		if (pos > 0){
			return url.substring(0, pos);
		}
		return "";

	}

	getApiUrl(){
		return this.apiUrl;
	}

	setApiUrl(url: string) {
		this.apiUrl = this.formatUrl(url);
		// 去掉前缀 'api/'
		//this.listViewUrl = url.replace("/api/", "")
		//this.formViewUrl = this.listViewUrl;
		// if (!this.isTest) {
		// 	this.apiUrl = url.replace("/api/", "remote/api/");
		// 	let api_context_path = environment.api_context_path;
		// 	if (api_context_path != null &&  api_context_path != "/"){
		// 		this.apiUrl = url.replace("/api/",  api_context_path + "/api/");
		// 	}
		// }
	}

	setPageViewUrl(url: string, view:string){
		if ("list" == view){
			this.setListViewUrl(url);
			if (url.endsWith("/list")){
				this.setFormViewUrl(url.replace("/list", ""));
			}else{
				this.setFormViewUrl(url.replace("/index", ""));
			}
		}else if ("form" == view){
			this.setFormViewUrl(url);
			let pos = url.lastIndexOf("/edit");
			if (pos > 0){
				this.setListViewUrl(url.substring(0, pos));
				return;
			}
			pos = url.lastIndexOf("/view");
			if (pos > 0){
				this.setListViewUrl(url.substring(0, pos));
				return;
			}else{
				pos = url.lastIndexOf("/");
				if (pos > 0){
					this.setListViewUrl(url.substring(0, pos));
				}
			}
		}

		//
		CookieService.save("last_menu_url", this.base64Encode(url));
		//

	}
	setListViewUrl(url: string) {
		this.listViewUrl = url;
	}

	getListViewUrl() {
		return this.listViewUrl;
	}

	setFormViewUrl(url: string) {
		this.formViewUrl = url;
	}

	getFormViewUrl() {
		return this.formViewUrl;
	}

	getAccessToken():string{
		let accessToken = CookieService.load(this.clientId + "-userToken");
		return "Bearer " + accessToken;
	}

	create(newRow: Object): Promise<Object> {
		//debugger;
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken() });
		const url = `${this.apiUrl}`;
		let options = new RequestOptions({ 'headers': headers });
		return this.http.post(url, newRow, options).toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	update(updatedRow: Object): Promise<Object> {
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken() });
		let rowId = this.getValue(updatedRow, this.idField);
		const url = `${this.apiUrl}/${rowId}`;
		//debugger;
		return this.http
			.put(url, JSON.stringify(updatedRow), { "headers": headers })
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	delete(id: number): Promise<Object> {
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		const url = `${this.apiUrl}/${id}`;
		return this.http.delete(url, { "headers": headers })
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	getDetail(id: number | string): Promise<Object> {
		//debugger;
		if (id >= 0) {
			let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
			let options = new RequestOptions({ "headers": headers });
			let url = `${this.apiUrl}/${id}`;
			// if (this.getIdField() != "id"){
			// 	url = `${this.apiUrl}?${this.getIdField().toLowerCase()}=${id}`;
			// }
			return this.http.get(url, options)
				.toPromise()
				.then(response => {
					let result = response.json();
					//debugger;
					if (result["rows"] != null && result["rows"]  instanceof Array){
			           result["rows"] = result["rows"][0];
		            }
					return result;
				})
				.catch(error => this.handleError(url,error));
		} else {
			return Promise.resolve(new Object());
		}
		//
	}

	executeCmd(command:string, params:Object): Promise<Object> {
		const headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken() });
		const url = `${this.apiUrl}/${command}`;
		//debugger;
		return this.http
			.post(url, JSON.stringify(params), { "headers": headers })
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}


	getList(action: string, params: any, pageIndex: number, pageSize: number, customUrl?:string): Promise<Object> {
		//debugger;
		let url = this.apiUrl;
		if (customUrl != null){
			url = this.formatUrl(customUrl);
		}

		if (params != null && params['ajaxUrl'] != null){
			url = params['ajaxUrl'];
		}
		if (params == null){
			params = {};
		}

		let keys = this.getKeys(params);
    	for (let i = 0; i < keys.length; i++) {
			if (params[keys[i]] == null){
				params.delete(keys[i]);
			}
		}

		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({
			headers: headers,
	  		search: this.bulidSearchString(action, params)
		});

		if (url.startsWith("http://") || url.endsWith(".json")){
			return this.getJSON(url);
		}

		if (customUrl == null){
			if (!url.endsWith(".json")){
				url = `${url}/query`;
			}
		}

		params["pageIndex"] = pageIndex;
		params["pageSize"]  = pageSize;
		if (action == "query"){
			params["command"]  = "search";
		}
		// debugger;
		//调用后台数据接口的时候使用的发送请求的方式
		return this.http.post(url, params, options)
			.toPromise()
			.then(response => response.json() as Object)
			.catch(error => this.handleError(url,error));
	}

	callServiceAPI(apiUrl: string, params: any): Promise<Object> {
		let tmp = params;
		if (params instanceof Array){
			tmp = {'data':params};
		}
		return this.ajaxPost(apiUrl, tmp).then(jsonData => {
            return jsonData;
        }).catch(error => {
			console.log("callServiceAPI " + apiUrl + ", error:" + JSON.stringify(error));
            return error;
        });
	}


	getValueListV1(typeName: string): Promise<Object[]> {
		//debugger;
		let data = BaseDataService.CachedDataMap.get(typeName);
		if (data && data instanceof Array && data.length > 0 ){
			// get data from data cache
			//console.log(typeName + " data found in cached, " + data.length);
			return Promise.resolve(data);
		}

		let url = `/api/data/valuelist/${typeName}`;
		if (typeName.startsWith("/assets")){
			url = typeName;
		}
		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({ "headers": headers });
		let customUrl:string;
		let tableColumns:string;

		if (typeName.startsWith("/api")){
			let splitPos = typeName.indexOf("?");
			customUrl = typeName.substring(0, splitPos);
			if (splitPos  > 0){
				tableColumns = typeName.substring(splitPos);
				tableColumns = tableColumns.replace("?cols=","");
				//console.log("getValueList: tableColumns=" + tableColumns);
			}else {
				customUrl = typeName;
			}
			url = customUrl;
		}

		// invoke http request
		return this.ajaxGet(url, options)
			.then(result => {
				//debugger;
				if (tableColumns != null && result != null){
					let columns = tableColumns.split(",");
					let data = result["data"];
					for(let i = 0;i < data.length;i++){
						data[i]["keyname"] = data[i][columns[0]];
						data[i]["valuetext"] = data[i][columns[1]];
					}
				}
				// cache the valuelist
				BaseDataService.CachedDataMap.set(typeName, result);
				return result;
			})
			.catch(this.handleErrorForPromise);

	}

	getValueList(typeName: string): Observable<Object[]> {

		//return Observable.of([{"label":"123", "value":"123"}, {"label":"456", "value":"456"}]);

		// debugger;
		let data = BaseDataService.CachedDataMap.get(typeName);
		if (data && data instanceof Array && data.length > 0 ){
			// get data from data cache
			//console.log(typeName + " data found in cached, " + data.length);
			return Observable.of(data);
		}

		let url = `/api/data/valuelist/${typeName}`;
		if (typeName.startsWith("/assets")){
			url = typeName;
		}
		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({ "headers": headers });
		let customUrl:string;
		let tableColumns:string;

		if (typeName.startsWith("/api")){
			let splitPos = typeName.indexOf("?");
			customUrl = typeName.substring(0, splitPos);
			if (splitPos  > 0){
				tableColumns = typeName.substring(splitPos);
				tableColumns = tableColumns.replace("?cols=","");
				//console.log("getValueList: tableColumns=" + tableColumns);
			}else {
				customUrl = typeName;
			}
			url = customUrl;
		}

		// invoke http request
		return this.ajaxGet2(url, options)
			.map(respObject => {
				// debugger;
				let result = JSON.parse(respObject["_body"]);
				if (tableColumns != null && result != null){
					let columns = tableColumns.split(",");
					let data = result["data"];
					for(let i = 0;i < data.length;i++){
						data[i]["keyname"] = data[i][columns[0]];
						data[i]["valuetext"] = data[i][columns[1]];
						data[i]["value"] = data[i][columns[0]];
						data[i]["label"] = data[i][columns[1]];
					}
				}

				let rows:Object[];

				if (result["data"] != null){
					rows = result["data"]["options"];
					if (rows == null){
						rows = result["data"];
					}
				}else{
					rows = result;
				}
				let options: Object[] = [];
				if (rows != null) {
					for (var item in rows) { // for acts as a foreach
						//console.log(rows[item]["keyname"]);
						if (rows[item]["keyname"]){
							options.push({ value: rows[item]["keyname"], label: rows[item]["valuetext"] });
						}else if (item["keyname"]){
							options.push({ value: item["keyname"], label: item["valuetext"] });
						}else if (Number.parseInt(item) >= 0 ){
							options.push({ value: rows[item]["optvalue"], label: rows[item]["optlabel"] });
						}
					}

				}
				// cache the valuelist
				BaseDataService.CachedDataMap.set(typeName, options);
				return options;
			})
			.catch(this.handleError);

	}


	getTreeData(dataUrl: string): Promise<Object[]> {
		//debugger;
		let url = `${dataUrl}`;
		let headers = new Headers({ 'Content-Type': 'application/json','Authorization': this.getAccessToken()});
		let options = new RequestOptions({ "headers": headers });
		let customUrl:string;
		let tableColumns:string;


		if (dataUrl.startsWith("/api")){
			let splitPos = dataUrl.indexOf("?");
			customUrl = dataUrl.substring(0, splitPos);
			if (splitPos  > 0){
				tableColumns = dataUrl.substring(splitPos);
				tableColumns = tableColumns.replace("?cols=","");
				//console.log("getValueList: tableColumns=" + tableColumns);
			}
			url = customUrl;
		}

		// invoke http request
		return this.ajaxGet(url, options)
			.then(result => {
				//debugger;
				if (tableColumns != null && result != null){
					let columns = tableColumns.split(",");
					let idColumn = columns[0];
					let parentColumn = columns[1];
					let textColumn = columns[2];
					result = this.buildTree(result, idColumn, parentColumn, textColumn);
				}
				if (result["rows"] != null && result["children"] == null && result["resultCode"] == 0){
					result = result["rows"];
				}
				//debugger;
				return result;
			})
			.catch(this.handleErrorForPromise);

	}

	//构造树的方法
    buildTree(input: Object, idColumn:string, parentColumn:string, textColumn:string): any {
        //console.error('An error occurred', error);
        let inputData = input["data"];

		let treeData: Object[] = [];
        let tmpNodes: Object[] = [];
        for (let i = 0; i < inputData.length; i++) {
            // debugger;
            let tmpNode = new Object();
            tmpNode["html"] = "<a href='javascript:void(0);'>" + inputData[i][textColumn] + "</a>";
			tmpNode["title"] = inputData[i][textColumn];
            tmpNode["nid"] = inputData[i][idColumn];
            tmpNode["parentId"] = inputData[i][parentColumn];
            tmpNode["open"] = true;
            let pnode = this.findParent(tmpNodes, inputData[i][parentColumn]);
            if (pnode != null) {
                if (pnode["children"] ==null){
                    pnode["children"] = [];
                }
                pnode["children"].push(tmpNode);
            }else{
                tmpNodes.push(tmpNode);
            }
        }
        treeData = tmpNodes;
        return treeData;
        //return JSON.stringify(treeData);
    }

    findParent(nodes: any, nid: number): any {
        if (nid > 0) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i]["nid"] == nid) {
                    return nodes[i];
                }
				if (nodes[i]["children"] != null){
					let pnode = this.findParent(nodes[i]["children"], nid);
					if (pnode != null){
						return pnode;
					}
				}
            }
        } else {
            return null;
        }
    }



	loadValueListData():Object {
		let typenames:string[] = this.getValuelistTypes();
		let valuelist = {};
		//console.log("loadValueListData "+ this.service.getValuelistTypes().toString() +" ..........");
		if (typenames != null){
			typenames.forEach(_typename =>{
			  this.getValueList(_typename).subscribe(data =>{
			  let label , value;
			  for(let item in data){
				if (valuelist[_typename] == null){
				  	valuelist[_typename] = [];
				}
				//console.log("item:" + JSON.stringify(data[item]));
				if (data[item]["typename"] && data[item]["keyname"]){
				  //typename = data[item]["typename"].toLowerCase();
				  value = data[item]["keyname"];
				  label = data[item]["valuetext"];
				  valuelist[_typename].push({"label":label, "value":value});
				}else{
				  valuelist[_typename].push(data[item]);
				}
			  }
			});
		  });
		}
		return valuelist;
	}
}
