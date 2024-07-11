import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export function Loading() {
    return (
        <div className="w-full flex justify-center items-center h-96"><FontAwesomeIcon icon={faSpinner} width="48px" height="48px" className="animate-spin text-5xl"/></div>
    )
}