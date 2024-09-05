import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddToHistoryPayload {
    originalText: string; 
    translatedText: string; 
    language: string; 
    timestamp?: string 
}

interface TranslationHistoryState {

    history: AddToHistoryPayload[];
}


const initialState:TranslationHistoryState  = {
    history: [],
}

const translationHistorySlice = createSlice({
    name: "translationHistory",
    initialState,
    reducers : {
        addToHistory: (state, action: PayloadAction<AddToHistoryPayload>) => {
            const {originalText, translatedText, language} = action.payload;
            state.history.push({originalText, translatedText, language, timestamp: new Date().toISOString()});

        },
        clearHistory: (state) => {
            state.history = [];
        }
    }

})

export const {addToHistory, clearHistory} = translationHistorySlice.actions;
export default translationHistorySlice.reducer;