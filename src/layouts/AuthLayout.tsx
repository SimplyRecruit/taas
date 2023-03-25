import { Card } from 'antd'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="center-column"
      style={{
        backgroundImage:
          'url(https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <Card className="elevation" style={{ width: '100%', maxWidth: 300 }}>
        {children}
      </Card>
    </div>
  )
}
