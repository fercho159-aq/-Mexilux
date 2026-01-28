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
          fontSize: 120,
          background: 'linear-gradient(135deg, #152132 0%, #1e3a5f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 40,
          fontWeight: 'bold',
          fontFamily: 'system-ui',
        }}
      >
        M
      </div>
    ),
    {
      ...size,
    }
  )
}
