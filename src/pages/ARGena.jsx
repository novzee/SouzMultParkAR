import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// import main helper:
import threeHelper from '../helpers/WebARRocksObject/helpers/WebARRocksObjectThreeHelper.js'

// import mediaStream API helper:
import mediaStreamAPIHelper from '../helpers/WebARRocksObject/helpers/WebARRocksMediaStreamAPIHelper.js'

// import neural network model for GENA detection:
import NN from '../assets/NN_GENA_0.json'

import { Link } from 'react-router-dom'

let _threeFiber = null

// Component for 3D model following the detected GENA object
const GenaFollower = ({ onDetect, onLose }) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()

  useEffect(() => {
    const threeObject3D = objRef.current
    
    if (!threeObject3D) {
      console.error('threeObject3D не найден')
      return
    }

    console.log('Начинаем загрузку GLB модели...')
    
    // Load the GENA 3D model
    const loader = new GLTFLoader()
    loader.load(
      '/genasc.glb',
      (gltf) => {
        console.log('GLB модель загружена успешно:', gltf)
        const model = gltf.scene
        
        // Проверяем, что модель не пустая
        if (model.children.length === 0) {
          console.warn('GLB модель пустая или не содержит геометрии')
        }
        
        model.scale.set(0.5, 0.5, 0.5) // Увеличил масштаб для лучшей видимости
        model.rotation.y = -Math.PI / 2 // Поворот на 90 градусов влево (по оси Y)
        model.position.set(0, 0, 0) // Убеждаемся что модель в центре
        
        // Добавляем модель к объекту
        if (threeObject3D.children[0]) {
          threeObject3D.children[0].add(model)
          console.log('Модель добавлена к сцене. Детей в контейнере:', threeObject3D.children[0].children.length)
        } else {
          console.error('Контейнер для модели не найден')
        }
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total * 100).toFixed(1)
          console.log(`Загрузка GLB: ${percent}%`)
        }
      },
      (error) => {
        console.error('Ошибка загрузки GLB модели:', error)
        console.error('Проверьте, что файл /genasc.glb существует в папке public/')
      }
    )

    // make the parent object as a GENA follower:
    threeHelper.set_objectFollower('GENA', threeObject3D)

    // set callbacks for detection and tracking:
    threeHelper.set_callback('GENA', 'ondetect', function(){
      if (onDetect){
        onDetect()
      }
      console.log('GENA detected!')
    })
    
    threeHelper.set_callback('GENA', 'onloose', function(){
      console.log('GENA tracking lost')
      if (onLose){
        onLose()
      }
    })
  }, [onDetect, onLose])

  const s = 1.0 // scale multiplier - нормальный размер
  
  return (
    <object3D ref={objRef}>
      <object3D scale={[s, s, s]} position={[0.0, 0.0, 0.0]} rotation={[0, 0, 0]}>
        {/* 3D модель GLB будет добавлена сюда через GLTFLoader */}
        
        {/* Временная отладочная геометрия - убрать после тестирования */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      </object3D>
    </object3D>
  )
}

// Component to grab Three.js context and handle rendering loop
const ThreeGrabber = (props) => {
  const threeFiber = useThree()
  _threeFiber = threeFiber
  
  useFrame(() => {
    // Update camera and poses in each frame
    threeHelper.update_threeCamera(props.sizing, threeFiber.camera)
    threeHelper.update_poses(threeFiber.camera)
  })
  
  return null
}

const compute_sizing = () => {
  // compute size of the canvas:
  const height = window.innerHeight
  const width = window.innerWidth
  
  // compute position of the canvas:
  const top = 0
  const left = 0
  return {width, height, top, left}
}

const ARGena = () => {
  // init state:
  const [sizing, setSizing] = useState(compute_sizing())
  const [isFirstDetection, setIsFirstDetection] = useState(true)
  const [isInitialized] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)

  // refs: 
  const canvasComputeRef = useRef()
  const cameraVideoRef = useRef()

  const _settings = {
    nDetectsPerLoop: 0, // 0 -> adaptive

    loadNNOptions: {
      notHereFactor: 0.0,
      paramsPerLabel: {
        GENA: {
          thresholdDetect: 0.85 // Detection threshold for GENA object
        }
      }
    },

    detectOptions: {
      isKeepTracking: true,
      isSkipConfirmation: false,
      thresholdDetectFactor: 1,
      cutShader: 'median',
      thresholdDetectFactorUnstitch: 0.2,
      trackingFactors: [0.5, 0.4, 1.5]
    },

    cameraFov: 0, // auto evaluation

    scanSettings: {
      nScaleLevels: 2,
      scale0Factor: 0.8,
      overlapFactors: [2, 2, 2], // between 0 (max overlap) and 1 (no overlap). Along X,Y,S
      scanCenterFirst: true
    },

    followZRot: true
  }
  
  let _timerResize = null

  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }

  const do_resize = () => {
    _timerResize = null
    const newSizing = compute_sizing()
    setSizing(newSizing)
  }

  useEffect(() => {
    if (!_timerResize && _threeFiber && _threeFiber.gl){
      _threeFiber.gl.setSize(sizing.width, sizing.height, true)
    }
  }, [sizing, _timerResize])

  useEffect(() => {
    // Store refs in variables to avoid issues in cleanup
    const videoElement = cameraVideoRef.current
    const canvasElement = canvasComputeRef.current

    // when videofeed is got, init WebAR.rocks.object through the threeHelper:
    const onCameraVideoFeedGot = () => {
      // Ensure canvas is properly initialized
      if (!canvasElement) {
        console.error('Canvas element not found!')
        return
      }

      // Set canvas dimensions
      canvasElement.width = 512
      canvasElement.height = 512

      try {
        // Validate that NN data is loaded correctly
        if (!NN || Object.keys(NN).length === 0) {
          console.error('Neural Network model not loaded correctly')
          return
        }

        console.log('Initializing WebAR.rocks.object with GENA detection...')
        
        threeHelper.init({
          video: videoElement,
          ARCanvas: canvasElement,
          NN,
          sizing,
          callbackReady: () => {
            console.log('WebAR.rocks.object is ready for GENA detection!')
            // handle resizing / orientation change:
            window.addEventListener('resize', handle_resize)
            window.addEventListener('orientationchange', handle_resize)
          },
          callbackTrack: (detectState) => {
            // Handle tracking state updates
            if (detectState && detectState.detected) {
              console.log('GENA tracking active:', detectState)
            }
          },
          loadNNOptions: _settings.loadNNOptions,
          nDetectsPerLoop: _settings.nDetectsPerLoop,
          detectOptions: _settings.detectOptions,
          cameraFov: _settings.cameraFov,
          followZRot: _settings.followZRot,
          scanSettings: _settings.scanSettings,
          stabilizerOptions: {n: 3}
        })
      } catch (error) {
        console.error('Error initializing WebAR.rocks.object:', error)
        console.error('Error details:', error.message, error.stack)
      }
    }

    // get videoFeed:
    if (videoElement) {
      mediaStreamAPIHelper.get(videoElement, onCameraVideoFeedGot, (err) => {
        console.error('Cannot get video feed', err)
      }, {
        video: { 
          facingMode: {ideal: 'environment'}
        },
        audio: false
      })
    }

    return () => {
      // Cleanup function
      try {
        window.removeEventListener('resize', handle_resize)
        window.removeEventListener('orientationchange', handle_resize)
        
        // Clean up video stream
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject
          const tracks = stream.getTracks()
          tracks.forEach(track => track.stop())
        }
        
        // Destroy WebAR.rocks instance
        if (threeHelper && threeHelper.destroy) {
          threeHelper.destroy()
        }
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized])

  const handleDetection = () => {
    setIsFirstDetection(false)
    setIsDetecting(true)
  }

  const handleLoseTracking = () => {
    setIsDetecting(false)
  }

  const commonStyle = {
    left: '50%',
    minHeight: '100vh',
    minWidth: '100vw',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)'      
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
      <Canvas 
        style={Object.assign({
          zIndex: 10,
          width: sizing.width,
          height: sizing.height
        }, commonStyle)}
        gl={{
          preserveDrawingBuffer: true // allow image capture
        }}
      >
        <ThreeGrabber sizing={sizing} />
        <GenaFollower 
          onDetect={handleDetection} 
          onLose={handleLoseTracking}
        />
        
        {/* Add some lighting for better 3D model visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
      </Canvas>

      {/* Video */}
      <video 
        style={cameraVideoStyle} 
        ref={cameraVideoRef}
        playsInline
        muted
      ></video>

      {/* Canvas managed by WebAR.rocks.object, used for WebGL computations */}
      <canvas 
        ref={canvasComputeRef} 
        style={{display: 'none'}} 
        width={512} 
        height={512} 
      />

      {/* Back button */}
      <Link to="/" style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 30,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '20px',
        textDecoration: 'none',
        fontSize: '14px'
      }}>
        ← Назад
      </Link>

      {/* Detection status overlay */}
      <div style={{
        position: 'fixed',
        textAlign: 'center',
        width: '100vw',
        zIndex: 20,
        top: '30vh',
        lineHeight: '2em',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
        opacity: (isFirstDetection) ? 1 : 0,
        transition: 'opacity 1s',
        color: 'white',
        fontSize: '18px'
      }}>
        Наведите камеру на объект GENA<br/>
        для начала AR-взаимодействия
      </div>

      {/* Detection indicator */}
      {isDetecting && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 30,
          background: 'rgba(0,255,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '15px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          GENA ОБНАРУЖЕНА
        </div>
      )}
    </div>
  )
} 

export default ARGena
