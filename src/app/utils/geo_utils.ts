/* 
 *  Copyright © 2020, Raytheon BBN Technologies. All rights reserved.
 *  See LICENSE.md in top level directory for additional information
 */

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx'

//Geocoder configuration
geoencoderOptions: NativeGeocoderOptions = {
  useLocale: true,
  maxResults: 5
};


//geocoder method to fetch address from coordinates passed as arguments
export function getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.address = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
generateAddress(addressObj) {
let obj = [];
let address = "";
for (let key in addressObj) {
  obj.push(addressObj[key]);
}
obj.reverse();
for (let val in obj) {
  if (obj[val].length)
    address += obj[val] + ', ';
}
return address.slice(0, -2);
}
