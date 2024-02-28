import { register } from "./register";


export const actionCustomFonts = register({
  name: "customFonts",
  viewMode: true,
  trackEvent: { category: "customfonts" },
  perform: async (elements, appState, value, app) => {
    return {
      commitToHistory: false,
      appState: {
        ...appState,
        openDialog: { name: "customFonts" },
      },
    };
  },
});
