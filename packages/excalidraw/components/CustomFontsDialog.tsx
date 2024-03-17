import { useEffect, useState } from "react";
import { Dialog } from "./Dialog";
import { TextField } from "./TextField";
import DialogActionButton from "./DialogActionButton";
import { KEYS } from "../keys";
import { InlineIcon } from "./InlineIcon";
import { FontFamilyNormalIcon, FontFamilyCodeIcon, FreedrawIcon } from './icons';
import { Paragraph } from "./Paragraph";
import { EDITOR_LS_KEYS } from '../constants';
import { EditorLocalStorage } from "../data/EditorLocalStorage";

import "./CustomFontsDialog.scss";
import { CustomFonts, preloadCustomFonts, getCustomFonts, getDefaultFonts } from "../font";

export type fontUrl = string | null;

export const CustomFontsDialog = (props: {
  onClose: () => void;
}) => {

  const [handwriting, setHandwriting] = useState<string>("https://excalidraw-zh.com/fonts/Xiaolai.woff2");
  const [normal, setNormal] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const customFonts = getCustomFonts() || getDefaultFonts();
    if (customFonts.handwriting) {
      setHandwriting(customFonts.handwriting);
    }
    if (customFonts.normal) {
      setNormal(customFonts.normal);
    }
    if (customFonts.code) {
      setCode(customFonts.code);
    }
  }, []);

  const onConfirm = () => {
    if (!handwriting && !normal && !code) {
      EditorLocalStorage.delete(EDITOR_LS_KEYS.CUSTOM_FONTS);
      window.location.reload();
      return;
    }
    const customFonts = {
      handwriting,
      normal,
      code,
    } as CustomFonts;   
    setIsSaving(true);
    preloadCustomFonts(customFonts).then(() => {
      setIsSaving(false);
      EditorLocalStorage.set(EDITOR_LS_KEYS.CUSTOM_FONTS, customFonts);
      console.log("Fonts loaded");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).catch(error => {
      setIsSaving(false);
      console.error(error);
    });
  }

  return (
    <Dialog
      onCloseRequest={() => {
        props.onClose();
      }}
      title={
        <div style={{ display: "flex" }}>
          Custom Fonts{" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.1rem 0.5rem",
              marginLeft: "1rem",
              fontSize: 14,
              borderRadius: "12px",
              color: "#000",
              background: "pink",
            }}
          >
            Experimental
          </div>
        </div>
      }
      className="CustomFonts"
      autofocus={false}
    >
      <Paragraph>
        Custom fonts are an experimental feature that allows you to use your own fonts in Excalidraw.
      </Paragraph>
      <Paragraph>
        You can add your own fonts by config the target font file url. Follow the the website to find more available fonts.
        {" "}
        <a
          href="https://platform.openai.com/login?launch"
          rel="noopener noreferrer"
          target="_blank"
        >
          Fonts
        </a>
      </Paragraph>
      <Paragraph>
        More features are coming soon.
      </Paragraph>
      <p />
      <TextField
        isRedacted={false}
        value={handwriting}
        placeholder="Paste your custom handwriting font url here, leave it empty to use default font."
        label="Handwriting Font"
        labelIcon={<InlineIcon icon={FreedrawIcon} />}
        onChange={(value) => {
          setHandwriting(value);
        }}
        selectOnRender
        onKeyDown={(event) => event.key === KEYS.ENTER && onConfirm()}
      />
      <p />
      <TextField
        isRedacted={false}
        value={normal}
        placeholder="Paste your custom normal font url here, leave it empty to use default font."
        label="Normal Font"
        labelIcon={<InlineIcon icon={FontFamilyNormalIcon} />}
        onChange={(value) => {
          setNormal(value);
        }}
        selectOnRender
        onKeyDown={(event) => event.key === KEYS.ENTER && onConfirm()}
      />
      <p />

      <TextField
        isRedacted={false}
        value={code}
        placeholder="Paste your custom code font url here, leave it empty to use default font."
        label="Code Font"
        labelIcon={<InlineIcon icon={FontFamilyCodeIcon} />}
        onChange={(value) => {
          setCode(value);
        }}
        selectOnRender
        onKeyDown={(event) => event.key === KEYS.ENTER && onConfirm()}
      />
      <p />
      <DialogActionButton
        label="Confirm"
        actionType="primary"
        isLoading={isSaving}
        onClick={onConfirm}
      />

    </Dialog>
  );
};
