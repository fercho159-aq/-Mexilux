import { ImageResponse } from 'next/og'

export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #152132 0%, #1e3a5f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          position: 'relative',
        }}
      >
        {/* Left lens */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '6px solid white',
          position: 'absolute', left: 26, top: 62,
        }} />
        {/* Right lens */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '6px solid white',
          position: 'absolute', right: 26, top: 62,
        }} />
        {/* Bridge */}
        <div style={{
          width: 16, height: 6, background: 'white', borderRadius: 3,
          position: 'absolute', top: 82, left: 88,
        }} />
        {/* Left temple */}
        <div style={{
          width: 6, height: 22, background: 'white', borderRadius: 3,
          position: 'absolute', left: 22, top: 58,
          transform: 'rotate(15deg)',
        }} />
        {/* Right temple */}
        <div style={{
          width: 6, height: 22, background: 'white', borderRadius: 3,
          position: 'absolute', right: 22, top: 58,
          transform: 'rotate(-15deg)',
        }} />
        {/* Lens reflections */}
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          position: 'absolute', left: 38, top: 72,
        }} />
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          position: 'absolute', right: 38, top: 72,
        }} />
      </div>
    ),
    { ...size }
  )
}
