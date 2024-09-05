import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TranslationCacheState {
    [cacheKey: string]: string
}

interface AddTranslationPayload {
    cacheKey: string;
    translatedText: string
}

const initialState: TranslationCacheState = {};

const translationCacheSlice = createSlice({
    name: "translationCache",
    initialState,
    reducers: {
        addTranslation: (state, action: PayloadAction<AddTranslationPayload>) => {
            const {cacheKey, translatedText} = action.payload;
            state[cacheKey] = translatedText;
        },
    },
});

export const {addTranslation} = translationCacheSlice.actions;
export default translationCacheSlice.reducer;
