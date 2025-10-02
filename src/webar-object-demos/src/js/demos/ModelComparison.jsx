import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// import helpers:
import threeHelper from '../contrib/WebARRocksObject/helpers/WebARRocksObjectThreeHelper.js'
import mediaStreamAPIHelper from '../contrib/WebARRocksObject/helpers/WebARRocksMediaStreamAPIHelper.js'

// import different models for comparison:
import NN_SPRITE from '../contrib/WebARRocksObject/neuralNets/NN_SPRITE_1.json'
import NN_COFFEE from '../contrib/WebARRocksObject/neuralNets/NN_COFFEE_2.json'
import NN_KEYBOARD from '../contrib/WebARRocksObject/neuralNets/NN_KEYBOARD_5.json'
import NN_POPMART from '../contrib/WebARRocksObject/neuralNets/NN_POPMART_8.json'

import BackButton from '../components/BackButton'

let _threeFiber = null

// Stabilized cube follower with smoothing
const ObjectFollower = () => {
  const objRef = useRef()
  const [currentModel, setCurrentModel] = useState('SPRITE')
  const prevPositionRef = useRef(new THREE.Vector3())
  const prevRotationRef = useRef(new THREE.Euler())
  const prevScaleRef = useRef(new THREE.Vector3(1, 1, 1))
  const smoothingFactor = 0.15 // Increase for more responsiveness, decrease for more smoothing
  
  useEffect(() => {
    const threeObject3D = objRef.current
    // Map models to their object followers
    const modelMap = {
      'SPRITE': 'SPRITECAN',
      'COFFEE': 'COFFEE',
      'KEYBOARD': 'KEYBOARD',
      'POPMART': 'POPMART'
    }
    threeHelper.set_objectFollower(modelMap[currentModel], threeObject3D)
  }, [currentModel])

  useFrame(() => {
    if (objRef.current) {
      const obj = objRef.current
      
      // Apply smoothing to position
      prevPositionRef.current.lerp(obj.position, smoothingFactor)
      obj.position.copy(prevPositionRef.current)
      
      // Apply smoothing to rotation
      prevRotationRef.current.x += (obj.rotation.x - prevRotationRef.current.x) * smoothingFactor
      prevRotationRef.current.y += (obj.rotation.y - prevRotationRef.current.y) * smoothingFactor
      prevRotationRef.current.z += (obj.rotation.z - prevRotationRef.current.z) * smoothingFactor
      obj.rotation.copy(prevRotationRef.current)
      
      // Apply smoothing to scale
      prevScaleRef.current.lerp(obj.scale, smoothingFactor)
      obj.scale.copy(prevScaleRef.current)
    }
  })

  return (
    <object3D ref={objRef}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshNormalMaterial />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshBasicMaterial wireframe={true} color={0x00ff00} />
      </mesh>
    </object3D>
  )
}

const ThreeGrabber = ({ sizing }) => {
  const threeFiber = useThree()
  _threeFiber = threeFiber
  
  useFrame(() => {
    threeHelper.update_threeCamera(sizing, threeFiber.camera)
    threeHelper.update_poses(threeFiber.camera)
  })
  return null
}

const ModelComparison = () => {
  const [sizing, setSizing] = useState(false)
  const [isInitialized, setInitialized] = useState(false)
  const [currentModel, setCurrentModel] = useState('SPRITE')
  const [detectionLog, setDetectionLog] = useState([])
  const [debugInfo, setDebugInfo] = useState({
    scanning: false,
    lastScan: null,
    totalDetections: 0,
    consecutiveMisses: 0
  })

  const cameraVideoRef = useRef()
  const canvasComputeRef = useRef()

  const models = {
    'SPRITE': { nn: NN_SPRITE, name: 'Sprite (Банки)', follower: 'SPRITECAN' },
    'COFFEE': { nn: NN_COFFEE, name: 'Coffee (Чашки)', follower: 'COFFEE' },
    'KEYBOARD': { nn: NN_KEYBOARD, name: 'Keyboard', follower: 'KEYBOARD' },
    'POPMART': { nn: NN_POPMART, name: 'POPMART (Ваша модель)', follower: 'POPMART' }
  }

  const initializeModel = useCallback((modelKey) => {
    if (!sizing || isInitialized) return
    
    const model = models[modelKey]
    console.log(`🔄 Switching to ${model.name}...`)
    
    const settings = {
        nDetectsPerLoop: 2,
        loadNNOptions: {
            notHereFactor: 0.0,
            paramsPerLabel: {
            [model.follower]: { 
                thresholdDetect: 0.6,
                maxNbDetectsInTheQueue: 10
            }
            }
        },
        detectOptions: {
            isKeepTracking: true,
            isSkipConfirmation: false,
            thresholdDetectFactor: 0.6,
            thresholdDetectFactorUnstitch: 0.3,
            trackingFactors: [0.6, 0.6, 0.6],
            detectionHysteresis: 0.05,
            nConfirmAutoMoves: 3,
            nLocateAutomoves: 3,
            nConfirmUnstitchMoves: 3
        },
        cameraFov: 55,
        followZRot: true,
        scanSettings: {
            margins: 0.05,
            nSweepXYsteps: 6,
            nSweepSsteps: 4,
            sweepScaleRange: [0.2, 1.0],
            sweepStepMinPx: 48,
            sweepShuffle: true,
            nDetectsPerSweep: 2
        }
        }


    threeHelper.init({
      video: cameraVideoRef.current,
      ARCanvas: canvasComputeRef.current,
      NN: model.nn,
      sizing,
      callbackReady: (err) => {
        if (err) {
          console.error(`❌ Error loading ${model.name}:`, err)
          return
        }
        console.log(`✅ ${model.name} loaded successfully`)
        
        threeHelper.set_callbackDetect((isDetected, detection) => {
          const logEntry = {
            time: new Date().toLocaleTimeString(),
            model: model.name,
            detected: isDetected,
            confidence: detection?.confidence?.toFixed(3) || 'N/A',
            position: detection?.positionScale ? 
              `[${detection.positionScale.slice(0,3).map(v => v.toFixed(2)).join(',')}]` : 'N/A'
          }
          
          // Обновляем debug информацию
          setDebugInfo(prev => ({
            ...prev,
            totalDetections: isDetected ? prev.totalDetections + 1 : prev.totalDetections,
            consecutiveMisses: isDetected ? 0 : prev.consecutiveMisses + 1,
            lastScan: new Date().toLocaleTimeString()
          }))
          
          if (isDetected) {
            console.log(`🎯 ${model.name} DETECTION:`, logEntry)
          } else {
            console.log(`❌ ${model.name} NO DETECTION at ${logEntry.time}`)
          }
          
          setDetectionLog(prev => [logEntry, ...prev].slice(0, 15))
        })
        
        setInitialized(true)
      },
      loadNNOptions: settings.loadNNOptions,
      nDetectsPerLoop: settings.nDetectsPerLoop,
      detectOptions: settings.detectOptions,
      cameraFov: settings.cameraFov,
      followZRot: settings.followZRot,
      scanSettings: settings.scanSettings
    })
  }, [sizing, isInitialized])

  const switchModel = (modelKey) => {
    if (isInitialized) {
      threeHelper.destroy()
      setInitialized(false)
    }
    setCurrentModel(modelKey)
    setTimeout(() => initializeModel(modelKey), 100)
  }

  useEffect(() => {
    const newSizing = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    setSizing(newSizing)

    mediaStreamAPIHelper.get(cameraVideoRef.current, () => {
      initializeModel(currentModel)
    }, (err) => {
      console.log('Cannot get video feed ' + err)
    }, {
      video: {
        width: { min: 640, max: 1920 },
        height: { min: 480, max: 1080 },
        facingMode: { ideal: 'environment' }
      },
      audio: false
    })
  }, [currentModel, initializeModel])

  return (
    <div>
      {/* Canvas managed by three fiber, for AR: */}
      {sizing && (
        <Canvas style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
          width: sizing.width,
          height: sizing.height
        }}>
          <ThreeGrabber sizing={sizing} />
          <ObjectFollower />
        </Canvas>
      )}

      {/* Video */}
      <video 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          objectFit: 'cover',
          width: '100vw',
          height: '100vh'
        }} 
        ref={cameraVideoRef}
      />

      {/* Model selector */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        {Object.entries(models).map(([key, model]) => (
          <button
            key={key}
            onClick={() => switchModel(key)}
            style={{
              padding: '8px 12px',
              backgroundColor: currentModel === key ? '#4CAF50' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {model.name} {currentModel === key && isInitialized ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Debug info panel */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '200px'
      }}>
        <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '5px' }}>
          🔍 Debug Info
        </div>
        <div>Модель: {models[currentModel].name}</div>
        <div>Всего детекций: {debugInfo.totalDetections}</div>
        <div>Промахов подряд: {debugInfo.consecutiveMisses}</div>
        <div>Последнее сканирование: {debugInfo.lastScan || 'N/A'}</div>
        <div style={{ 
          color: isInitialized ? '#4CAF50' : '#ff9800',
          marginTop: '5px'
        }}>
          Статус: {isInitialized ? '✅ Готов' : '⏳ Инициализация...'}
        </div>
      </div>

      {/* Detection log */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '350px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>📊 Лог детекций (последние 7):</div>
        {detectionLog.slice(0, 7).map((log, i) => (
          <div key={i} style={{ 
            color: log.detected ? '#4CAF50' : '#666',
            fontSize: '11px',
            marginBottom: '2px'
          }}>
            {log.time} - {log.detected ? `✅ ${log.confidence} pos:${log.position}` : '❌ Не найден'}
          </div>
        ))}
        {detectionLog.length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>Ожидание детекций...</div>
        )}
      </div>

      {/* Canvas for WebAR computations */}
      <canvas ref={canvasComputeRef} style={{display: 'none'}} width={128} height={128} />

      <BackButton />
    </div>
  )
}

export default ModelComparison
