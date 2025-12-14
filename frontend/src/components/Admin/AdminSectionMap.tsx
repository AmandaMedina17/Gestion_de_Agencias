import ActivityManagement from "./sections/Activity/ActivityManagement";
import AgencyManagement from "./sections/Agency/AgencyManagement";
import AlbumManagement from "./sections/Album/AlbumManagement";
import ApprenticesManagement from "./sections/Apprentice/ApprenticesManagement";
import ArtistManagement from "./sections/Artist/ArtistManagement";
import AwardManagement from "./sections/Award/AwardManagement";
import BillboardListManagement from "./sections/BillboardList/BillboardManagement";
import ContractManagement from "./sections/Contract/ContractManagement";
import EvaluationManagement from "../Manager/sections/Evaluation/EvaluationsManagement";
import PlaceManagement from "./sections/Place/PlaceManagement";
import ResponsibleManagement from "./sections/Responsible/ResponsibleManager";
import SongManagement from "./sections/Song/SongManagement";

export const sectionComponents = {
  responsible_management: ResponsibleManagement,
  apprentices_management: ApprenticesManagement,
  place_management: PlaceManagement,
  artists_management: ArtistManagement,
  evaluation_management: EvaluationManagement,
  activities_management: ActivityManagement,
  agencies_management: AgencyManagement,
  contract_management: ContractManagement,
  billboard_management: BillboardListManagement,
  songs_management: SongManagement,
  albums_management: AlbumManagement,
  award_management: AwardManagement
};
