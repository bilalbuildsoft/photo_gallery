import React, {useState, useEffect} from 'react';
import './App.css';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { Typography} from '@mui/material';

const aspectRatios=[
    {value:4/3, text:"4/3"},
    {value:16/9, text:"16/9"},
    {value:1/2, text:"1/2"}
];

const ImageDialog=({id,
    imageUrl,
    cropInit,
    zoomInit,
    aspectInit,
    rotateInit,
    onCancel,
    setCroppedImageFor,
    resetImage,
    }) => {
    if(zoomInit==null){
        zoomInit=1;
    }
    if(cropInit==null){
        cropInit={x:0,y:0};
    }
    if(rotateInit==null){
        rotateInit=0;
    }
    if(aspectInit==null){
        aspectInit = aspectRatios[0];
    }

    const [zoom, setZoom]= useState(zoomInit);
    const [crop, setCrop]= useState(cropInit);
    const [aspect, setAspect]= useState(aspectInit);
    const [rotation, setRotation] = useState(rotateInit)
    
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange=(crop)=>{
        setCrop(crop);
    };

    const onZoomChange=(zoom)=>{
        setZoom(zoom);
    };

    const onRotationChange=(rotation)=>{
        setRotation(rotation);
    };

    const onAspectChange=(e)=>{
        const value = e.target.value;
        const ratio = aspectRatios.find((ratio)=>ratio.value==value);  
        setAspect(ratio);

    };

    const onCropComplete =(croppedArea,croppedAreaPixels)=>{
        setCroppedAreaPixels(croppedAreaPixels);

    }

    const onCrop= async()=>{
        const croppedImageUrl = await getCroppedImg(imageUrl,croppedAreaPixels,rotation);
        setCroppedImageFor(id,crop,zoom,aspect,rotation,croppedImageUrl);
    };

    const onResetImage =()=>{
        resetImage(id);

    }

    return <div>
          <div className="backdrop"></div>
          <div className="crop-container">
                <Cropper 
                 image={imageUrl}
                 zoom={zoom}
                 crop={crop}
                 rotation={rotation}
                 aspect={aspect.value}
                 onCropChange={onCropChange}
                 onZoomChange={onZoomChange}
                 onCropComplete={onCropComplete}
                 onRotationChange={onRotationChange}
                
                 />      
          </div>
          
          <div className="controls">
          <div className="controls-upper">
            <input className="slider" type='range' min={1} max={3} step={0.1} value={zoom} onInput={(e)=>{onZoomChange(e.target.value)}}>
        
            </input>
            
            <input className="slider" type='range' min={0} max={360} step={90} value={rotation} onInput={(e)=>{onRotationChange(e.target.value)}}>
        
            </input>




            <select onChange={onAspectChange}>
              {aspectRatios.map(ratio=><option key={ratio.text} value={ratio.value} selected={ratio.value === aspect.value}>{ratio.text}</option>)}
            </select>


          </div>

          <div className="buttons">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onResetImage}>Reset</button>
            <button onClick={onCrop}>Crop</button>
          </div>
          </div>

    </div>;

}

export default ImageDialog;