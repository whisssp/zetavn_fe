"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import User from "@/types/user.type";
import React, { RefObject, useEffect, useRef, useState } from "react";
import Autosuggest from "react-autosuggest";
import ActiveSuggestionItem from "./ActiveSuggestionItem";
import UserSuggestionItem from "./UserSuggestionItem";
import { MentionsInput, Mention } from "react-mentions";
import { setTextContent } from "@/redux/features/post/post.slice";

const CardComposeTextarea = () => {
  const { friends } = useAppSelector((selector) => selector.auth);
  const mentionRef = useRef(null);
  const dispatch = useAppDispatch();
  const { textContent } = useAppSelector((selector) => selector.post);

  useEffect(() => {
    const mentionInput: any = mentionRef.current;
    if (mentionInput && mentionInput.containerElement) {
      const el: HTMLElement = mentionInput.containerElement as HTMLElement;
      el.onclick = () => {
        el.querySelector("textarea")?.focus();
      };

      return () => {
        el.onclick = null;
      };
    }
  }, [mentionRef]);

  const inputProps = {
    placeholder: "Write something about you...",
    value: textContent,
    id: "publish",
    className: "textarea",
    rows: 3,
  };

  const handleChangeInput = (
    event: any,
    newValue: any,
    newPlainTextValue: any,
    mentions: any
  ) => {
    dispatch(setTextContent(newValue));
  };
  return (
    <>
      <MentionsInput
        ref={mentionRef}
        className="post-mention"
        id="publish"
        rows={3}
        placeholder="Write something about you..."
        value={textContent}
        onChange={handleChangeInput}>
        <Mention
          trigger="@"
          data={friends}
          displayTransform={(id, display) => {
            return `@${display}`;
          }}
          renderSuggestion={(
            suggestion,
            search: string,
            highlightedDisplay: React.ReactNode,
            index: number,
            focused: boolean
          ) => (
            <UserSuggestionItem
              suggestion={suggestion as User}
              search={search}
              highlightedDisplay={highlightedDisplay}
              index={index}
              focused={focused}
            />
          )}
        />
      </MentionsInput>
    </>
  );
};

export default CardComposeTextarea;
