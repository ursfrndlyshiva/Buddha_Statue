import React, { useState } from 'react'
import "./App.css"
const Content = () => {
  const[show,SetShow]=useState(false)
  return (
    <div style={{padding:"2px 3px"}}>
      
      <div className='title' >
        <p>
            Maithreya Buddha in gesture of fearlessness   (Abhaya mudra)
        </p>
        <div className='icons'>
          <span><img src="heart.png"  alt="" /><p>0</p></span>
          <span><img src="share.png" alt="" /><p>10</p></span>
          <span><img src="view.png" alt="" /><p>20</p></span>
        </div>
      </div>
      <div> <ul>
        <li>Dynasty</li>
        <li>Period:200CE</li>
        <li>Material:Sandstone</li>
        <li>Location:National Muesuem</li>
      </ul></div>
      <div className={`description ${show ? 'close' : ''}`}>
        <p style={{fontWeight:"bold"}}>Descrption:</p>
        The Maitreya Buddha, also known as the Future Buddha, symbolizes hope, compassion, 
  and the promise of future enlightenment. Maitreya is believed to be the successor 
  to the historical Buddha (Gautama Buddha) and will appear on Earth to teach the 
  pure Dharma when the current teachings have faded. Often depicted seated or 
  standing, Maitreya shows the Abhaya Mudra—a gesture of fearlessness—offering 
  protection and peace. Adorned with a crown and jewels, his serene smile radiates 
  wisdom, reflecting his role as a beacon of universal love and enlightenment
        </div>
        <p className='button'  onClick={() => SetShow(!show)}>{!show?<><i class="fa-solid fa-arrow-right"></i> Read More</>:<>Read Less  <i class="fa-solid fa-arrow-left"></i></>}</p>
      <div>
        <button id='b1' className='foot'>Add To Collectiom </button> <button id='b2' className='foot'>souvenir</button>
      </div>
    </div>
  )
}

export default Content
