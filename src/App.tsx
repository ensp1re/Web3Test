import React from "react"
import Layout from "./components/Layout"
import Index from "./components/Index"
import { EthereumProvider } from "./providers/EthereumProvider"
import "./globals.css"

const App: React.FC = () => {
  return (
    <EthereumProvider>
      <Layout>
        <Index />
      </Layout>
    </EthereumProvider>
  )
}

export default App

