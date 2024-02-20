const {
    types,
    version,
    Device,
    detectDevice,
    parseScalabilityMode,
    debug,
} = require("mediasoup-client");
const { CreateActiveSpeakerObserverRequest } = require("mediasoup/node/lib/fbs/router");
const sio = require('socket.io-client');
let io = sio(window.location.protocol + "//" + document.domain + ":" + location.port, {
    autoConnect: true,
});

io.on('connection-success', ({ socketId }) => {
    console.log(socketId)
})

let device
let rtpCapabilities
let producerTransport
let consumerTransport
let producer
let consumer

// https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerOptions
// https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
let params = {
    // mediasoup params
    encodings: [
        {
            rid: 'r0',
            maxBitrate: 100000,
            scalabilityMode: 'S1T3',
        },
        {
            rid: 'r1',
            maxBitrate: 300000,
            scalabilityMode: 'S1T3',
        },
        {
            rid: 'r2',
            maxBitrate: 900000,
            scalabilityMode: 'S1T3',
        },
    ],
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
    codecOptions: {
        videoGoogleStartBitrate: 1000
    }
}

function getLocalStream() {
    navigator.getUserMedia({
        audio: false,
        video: {
            width: {
                min: 640,
                max: 1920,
            },
            height: {
                min: 400,
                max: 1080,
            }
        }
    }, (stream) => {
        document.getElementById("localVideo").srcObject = stream;
        const track = stream.getVideoTracks()[0]
        params = {
            track,
            ...params
        }
    }, error => {
        console.log(error.message)
    })
}

async function getRtpCapabilities() {
    // make a request to the server for Router RTP Capabilities
    // see server's socket.on('getRtpCapabilities', ...)
    // the server sends back data object which contains rtpCapabilities
    io.emit('getRtpCapabilities', (data) => {
        console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`)

        rtpCapabilities = data.rtpCapabilities
    })
}

async function createDevice() {
    try {
        device = new Device()

        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
        // Loads the device with RTP capabilities of the Router (server side)
        await device.load({
            // see getRtpCapabilities()
            routerRtpCapabilities: rtpCapabilities
        })

        console.warn(device.rtpCapabilities)
        console.warn(`DEVICE: ${device.handlerName}`)

    } catch (error) {
        console.log(error)
        if (error.name === 'UnsupportedError')
            console.warn('browser not supported')
    }
}

function changeLocalStream() { }

async function createSendTransport() {
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    io.emit('createWebRtcTransport', { sender: true }, ({ params }) => {
        // The server sends back params needed 
        // to create Send Transport on the client side
        if (params.error) {
            console.log(params.error)
            return
        }

        console.log(params)

        // creates a new WebRTC Transport to send media
        // based on the server's producer transport params
        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
        producerTransport = device.createSendTransport(params)

        // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
        // this event is raised when a first call to transport.produce() is made
        // see connectSendTransport() below
        producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                // Signal local DTLS parameters to the server side transport
                // see server's socket.on('transport-connect', ...)
                await io.emit('transport-connect', {
                    dtlsParameters,
                })

                // Tell the transport that parameters were transmitted.
                callback()

            } catch (error) {
                errback(error)
            }
        })

        producerTransport.on('produce', async (parameters, callback, errback) => {
            console.log(parameters)

            try {
                // tell the server to create a Producer
                // with the following parameters and produce
                // and expect back a server side producer id
                // see server's socket.on('transport-produce', ...)
                await io.emit('transport-produce', {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                }, ({ id }) => {
                    // Tell the transport that parameters were transmitted and provide it with the
                    // server side producer's id.
                    callback({ id })
                })
            } catch (error) {
                errback(error)
            }
        })
    })
}

async function connectSendTransport() {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    producer = await producerTransport.produce(params)

    producer.on('trackended', () => {
        console.log('track ended')

        // close video track
    })

    producer.on('transportclose', () => {
        console.log('transport ended')

        // close video track
    })
}

async function createRecvTransport() {
    await io.emit('createWebRtcTransport', { sender: false }, ({ params }) => {
        // The server sends back params needed 
        // to create Send Transport on the client side
        if (params.error) {
            console.log(params.error)
            return
        }

        console.log(params)

        // creates a new WebRTC Transport to receive media
        // based on server's consumer transport params
        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-createRecvTransport
        consumerTransport = device.createRecvTransport(params)

        // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
        // this event is raised when a first call to transport.produce() is made
        // see connectRecvTransport() below
        consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                // Signal local DTLS parameters to the server side transport
                // see server's socket.on('transport-recv-connect', ...)
                await io.emit('transport-recv-connect', {
                    dtlsParameters,
                })

                // Tell the transport that parameters were transmitted.
                callback()
            } catch (error) {
                // Tell the transport that something was wrong
                errback(error)
            }
        })
    })
}

async function connectRecvTransport() {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await io.emit('consume', {
        rtpCapabilities: device.rtpCapabilities,
    }, async ({ params }) => {
        if (params.error) {
            console.log('Cannot Consume')
            return
        }

        console.log(params)
        // then consume with the local consumer transport
        // which creates a consumer
        consumer = await consumerTransport.consume({
            id: params.id,
            producerId: params.producerId,
            kind: params.kind,
            rtpParameters: params.rtpParameters
        })

        // destructure and retrieve the video track from the producer
        const { track } = consumer

        document.getElementById('remoteVideo').srcObject = new MediaStream([track])
        console.log(track)

        // the server consumer started with media paused
        // so we need to inform the server to resume
        io.emit('consumer-resume')
    })
}

document.getElementById('btnLocalVideo').addEventListener('click', getLocalStream)
document.getElementById('btnRtpCapabilities').addEventListener('click', getRtpCapabilities)
document.getElementById('btnDevice').addEventListener('click', createDevice)
document.getElementById('btnCreateSendTransport').addEventListener('click', createSendTransport)
document.getElementById('btnConnectSendTransport').addEventListener('click', connectSendTransport)
document.getElementById('btnRecvSendTransport').addEventListener('click', createRecvTransport)
document.getElementById('btnConnectRecvTransport').addEventListener('click', connectRecvTransport)
