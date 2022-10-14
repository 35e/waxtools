import { useState, useRef } from "react"

export default function Collapsible(props) {
  const [isOpen, setIsOpen] = useState(false)
  const parentRef = useRef()

  if (parentRef.current) { console.log(parentRef.current.scrollHeight) }

  return (
    <div className="collapsible p-2 px-4 bg-[#1a1a1a] rounded-xl cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <p className="cursor-pointer">{props.label}</p>
      <div className="collapsible-parent" ref={parentRef} style={isOpen ? {
          maxHeight: parentRef.current?.scrollHeight + "px"
        } : {
          maxHeight: "0px"
        }}>
        <div className="collapsible-content">{props.children}</div>
      </div>
    </div>
  )
}
