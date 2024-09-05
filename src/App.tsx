
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PDFViewer from "./components/pdfViewer/PdfViewer";
import Translator from "./components/translator/Translate";
import ImageExtractor from "./components/translator/ImageExtractor";
import Chat from "./components/chat/Chat";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBot />} />
        <Route path="/pdf-viewer" element={<PDFViewer />} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/image-extractor" element={<ImageExtractor />} />
        <Route path="/translator" element={<Translator />} />
      </Routes>
    </Router>
  );
}

export default App;

