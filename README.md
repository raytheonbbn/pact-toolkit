<h2 align="center">
	<img
		width="200"
		alt="PACT Toolkit"
		src="./resources/icon.png"/>
        <h1 align="center">PACT Toolkit</h1>
</h2>
<h3 align="center">
    A mobile application for Bluetooth experimentation to support automated contact tracing efforts
</h3>
<p align="center">
    <i>Built in direct support of the <a href="https://pact.mit.edu/">PACT (Private Automatic Contact Tracing)</a> effort</i>
</p>

## Features
- **Pairwise Experiment**: Installing this application on two devices will allow you to collect RSSI data from two advertising devices 
- **Data Export**: Export data from this application and share the data via email or other platforms

## Development
1. You should have Node and NPM installed (detailed in step 2)
2. Install the [Ionic CLI](https://ionicframework.com/docs/intro/cli)
3. Clone this repository
4. Run `npm install` in the project directory (`/pact/pact-toolkit-ionic`)
5. Run `ionic serve` from the same directory to test

You can run the code right in your browser, but a physical device is required for Bluetooth functionality.

> **Note:** Some configuration of your Java environment is required, and this command may not work out of the box. 

To build for Android:
```
ionic cordova build android
```

To run directly on a connected device:
```
Ionic cordova run android
```

## Contributing
Coming soon

---
###### 