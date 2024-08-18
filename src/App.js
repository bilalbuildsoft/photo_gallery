import React, { useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import './App.css';
import Cropper from 'react-easy-crop';
// Utility functions for cropping and resizing
import ImageDialog from './ImageDialog';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Photo Gallery
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function PhotoGalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const [photoName, setPhotoName] = useState('');
  const generateUniqueId = () => `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;


  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => ({
      id: generateUniqueId(),
      url: URL.createObjectURL(file),
      name: file.name,
      croppedImageUrl: null,
      file,
    }));
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleSelectPhoto = (photo) => {
    if (selectedPhoto && selectedPhoto.url === photo.url) {
      // If the clicked photo is already selected, unselect it
      setSelectedPhoto(null);
      setPhotoName('');
    } else {
      // Otherwise, select the clicked photo
      setSelectedPhoto(photo);
      setPhotoName(photo.name);
    }
  };
  

  

  const handleDeletePhoto = () => {
    setPhotos(photos.filter((photo) => photo !== selectedPhoto));
    setSelectedPhoto(null);
  
  };

  const onCancel = () => {
    setSelectedPhoto(null);
  };
  
  
  const setCroppedImageFor = (id, crop, zoom, aspect,rotation, croppedImageUrl) => {
    const newPhotosList = [...photos];
    const photoIndex = photos.findIndex((x) => x.id === id);
    const photo = photos[photoIndex];
    const newPhoto = { ...photo, croppedImageUrl, crop, zoom, aspect, rotation };
    newPhotosList[photoIndex] = newPhoto;
    setPhotos(newPhotosList);
    setSelectedPhoto(null);
  };

  const resetImage=(id)=>{
    setCroppedImageFor(id);
  }

  return (
    <div>
      <Navbar />
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Photo Gallery
        </Typography>
        
        <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
          Add Photos
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleUpload}
          />
        </Button>

     
        <ImageList variant="masonry" cols={3} gap={8}>
          {photos.map((photo, index) => (
            <ImageListItem key={index} onClick={() => handleSelectPhoto(photo)}>
              <img
                src={photo.croppedImageUrl ? photo.croppedImageUrl : photo.url}
                alt={photo.name}
                loading="lazy"
                style={{
                  borderRadius: 8,
                  border: selectedPhoto === photo ? '3px solid blue' : 'none',
                  cursor: 'pointer',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
        {selectedPhoto ? <ImageDialog 
        id={selectedPhoto.id}
        imageUrl={selectedPhoto.url}
        cropInit={selectedPhoto.cropInit}
        zoomInit={selectedPhoto.zoomInit}
        aspectInit={selectedPhoto.aspectInit}
        rotateInit={selectedPhoto.rotateInit}
        onCancel={onCancel}
        setCroppedImageFor={setCroppedImageFor}
        resetImage={resetImage}
        /> : null }

        

      </Container>
    </div>
  );
}

export default PhotoGalleryPage;
