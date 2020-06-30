/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

export interface Experiment {
    //experiment properties
    key: string;
    title: string;
    experimentUUID: string;
    timestamp: Date;

    //device properties as JSON 
    device: {
        version: string,
        model: string,
        manufacturer: string,
        id: string,
        serial: string
    },

    //settings
    distance: number,
    orientation1: number,
    orientation2: number,
    location: {
          latitude: number,
          longitude: number,
          accuracy: number,
          altitude: number,
          altitudeAccuracy: number,
          heading: number,
          speed: number,
          timestamp: number,
          address: string
    },
    note: string;
    completed: boolean;
    
    //as json
    data: any;
}
