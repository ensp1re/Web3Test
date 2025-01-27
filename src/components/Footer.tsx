import React from "react"
import Container from "./Container"

const Footer: React.FC = () => {
    return (
        <footer className="border-t w-full h-fullbg-gray-50 py-4 bg-muted/50">
            <Container>
                <div className="flex w-full items-center justify-between gap-4">
                    <p className="text-sm text-center text-muted-foreground">©
                        {" "}{new Date().getFullYear()}{" "}
                        Web3 Test. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    )
}

export default Footer

