export const threadsReducer = (state: ThreadsState, action: ThreadsAction): ThreadsState => {
    switch (action.type) {
        case 'SET_THREADS':
            return { ...state, threads: action.payload };

        case 'ADD_THREAD':
            return {
                ...state,
                threads: {
                    ...state.threads,
                    [action.payload.threadId]: {
                        [action.payload.threadId]: action.payload.thread[action.payload.threadId]
                    }
                }
            };

        case 'UPDATE_THREAD':
            return {
                ...state,
                threads: {
                    ...state.threads,
                    [action.payload.threadId]: {
                        ...state.threads[action.payload.threadId],
                        [action.payload.threadId]: {
                            ...state.threads[action.payload.threadId][action.payload.threadId],
                            ...action.payload.updates
                        }
                    }
                }
            };

        case 'DELETE_THREAD':
            const { [action.payload]: deletedThread, ...remainingThreads } = state.threads;
            return { ...state, threads: remainingThreads };

        case 'ADD_MESSAGE':
            console.log('adding message to thread', action.payload.threadId);
            console.log("the state thread item throwing error is", state.threads[action.payload.threadId])
            return {
                ...state,
                threads: {
                    ...state.threads,
                    [action.payload.threadId]: {
                        ...state.threads[action.payload.threadId],
                        [action.payload.threadId]: {
                            ...state.threads[action.payload.threadId],
                            messages: [
                                ...state.threads[action.payload.threadId][action.payload.threadId].messages,
                                action.payload.message
                            ]
                        }
                    }
                },
                messagesInActiveThread: state.currentThreadId === action.payload.threadId
                    ? [...state.messagesInActiveThread, action.payload.message]
                    : state.messagesInActiveThread,
                activeMessageQueue: state.currentThreadId === action.payload.threadId
                    ? [...state.activeMessageQueue, action.payload.message].slice(-7)
                    : state.activeMessageQueue
            };

        case 'SET_CURRENT_THREAD':
            return {
                ...state,
                currentThreadId: action.payload,
                messagesInActiveThread: state.threads[action.payload]?.[action.payload]?.messages || [],
                activeMessageQueue: state.threads[action.payload]?.[action.payload]?.messages.slice(-7) || []
            };

        case 'SET_ACTIVE_MESSAGE_QUEUE':
            return {
                ...state,
                activeMessageQueue: action.payload.messages
            };

        case 'SET_MESSAGES_IN_ACTIVE_THREAD':
            return {
                ...state,
                messagesInActiveThread: action.payload.messages
            };

        default:
            return state;
    }
};
