import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#152132',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          position: 'relative',
        }}
      >
        {/* Left lens */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          border: '2px solid white',
          position: 'absolute', left: 4, top: 10,
        }} />
        {/* Right lens */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          border: '2px solid white',
          position: 'absolute', right: 4, top: 10,
        }} />
        {/* Bridge */}
        <div style={{
          width: 4, height: 2, background: 'white',
          position: 'absolute', top: 13, left: 14,
        }} />
      </div>
    ),
    { ...size }
  )
}
