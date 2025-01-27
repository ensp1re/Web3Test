import React from "react"
import { ReactElement } from "react"

interface ContainerProps {
    children: React.ReactNode
    className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }): ReactElement => {
    return <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export default Container

