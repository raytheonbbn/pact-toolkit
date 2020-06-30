/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Experiment } from '../experiment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  experiments = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) { 
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'experiments.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.prepopulateDatabase();

      }).catch((error: Error) => {
        console.log('Error on open or create database: ', error);
        return Promise.reject(error.message || error);
      });  
      
    });
  }

  prepopulateDatabase(){
    this.http.get('assets/sample.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadExperiments();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getExperiments(): Observable<Experiment[]> {
    return this.experiments.asObservable();
  }

  loadExperiments(){
    return this.database.executeSql('SELECT * FROM experiments', []).then(data => {
      let experiments: Experiment[] = [];
  
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          var exp = JSON.parse(item.data);
          exp["id"] = item.id;
          experiments.push(exp);

          // experiments.push({
          //   key: item.id,
          //   title: item.title,
          //   experimentUUID: item.experimentUUID,
          //   timestamp: item.timestamp,
        
          //   //device properties as JSON 
          //   device: JSON.parse(item.device),
        
          //   //settings
          //   distance: item.distance,
          //   orientation1: item.orientation1,
          //   orientation2: item.orientation2,
          //   location: JSON.parse(item.location),
          //   note: item.note,
          //   completed: item.completed,
            
          //   //as json
          //   data: JSON.parse(item.data)
          // });
        }
      }
      this.experiments.next(experiments);
    });
  }
 
  addExperiment(experimentKey, experiment) {
    let data = [JSON.stringify(experiment)];
    return this.database.executeSql('INSERT INTO experiments (data) VALUES (?)', data).then(data => {
      this.loadExperiments();
      return data;
    });
  }
 
  getExperiment(id): Promise<Experiment> {
    return this.database.executeSql('SELECT * FROM experiments WHERE id = ?', [id]).then(data => { 
      if(data.rows.item(0) == null){
        console.log("Something went wrong", data.rows);
        return null;
      }else{
        let result = JSON.parse(data.rows.item(0).data);
        return result;
      }
    });
  }
 
  deleteExperiment(id) {
    return this.database.executeSql('DELETE FROM experiments WHERE id = ?', [id]).then(_ => {
      this.loadExperiments();
    });
  }

  updateExperiment(id, experiment){
    let data = [JSON.stringify(experiment)];
    return this.database.executeSql('UPDATE experiments SET data = ? WHERE id = ' + id, data).then((data) => {
      console.log("Updated db");
      this.loadExperiments();
    });
  }
}
