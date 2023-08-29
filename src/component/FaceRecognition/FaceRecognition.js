import React from 'react';
import './FaceRecognition.css';


const FaceRecognition = ({box,imageUrl}) => {
    return (
        <div className='center ma'>
        <div className='absolute mt2'>
            <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
            {/* <div className='bounding-box' style={{top: box.toprow, right: box.rightcol, bottom: box.bottomrow, left: box.leftcol}}>
            </div> */}
            {box.map((boxi, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{
              top: boxi.toprow,
              right: boxi.rightcol,
              bottom: boxi.bottomrow,
              left: boxi.leftcol,
            }}>
            </div>
        ))}
        </div>
        </div>
       // console.log("hi")
        );
        
}


export default FaceRecognition;