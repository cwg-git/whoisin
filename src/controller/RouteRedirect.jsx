import { Suspense } from "react";
import { useParams } from "react-router-dom";

import Home from "../pages/Home";
import ThisWeek from "../pages/ThisWeek";
import Today from "../pages/Today";
import Legacy from "../pages/Legacy";
import Categories from "../pages/Categories";
import Agendas from "../pages/Agendas";
import About from "../pages/About";
import CmsPage from "../pages/CmsPage";
import Festival from "../pages/Festival";
import FiestasMajor from "../pages/FiestasMajor";
import Subscriptions from "../pages/Subscriptions";

import SinglePost from "../pages/SinglePost";
import SingleEvent from "../pages/SingleEvent";

import EventsByCategoorie from "../pages/EventsByCategoorie";
import PostsByCategoorie from "../pages/PostsByCategoorie";
import SearchPage from "../pages/SearchPage";

import MapsByCategorie from "../pages/MapsByCategorie";
import AllMapsByCategory from "../pages/AllMapsByCategory";
import SingleMap from "../pages/SingleMap";

const RedirectComponent = () => {
  const params = useParams();
  const { object, key } = params;

  const resolveCmsSlug = (value) => {
    const aliasMap = {
      "fiestas-mayor": "fiestas-major",
      festivales: "festival",
      subscription: "subscriptions",
    };

    // Keep old URLs working while the CMS pages move to their new slugs.
    return aliasMap[value] || value;
  };

  const routeMap = {
    // Static pages
    "this-week": <ThisWeek />,
    legacy: <Legacy />,
    categories: <Categories />,
    agendas: <Agendas />,
    "about-us": <About />,
    contact: <Subscriptions />,
    festival: <Festival />,
    festivales: <Festival />,
    "fiestas-major": <FiestasMajor />,
    "fiestas-mayor": <FiestasMajor />,
    subscriptions: <Subscriptions />,

    // Legacy filters
    yesterday: <Legacy type="yesterday" />,
    today: <Today />,
    forever: <Legacy type="forever" />,

    // Category pages
    "event-category": <EventsByCategoorie />,
    "post-category": <PostsByCategoorie />,
    "maps-category": <MapsByCategorie />,
    "all-maps": <AllMapsByCategory />,
    "search": <SearchPage />,

    // Single pages
    post: key ? <SinglePost /> : null,
    event: key ? <SingleEvent /> : null,
    map: key ? <SingleMap /> : null,

    // Fallback
    404: <div>404 Not Found</div>,
  };

  // If URL is just domain.com/
  if (!object) return <Home />;

  if (!routeMap[object]) {
    return (
      <Suspense fallback={<div />}>
        <CmsPage slug={resolveCmsSlug(object)} titleFallback={object} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div />}>
      {routeMap[object] || routeMap["404"]}
    </Suspense>
  );
};

export default RedirectComponent;
