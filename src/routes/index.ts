import { Hono } from "hono";

import albumRouter from "./album";
import artistRouter from "./artist";
import genreRouter from "./genre";
import playlistRouter from "./playlist";
import songRouter from "./song";
import userRouter from "./user";

type Route = {
  path: string;
  router: Hono;
};

const routes: Route[] = [
  { path: "/album", router: albumRouter },
  { path: "/artist", router: artistRouter },
  { path: "/genre", router: genreRouter },
  { path: "/playlist", router: playlistRouter },
  { path: "/song", router: songRouter },
  { path: "/user", router: userRouter },
];

export default routes;
