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
  const myntraLinkPattern =/^https:\/\/www\.myntra\.com.*\/buy$/i
  const {session} = useSession();
  const [filePreviews, setFilePreviews] = useState([]);

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

    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(previewUrls);
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
    <div className="flex bg-purple-100">
    <div className=" bg-purple-50 p-16 w-1/2 pt-10 rounded-r-[50px] shadow-2xl">
      <h2 className="text-sm text-purple-600 font-semibold mb-4">Post Images</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="file" 
          id="fileInput" 
          multiple 
          accept="image/*" 
          onChange={handleFilesChange} 
          className="hidden" 
        />
        <label htmlFor="fileInput" className="flex items-center cursor-pointer bg-purple-700 text-white px-4 py-2 rounded-lg">
          <div className="plus-icon mr-2">+</div>
          <span>Upload Images</span>
        </label>
        <div className="flex flex-wrap space-x-2 space-y-2 mt-2">
          {filePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`preview ${index}`} className="w-32 h-32 object-cover rounded-lg" />
          ))}
        </div>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter description" 
          required 
          className="w-full px-3 bg-purple-100 py-2  rounded-lg"
        />
        <div>
          <h3 className="text-sm mb-2 font-semibold text-purple-600">Product Links</h3>
          {productLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input 
                type="text" 
                value={link} 
                onChange={(e) => handleLinkChange(index, e.target.value)} 
                placeholder={`Product link ${index + 1}`} 
                required 
                className="w-full bg-purple-100 px-3 py-2 rounded-lg"
              />
              {productLinks.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveLink(index)} 
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddLink} 
            className="bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Add another link
          </button>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-purple-600 mb-2">Select Tags:</h3>
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2  bg-purple-100 rounded-lg mb-2"
          />
          <ul className="space-y-1 text-purple-600 font-light">
            {displayedTags.map((tag, index) => (
              <li key={index} className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagSelection(tag)}
                    className="mr-2"
                  />
                  {tag}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded-lg">
          Submit Post
        </button>
      </form>
    </div>
    <div className="w-1/2 p-10 shadow-2xl mt-10">
    <p className="text-purple-800 font-light text-sm">Dear {session.username},<br></br>
    <br></br>

    I hope this message finds you well. As always, your impeccable sense of style and fashion insight never cease to amaze your audience. Your upcoming post is eagerly anticipated by your followers, and I’m sure it will be yet another hit.<br></br>
    <br></br>
    <br></br>

Your dedication to curating such unique and stylish content has not gone unnoticed. Each post not only showcases your incredible fashion sense but also provides inspiration to countless individuals who look up to you for guidance and ideas. Your ability to stay ahead of trends and present them in such an engaging and accessible manner is truly commendable.<br></br>
<br></br>
<br></br>

Thank you for being a source of inspiration and for sharing your incredible fashion journey with us. Your creativity and passion for fashion resonate deeply with your audience, fostering a sense of community and connection that is rare and special. I’m looking forward to your next post and the positive impact it will undoubtedly have.<br></br>
<br></br>
<br></br>

Wishing you all the best,<br></br>
Myntragram</p>

    </div>
    </div>
  );
};

export default CreatePost;
