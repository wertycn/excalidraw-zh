import {
  forwardRef,
  useRef,
  useImperativeHandle,
  KeyboardEvent,
  useLayoutEffect,
  useState,
} from "react";
import clsx from "clsx";

import "./TextField.scss";
import { Button } from "./Button";
import { eyeIcon, eyeClosedIcon } from "./icons";

type TextFieldProps = {
  onChange?: (value: string) => void;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;

  readonly?: boolean;
  fullWidth?: boolean;
  selectOnRender?: boolean;

  label?: string;
  labelIcon? : React.ReactNode;
  placeholder?: string;
  isRedacted?: boolean;
} & ({ value: string } | { defaultValue: string });

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      onChange,
      label,
      labelIcon,
      fullWidth,
      placeholder,
      readonly,
      selectOnRender,
      onKeyDown,
      isRedacted = false,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    useLayoutEffect(() => {
      if (selectOnRender) {
        innerRef.current?.select();
      }
    }, [selectOnRender]);

    const [isTemporarilyUnredacted, setIsTemporarilyUnredacted] =
      useState<boolean>(false);

    return (
      <div
        className={clsx("ExcTextField", {
          "ExcTextField--fullWidth": fullWidth,
        })}
        onClick={() => {
          innerRef.current?.focus();
        }}
      >
        <div className="ExcTextField__label">{label}{labelIcon ? labelIcon : ''}</div>
        <div
          className={clsx("ExcTextField__input", {
            "ExcTextField__input--readonly": readonly,
          })}
        >
          <input
            className={clsx({
              "is-redacted":
                "value" in rest &&
                rest.value &&
                isRedacted &&
                !isTemporarilyUnredacted,
            })}
            readOnly={readonly}
            value={"value" in rest ? rest.value : undefined}
            defaultValue={
              "defaultValue" in rest ? rest.defaultValue : undefined
            }
            placeholder={placeholder}
            ref={innerRef}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={onKeyDown}
          />
          {isRedacted && (
            <Button
              onSelect={() =>
                setIsTemporarilyUnredacted(!isTemporarilyUnredacted)
              }
              style={{ border: 0, userSelect: "none" }}
            >
              {isTemporarilyUnredacted ? eyeClosedIcon : eyeIcon}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
