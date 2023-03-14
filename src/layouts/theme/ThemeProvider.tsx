import { ConfigProvider } from 'antd'
import colors from '@/styles/colors'
import useColor from '@/styles/useColor'

interface RenderProps {
  children: React.ReactNode
}

export default function ThemeProvider({ children }: RenderProps) {
  const { getColor } = useColor()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgLayout: '#fafafa',
          colorPrimary: colors.geekblue,
          colorWarning: colors.orange,
          borderRadius: 8,
          borderRadiusSM: 4,
          borderRadiusLG: 8,
          controlHeight: 40,
          colorLinkHover: getColor('geekblue', 3),
          colorLink: getColor('geekblue'),
          controlItemBgActive: colors.blue,
          controlItemBgActiveHover: colors.blue,
        },
        components: {
          Menu: {
            colorItemBgHover: colors.blue,
          },
          Layout: {
            colorBgHeader: '#FFFFFF',
          },
          Tag: {
            borderRadiusSM: 16,
            lineHeight: 2,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
