import React, { useEffect, useState } from 'react';

interface props {
    onButtonClick:  ()=> void;
    setSelectedText: (value: string) => void;
}

const SelectMenu: React.FC<props> = ({onButtonClick, setSelectedText}) => {
    const [selection, setSelection] = useState<string>();
    const [position, setPosition] = useState<Record<string, number>>();

  function onSelectStart() {
    setSelection(undefined);
  }

  function onSelectEnd() {
    const activeSelection = document.getSelection();
    const text = activeSelection?.toString();

    if ( !activeSelection || !text ) {
      setSelection(undefined);
      return;
    };

    setSelection(text);

    const rect = activeSelection.getRangeAt(0).getBoundingClientRect();
    // Adjust for the scroll position of the PDF container
    const pdfContainer = document.querySelector('.leftPane');
    const scrollTop = pdfContainer ? pdfContainer.scrollTop : 0;

    setPosition({
      x: rect.left + (rect.width / 2) - (80 / 2),
      y: rect.top + scrollTop + window.scrollY - 140,
      width: rect.width,
      height: rect.height,
    });
    
    
  }

  useEffect(() => {
    document.addEventListener('selectstart', onSelectStart);
    document.addEventListener('mouseup', onSelectEnd);
    return () => {
      document.removeEventListener('selectstart', onSelectStart);
      document.removeEventListener('mouseup', onSelectEnd);
    }
  }, []);

  useEffect(()=> {
    if (selection) setSelectedText(selection);
  },[selection]);
 

  return (
    <div role="dialog" aria-labelledby="share" aria-haspopup="dialog" className='relative z-10'>
      {selection && position && (
        <p
          className="
            absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
            after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
          "
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`
          }}
        >
          <button
            className="flex w-full h-full justify-between items-center px-2"
            onClick={() => {
                onButtonClick()}}
          >
            <span id="share" className="text-xs">Translate</span>
            
          </button>
        </p>
      )}
    </div>
  );
}

export default SelectMenu;