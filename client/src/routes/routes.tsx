import React from "react";
import {RegistryPage} from "@/pages/RegistryPage.tsx";
import {VotingPage} from "@/pages/VotingPage.tsx";
import {TokenPage} from "@/pages/TokenPage.tsx";

interface IRoutes {
    path: RoutePaths,
    element: React.ReactElement
}

const enum RoutePaths {
    home = '/',
    registry = '/registry',
    voting = '/voting',
    token = '/token',
}

export const routes: IRoutes[] = [
    {
        path: RoutePaths.home,
        element: <RegistryPage/>
    },
    {
        path: RoutePaths.registry,
        element: <RegistryPage/>
    },
    {
        path: RoutePaths.voting,
        element: <VotingPage/>
    },
    {
        path: RoutePaths.token,
        element: <TokenPage/>
    },
]
