"use client"
import { ReactNode } from "react";
import { Provider } from "react-redux";
import reduxStore from "./store";

type Props = { children: ReactNode };

const ReduxProvider = ({ children }: Props) => {
    return (
        <Provider store={reduxStore}>
            {children}
        </Provider>
    )
}

export default ReduxProvider;