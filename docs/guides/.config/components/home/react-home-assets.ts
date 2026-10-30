import reactImage0 from './assets/react-home/images/g_arrow.png'
import reactImage1 from './assets/react-home/images/home/community/react_conf_elizabet.webp'
import reactImage2 from './assets/react-home/images/home/community/react_conf_fun.webp'
import reactImage3 from './assets/react-home/images/home/community/react_conf_hallway.webp'
import reactImage4 from './assets/react-home/images/home/community/react_conf_nat.webp'
import reactImage5 from './assets/react-home/images/home/community/react_india_hallway.webp'
import reactImage6 from './assets/react-home/images/home/community/react_india_selfie.webp'
import reactImage7 from './assets/react-home/images/home/community/react_india_sunil.webp'
import reactImage8 from './assets/react-home/images/home/community/react_india_team.webp'
import reactImage9 from './assets/react-home/images/home/conf2021/aakansha.jpg'
import reactImage10 from './assets/react-home/images/home/conf2021/andrew.jpg'
import reactImage11 from './assets/react-home/images/home/conf2021/brian.jpg'
import reactImage12 from './assets/react-home/images/home/conf2021/cover.svg'
import reactImage13 from './assets/react-home/images/home/conf2021/daishi.jpg'
import reactImage14 from './assets/react-home/images/home/conf2021/debbie.jpg'
import reactImage15 from './assets/react-home/images/home/conf2021/delba.jpg'
import reactImage16 from './assets/react-home/images/home/conf2021/diego.jpg'
import reactImage17 from './assets/react-home/images/home/conf2021/eric.jpg'
import reactImage18 from './assets/react-home/images/home/conf2021/helen.jpg'
import reactImage19 from './assets/react-home/images/home/conf2021/juan.jpg'
import reactImage20 from './assets/react-home/images/home/conf2021/lauren.jpg'
import reactImage21 from './assets/react-home/images/home/conf2021/linton.jpg'
import reactImage22 from './assets/react-home/images/home/conf2021/lyle.jpg'
import reactImage23 from './assets/react-home/images/home/conf2021/rachel.jpg'
import reactImage24 from './assets/react-home/images/home/conf2021/rick.jpg'
import reactImage25 from './assets/react-home/images/home/conf2021/robert.jpg'
import reactImage26 from './assets/react-home/images/home/conf2021/roman.jpg'
import reactImage27 from './assets/react-home/images/home/conf2021/sarah.jpg'
import reactImage28 from './assets/react-home/images/home/conf2021/shaundai.jpg'
import reactImage29 from './assets/react-home/images/home/conf2021/shruti.jpg'
import reactImage30 from './assets/react-home/images/home/conf2021/steven.jpg'
import reactImage31 from './assets/react-home/images/home/conf2021/tafu.jpg'
import reactImage32 from './assets/react-home/images/home/conf2021/xuan.jpg'
import reactImage33 from './assets/react-home/images/meta-gradient-dark.png'
import reactImage34 from './assets/react-home/images/meta-gradient.png'
import reactImage35 from './assets/react-home/images/uwu.png'
import reactImage36 from './assets/react-home/images/home/conf2019/cover.svg'

const localImages: Array<[string, string]> = [
  ['/react-home/images/g_arrow.png', reactImage0],
  ['/react-home/images/home/community/react_conf_elizabet.webp', reactImage1],
  ['/react-home/images/home/community/react_conf_fun.webp', reactImage2],
  ['/react-home/images/home/community/react_conf_hallway.webp', reactImage3],
  ['/react-home/images/home/community/react_conf_nat.webp', reactImage4],
  ['/react-home/images/home/community/react_india_hallway.webp', reactImage5],
  ['/react-home/images/home/community/react_india_selfie.webp', reactImage6],
  ['/react-home/images/home/community/react_india_sunil.webp', reactImage7],
  ['/react-home/images/home/community/react_india_team.webp', reactImage8],
  ['/react-home/images/home/conf2021/aakansha.jpg', reactImage9],
  ['/react-home/images/home/conf2021/andrew.jpg', reactImage10],
  ['/react-home/images/home/conf2021/brian.jpg', reactImage11],
  ['/react-home/images/home/conf2021/cover.svg', reactImage12],
  ['/react-home/images/home/conf2021/daishi.jpg', reactImage13],
  ['/react-home/images/home/conf2021/debbie.jpg', reactImage14],
  ['/react-home/images/home/conf2021/delba.jpg', reactImage15],
  ['/react-home/images/home/conf2021/diego.jpg', reactImage16],
  ['/react-home/images/home/conf2021/eric.jpg', reactImage17],
  ['/react-home/images/home/conf2021/helen.jpg', reactImage18],
  ['/react-home/images/home/conf2021/juan.jpg', reactImage19],
  ['/react-home/images/home/conf2021/lauren.jpg', reactImage20],
  ['/react-home/images/home/conf2021/linton.jpg', reactImage21],
  ['/react-home/images/home/conf2021/lyle.jpg', reactImage22],
  ['/react-home/images/home/conf2021/rachel.jpg', reactImage23],
  ['/react-home/images/home/conf2021/rick.jpg', reactImage24],
  ['/react-home/images/home/conf2021/robert.jpg', reactImage25],
  ['/react-home/images/home/conf2021/roman.jpg', reactImage26],
  ['/react-home/images/home/conf2021/sarah.jpg', reactImage27],
  ['/react-home/images/home/conf2021/shaundai.jpg', reactImage28],
  ['/react-home/images/home/conf2021/shruti.jpg', reactImage29],
  ['/react-home/images/home/conf2021/steven.jpg', reactImage30],
  ['/react-home/images/home/conf2021/tafu.jpg', reactImage31],
  ['/react-home/images/home/conf2021/xuan.jpg', reactImage32],
  ['/react-home/images/meta-gradient-dark.png', reactImage33],
  ['/react-home/images/meta-gradient.png', reactImage34],
  ['/react-home/images/uwu.png', reactImage35],
  ['/react-home/images/home/conf2019/cover.svg', reactImage36],
]

export const localizeReactAssets = (html: string): string =>
  localImages.reduce((content, [source, local]) => content.replaceAll(source, local), html)
