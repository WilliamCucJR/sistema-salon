import { useRef, useState } from "react";
import "./FileInput.css";
import { Icon } from 'semantic-ui-react'; 

const FileInput = ({ onFileSelect }) => {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const onChooseFile = (event) => {
    event.preventDefault();
    inputRef.current.click();
  };

  const removeFile = (event) => {
    event.preventDefault();
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="FileUpload-Container">
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <button className="file-btn" onClick={onChooseFile}>
        <Icon name="upload" /> Subir Imagen 
      </button>

      {selectedFile && (
        <div className="selected-file">
          <p>{selectedFile.name}</p>

          <button onClick={removeFile}>
            <Icon name="trash alternate" /> 
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;