// @ts-nocheck
import '@propeldata/wc-time-series'
import Image from 'next/image'

const styles = {
  border: {
    width: 1,
    radius: 10,
    color: '#7d150f',
    hoverColor: '#7d150f'
  },
  background: {
    color: '#e50914',
    hoverColor: '#7d150f'
  },
  canvas: {
    backgroundColor: '#222222',
    padding: 40,
    borderRadius: '8px'
  },
  font: {
    color: '#FFF',
    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    size: 16,
    weight: '400',
    style: 'normal',
    lineHeight: 1
  }
}

const NetflixPage = () => (
  <div className="bg-[#141414] p-10 h-full flex flex-col items-center justify-center gap-10">
    <Image className="self-center" src="/logo-netflix.png" width={217} height={70} />
    <div className="h-full w-full">
      <time-series
        metric="queryCount"
        accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}
        styles={JSON.stringify(styles)}
      ></time-series>
    </div>
  </div>
)

export default NetflixPage
