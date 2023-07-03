import React, { memo } from "react"
import "./Loader.css"

const Loader = memo(({ loading }) => {
  return (
    <div className={`loader-container ${!loading && "disabledAnim"}`}>
      <div className="spinner"></div>
    </div>
  )
})

export default Loader
