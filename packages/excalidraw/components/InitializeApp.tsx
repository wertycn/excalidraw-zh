import React, { useEffect, useState } from "react";

import { LoadingMessage } from "./LoadingMessage";
import { defaultLang, Language, languages, setLanguage } from "../i18n";
import { Theme } from "../element/types";
import { EDITOR_LS_KEYS } from '../constants';
import { EditorLocalStorage } from "../data/EditorLocalStorage";

interface Props {
  langCode: Language["code"];
  children: React.ReactElement;
  theme?: Theme;
}

const loadCustomFonts = async () => {
  const customFonts = EditorLocalStorage.get(EDITOR_LS_KEYS.CUSTOM_FONTS) as {
    handwritingFont: string | null;
    normalFont: string | null;
    codeFont: string | null;
  } | null;
  if (!customFonts) {
    return;
  }
  if (customFonts.handwritingFont) {
    const fontFaceRule = `
      @font-face {
        font-family: 'Virgil';
        src: url('${customFonts.handwritingFont}') format('woff2');
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = fontFaceRule;
    document.head.appendChild(styleElement);
  }
  if (customFonts.normalFont) {
    const fontFaceRule = `
      @font-face {
        font-family: 'Helvetica';
        src: url('${customFonts.normalFont}') format('woff2');
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = fontFaceRule;
    document.head.appendChild(styleElement);
  }
  if (customFonts.codeFont) {
    const fontFaceRule = `
      @font-face {
        font-family: 'Cascadia';
        src: url('${customFonts.codeFont}') format('woff2');
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = fontFaceRule;
    document.head.appendChild(styleElement);
  }
}

export const InitializeApp = (props: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateFonts = async () => {
      await loadCustomFonts();  
    }; 
    const updateLang = async () => {
      await setLanguage(currentLang);
    };
    const initialize = async () => {
      await updateFonts();
      await updateLang();
      setLoading(false);
    };
    const currentLang =
      languages.find((lang) => lang.code === props.langCode) || defaultLang;
    initialize();
  }, [props.langCode]);

  return loading ? <LoadingMessage theme={props.theme} /> : props.children;
};
