import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Navigate replace to={`/document/${uuidv4()}`} />} />
          <Route path="/document/:id" element={<TextEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
