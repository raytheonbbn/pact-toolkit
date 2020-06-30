/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Experiment } from './experiment';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {

  constructor(public storage: Storage) { }

  public async generateKey(): Promise<string>{
    let key = `exp${ parseInt(`${Math.random() * 100}`)}`;
    let ret = await this.storage.get(key);

    while(ret){
      key = `exp${ parseInt(`${Math.random() * 100}`)}`;
      ret = await this.storage.get(key);
    }
    return key;
  }

  public async read(): Promise<Experiment[]>{
    let exps: Array<Experiment> = [];

    await this.storage.forEach((v, key, i)=>{
      if(key.startsWith("exp")){
          exps.push(v);
      }
    });

    //use + to make Date format timestamp an operable number 
    exps.sort((a, b) => (+b.timestamp) - (+a.timestamp));

    return exps;
  }

  public async readFromId(key: string): Promise<Experiment>{
    return await this.storage.get(key);
  };

  public async create(key: string , exp: Experiment){
    console.log("Creating experiment: ", exp);
    return await this.storage.set(key, exp);
  }

  public async update(exp: Experiment){
    return await this.storage.set(exp.key, exp);
  }

  public async delete(key: string){
    return await this.storage.remove(key);
  }
}
