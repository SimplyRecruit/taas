import colors from '@/styles/colors'
import { ConfigProvider } from 'antd'

interface RenderProps {
  children: React.ReactNode
}

export default function ColorProvider({ children }: RenderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          geekblue: colors.geekblue,
          orange: colors.orange,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
