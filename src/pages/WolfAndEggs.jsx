import React, { useRef, useEffect } from 'react'

const WolfAndEggs = () => {
  const canvasRef = useRef(null)
  const wolfRef = useRef({ x: 160, y: 440, width: 80, height: 20 })
  const eggsRef = useRef([])
  const scoreRef = useRef(0)
  const keysRef = useRef({ left: false, right: false })
  const gameOverRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width = 400
    const height = canvas.height = 480

    // Spawn eggs every second
    const spawn = setInterval(() => {
      eggsRef.current.push({ x: Math.random() * (width - 10), y: 0, size: 10, speed: 1 + Math.random() * 2 })
    }, 1000)

    // Keyboard handlers
    const onKeyDown = e => {
      if (e.key === 'ArrowLeft') keysRef.current.left = true
      if (e.key === 'ArrowRight') keysRef.current.right = true
    }
    const onKeyUp = e => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false
      if (e.key === 'ArrowRight') keysRef.current.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // Game loop
    const loop = () => {
      if (gameOverRef.current) {
        ctx.fillStyle = 'black'
        ctx.font = '24px sans-serif'
        ctx.fillText('Game Over! Score: ' + scoreRef.current, 50, height / 2)
        return
      }
      requestAnimationFrame(loop)

      // Update wolf
      if (keysRef.current.left) wolfRef.current.x -= 5
      if (keysRef.current.right) wolfRef.current.x += 5
      wolfRef.current.x = Math.max(0, Math.min(width - wolfRef.current.width, wolfRef.current.x))

      // Update eggs
      eggsRef.current.forEach(egg => (egg.y += egg.speed))
      // Collision and remove
      eggsRef.current = eggsRef.current.filter(egg => {
        if (egg.y + egg.size >= wolfRef.current.y && egg.x + egg.size > wolfRef.current.x && egg.x < wolfRef.current.x + wolfRef.current.width) {
          scoreRef.current++
          return false
        }
        if (egg.y > height) {
          gameOverRef.current = true
          return false
        }
        return true
      })

      // Draw
      ctx.clearRect(0, 0, width, height)
      // Wolf
      ctx.fillStyle = 'gray'
      ctx.fillRect(wolfRef.current.x, wolfRef.current.y, wolfRef.current.width, wolfRef.current.height)
      // Eggs
      eggsRef.current.forEach(egg => {
        ctx.fillStyle = 'gold'
        ctx.beginPath()
        ctx.arc(egg.x + egg.size / 2, egg.y + egg.size / 2, egg.size / 2, 0, Math.PI * 2)
        ctx.fill()
      })
      // Score
      ctx.fillStyle = 'black'
      ctx.font = '16px sans-serif'
      ctx.fillText('Score: ' + scoreRef.current, 10, 20)
    }

    loop()

    return () => {
      clearInterval(spawn)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // Touch and mouse handlers for on-screen buttons
  const handleLeftDown = () => { keysRef.current.left = true }
  const handleLeftUp = () => { keysRef.current.left = false }
  const handleRightDown = () => { keysRef.current.right = true }
  const handleRightUp = () => { keysRef.current.right = false }

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <h2>Wolf and Eggs!</h2>
      <canvas ref={canvasRef} style={{ border: '2px solid #333' }} />
      <p>Use ← → to move the wolf. Catch eggs!</p>
      {/* On-screen joystick buttons */}
      <div className="absolute bottom-8 inset-x-0 flex justify-between px-12">
        <button
          onMouseDown={handleLeftDown} onMouseUp={handleLeftUp}
          onTouchStart={handleLeftDown} onTouchEnd={handleLeftUp}
          className="flex items-center justify-center w-16 h-16 bg-[#726de3] text-white rounded-full shadow-lg transition-all duration-200 hover:bg-[#09a9c3] mx-4"
        >
          ←
        </button>
        <button
          onMouseDown={handleRightDown} onMouseUp={handleRightUp}
          onTouchStart={handleRightDown} onTouchEnd={handleRightUp}
          className="flex items-center justify-center w-16 h-16 bg-[#726de3] text-white rounded-full shadow-lg transition-all duration-200 hover:bg-[#09a9c3] mx-4"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default WolfAndEggs
