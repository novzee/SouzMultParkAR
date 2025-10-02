import React, { useState, useEffect, useRef } from 'react'import React, { useState, useEffect, useRef } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'



// import main helper:// import main helper:

import threeHelper from '../helpers/WebARRocksObject/helpers/WebARRocksObjectThreeHelper.js'import threeHelper from '../helpers/WebARRocksObject/helpers/WebARRocksObjectThreeHelper.js'



// import mediaStream API helper:// import mediaStream API helper:

import mediaStreamAPIHelper from '../helpers/WebARRocksObject/helpers/WebARRocksMediaStreamAPIHelper.js'import mediaStreamAPIHelper from '../helpers/WebARRocksObject/helpers/WebARRocksMediaStreamAPIHelper.js'



// import neural network model for SHAPOK detection:// import neural network model for SHAPKA detection:

import NN from '../assets/NN_SHAPOK_0.json'import NN from '../assets/NN_SHAPOK_0.json'



import { Link } from 'react-router-dom'import { Link } from 'react-router-dom'



let _threeFiber = nulllet _threeFiber = null



// Component for 3D model following the detected SHAPOK object// Component for 3D model following the detected SHAPKA object

const ShapokFollower = ({ onDetect, onLose }) => {const ShapkaFollower = ({ onDetect, onLose }) => {

  // This reference will give us direct access to the mesh  // This reference will give us direct access to the mesh

  const objRef = useRef()  const objRef = useRef()



  useEffect(() => {  useEffect(() => {

    const threeObject3D = objRef.current    const threeObject3D = objRef.current

    

    if (!threeObject3D) {    // Load the SHAPKA 3D model

      console.error('threeObject3D не найден')    const loader = new GLTFLoader()

      return    loader.load('/rat.glb', (gltf) => {

    }      const model = gltf.scene

      model.scale.set(0.2, 0.2, 0.2) // Уменьшил масштаб 3D модели с 0.5 до 0.2

    console.log('Начинаем загрузку GLB модели...')      model.rotation.y = -Math.PI / 2 // Поворот на 90 градусов влево (по оси Y)

          threeObject3D.children[0].add(model)

    // Load the SHAPOK 3D model    })

    const loader = new GLTFLoader()

    loader.load(    // make the parent object as a SHAPKA follower:

      '/rat.glb',    threeHelper.set_objectFollower('SHAPKA', threeObject3D)

      (gltf) => {

        console.log('GLB модель загружена успешно:', gltf)    // set callbacks for detection and tracking:

        const model = gltf.scene    threeHelper.set_callback('SHAPKA', 'ondetect', function(){

              if (onDetect){

        // Проверяем, что модель не пустая        onDetect()

        if (model.children.length === 0) {      }

          console.warn('GLB модель пустая или не содержит геометрии')      console.log('SHAPKA detected!')

        }    })

            

        model.scale.set(0.5, 0.5, 0.5) // Увеличил масштаб для лучшей видимости    threeHelper.set_callback('SHAPKA', 'onloose', function(){

        model.rotation.y = -Math.PI / 2 // Поворот на 90 градусов влево (по ��си Y)      console.log('SHAPKA tracking lost')

        model.position.set(0, 0, 0) // Убеждаемся что модель в центре      if (onLose){

                onLose()

        // Добавляем модель к объекту      }

        threeObject3D.add(model)    })

        console.log('Модель добавлена к сцене')  }, [onDetect, onLose])

      },

      (progress) => {  const s = 0.8 // scale multiplier - уменьшил размер модели

        console.log('Прогресс загрузки GLB:', (progress.loaded / progress.total * 100) + '%')  

      },  return (

      (error) => {    <object3D ref={objRef}>

        console.error('Ошибка при загрузке GLB модели:', error)      <object3D scale={[s, s, s]} position={[0.0, 0.0, 0.0]} rotation={[0, -Math.PI/2, 0]}>

      }        {/* 3D модель GLB будет добавлена сюда через GLTFLoader */}

    )      </object3D>

    </object3D>

    // Register the object for detection:  )

    threeHelper.addDetectedObject(threeObject3D, onDetect, onLose)}



    return () => {// Component to grab Three.js context and handle rendering loop

      // Очищаем при размонтированииconst ThreeGrabber = (props) => {

      if (threeObject3D && threeObject3D.parent) {  const threeFiber = useThree()

        threeObject3D.parent.remove(threeObject3D)  _threeFiber = threeFiber

      }  

    }  useFrame(() => {

  }, [onDetect, onLose])    // Update camera and poses in each frame

    threeHelper.update_threeCamera(props.sizing, threeFiber.camera)

  return (    threeHelper.update_poses(threeFiber.camera)

    <object3D ref={objRef} />  })

  )  

}  return null

}

// Component for the main canvas

const ARCanvas = ({ onDetect, onLose }) => {const compute_sizing = () => {

  useEffect(() => {  // compute size of the canvas:

    const { camera, gl, scene } = _threeFiber  const height = window.innerHeight

      const width = window.innerWidth

    // Initialize three.js helper  

    threeHelper.init({  // compute position of the canvas:

      threejsCanvasId: 'ARCanvas',  const top = 0

      callbackReady: (error, spec) => {  const left = 0

        if (error) {  return {width, height, top, left}

          console.error('Ошибка инициализации WebAR.rocks Object:', error)}

          return

        }const ARShapok = () => {

        console.log('WebAR.rocks Object инициализировано:', spec)  // init state:

        console.log('INFO in callbackReady: WebAR.rocks Object library готова')  const [sizing, setSizing] = useState(compute_sizing())

          const [isFirstDetection, setIsFirstDetection] = useState(true)

        // Start the detection loop  const [isInitialized] = useState(true)

        threeHelper.start()  const [isDetecting, setIsDetecting] = useState(false)

      },

      isDebugRender: false,  // refs: 

      NNPath: '../helpers/WebARRocksObject/neuralNets/',  const canvasComputeRef = useRef()

      objectLabels: ['shapok'],  const cameraVideoRef = useRef()

      NN: NN,

      followZRot: true,  const _settings = {

      nDetectsPerLoop: 1,    nDetectsPerLoop: 0, // 0 -> adaptive

      detectZoom: 1,

      callbackTrack: (detectStates) => {    loadNNOptions: {

        // Этот callback вызывается на каждом кадре с состоянием детекции      notHereFactor: 0.0,

        // detectStates - массив с информацией об обнаруженных объектах      paramsPerLabel: {

        detectStates.forEach((detectState, index) => {        SHAPKA: {

          if (detectState.detected > 0.5) {          thresholdDetect: 0.85 // Detection threshold for SHAPKA object

            if (onDetect) {        }

              onDetect(index, detectState)      }

            }    },

          } else {

            if (onLose) {    detectOptions: {

              onLose(index)      isKeepTracking: true,

            }      isSkipConfirmation: false,

          }      thresholdDetectFactor: 1,

        })      cutShader: 'median',

      }      thresholdDetectFactorUnstitch: 0.2,

    })      trackingFactors: [0.5, 0.4, 1.5]

    },

    return () => {

      // Очистка при размонтировании    cameraFov: 0, // auto evaluation

      if (threeHelper && threeHelper.destroy) {

        threeHelper.destroy()    scanSettings: {

      }      nScaleLevels: 2,

    }      scale0Factor: 0.8,

  }, [onDetect, onLose])      overlapFactors: [2, 2, 2], // between 0 (max overlap) and 1 (no overlap). Along X,Y,S

      scanCenterFirst: true

  return null    },

}

    followZRot: true

// Hook to store the Three.js fiber context  }

const useThreeStore = () => {  

  const threeContext = useThree()  let _timerResize = null

  

  useEffect(() => {  const handle_resize = () => {

    _threeFiber = threeContext    // do not resize too often:

  }, [threeContext])    if (_timerResize){

        clearTimeout(_timerResize)

  return null    }

}    _timerResize = setTimeout(do_resize, 200)

  }

// Main AR component

const ARShapok = () => {  const do_resize = () => {

  const canvasRef = useRef(null)    _timerResize = null

  const [isDetected, setIsDetected] = useState(false)    const newSizing = compute_sizing()

  const [isInitialized, setIsInitialized] = useState(false)    setSizing(newSizing)

  const [error, setError] = useState(null)  }



  // Handle object detection  useEffect(() => {

  const handleDetect = (index, detectState) => {    if (!_timerResize && _threeFiber && _threeFiber.gl){

    if (!isDetected) {      _threeFiber.gl.setSize(sizing.width, sizing.height, true)

      console.log(`Шапка обнаружена! Индекс: ${index}, уверенность: ${detectState.detected}`)    }

      setIsDetected(true)  }, [sizing, _timerResize])

    }

  }  useEffect(() => {

    // Store refs in variables to avoid issues in cleanup

  // Handle object loss    const videoElement = cameraVideoRef.current

  const handleLose = (index) => {    const canvasElement = canvasComputeRef.current

    if (isDetected) {

      console.log(`Шапка потеряна! Индекс: ${index}`)    // when videofeed is got, init WebAR.rocks.object through the threeHelper:

      setIsDetected(false)    const onCameraVideoFeedGot = () => {

    }      // Ensure canvas is properly initialized

  }      if (!canvasElement) {

        console.error('Canvas element not found!')

  // Initialize camera and mediaStream        return

  useEffect(() => {      }

    const initializeAR = async () => {

      try {      // Set canvas dimensions

        console.log('Инициализация AR...')      canvasElement.width = 512

              canvasElement.height = 512

        // Get mediaStream (camera)

        const mediaStream = await mediaStreamAPIHelper.get('video', {      try {

          video: {        // Validate that NN data is loaded correctly

            facingMode: { ideal: 'environment' }, // Используем заднюю камеру        if (!NN || Object.keys(NN).length === 0) {

            width: { ideal: 640 },          console.error('Neural Network model not loaded correctly')

            height: { ideal: 480 }          return

          }        }

        })

        console.log('Initializing WebAR.rocks.object with SHAPKA detection...')

        console.log('MediaStream получен:', mediaStream)        

        setIsInitialized(true)        threeHelper.init({

                  video: videoElement,

      } catch (err) {          ARCanvas: canvasElement,

        console.error('Ошибка инициализации AR:', err)          NN,

        setError(err.message)          sizing,

      }          callbackReady: () => {

    }            console.log('WebAR.rocks.object is ready for SHAPKA detection!')

            // handle resizing / orientation change:

    initializeAR()            window.addEventListener('resize', handle_resize)

            window.addEventListener('orientationchange', handle_resize)

    return () => {          },

      // Cleanup          callbackTrack: (detectState) => {

      if (mediaStreamAPIHelper && mediaStreamAPIHelper.destroy) {            // Handle tracking state updates

        mediaStreamAPIHelper.destroy()            if (detectState && detectState.detected) {

      }              console.log('SHAPKA tracking active:', detectState)

    }            }

  }, [])          },

          loadNNOptions: _settings.loadNNOptions,

  if (error) {          nDetectsPerLoop: _settings.nDetectsPerLoop,

    return (          detectOptions: _settings.detectOptions,

      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">          cameraFov: _settings.cameraFov,

        <h2 className="text-xl font-bold mb-4">Ошибка AR</h2>          followZRot: _settings.followZRot,

        <p className="text-center mb-4">{error}</p>          scanSettings: _settings.scanSettings,

        <Link           stabilizerOptions: {n: 3}

          to="/"         })

          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"      } catch (error) {

        >        console.error('Error initializing WebAR.rocks.object:', error)

          Вернуться на главную        console.error('Error details:', error.message, error.stack)

        </Link>      }

      </div>    }

    )

  }    // get videoFeed:

    if (videoElement) {

  if (!isInitialized) {      mediaStreamAPIHelper.get(videoElement, onCameraVideoFeedGot, (err) => {

    return (        console.error('Cannot get video feed', err)

      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">      }, {

        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>        video: { 

        <p>Инициализация AR шапки...</p>          facingMode: {ideal: 'environment'}

        <p className="text-sm mt-2">Разрешите доступ к камере</p>        },

      </div>        audio: false

    )      })

  }    }



  return (    return () => {

    <div className="relative w-full h-screen overflow-hidden bg-black">      // Cleanup function

      {/* AR Canvas */}      try {

      <Canvas        window.removeEventListener('resize', handle_resize)

        ref={canvasRef}        window.removeEventListener('orientationchange', handle_resize)

        id="ARCanvas"        

        className="absolute inset-0 w-full h-full"        // Clean up video stream

        camera={{         if (videoElement && videoElement.srcObject) {

          position: [0, 0, 0],           const stream = videoElement.srcObject

          fov: 75,          const tracks = stream.getTracks()

          near: 0.1,          tracks.forEach(track => track.stop())

          far: 1000         }

        }}        

        gl={{         // Destroy WebAR.rocks instance

          preserveDrawingBuffer: true,        if (threeHelper && threeHelper.destroy) {

          alpha: true,          threeHelper.destroy()

          antialias: true         }

        }}      } catch (error) {

      >        console.error('Error during cleanup:', error)

        <UseThreeStore />      }

        <ARCanvas onDetect={handleDetect} onLose={handleLose} />    }

        <ShapokFollower onDetect={handleDetect} onLose={handleLose} />    // eslint-disable-next-line react-hooks/exhaustive-deps

          }, [isInitialized])

        {/* Basic lighting */}

        <ambientLight intensity={0.6} />  const handleDetection = () => {

        <directionalLight position={[10, 10, 5]} intensity={0.8} />    setIsFirstDetection(false)

      </Canvas>    setIsDetecting(true)

  }

      {/* UI Overlay */}

      <div className="absolute inset-0 pointer-events-none">  const handleLoseTracking = () => {

        {/* Detection status */}    setIsDetecting(false)

        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">  }

          <div className="flex items-center gap-2">

            <div className={`w-3 h-3 rounded-full ${isDetected ? 'bg-green-500' : 'bg-red-500'}`}></div>  const commonStyle = {

            <span className="text-sm">    left: '50%',

              {isDetected ? 'Шапка найдена!' : 'Ищем шапку...'}    minHeight: '100vh',

            </span>    minWidth: '100vw',

          </div>    position: 'fixed',

        </div>    top: '50%',

    transform: 'translate(-50%, -50%)'      

        {/* Instructions */}  }

        <div className="absolute bottom-20 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">

          <h3 className="font-bold mb-2">Инструкция:</h3>  const cameraVideoStyle = {

          <p className="text-sm">    zIndex: 1,

            Наведите камеру на шапку из мультфильма "Ну, погоди!"     top: 0,

            для появления 3D персонажа    left: 0,

          </p>    position: 'fixed',

        </div>    objectFit: 'cover',

    width: '100vw',

        {/* Back button */}    height: '100%'

        <Link   }

          to="/" 

          className="absolute top-4 right-4 pointer-events-auto px-4 py-2 bg-blue-600/80 hover:bg-blue-700/90 text-white rounded-lg transition-colors"  return (

        >    <div>

          Назад      {/* Canvas managed by three fiber, for AR: */}

        </Link>      <Canvas 

      </div>        style={Object.assign({

    </div>          zIndex: 10,

  )          width: sizing.width,

}          height: sizing.height

        }, commonStyle)}

export default ARShapok        gl={{
          preserveDrawingBuffer: true // allow image capture
        }}
      >
        <ThreeGrabber sizing={sizing} />
        <ShapkaFollower 
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
        Наведите камеру на объект ШАПКА<br/>
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
          ШАПКА ОБНАРУЖЕНА
        </div>
      )}
    </div>
  )
} 

export default ARShapok