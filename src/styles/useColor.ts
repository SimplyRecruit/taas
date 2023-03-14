import ColorRange from '../types/ColorRange'

import { theme } from 'antd'
import Color from '@/types/Color'

const { useToken } = theme

export default function useColor() {
  const { token } = useToken()

  return {
    getColor: (color: Color, shade: ColorRange = 6) =>
      token[`${color}-${shade}`],
  }
}
