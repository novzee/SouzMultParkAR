import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ShapokRat = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseCanvasRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [detector, setDetector] = useState(null);
  const [poses, setPoses] = useState([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isPoseDetectionEnabled, setIsPoseDetectionEnabled] = useState(true);
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const detectionIntervalRef = useRef(null);

  // Three.js объекты и вспомогательные refs для сглаживания
  const threeSceneRef = useRef(null);
  const threeRendererRef = useRef(null);
  const threeCameraRef = useRef(null);
  const mishModelRef = useRef(null);
  const isModelLoadedRef = useRef(false);

  const targetPosRef = useRef(new THREE.Vector3());
  const currentPosRef = useRef(new THREE.Vector3());
  const targetQuatRef = useRef(new THREE.Quaternion());
  const currentQuatRef = useRef(new THREE.Quaternion());
  const targetScaleRef = useRef(1);
  const currentScaleRef = useRef(1);

  // Инициализация Three.js сцены
  const initializeThreeJS = () => {
    if (!threeCanvasRef.current || !videoRef.current) return;

    const canvas = threeCanvasRef.current;
    const video = videoRef.current;

    // Создаем сцену
    const scene = new THREE.Scene();
    threeSceneRef.current = scene;

    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(
      50,
      Math.max(1, video.videoWidth / video.videoHeight),
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    threeCameraRef.current = camera;

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(video.videoWidth, video.videoHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    threeRendererRef.current = renderer;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(1, 3, 2);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.6, 10);
    rimLight.position.set(0, -2, 3);
    scene.add(rimLight);

    // Фоновая плоскость (прозрачная) для корректного отображения теней/референса
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    plane.receiveShadow = true;
    scene.add(plane);

    // Анимация рендера
    const animate = () => {
      requestAnimationFrame(animate);

      // Сглаживаем позицию
      if (mishModelRef.current) {
        // позиция
        currentPosRef.current.lerp(targetPosRef.current, 0.18);
        mishModelRef.current.position.copy(currentPosRef.current);

        // масштаб
        currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * 0.14;
        mishModelRef.current.scale.setScalar(currentScaleRef.current);

        // вращение через кватернион
        currentQuatRef.current.slerp(targetQuatRef.current, 0.16);
        mishModelRef.current.quaternion.copy(currentQuatRef.current);
      }

      if (threeRendererRef.current && threeSceneRef.current && threeCameraRef.current && is3DEnabled) {
        threeRendererRef.current.render(threeSceneRef.current, threeCameraRef.current);
      }
    };

    animate();

    console.log('Three.js сцена инициализирована (улучшенная)');
  };

  // Загрузка 3D модели rat.glb
  const loadRatModel = async () => {
    if (!threeSceneRef.current) return;

    try {
      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          '/rat.glb',
          (gltf) => resolve(gltf),
          undefined,
          (error) => reject(error)
        );
      });

      const model = gltf.scene;

      // Центрируем модель: создадим pivot, чтобы проще позиционировать
      const pivot = new THREE.Object3D();
      pivot.add(model);

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Немного улучшить материалы для видимости, если map есть - оставить
          if (child.material && (child.material.isMeshStandardMaterial || child.material.isMeshLambertMaterial)) {
            child.material.metalness = child.material.metalness ?? 0;
            child.material.roughness = child.material.roughness ?? 0.6;
          }
        }
      });

      // Начальный размер и ориентация: смотрит в сторону камеры (по оси -Z модели должен быть направлен к камере)
      pivot.scale.setScalar(0.8);
      pivot.position.set(0, 0, 0);
      pivot.rotation.set(0, Math.PI / 2, 0); // повернуть так, чтобы бок крысы был виден

      threeSceneRef.current.add(pivot);
      mishModelRef.current = pivot;
      isModelLoadedRef.current = true;

      // Инициализируем текущее состояние для сглаживания
      currentPosRef.current.copy(pivot.position);
      currentQuatRef.current.copy(pivot.quaternion);
      currentScaleRef.current = pivot.scale.x;
      targetPosRef.current.copy(pivot.position);
      targetQuatRef.current.copy(pivot.quaternion);
      targetScaleRef.current = pivot.scale.x;

      console.log('3D модель rat.glb загружена и добавлена в сцену');
    } catch (err) {
      console.error('Ошибка загрузки 3D модели rat.glb:', err);
      setError(`Ошибка загрузки 3D модели: ${err.message}`);
    }
  };

  // Инициализация модели детекции поз
  const initializePoseDetection = async () => {
    try {
      setIsModelLoading(true);
      await tf.ready();

      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };

      const poseDetector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );

      setDetector(poseDetector);
      setIsModelLoading(false);
      console.log('Модель детекции поз загружена');

    } catch (err) {
      console.error('Ошибка загрузки модели:', err);
      setError(`Ошибка загрузки модели детекции поз: ${err.message}`);
      setIsModelLoading(false);
    }
  };

  // Отрисовка скелета и ключевых точек (как было)
  const drawSkeleton = (ctx, keypoints) => {
    const connections = [
      [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], [11, 12], [5, 11], [6, 12], [11, 13], [12, 14], [13, 15], [14, 16], [0, 1], [0, 2], [1, 3], [2, 4]
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;

    connections.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      if (kp1 && kp2 && kp1.score > 0.3 && kp2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
  };

  const drawKeypoints = (ctx, keypoints) => {
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 720, ideal: 1080, max: 1440 },
          height: { min: 1280, ideal: 1920, max: 2560 },
          facingMode: 'environment'
        },
        audio: false
      });

      setStream(mediaStream);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsVideoReady(true);

            // Обновляем размеры рендера когда видео готово
            if (threeRendererRef.current) {
              threeRendererRef.current.setSize(videoRef.current.videoWidth, videoRef.current.videoHeight);
              if (threeCameraRef.current) {
                threeCameraRef.current.aspect = Math.max(1, videoRef.current.videoWidth / videoRef.current.videoHeight);
                threeCameraRef.current.updateProjectionMatrix();
              }
            }
          }
        };
      }
    } catch (err) {
      console.error('Ошибка доступа к камере:', err);
      setError(`Не удается получить доступ к камере: ${err.message}`);
      setIsVideoReady(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let localStream = null;

    const initCamera = async () => {
      if (!mounted) return;

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 720, ideal: 1080, max: 1440 },
            height: { min: 1280, ideal: 1920, max: 2560 },
            facingMode: 'environment'
          },
          audio: false
        });

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = mediaStream;
        setStream(mediaStream);
        setError(null);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && mounted) {
              videoRef.current.play();
              setIsVideoReady(true);

              // После готовности видео инициализируем three и модель
              initializeThreeJS();
              loadRatModel();
            }
          };
        }
      } catch (err) {
        if (mounted) {
          console.error('Ошибка доступа к камере:', err);
          setError(`Не удается получить доступ к камере: ${err.message}`);
          setIsVideoReady(false);
        }
      }
    };

    const initAll = async () => {
      await initCamera();
      if (mounted) {
        await initializePoseDetection();
      }
    };

    initAll();

    return () => {
      mounted = false;
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Запуск детекции поз и обновление 3D модели
  useEffect(() => {
    const localDrawPoses = (detectedPoses) => {
      if (!poseCanvasRef.current || !videoRef.current) return;

      const canvas = poseCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      detectedPoses.forEach(pose => {
        if (pose.keypoints) {
          drawSkeleton(ctx, pose.keypoints);
          drawKeypoints(ctx, pose.keypoints);
        }
      });
    };

    if (isVideoReady && detector && isPoseDetectionEnabled) {
      const localUpdate3DModel = (detectedPoses) => {
        if (!mishModelRef.current || !is3DEnabled || !detectedPoses.length) return;

        const pose = detectedPoses[0];
        if (!pose.keypoints) return;

        const left = pose.keypoints[5];
        const right = pose.keypoints[6];

        // Если видны оба плеча
        if (left && right && left.score > 0.25 && right.score > 0.25) {
          const video = videoRef.current;

          // координаты в пикселях
          const midX = (left.x + right.x) / 2;
          const midY = (left.y + right.y) / 2;

          // расстояние между плечами
          const shoulderDistancePx = Math.hypot(right.x - left.x, right.y - left.y);

          // Нормализованные координаты от -1 до 1
          const nx = (midX / video.videoWidth) * 2 - 1;
          const ny = -((midY / video.videoHeight) * 2 - 1);

          // Рассчитываем желаемую дистанцию от камеры на основе ширины плеч
          const shoulderRatio = THREE.MathUtils.clamp(shoulderDistancePx / video.videoWidth, 0.05, 0.5);
          const t = (shoulderRatio - 0.05) / (0.45);
          const desiredDistance = THREE.MathUtils.lerp(4.6, 1.6, t); // ближе при больших плечах

          // Проецируем NDC точку в мировой вектор и получаем направление
          const ndc = new THREE.Vector3(nx, ny, 0.5);
          ndc.unproject(threeCameraRef.current);
          const dir = ndc.sub(threeCameraRef.current.position).normalize();
          const worldPos = threeCameraRef.current.position.clone().add(dir.multiplyScalar(desiredDistance));

          // Небольшой поднятый оффсет чтобы крыса стояла на плече, а не в середине груди
          worldPos.y += 0.12 * desiredDistance; // поднимаем пропорционально дистанции
          worldPos.x += (right.x > left.x) ? -0.05 * desiredDistance : 0.05 * desiredDistance; // сдвиг в сторону плеча

          // Поворот крысы: ориентируемся по вектору плеч
          const shoulderAngle = Math.atan2(right.y - left.y, right.x - left.x);
          // Преобразуем в трехмерный поворот: вращаем вокруг Z, чтобы совпадал наклон плеч
          const quat = new THREE.Quaternion();
          const euler = new THREE.Euler(-0.6, Math.PI / 2, -shoulderAngle, 'XYZ');
          quat.setFromEuler(euler);

          // Масштаб модели в зависимости от расстояния плеч
          const baseScale = 0.9;
          const scaleFromShoulders = THREE.MathUtils.clamp((shoulderDistancePx / 250) * 1.2, 0.4, 2.2);
          const finalScale = baseScale * scaleFromShoulders;

          // Обновляем target refs (для сглаживания в animate loop)
          targetPosRef.current.copy(worldPos);
          targetQuatRef.current.copy(quat);
          targetScaleRef.current = finalScale;

        } else if (left && left.score > 0.25) {
          // Если видимо только левое плечо используем его как опорную точку
          const video = videoRef.current;
          const nx = (left.x / video.videoWidth) * 2 - 1;
          const ny = -((left.y / video.videoHeight) * 2 - 1);
          const ndc = new THREE.Vector3(nx, ny, 0.5);
          ndc.unproject(threeCameraRef.current);
          const dir = ndc.sub(threeCameraRef.current.position).normalize();
          const worldPos = threeCameraRef.current.position.clone().add(dir.multiplyScalar(3.5));
          worldPos.y += 0.1;

          const quat = new THREE.Quaternion();
          const euler = new THREE.Euler(-0.5, Math.PI / 2, 0, 'XYZ');
          quat.setFromEuler(euler);

          targetPosRef.current.copy(worldPos);
          targetQuatRef.current.copy(quat);
          targetScaleRef.current = 0.9;
        }
      };

      const localRenderThreeJS = () => {
        if (threeRendererRef.current && threeSceneRef.current && threeCameraRef.current && is3DEnabled) {
          threeRendererRef.current.render(threeSceneRef.current, threeCameraRef.current);
        }
      };

      const runDetection = async () => {
        if (!detector || !videoRef.current || !isPoseDetectionEnabled) return;
        try {
          const detectedPoses = await detector.estimatePoses(videoRef.current);
          setPoses(detectedPoses);
          localDrawPoses(detectedPoses);

          if (is3DEnabled) {
            localUpdate3DModel(detectedPoses);
            localRenderThreeJS();
          }
        } catch (err) {
          console.error('Ошибка детекции поз:', err);
        }
      };

      detectionIntervalRef.current = setInterval(runDetection, 100);

      return () => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
      };
    } else {
      // Очистка
      if (poseCanvasRef.current) {
        const ctx = poseCanvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, poseCanvasRef.current.width, poseCanvasRef.current.height);
      }
    }
  }, [isVideoReady, detector, isPoseDetectionEnabled, is3DEnabled]);

  // Остальные функции: takePhoto, download, switchCamera
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isVideoReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (isPoseDetectionEnabled && poses.length > 0 && poseCanvasRef.current) {
        const poseCanvas = poseCanvasRef.current;
        context.drawImage(poseCanvas, 0, 0, canvas.width, canvas.height);
      }

      if (is3DEnabled && threeCanvasRef.current && isModelLoadedRef.current) {
        const threeCanvas = threeCanvasRef.current;
        context.drawImage(threeCanvas, 0, 0, canvas.width, canvas.height);
      }

      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
    }
  };

  const downloadPhoto = (dataUrl) => {
    try {
      const link = document.createElement('a');
      link.download = `shapok-photo-${new Date().getTime()}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Ошибка скачивания:', err);
      window.open(dataUrl, '_blank');
    }
  };

  const retakePhoto = () => setCapturedImage(null);

  const switchCamera = async () => {
    try {
      const facing = stream && stream.getVideoTracks()[0].getSettings().facingMode === 'environment' ? 'user' : 'environment';
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 720, ideal: 1080, max: 1440 },
          height: { min: 1280, ideal: 1920, max: 2560 },
          facingMode: facing
        },
        audio: false
      });

      if (stream) stream.getTracks().forEach(track => track.stop());
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error('Ошибка переключения камеры:', err);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-xl mb-4">Ошибка камеры</h2>
          <p>{error}</p>
          <button onClick={startCamera} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg">Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" style={{ minHeight: '100vh', minWidth: '100vw', touchAction: 'manipulation' }}>
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'translateZ(0)', willChange: 'transform' }} />

      <canvas ref={poseCanvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: 10 }} />

      <canvas ref={threeCanvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: 15 }} />

      <canvas ref={canvasRef} className="hidden" />

      {isModelLoading && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Загрузка модели...</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPoseDetectionEnabled && detector ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isPoseDetectionEnabled && detector ? 'Позы ON' : 'Позы OFF'}</span>
          </div>
        </div>

        <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${is3DEnabled && isModelLoadedRef.current ? 'bg-purple-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{is3DEnabled && isModelLoadedRef.current ? '🐭 Rat ON' : '🐭 Rat OFF'}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end items-center p-6">
        <div className="flex items-center justify-center mb-8">
          <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => window.history.back()} className="px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg text-sm">← Назад</button>
          <button onClick={switchCamera} className="px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg text-sm">🔄 Камера</button>
          <button onClick={() => setIsPoseDetectionEnabled(!isPoseDetectionEnabled)} className={`px-3 py-2 rounded-lg text-sm ${isPoseDetectionEnabled ? 'bg-green-600 bg-opacity-70 text-white' : 'bg-black bg-opacity-50 text-white'}`}>{isPoseDetectionEnabled ? '🎯 Позы ON' : '🎯 Позы OFF'}</button>
          <button onClick={() => setIs3DEnabled(!is3DEnabled)} className={`px-3 py-2 rounded-lg text-sm ${is3DEnabled ? 'bg-purple-600 bg-opacity-70 text-white' : 'bg-black bg-opacity-50 text-white'}`}>{is3DEnabled ? '🐭 Rat ON' : '🐭 Rat OFF'}</button>
          <button onClick={startCamera} className="px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg text-sm">🔄 Restart</button>
        </div>
      </div>

      {capturedImage && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="max-w-full max-h-full">
            <img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={retakePhoto} className="px-6 py-3 bg-red-500 text-white rounded-lg">Переснять</button>
              <button onClick={() => downloadPhoto(capturedImage)} className="px-6 py-3 bg-green-500 text-white rounded-lg">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShapokRat;
