import React from "react";

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
        element: <div>Registry</div>
    },
    {
        path: RoutePaths.registry,
        element: <div>Registry</div>
    },
    {
        path: RoutePaths.voting,
        element: <div>Voting</div>
    },
    {
        path: RoutePaths.token,
        element: <div>Token</div>
    },

]


