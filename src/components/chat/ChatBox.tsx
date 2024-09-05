import { useState, useEffect, useRef } from "react";

import Message from "./Message";
import SendMessage from "./SendMessage";
import translate from "../../utilities/translate";

import { Timestamp } from "firebase/firestore";
import { auth, db } from "../../utilities/firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit, 
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { useAppSelector, UseAppDispatch } from "../../store/hooks";
import { addTranslation } from "../../features/translation/translationCacheSlice";


export interface MessageProps {
    text: string;
    name: string;
    avatar: string;
    uid: string;
    createdAt: Timestamp | null;
    id: string;
}


const ChatBox = () => {
  
  const [messages, setMessages] = useState<MessageProps[]>([]);  
  const scroll = useRef<HTMLSpanElement | null>(null);
  const userId = auth.currentUser?.uid;
  const dispatch = UseAppDispatch();

  const preferredLanguage = useAppSelector(
    (state) => state.language?.preferences?.[userId ?? ""] || "en"
  );
  const translationCache = useAppSelector((state) => state.translationCache);

  // console.log("messages:", messages)

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    let unsubscribe: () => void;
    let isProcessing = false;

    const processMessages = async (QuerySnapshot: QuerySnapshot<DocumentData>) => {
      if (isProcessing) return;
      isProcessing = true;

      const fetchedMessages: MessageProps[] = [];

      for (let doc of QuerySnapshot.docs) {
        const data = doc.data() as DocumentData & MessageProps;
        const cacheKey = `${data.text}-${data.uid}-${preferredLanguage}`;
        let translatedText: string;

        if (translationCache[cacheKey]) {
          console.log("Cache hit for:", cacheKey);
          translatedText = translationCache[cacheKey];
        } else {
          try {
            console.log("Cache miss for:", cacheKey);
            translatedText = await translate(data.text, preferredLanguage) || data.text;
            dispatch(addTranslation({ cacheKey, translatedText }));
          } catch (error) {
            console.error("Translation error:", error);
            translatedText = data.text;
          }
        }

        fetchedMessages.push({
          ...data, 
          text: translatedText, 
          id: doc.id,
          name: data.name, 
          avatar: data.avatar,
          uid: data.uid,
          createdAt: data.createdAt || null,
        });
      }

      const sortedMessages = fetchedMessages.sort(
        (a, b) => {
            if (a.createdAt && b.createdAt) {
                return a.createdAt.seconds - b.createdAt.seconds;
              } else {
                
                return 0;
              }}
      );
      setMessages(sortedMessages);

      isProcessing = false;
    };

    unsubscribe = onSnapshot(q, processMessages);

    return () => unsubscribe();
  }, [preferredLanguage, dispatch, translationCache]);

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} />
    </main>
  );
};

export default ChatBox;