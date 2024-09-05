import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { pdfjs } from "react-pdf";
import translate from "../../utilities/translate";
import SelectMenu from "./SelectMenu";
import type { PDFDocumentProxy } from "pdfjs-dist";
import SelectDropDown from "../../atom/SelectDropdown";

import { addToHistory } from "../../features/pdf/translationHistorySlice";
import { useAppSelector, UseAppDispatch } from "../../store/hooks";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();


const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024, // This is equivalent to lg breakpoint
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
      },
    },
  ],
};


const PDFViewer = () => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedText, setSelectedText] = useState<string>("");
  const [transText, setTransText] = useState<string>();
  const [outputLn, setOutputLn] = useState<string>("es");
  const [paneDimensions, setPaneDimensions] = useState({ width: 0, height: 0 });
  const [summary, setSummary] = useState<string>("");

  const dispatch = UseAppDispatch();
  const translationHistory = useAppSelector(
    (state) => state.translationHistory.history
  );

  const onButtonClick = async () => {
    const translation = await translate(selectedText, outputLn);
    console.log("translation:", translation);
    setTransText(translation);
    dispatch(
      addToHistory({
        originalText: selectedText,
        translatedText: translation || "",
        language: outputLn,
      })
    );
    console.log(selectedText);
  };

  const onFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setPdfData(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
    setPageNumber(1);
  };

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    const updateDimensions = () => {
      const leftPane = document.getElementsByClassName("leftPane")[0];
      if (leftPane) {
        setPaneDimensions({
          width: leftPane.clientWidth,
          height: leftPane.clientHeight * 0.8, // 80% of the leftPane height
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);


  useEffect(() => {

    const summarize = async () => {
      const summaryText = await translate(selectedText, outputLn, "summarize")
      if (summaryText) {
        setSummary(summaryText)
      }
    }

    if (transText) {
      summarize()
    }
  },[transText])

  return (
    <div className={`flex flex-col lg:flex-row gap-5 p-5 bg-[#f7f7f7] ${!pdfData && ("h-screen")} xl:h-screen`}>
      <div className="leftPane flex flex-col h-full items-center p-5 bg-white rounded-lg overflow-y-auto w-full lg:w-2/5 flex-shrink-0">
        <input
          type="file"
          accept=".pdf"
          onChange={onFileLoad}
          className="mb-5 p-[10px] rounded-[4px] border border-solid border-[#ccc]"
        />

        {pdfData && (
          <>
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              className="document"
            >
              <SelectMenu
                onButtonClick={onButtonClick}
                setSelectedText={setSelectedText}
              />
              <Page
                pageNumber={pageNumber}
                width={paneDimensions.width}
                height={paneDimensions.height}
                canvasBackground={"#FAFCFC"}
              />
            </Document>

            <div className="flex justify-between items-center mt-5 w-full">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                className="py-[10px] px-[20px] bg-[#007BFF] text-white border-none rounded cursor-pointer"
              >
                Previous
              </button>
              <p className="text-base">
                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
              </p>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
                className="py-[10px] px-[20px] bg-[#007BFF] text-white border-none rounded cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <div className="rightPane flex-1 flex flex-col bg-white p-5 rounded-lg overflow-auto w-full lg:w-3/5 flex-shrink-0">
        <SelectDropDown outputLn={outputLn} setOutputLn={setOutputLn} className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-2"/>
        {/* <h2>Translated Text</h2> */}
        <div className="mt-[8px] p-[15px] bg-[#f0f0f0] rounded-lg  flex flex-col space-y-4">
          {/* <div className="flex-1 m-3 overflow-auto">
      {transText}
    </div> */}

          <div className="flip-card flex-1 m-3 overflow-auto bg-transparent border-solid border-[#flflfl] no-scrollbar">
            <div className="flip-card-inner relative w-full h-full text-center ">
              <div className="flip-card-front absolute w-full h-full">
                {transText}
              </div>
              <div className="flip-card-back absolute w-full h-full">
                {summary}
              </div>
            </div>
          </div>
          {transText && (
          <div className="transHistory">
            <h3 className="text-lg font-semibold ml-4">Translation History</h3>
          
            <div className="flex-1 m-3 overflow-auto no-scrollbar">
              {window.innerWidth >= 1024 ? (
                <Slider {...sliderSettings}>
                  {translationHistory.map((item, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded-md">
                      <p className="font-medium">Original: {item.originalText}</p>
                      <p>Translated: {item.translatedText}</p>
                      <p>Language: {item.language}</p>
                      <p className="text-sm text-gray-500">
                        Translated on: {item.timestamp}
                      </p>
                    </div>
                  ))}
                </Slider>
              ) : (
                <ul className="space-y-2">
                  {translationHistory.map((item, index) => (
                    <li key={index} className="p-2 bg-gray-100 rounded-md">
                      <p className="font-medium">Original: {item.originalText}</p>
                      <p>Translated: {item.translatedText}</p>
                      <p>Language: {item.language}</p>
                      <p className="text-sm text-gray-500">
                        Translated on: {item.timestamp}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            </div>
          )}
          
        </div>
      </div>
    
    </div>
  );
};

export default PDFViewer;

// <div className="flip-card bg-transparent border-solid border-[#flflfl]">
//   <div className="flip-card-inner relative w-full h-full text-center ">
//     <div className="flip-card-front absolute w-full h-full">
//     {transText}
//     </div>
//     <div className="flip-card-back absolute w-full h-full">
//       <h1>John Doe</h1>
//       <p>Architect & Engineer</p>
//       <p>We love that guy</p>
//     </div>
//   </div>
// </div>
