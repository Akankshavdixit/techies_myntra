import React, { useState } from 'react';
import axios from 'axios';
import PostDisplay from './PostDisplay';



const CreatePost = ({ token }) => { // Pass the JWT token as a prop
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [productLinks, setProductLinks] = useState(['']);
  const [uploadStatus, setUploadStatus] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [post,setPost]=useState(null);
  const myntraLinkPattern =/^https:\/\/www\.myntra\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/\d+\/[a-zA-Z0-9-]+$/i



  const validateProductLinks = () => {
    return productLinks.every(link => myntraLinkPattern.test(link));
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }
    setFiles(selectedFiles);
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...productLinks];
    newLinks[index] = value;
    setProductLinks(newLinks);
  };

  const handleAddLink = () => {
    setProductLinks([...productLinks, '']);
  };

  const handleRemoveLink = (index) => {
    const newLinks = [...productLinks];
    newLinks.splice(index, 1);
    setProductLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProductLinks()) {
        alert("Please enter valid Myntra product links.");
        return;
    }
    if (files.length === 0 || !description) {
      alert("Please add some images and a description.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      formData.append('description', description);
      formData.append('productLinks', JSON.stringify(productLinks));

      const response = await axios.post('http://localhost:8000/posts/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        //   'Authorization': `Bearer ${token}` // Include the JWT token in the header
        }
      });

      setUploadStatus(response.data.message);
    //   setImageUrls(response.data.urls);
      setPost(response.data.post)

    } catch (error) {
      console.error('Error uploading images and creating post:', error);
      setUploadStatus('Failed to upload images and create post');
    }
  };

  return (
    <div>
      <h2>Post Images</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          id="fileInput" 
          multiple 
          accept="image/*" 
          onChange={handleFilesChange} 
          style={{ display: 'none' }} 
        />
        <label htmlFor="fileInput" className="custom-upload-button">
          <div className="plus-icon">+</div>
          <span>Upload Images</span>
        </label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter description" 
          required 
        />
        <div>
          <h3>Product Links</h3>
          {productLinks.map((link, index) => (
            <div key={index}>
              <input 
                type="text" 
                value={link} 
                onChange={(e) => handleLinkChange(index, e.target.value)} 
                placeholder={`Product link ${index + 1}`} 
                required 
              />
              {productLinks.length > 1 && (
                <button type="button" onClick={() => handleRemoveLink(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddLink}>Add another link</button>
        </div>
        <button type="submit">Submit Post</button>
      </form>
      
        
    </div>
  );
};

export default CreatePost;
