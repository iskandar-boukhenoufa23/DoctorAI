import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type ConsultationMessage = {
  id: string;
  role: "PATIENT" | "DOCTOR" | "SYSTEM";
  content: string;
  createdAt?: string;
};
type ChatState = { messages: Record<string, ConsultationMessage[]> };
const initialState: ChatState = { messages: {} };
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    replaceMessages(
      state,
      action: PayloadAction<{
        consultationId: string;
        messages: ConsultationMessage[];
      }>,
    ) {
      state.messages[action.payload.consultationId] = action.payload.messages;
    },
    appendMessages(
      state,
      action: PayloadAction<{
        consultationId: string;
        messages: ConsultationMessage[];
      }>,
    ) {
      state.messages[action.payload.consultationId] = [
        ...(state.messages[action.payload.consultationId] || []),
        ...action.payload.messages,
      ];
    },
  },
});
export const { replaceMessages, appendMessages } = chatSlice.actions;
export const store = configureStore({ reducer: { chat: chatSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
