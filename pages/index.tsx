import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Person from 'models/Person'
import { Button } from 'antd'

export default function Home() {
  const person: Person = { name: "Mehmet", surname: "Yılmaz" }
  return (
    <>
      <div style={{height: "100%"}}></div>
    </>
  )
}