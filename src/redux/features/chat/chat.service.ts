import { apiAuthorization } from "@/redux/api/api.service";
import { Message } from "@/types/chat.type";
import { API_URL } from "@/types/contants.type";
import {
  CreateChatMessagesRequest,
  GetChatMessagesRequest,
  UploadFileChatMessageRequest,
} from "@/types/request.type";
import {
  ApiResponse,
  CreateChatMessagesResponse,
  GetChatMessagesResponse,
  GetContactResponse,
} from "@/types/response.type";
import { UserContact } from "@/types/user.type";

export const chatApi = apiAuthorization.injectEndpoints({
  endpoints: (build) => ({
    getContacts: build.query<GetContactResponse, string>({
      query: (id) => `${API_URL.USERS}/${id}/contacts`,
    }),
    getChatMessages: build.query<
      GetChatMessagesResponse,
      GetChatMessagesRequest
    >({
      query: (request) => ({
        url: API_URL.MESSAGES,
        params: {
          userIdGetChat: request.userIdGetChat,
          userIdContact: request.userIdContact,
          pageNumber: request.pageNumber || 0,
          pageSize: request.pageSize || 10,
        },
      }),
    }),
    createChatMessage: build.mutation<
      ApiResponse<Message>,
      CreateChatMessagesRequest
    >({
      query: (body) => ({
        url: API_URL.MESSAGES,
        method: "post",
        body,
      }),
    }),
    updateReadChatMessage: build.mutation<ApiResponse<Message>, number>({
      query: (id) => ({
        url: `${API_URL.MESSAGES}/${id}`,
        method: "put",
      }),
    }),
    uploadFileChatMessage: build.mutation<
      ApiResponse<Message>,
      UploadFileChatMessageRequest
    >({
      query: (request) => ({
        url: `${API_URL.MESSAGES}/file`,
        method: "post",
        body: (() => {
          const formData = new FormData();
          formData.append("file", request.file);
          formData.append("senderId", request.senderId);
          formData.append("recieverId", request.recieverId);
          formData.append("message", request.message);
          formData.append("type", request.type);
          return formData;
        })(),
      }),
    }),
  }),
});

export const {
  useLazyGetContactsQuery,
  useLazyGetChatMessagesQuery,
  useCreateChatMessageMutation,
  useUpdateReadChatMessageMutation,
  useUploadFileChatMessageMutation,
} = chatApi;
