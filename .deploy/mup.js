module.exports = {
  servers: {
    one: {
      host: "45.55.230.236",
      username: "root",
      pem: '/Users/jeremiahlucio/.ssh/id_rsa',
      // opts: {
      //   port: 22,
      // },
    },
  },

  meteor: {
    name: 'simple-ledger',
    path: "../",
    servers: {
      one: {},
    },
    // lets you add docker volumes (optional)
    volumes: {
      // passed as '-v /host/path:/container/path' to the docker run command
      // '/host/path': '/container/path',
      // '/second/host/path': '/second/container/path'
    },
    docker: {
      // Change the image to 'kadirahq/meteord' if you
      // are using Meteor 1.3 or older
      // image: 'abernix/meteord:base' , // (optional)
      // image: 'kadirahq/meteord' , // (optional)
      imagePort: 80, // (optional, default: 80)

      // lets you add/overwrite any parameter on
      // the docker run command (optional)
      args: [
        // '--link=myCustomMongoDB:myCustomMongoDB', // linking example
        // '--memory-reservation 200M' // memory reservation example
      ],
      // (optional) Only used if using your own ssl certificates.
      // Default is "meteorhacks/mup-frontend-server"
      // imageFrontendServer: 'meteorhacks/mup-frontend-server',
      // lets you bind the docker container to a
      // specific network interface (optional)
      bind: '127.0.0.1',
      // lets you add network connections to perform after run
      // (runs docker network connect <net name> for each network listed here)
      networks: [
        // 'net1',
      ],
    },
    enableUploadProgressBar: true,

    env: {
      ROOT_URL: "http://45.55.230.236",
      // PORT: 80,
      MONGO_URL: "mongodb://127.0.0.1:27017/simpledger",
      METEOR_ENV: "development",
    },

    deployCheckWaitTime: 60,

    buildOptions: {
      debug: true,
      serverOnly: true,

      // executable: "meteor"
    },
  },

  // setupMongo: true,
  // setupNode: true,
  // setupPhantom: true,

  // appName: "simpledger",
  // app: "/Users/jeremiahlucio/Programming/miahal7/simple-ledger",


  mongo: { // (optional but remove it if you want to use a remote mongodb!)
    port: 27017,
    version: '3.4.1', // (optional), default is 3.4.1
    servers: {
      one: {},
    },
  },
};
