import ActivityManagement from "./sections/Activity/ActivityManagement";
import ApprenticesManagement from "./sections/Apprentice/ApprenticesManagement";
import ArtistManagement from "./sections/Artist/ArtistManagement";
import EvaluationManagement from "./sections/Evaluation/EvaluationsManagement";
import PlaceManagement from "./sections/Place/PlaceManagement";
import ResponsibleManagement from "./sections/Responsible/ResponsibleManager";

export const sectionComponents = {
  responsible_management: ResponsibleManagement,
  apprentices_management: ApprenticesManagement,
  place_management: PlaceManagement,
  artists_management: ArtistManagement,
  evaluation_management: EvaluationManagement,
  activities_management: ActivityManagement
};
