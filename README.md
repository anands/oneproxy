# OneProxy

OneProxy is a typical HTTP proxy + an interface to:

1. Inject data (JS, HTML or Raw Data)
2. Respond with data without making a request to the source server

#### Configuration:

**Sample meta config:**

```json
{
    "app": {
        "PROXY_HOST": "127.0.0.1",
        "PROXY_PORT": "80",
        "SERVER_PORT": 5050
    },
    "interceptors": []
}
```

- **app.PROXY_HOST** - The source server host
- **app.PROXY_PORT** - The source server port
- **app.SERVER_PORT** - Port on which oneproxy server runs
- **Interceptors** - Array of interceptor config

**Sample interceptor config:** (Which is used in the demo)

```json
[{
    "url": "/injectScript",
    "inject": true,
    "script": "alert('Script injected from config.json');"
}, {
    "url": "/injectScriptFromFile",
    "inject": true,
    "file": "./demo/files/injectJSFromFile.js"
}, {
    "url": "/injectRaw",
    "inject": true,
    "raw": true,
    "data": "<h1>This is injected from config.json</h1>"
}, {
    "url": "/injectRawFile",
    "inject": true,
    "raw": true,
    "file": "./demo/files/injectRawFile.html"
}, {
    "url": "/interceptRequest",
    "replace": true,
    "data": "Request has been intercepted, this is the response from config.json"
}, {
    "url": "/interceptRequestFromFile",
    "replace": true,
    "file": "./demo/files/interceptRequest.txt"
}]
```

- **URL** - Path of the request to be matched by oneproxy
- **Inject (or) Replace**
 	- **Inject** - Inject the data or file to the response sent from source server, by default oneproxy considers this to be a JavaScript, hence data or the file is wrapped into a script tag and then injected to the HTML from the source server. However, you can set `raw: true` to ignore the script tag and inject the data as is
 	- **Replace** - Respond to the request without calling the source server for the data, supports both `data` and `file` property



#### Let's get started using demo:

**Clone oneproxy:**

```bash
git clone https://github.com/codehate/oneproxy.git
cd oneproxy
npm install
```

**Run demo server:**

```bash
node demo/server.js
```
Server will be running at: [http://127.0.0.1:3000](http://127.0.0.1:3000)

**Start oneproxy:**

```bash
# Use demo's config.json
node app.js --config=demo/config.json
```

Demo server is a simple server which returns the requested path:

For: [http://127.0.0.1:3000](http://127.0.0.1:3000)

![](http://i.imgur.com/sDlo0sI.png)

For: [http://127.0.0.1:3000/path](http://127.0.0.1:3000/path)

![](http://i.imgur.com/AyAIWq5.png)

#### Oneproxy in action:


Typical HTTP proxy: [http://127.0.0.1:5050](http://127.0.0.1:5050), this will send request to source server and proxy the response back:

![](http://i.imgur.com/sDlo0sI.png)

**Inject script:** 

[http://127.0.0.1:5050/injectScript](http://127.0.0.1:5050/injectScript) 


![](http://i.imgur.com/iQl66FZ.png)

![](http://i.imgur.com/JcDXYKS.png)

**Inject script from file:**

[http://127.0.0.1:5050/injectScriptFromFile](http://127.0.0.1:5050/injectScriptFromFile)


![](http://i.imgur.com/kvRjfpL.png)

**Inject raw content:**

[http://127.0.0.1:5050/injectRaw](http://127.0.0.1:5050/injectRaw)

![](http://i.imgur.com/GrpBU6J.png)

**Inject raw content from file:**

[http://127.0.0.1:5050/injectRawFile](http://127.0.0.1:5050/injectRawFile)

![](http://i.imgur.com/OO3lIym.png)

**Intercept the request:** 

[http://127.0.0.1:5050/interceptRequest](http://127.0.0.1:5050/interceptRequest)

![](http://i.imgur.com/tuqzV2K.png)

**Intercept the request from file:**

[http://127.0.0.1:5050/interceptRequestFromFile](http://127.0.0.1:5050/interceptRequestFromFile)

![](http://i.imgur.com/U42BRVI.png)
