import React from "react";
import {RegistryPage} from "@/pages/registry/RegistryPage.tsx";
import {VotingPage} from "@/pages/voting/VotingPage.tsx";
import {TokenPage} from "@/pages/token/TokenPage.tsx";
import {ApplicationPage} from "@/pages/application/ApplicationPage.tsx";

interface IRoutes {
    path: RoutePaths,
    element: React.ReactElement
}

const enum RoutePaths {
    home = '/',
    registry = '/registry',
    voting = '/voting',
    token = '/token',
    applications = '/applications',
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
    {
        path: RoutePaths.applications,
        element: <ApplicationPage/>
    },
]
