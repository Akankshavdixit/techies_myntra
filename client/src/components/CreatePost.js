import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { predefinedTags } from '../constants/tags';
import { useSession } from '../context/SessionContext';

const CreatePost = ({ token }) => { // Pass the JWT token as a prop
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [productLinks, setProductLinks] = useState(['']);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState(predefinedTags);
  const [displayedTags, setDisplayedTags] = useState([]);
  const myntraLinkPattern =/^https:\/\/www\.myntra\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/\d+\/[a-zA-Z0-9-]+$/i
  const {session} = useSession();


  const validateProductLinks = () => {
    return productLinks.every(link => myntraLinkPattern.test(link));
  };
  useEffect(() => {
    setDisplayedTags(predefinedTags); // Initially display all predefined tags
  }, []);

  useEffect(() => {
    // Filter tags based on search term whenever it changes
    if (searchTerm.trim() === '') {
      setDisplayedTags(predefinedTags); // Show all tags if search term is empty
    } else {
      const filtered = predefinedTags.filter(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedTags(filtered);
    }
  }, [searchTerm]);

  const handleTagSelection = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    }
    console.log(selectedTags)
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
    if (selectedTags.length==0){
      alert('Please add appropriate tags!')
      return
    }

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      formData.append('description', description);
      formData.append('productLinks', JSON.stringify(productLinks));
      formData.append('tags', JSON.stringify(selectedTags))

      const response = await axios.post('http://localhost:8000/posts/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session.token}` // Include the JWT token in the header
        }
      });

      
      window.location.href = '/posts'

    } catch (error) {
      console.error('Error uploading images and creating post:', error);
      
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
        <div>
        <h3>Select Tags:</h3>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {displayedTags.map((tag, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagSelection(tag)}
                />{' '}
                {tag}
              </label>
            </li>
          ))}
        </ul>
      </div>
        <button type="submit">Submit Post</button>
      </form>
      
        
    </div>
  );
};

export default CreatePost;
