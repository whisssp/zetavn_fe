"use client";
import React, { useEffect, useState } from "react";
import { ComposeAddDropdown } from "../dropdowns";
import ChatCompose from "./ChatCompose";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLazyGetChatMessagesQuery } from "@/redux/features/chat/chat.service";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addChatMessageSelected,
  addChatMessageSelectedHead,
  setChatMessageSelected,
} from "@/redux/features/chat/chat.slice";
import { ImageDefault } from "@/types/contants.type";
import { calculateTime } from "@/utils/calculate-time.util";
import MessageChatStatus from "./message/MessageChatStatus";
import MessageItem from "./message/MessageItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fancybox } from "../fancybox";

const ChatBody = () => {
  const { openChatDetails, userContactSelected, chatMessageSelected } =
    useAppSelector((selector) => selector.chat);
  const user = useAppSelector((selector) => selector.auth.user);
  const [getChatMessages] = useLazyGetChatMessagesQuery();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchGetChatMessages = async () => {
      const response = await getChatMessages({
        userIdGetChat: user?.id || "",
        userIdContact: userContactSelected?.id || "",
        pageNumber: page,
        pageSize: 20,
      }).unwrap();

      if (response.code === 200) {
        const { data } = response;
        if (page === 0) {
          dispatch(setChatMessageSelected(data.data));
        } else {
          dispatch(addChatMessageSelected(data.data));
        }
        if (data.lastPage) setHasMore(false);
      }
    };
    if (userContactSelected) {
      fetchGetChatMessages();
    }
  }, [dispatch, getChatMessages, user, userContactSelected, page]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [userContactSelected]);

  return (
    <Fancybox
      options={{
        Carousel: {
          infinite: false,
        },
      }}>
      <div
        id="chat-body"
        className={`chat-body ${openChatDetails ? "is-opened" : ""}`}>
        <div id="chat-scroll" className="chat-body-inner has-slimscroll">
          <InfiniteScroll
            inverse={true}
            loader={<></>}
            hasMore={hasMore}
            next={() => setPage((prev) => prev + 1)}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "unset",
              height: "100%",
            }}
            dataLength={chatMessageSelected.length}
            scrollableTarget="chat-scroll">
            {chatMessageSelected.map((chatMessage) => (
              <MessageItem
                key={chatMessage.id + chatMessage.createdAt}
                message={chatMessage}
              />
            ))}
          </InfiniteScroll>
        </div>
        {/* <div className="date-divider">
          <hr className="date-divider-line" />
          <span className="date-divider-text">Today</span>
        </div> */}
        {/* Compose message area */}
        <ChatCompose />
      </div>
    </Fancybox>
  );
};

export default ChatBody;
