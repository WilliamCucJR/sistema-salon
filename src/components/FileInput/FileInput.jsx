import { useRef, useState } from "react";
import "./FileInput.css";
import { Icon, } from 'semantic-ui-react'; 

const FileInput = () => {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="FileUpload-Container">
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
      />

      <button className="file-btn" onClick={onChooseFile}>
        <Icon name="upload" /> Subir Archivo 
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
