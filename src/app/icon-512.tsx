import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
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
          borderRadius: 100,
          position: 'relative',
        }}
      >
        {/* Left lens */}
        <div style={{
          width: 150, height: 150, borderRadius: '50%',
          border: '14px solid white',
          position: 'absolute', left: 66, top: 168,
        }} />
        {/* Right lens */}
        <div style={{
          width: 150, height: 150, borderRadius: '50%',
          border: '14px solid white',
          position: 'absolute', right: 66, top: 168,
        }} />
        {/* Bridge */}
        <div style={{
          width: 38, height: 14, background: 'white', borderRadius: 7,
          position: 'absolute', top: 225, left: 237,
        }} />
        {/* Left temple */}
        <div style={{
          width: 14, height: 55, background: 'white', borderRadius: 7,
          position: 'absolute', left: 56, top: 155,
          transform: 'rotate(15deg)',
        }} />
        {/* Right temple */}
        <div style={{
          width: 14, height: 55, background: 'white', borderRadius: 7,
          position: 'absolute', right: 56, top: 155,
          transform: 'rotate(-15deg)',
        }} />
        {/* Lens reflections */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          position: 'absolute', left: 100, top: 195,
        }} />
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          position: 'absolute', right: 100, top: 195,
        }} />
      </div>
    ),
    { ...size }
  )
}
