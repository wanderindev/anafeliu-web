<h1 align="center">Welcome to anafeliu-web 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/wanderindev/anafeliu-web#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/wanderindev/anafeliu-web/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/wanderindev/anafeliu-web/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://twitter.com/JavierFeliuA">
    <img alt="Twitter: JavierFeliuA" src="https://img.shields.io/twitter/follow/JavierFeliuA.svg?style=social" target="_blank" />
  </a>
</p>

> Website for anafeliu.com

### 🏠 [Homepage](https://github.com/wanderindev/anafeliu-web#readme)

## Install

```sh
git clone https://github.com/wanderindev/anafeliu-web.git .
cd anafeliu-web
npm install
```

## Usage
During develpment use:
```sh
gulp watch
```

For deployment:
```sh
gulp
docker build -t wanderindev/anafeliu-web .
docker push wanderindev/anafeliu-web
```
Then, from the root of do-kubernetes project:
```sh
kubectl delete deployment anafeliu-web
kubectl apply -f ./sites/anafeliu-web.yml
```
For more information on deploying to a Kubernetes cluster, visit 
my [do-kubernetes](https://github.com/wanderindev/do-kubernetes) repository.

## Author

👤 **Javier Feliu**

* Twitter: [@JavierFeliuA](https://twitter.com/JavierFeliuA)
* Github: [@wanderindev](https://github.com/wanderindev)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Javier Feliu](https://github.com/wanderindev) and [Ana Feliu](https://anafeliu.com).<br />

This project is [MIT](https://github.com/wanderindev/anafeliu-web/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
