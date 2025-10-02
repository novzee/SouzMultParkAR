import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

// import main helper:
import threeHelper from '../contrib/WebARRocksObject/helpers/WebARRocksObjectThreeHelper.js'

// import mediaStream API helper:
import mediaStreamAPIHelper from '../contrib/WebARRocksObject/helpers/WebARRocksMediaStreamAPIHelper.js'

// Тест с простой рабочей моделью:
import NN from '../contrib/WebARRocksObject/neuralNets/NN_SPRITE_1.json'

import BackButton from '../components/BackButton'


let _threeFiber = null


// This mesh follows the object. put stuffs in it.
// Its position and orientation is controlled by the THREE.js helper
const ObjectFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()
  useEffect(() => {
    const threeObject3D = objRef.current
    threeHelper.set_objectFollower('SPRITECAN', threeObject3D)
  })

  const s = 1
  return (
    <object3D ref={objRef}>
      {/* Main object box */}
      <mesh position={[0, s/2, 0]}>
        <boxGeometry args={[s, s, s]} />
        <meshNormalMaterial />
      </mesh>
      
      {/* Debug wireframe */}
      <mesh>
        <boxGeometry args={[s+0.1, s+0.1, s+0.1]} />
        <meshBasicMaterial wireframe={true} color={0x00ff00} />
      </mesh>
    </object3D>
  )
}

// fake component, display nothing but get the Camera and the renderer
const ThreeGrabber = (props) => {
  const threeFiber = useThree()
  _threeFiber = threeFiber
  
  useFrame(() => {
    threeHelper.update_threeCamera(props.sizing, threeFiber.camera)
    threeHelper.update_poses(threeFiber.camera)
  })
  return null
}


const TestDetection = (props) => {
  const [sizing, setSizing] = useState(false)
  const [isInitialized, setInitialized] = useState(false)
  
  let _timerResize = null
  
  const _settings = {
    nDetectsPerLoop: 0, // 0 -> adaptative

    loadNNOptions: {
      notHereFactor: 0.0,
      paramsPerLabel: {
        SPRITECAN: {
          thresholdDetect: 0.5
        }
      }
    },

    detectOptions: {
      isKeepTracking: true,
      isSkipConfirmation: false,
      thresholdDetectFactor: 0.8,
      thresholdDetectFactorUnstitch: 0.2,
      trackingFactors: [0.2, 0.2, 0.2]
    },

    cameraFov: 55,
    followZRot: true,

    scanSettings: {
      margins: 0.1,
      nSweepXYsteps: 6,
      nSweepSsteps: 4,
      sweepScaleRange: [0.3, 0.7],
      sweepStepMinPx: 32,
      sweepShuffle: true,
      nDetectsPerSweep: 3
    },

    stabilizationSettings: {
      translationFactorRange: [0.2, 0.6],
      rotationFactorRange: [0.05, 0.3],
      qualityFactorRange: [0.90, 0.98],
      alphaRange: [0.05, 1.0]
    }
  }

  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }

  const do_resize = () => {
    const newSizing = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    _threeFiber.gl.setSize(newSizing.width, newSizing.height)
    setSizing(newSizing)
    _timerResize = null
  }

  const compute_sizing = () => {
    // compute  size of the canvas:
    const newSizing = {
      width: window.innerWidth,
      height: window.innerHeight,
      paddingX: 0,
      paddingY: 0
    }
    setSizing(newSizing)
  }

  useEffect(() => {
    compute_sizing()
    window.addEventListener('resize', handle_resize)
    window.addEventListener('orientationchange', handle_resize)

    return () => {
      window.removeEventListener('resize', handle_resize)
      window.removeEventListener('orientationchange', handle_resize)
    }
  }, [])

  // refs for video and canvas:
  const cameraVideoRef = useRef()
  const canvasComputeRef = useRef()

  useEffect(() => {
    if (sizing !== false && !isInitialized) {
      console.log('Testing with Sprite model...');
      
      const onCameraVideoFeedGot = () => {
        console.log('Camera feed obtained, initializing...');
        
        threeHelper.init({
          video: cameraVideoRef.current,
          ARCanvas: canvasComputeRef.current,
          NN,
          sizing,
          callbackReady: (err, spec) => {
            if (err) {
              console.error('Init error:', err);
              return;
            }
            console.log('WebARRocks ready, spec:', spec);
            setInitialized(true);
          },
          loadNNOptions: _settings.loadNNOptions,
          nDetectsPerLoop: _settings.nDetectsPerLoop,
          detectOptions: _settings.detectOptions,
          cameraFov: _settings.cameraFov,
          followZRot: _settings.followZRot,
          scanSettings: _settings.scanSettings,
          stabilizerOptions: {n: 3}
        })
      }

      // get videoFeed:
      mediaStreamAPIHelper.get(cameraVideoRef.current, onCameraVideoFeedGot, (err) => {
        console.log('Cannot get video feed ' + err)
      }, {
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 480, max: 1080 },
          facingMode: { ideal: 'environment' }
        },
        audio: false
      })
    }
  }, [sizing, isInitialized])

  const commonStyle = {
    position: 'fixed',
    top: 0,
    left: 0
  }

  const cameraVideoStyle = {
    zIndex: 1,
    top: 0,
    left: 0,
    position: 'fixed',
    objectFit: 'cover',
    width: '100vw',
    height: '100%'
  }

  return (
    <div>
      {/* Canvas managed by three fiber, for AR: */}
      {sizing && (
        <Canvas style={Object.assign({
          zIndex: 10,
          width: sizing.width,
          height: sizing.height
        }, commonStyle)}
        gl={{
          preserveDrawingBuffer: true
        }}
        >
          <ThreeGrabber sizing={sizing} />
          <ObjectFollower />
        </Canvas>
      )}

      {/* Video */}
      <video style={cameraVideoStyle} ref={cameraVideoRef}></video>

      {/* Canvas managed by WebAR.rocks.object, used for WebGL computations) */}
      <canvas ref={canvasComputeRef} style={{display: 'none'}} width={512} height={512} />

      <BackButton />
      
      {/* Debug info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'monospace',
        zIndex: 1000
      }}>
        <div>TEST: Sprite Detection</div>
        <div>Status: {isInitialized ? 'Ready' : 'Initializing...'}</div>
        <div>Try pointing at Sprite can</div>
      </div>
    </div>
  )
}

export default TestDetection