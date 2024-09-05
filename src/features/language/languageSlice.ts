import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
    preferences: {[userId: string]: string};
}

interface SetLanguagePreferencePayload {
    userId: string;
    language: string;
}


const initialState: LanguageState = {
    preferences: {},
}

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers : {
        setLanguagePreference: (state, action:PayloadAction<SetLanguagePreferencePayload> ) => {
            const {userId, language} = action.payload;
            state.preferences[userId] = language;
        },

       
    },
});

export const {setLanguagePreference} = languageSlice.actions;
export default languageSlice.reducer;