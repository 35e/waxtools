import { useState, useRef } from "react"

export default function Collapsible(props) {
  const [isOpen, setIsOpen] = useState(false)
  const parentRef = useRef()

  return (
    <div className={`collapsible ${isOpen ? 'open': ''}`} onClick={() => setIsOpen(!isOpen)}>
      <p className="collapsible-label">{props.label}</p>
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
