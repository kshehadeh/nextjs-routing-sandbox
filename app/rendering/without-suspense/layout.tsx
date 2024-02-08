import { PropsWithChildren } from "react"

export default function InnerLayout({children}: Readonly<PropsWithChildren>) {
    return (
        <div>
            {children}
        </div>    
    )
}