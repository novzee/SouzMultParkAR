import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// import main helper:
import threeHelper from '../helpers/WebARRocksObject/helpers/WebARRocksObjectThreeHelper.js'

// import mediaStream API helper:
import mediaStreamAPIHelper from '../helpers/WebARRocksObject/helpers/WebARRocksMediaStreamAPIHelper.js'

// import neural network model for POGOD detection:
import NN from '../assets/NN_POGOD_5.json'

import { Link } from 'react-router-dom'

import BackButton from '../components/BackButton'
import DetectionStatus from '../components/DetectionStatus'
import DetectionIndicator from '../components/DetectionIndicator'

let _threeFiber = null

// Component for 3D model following the detected POGOD object
const PogodFollower = ({ onDetect, onLose }) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()

  useEffect(() => {
    const threeObject3D = objRef.current

    // Load the POGOD 3D model
    const loader = new GLTFLoader()
    loader.load('/rat.glb', (gltf) => {
      const model = gltf.scene
      model.scale.set(0.2, 0.2, 0.2) // Уменьшил масштаб 3D модели с 0.5 до 0.2
      model.rotation.y = -Math.PI / 2 // Поворот на 90 градусов влево (по оси Y)
      threeObject3D.children[0].add(model)
    })

    // make the parent object as a POGOD follower:
    threeHelper.set_objectFollower('POGOD', threeObject3D)

    // set callbacks for detection and tracking:
    threeHelper.set_callback('POGOD', 'ondetect', function(){
      if (onDetect){
        onDetect()
      }
      console.log('POGOD detected!')
    })
    
    threeHelper.set_callback('POGOD', 'onloose', function(){
      console.log('POGOD tracking lost')
      if (onLose){
        onLose()
      }
    })
  }, [onDetect, onLose])

  const s = 0.8 // scale multiplier - уменьшил размер модели
  
  return (
    <object3D ref={objRef}>
      <object3D scale={[s, s, s]} position={[0.0, 0.0, 0.0]} rotation={[0, -Math.PI/2, 0]}>
        {/* 3D модель GLB будет добавлена сюда через GLTFLoader */}
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

const ARPogod = () => {
  // init state:
  const [sizing, setSizing] = useState(compute_sizing())
  const [isFirstDetection, setIsFirstDetection] = useState(true)
  const [isInitialized] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // refs: 
  const canvasComputeRef = useRef()
  const cameraVideoRef = useRef()

  const _settings = {
    nDetectsPerLoop: 0, // 0 -> adaptive

    loadNNOptions: {
      notHereFactor: 0.0,
      paramsPerLabel: {
        POGOD: {
          thresholdDetect: 0.85 // Detection threshold for POGOD object
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

        console.log('Initializing WebAR.rocks.object with POGOD detection...')
        
        threeHelper.init({
          video: videoElement,
          ARCanvas: canvasElement,
          NN,
          sizing,
          callbackReady: () => {
            console.log('WebAR.rocks.object is ready for POGOD detection!')
            // handle resizing / orientation change:
            window.addEventListener('resize', handle_resize)
            window.addEventListener('orientationchange', handle_resize)
          },
          callbackTrack: (detectState) => {
            // Handle tracking state updates
            if (detectState && detectState.detected) {
              console.log('POGOD tracking active:', detectState)
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

  // Функция для захвата фото
  const handleTakePhoto = () => {
    if (!_threeFiber || !_threeFiber.gl || !cameraVideoRef.current) return

    const video = cameraVideoRef.current
    const threeCanvas = _threeFiber.gl.domElement

    // Создаем временный canvas с размерами видимой области
    const tempCanvas = document.createElement('canvas')
    const displayWidth = threeCanvas.clientWidth
    const displayHeight = threeCanvas.clientHeight
    tempCanvas.width = displayWidth
    tempCanvas.height = displayHeight

    const ctx = tempCanvas.getContext('2d')

    // Рассчитываем 'object-fit: cover' для видео
    const videoAspectRatio = video.videoWidth / video.videoHeight
    const canvasAspectRatio = displayWidth / displayHeight
    let renderWidth, renderHeight, x, y

    if (videoAspectRatio > canvasAspectRatio) {
      renderHeight = displayHeight
      renderWidth = displayHeight * videoAspectRatio
      x = (displayWidth - renderWidth) / 2
      y = 0
    } else {
      renderWidth = displayWidth
      renderHeight = displayWidth / videoAspectRatio
      x = 0
      y = (displayHeight - renderHeight) / 2
    }

    // 1. Рисуем видео фон с сохранением пропорций
    ctx.drawImage(video, x, y, renderWidth, renderHeight)

    // 2. Рисуем 3D сцену поверх
    ctx.drawImage(threeCanvas, 0, 0, displayWidth, displayHeight)

    // Получаем результат
    const dataURL = tempCanvas.toDataURL('image/png')
    setCapturedImage(dataURL)
  }

  // Функция для сохранения фото
  const handleSavePhoto = () => {
    if (!capturedImage) return

    // Создаем имя файла с датой
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(-2)
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    
    const filename = `souzmultpark.ru-${day}.${month}.${year}-${hours}:${minutes}:${seconds}.png`

    // Создаем ссылку для скачивания
    const link = document.createElement('a')
    link.href = capturedImage
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Показываем уведомление об успехе
    setShowSaveSuccess(true)
    setTimeout(() => {
      setShowSaveSuccess(false)
      setCapturedImage(null)
    }, 2000)
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
        <PogodFollower 
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

      <BackButton />

      {/* Detection status overlay */}
      <DetectionStatus isVisible={isFirstDetection} characterName="Волка" />

      {/* Detection indicator */}
      {isDetecting && <DetectionIndicator characterName="ВОЛК" />}

      {/* Photo button */}
      {!capturedImage && (
        <button
          onClick={handleTakePhoto}
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid white',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(0.95)'
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '2px solid #333',
            background: 'transparent'
          }}></div>
        </button>
      )}

      {/* Photo preview modal - Step 1: Save or Cancel */}
      {capturedImage && !showSaveSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.95)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <img 
            src={capturedImage} 
            alt="Captured" 
            style={{
              maxWidth: '90%',
              maxHeight: '70vh',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          />
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleSavePhoto}
              style={{
                padding: '12px 30px',
                background: '#5ccf54',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              💾 Сохранить
            </button>
            <button
              onClick={() => setCapturedImage(null)}
              style={{
                padding: '12px 30px',
                background: '#ff6bcc',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✕ Отмена
            </button>
          </div>
        </div>
      )}

      {/* Success message / Step 2: Learn more */}
      {showSaveSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.95)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
           {/* Close button */}
           <button
            onClick={() => {
              setCapturedImage(null);
              setShowSaveSuccess(false);
            }}
            style={{
              position: 'absolute',
              top: '20px',
              // In the middle-top
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(40, 40, 40, 0.8)',
              border: '2px solid white',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: '1',
              width: '44px',
              height: '44px',
              borderRadius: '50%'
            }}
          >
            &times;
          </button>

          <img 
            src={capturedImage} 
            alt="Saved" 
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 180px)', // Adjust max height to leave space for button
              borderRadius: '10px',
              objectFit: 'contain'
            }}
          />

          {/* Learn More Button */}
          <Link
            to="/pogod-info"
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '5%',
              right: '5%',
              width: '90%',
              padding: '18px',
              background: '#726de3',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'center',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => { // Reset state when leaving the page
              setCapturedImage(null);
              setShowSaveSuccess(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#5a55b8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#726de3'}
          >
            Узнать больше о персонаже
          </Link>
        </div>
      )}
    </div>
  )
} 

export default ARPogod