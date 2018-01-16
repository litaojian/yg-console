import { Injectable,Injector } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseDataService }  from 'bizapp/base/base-data.service';

@Injectable()
export class TestRecService extends BaseDataService {

    constructor(injector: Injector) {
        super(injector);
				
		this.setApiUrl("/api/rest/testRec");
		this.setIdField("testRecId");
		this.setValuelistTypes(["docStatus","dataType"]);
	}

	update(updatedRow: Object): Promise<Object> {

		let result = super.update(updatedRow);
		//
		return result;
	}	





}